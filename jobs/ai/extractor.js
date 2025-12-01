const axios = require("axios");
const crypto = require("crypto");
const cheerio = require("cheerio");
require("dotenv").config();
const { askAI } = require("../../utils/aiClient");
const postsRepository = require("../../repositories/postsRepository");
const sourcesRepository = require("../../repositories/sourcesRepository");
const { detectLanguage } = require("../../utils/langDetect");
const { jsonrepair } = require("jsonrepair");

// ✅ Yardımcı Fonksiyon: Bekleme (Sleep)
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const SOURCE_DEFAULT_LANG = {
  thehackernews: "en",
  donanimhaber: "tr",
  siberbulten: "tr",
  "bbc news": "tr",
};

async function run() {
  const sources = await sourcesRepository.getActiveSources();
  let inserted = 0;

  console.log("🔎 DB’den gelen sources:", sources);

  for (const src of sources) {
    console.log(`--------------------------------------------------`);
    console.log(`🔍 Kaynak işleniyor: ${src.name} (${src.url})`);

    let html = "";
    let allLinks = [];

    // 1. HTML İndirme ve Link Toplama
    try {
      const res = await axios.get(src.url, {
        timeout: 20000,
        headers: {
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        },
      });
      html = res.data;
      const $ = cheerio.load(html);

      // Link toplama mantığı (Mevcut kodun aynısı)
      if (src.name.toLowerCase().includes("bbc")) {
        $("a[data-testid='internal-link']").each((i, el) => {
          const link = $(el).attr("href");
          const title = $(el).find("h3").text().trim();
          if (!link || !title) return;
          let fullUrl = link.startsWith("http") ? link : new URL(link, src.url).toString();
          if (!/\/(articles|haberler|turkiye|dunya|bilim-)/.test(fullUrl)) return;
          allLinks.push({ title, link: fullUrl }); // BBC obje olarak tutuyor
        });
        // BBC için düz listeye çevirme (Prompt için)
        if (allLinks.length > 0) {
             const bbcCleanLinks = allLinks.map(item => item.link);
             allLinks = bbcCleanLinks;
        }
      } else {
        $("a").each((i, el) => {
          const href = $(el).attr("href");
          if (!href) return;
          if (href.startsWith("#") || href.startsWith("javascript")) return;
          let fullUrl = href;
          if (!fullUrl.startsWith("http")) {
            try { fullUrl = new URL(fullUrl, src.url).toString(); } catch (e) { return; }
          }
          if (src.name.toLowerCase().includes("donanimhaber") && !/\/[^/]+--\d+$/.test(fullUrl)) return;
          if (src.name.toLowerCase().includes("hackernews") && !/\d{4}\/\d{2}\//.test(fullUrl)) return;
          if (src.name.toLowerCase().includes("shiftdelete")) {
            if (!/^https:\/\/shiftdelete\.net\/[a-z0-9-]+(?:-[a-z0-9-]+)*$/i.test(fullUrl)) return;
            if (/\/(yapay-zeka|mobil|ios|android|donanim|haberler|sdntv|inceleme)(\/|$)/i.test(fullUrl)) return;
            if (/\/page\//i.test(fullUrl)) return;
          }
          allLinks.push(fullUrl);
        });
      }
    } catch (err) {
      console.error(`❌ HTML indirme hatası (${src.name}):`, err.message);
      continue;
    }

    console.log(`🔗 Filtrelenmiş link sayısı: ${allLinks.length}`);
    if (allLinks.length === 0) {
      console.log(`⚠️ ${src.name} için uygun link bulunamadı, atlanıyor.`);
      continue;
    }

    // 3. Prompt Hazırlığı
    let linkRule = "";
    if (src.name.toLowerCase().includes("hackernews")) linkRule = `- TheHackerNews linkleri "/YYYY/MM/...html" formatında olmalı.`;
    if (src.name.toLowerCase().includes("donanimhaber")) linkRule = `- DonanımHaber linkleri "...--123456" formatında olmalı.`;

    const extractPrompt = `
      Sen bir haber listesi ayıklama yapay zekasısın.
      Link Listesi: ${JSON.stringify(allLinks.slice(0, 50), null, 2)}
      
      Görevin: HTML içeriğine bakarak en güncel 7 haberi JSON formatında döndürmek.
      Beklenen JSON: [ { "title": "string", "summary": "string", "image_url": "string", "link": "string" } ]
      
      Kurallar:
      - "link" mutlaka verilen listeden birebir seçilmeli.
      - ${linkRule}
      - JSON dışında hiçbir şey yazma.
      
      HTML (ilk 5000 karakter): ${html.slice(0, 5000)}
    `;

    // 4. AI İsteği (RETRIES - TEKRAR DENEME DÖNGÜSÜ) 🛑 BURASI YENİ
    let parsed = null;
    let attempts = 0;
    const maxRetries = 3;

    while (parsed === null && attempts < maxRetries) {
      attempts++;
      try {
        if (attempts > 1) console.log(`🔄 Deneme ${attempts}/${maxRetries} başlatılıyor...`);
        
        const aiResult = await askAI(extractPrompt);

        if (!aiResult) {
          throw new Error("AI Boş Cevap Döndü (Muhtemelen 429)");
        }

        const jsonMatch = aiResult.match(/\[[\s\S]*\]/);
        const clean = jsonMatch ? jsonMatch[0] : aiResult.replace(/```json|```/g, "").trim();

        try {
          parsed = JSON.parse(clean);
        } catch (jsonErr) {
          parsed = JSON.parse(jsonrepair(clean));
        }

      } catch (err) {
        console.warn(`⚠️ AI Hatası (${src.name}) - Deneme ${attempts}: ${err.message}`);
        
        if (attempts < maxRetries) {
          console.log(`⏳ Rate Limit Engellemesi! 60 saniye bekleyip TEKRAR DENENECEK...`);
          await sleep(60000); // 60 Saniye Bekle
        } else {
          console.error(`❌ ${src.name} için 3 deneme de başarısız oldu. Bu kaynak atlanıyor.`);
        }
      }
    }

    if (!parsed) continue; // 3 denemede de başarısız olursa sonraki kaynağa geç

    // 5. Veritabanı Kayıt İşlemleri
    for (const post of parsed) {
      const safeTitle = post.title?.trim() || "No title";
      const safeLink = post.link?.trim() || null;

      if (!safeLink || !allLinks.includes(safeLink)) continue;

      const fingerprint = crypto.createHash("sha1").update(safeTitle + safeLink).digest("hex");

      try {
        const existing = await postsRepository.findByFingerprint(fingerprint);
        if (existing) {
           // console.log("Duplicate atlandı."); 
           continue; 
        }

        let lang = detectLanguage(safeTitle + " " + (post.summary || ""));
        if (!lang || (lang === "en" && src.name.toLowerCase() in SOURCE_DEFAULT_LANG)) {
          lang = SOURCE_DEFAULT_LANG[src.name.toLowerCase()] || "en";
        }

        await postsRepository.createPost({
          title: safeTitle,
          summary: post.summary,
          image_url: post.image_url,
          source_url: safeLink,
          source_id: src.id,
          category_id: src.category_id,
          fingerprint,
          status: "fetched",
          lang,
        });
        inserted++;
        console.log(`✅ Eklendi: ${safeTitle}`);
      } catch (dbErr) {
        console.error(`⚠️ DB Hatası:`, dbErr.message);
      }
    }

    // Başarılı işlem sonrası da biraz bekle ki sonraki kaynak hemen engellenmesin
    console.log(`⏳ ${src.name} bitti. Sonraki kaynak için 30 saniye bekleniyor...`);
    await sleep(30000);
  }

  console.log(`📌 Toplam eklenen post: ${inserted}`);
  return { inserted };
}

module.exports = run;

if (require.main === module) {
  run().then(console.log).catch(console.error);
}