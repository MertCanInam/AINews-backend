const axios = require("axios");
const crypto = require("crypto");
const cheerio = require("cheerio");
require("dotenv").config();
const { askAI } = require("../../utils/aiClient");
const postsRepository = require("../../repositories/postsRepository");
const sourcesRepository = require("../../repositories/sourcesRepository");
const { detectLanguage } = require("../../utils/langDetect");
const { parse } = require("jsonrepair");

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
    try {
      console.log(`--------------------------------------------------`);
      console.log(`🔍 Kaynak işleniyor: ${src.name} (${src.url})`);

      // 1. HTML indir
      const res = await axios.get(src.url, {
        timeout: 20000,
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        },
      });
      const html = res.data;

      // 2. Cheerio ile linkleri çıkar + filtrele
      const $ = cheerio.load(html);
      const allLinks = [];

      if (src.name.toLowerCase().includes("bbc")) {
        const bbcLinks = [];
        $("a[data-testid='internal-link']").each((i, el) => {
          const link = $(el).attr("href");
          const title = $(el).find("h3").text().trim();
          if (!link || !title) return;

          let fullUrl = link.startsWith("http")
            ? link
            : new URL(link, src.url).toString();

          if (!/\/(articles|haberler|turkiye|dunya|bilim-)/.test(fullUrl))
            return;

          bbcLinks.push({ title, link: fullUrl });
        });

        if (bbcLinks.length > 0) {
          allLinks.push(...bbcLinks.map((item) => item.link));
        }
      } else {
        $("a").each((i, el) => {
          const href = $(el).attr("href");
          if (!href) return;
          if (href.startsWith("#") || href.startsWith("javascript")) return;

          let fullUrl = href;
          if (!fullUrl.startsWith("http")) {
            try {
              fullUrl = new URL(fullUrl, src.url).toString();
            } catch (e) {
              return;
            }
          }

          if (src.name.toLowerCase().includes("donanimhaber")) {
            if (!/\/[^/]+--\d+$/.test(fullUrl)) return;
          }

          if (src.name.toLowerCase().includes("hackernews")) {
            if (!/\d{4}\/\d{2}\//.test(fullUrl)) return;
          }

          if (src.name.toLowerCase().includes("shiftdelete")) {
            if (!/^https:\/\/shiftdelete\.net\/[a-z0-9-]+(?:-[a-z0-9-]+)*$/i.test(fullUrl))
              return;
            if (/\/(yapay-zeka|mobil|ios|android|donanim|haberler|sdntv|inceleme)(\/|$)/i.test(fullUrl))
              return;
            if (/\/page\//i.test(fullUrl)) return;
          }

          allLinks.push(fullUrl);
        });
      }

      console.log(`🔗 Filtrelenmiş link sayısı: ${allLinks.length}`);

      if (allLinks.length === 0) {
        console.log(`⚠️ ${src.name} için uygun link bulunamadı, atlanıyor.`);
        continue;
      }

      // 3. Prompt hazırlığı
      let linkRule = "";
      if (src.name.toLowerCase().includes("hackernews")) {
        linkRule = `- TheHackerNews linkleri "/YYYY/MM/...html" formatında olmalı.`;
      }
      if (src.name.toLowerCase().includes("donanimhaber")) {
        linkRule = `- DonanımHaber linkleri "...--123456" formatında olmalı.`;
      }

      const extractPrompt = `
      Sen bir haber listesi ayıklama yapay zekasısın.
      HTML kodu ve filtrelenmiş link listesi verilecek.
      Görevin: Sayfadaki en güncel 7 haberi JSON formatında döndürmek.

      Beklenen JSON:
      [
        { "title": "string", "summary": "string", "image_url": "string", "link": "string" }
      ]

      Kurallar:
      - "link" mutlaka verilen listeden birebir seçilmeli, uydurma slug veya ID ekleme.
      - ${linkRule}
      - "title" sadece haber başlığı olabilir.
      - "summary" kategori sayfasındaki kısa açıklama olmalı (yoksa başlıktan farklı birkaç cümle üret).
      - JSON dışında hiçbir şey yazma.

      Link Listesi (toplam ${allLinks.length} adet):
      ${JSON.stringify(allLinks.slice(0, 50), null, 2)}

      HTML (ilk 5000 karakter):
      ${html.slice(0, 5000)}
      `;

      let parsed;
      try {
        const aiResult = await askAI(extractPrompt);

        // 🛑 KRİTİK KONTROL: AI Cevap vermedi mi?
        if (!aiResult) {
          console.warn(`⚠️ AI boş cevap döndü (Muhtemelen Rate Limit), bu kaynak atlanıyor: ${src.name}`);
          
          // ✅ GÜNCELLEME: Bekleme süresini 45 saniyeye çıkardık (Daha güvenli)
          console.log("⏳ Hata sonrası soğuma süresi (45 sn)...");
          await sleep(45000); 
          continue;
        }

        const jsonMatch = aiResult.match(/\[[\s\S]*\]/);
        const clean = jsonMatch ? jsonMatch[0] : aiResult.replace(/```json|```/g, "").trim();

        try {
          parsed = JSON.parse(clean);
        } catch (err) {
          parsed = parse(clean);
        }
      } catch (err) {
        console.error("⚠️ Haber parse hatası:", err.message);
        continue;
      }

      // 5. DB Kaydı
      for (const post of parsed) {
        const safeTitle = post.title?.trim() || "No title";
        const safeSummary = post.summary?.trim() || null;
        const safeImage = post.image_url?.trim() || null;
        const safeLink = post.link?.trim() || null;

        if (!safeLink || !allLinks.includes(safeLink)) {
          continue;
        }

        const fingerprint = crypto
          .createHash("sha1")
          .update(safeTitle + safeLink)
          .digest("hex");

        try {
          const existingByFingerprint = await postsRepository.findByFingerprint(fingerprint);
          const existingByUrl = await postsRepository.findByUrl(safeLink);

          if (existingByFingerprint || existingByUrl) {
            console.log(`⚠️ Duplicate atlandı: ${safeTitle}`);
            continue;
          }

          let lang = detectLanguage(safeTitle + " " + (safeSummary || ""));
          if (!lang || (lang === "en" && src.name.toLowerCase() in SOURCE_DEFAULT_LANG)) {
            lang = SOURCE_DEFAULT_LANG[src.name.toLowerCase()] || "en";
          }

          await postsRepository.createPost({
            title: safeTitle,
            summary: safeSummary,
            content_raw: null,
            content_clean: null,
            image_url: safeImage,
            source_url: safeLink,
            source_id: src.id,
            category_id: src.category_id,
            fingerprint,
            status: "fetched",
            lang,
          });
          inserted++;
          console.log(`✅ Eklendi: ${safeTitle} (lang=${lang})`);
        } catch (dbErr) {
          console.error(`⚠️ DB insert hatası:`, dbErr.message);
        }
      }

      // ✅ GÜNCELLEME: Başarılı işlemden sonra da 45 saniye bekle
      console.log(`⏳ ${src.name} tamamlandı. Rate Limit yememek için 45 saniye bekleniyor...`);
      await sleep(45000);

    } catch (err) {
      console.error(`❌ Kaynak hata: ${src.url}`, err.message);
    }
  }

  console.log(`📌 Toplam eklenen post: ${inserted}`);
  return { inserted };
}

module.exports = run;

if (require.main === module) {
  run().then(console.log).catch(console.error);
}