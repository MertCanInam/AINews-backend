// jobs/ai/extractor.js
const axios = require("axios");
const crypto = require("crypto");
const cheerio = require("cheerio");
require("dotenv").config();
const { askAI } = require("../../utils/aiClient");
const postsRepository = require("../../repositories/postsRepository");
const sourcesRepository = require("../../repositories/sourcesRepository");
const { detectLanguage } = require("../../utils/langDetect");
const { parse } = require("jsonrepair");

// ✅ Kaynak bazlı default dil
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
      console.log(`🔍 Kaynak işleniyor: ${src.name} (${src.url})`);

      // 1. HTML indir (✅ DÜZELTME: User-Agent eklendi)
      const res = await axios.get(src.url, { 
        timeout: 20000,
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
        }
      });
      const html = res.data;

      // 2. Cheerio ile linkleri çıkar + filtrele
      const $ = cheerio.load(html);
      const allLinks = [];

      if (src.name.toLowerCase().includes("bbc")) {
        // ✅ BBC özel işleme
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
          console.log("🔗 BBC özel link sayısı:", bbcLinks.length);
        }
      } else {
        // ✅ Diğer kaynaklar için genel döngü
        $("a").each((i, el) => {
          const href = $(el).attr("href");
          if (!href) return;
          if (href.startsWith("#") || href.startsWith("javascript")) return;

          // Göreceli linkleri base URL ile birleştir
          let fullUrl = href;
          if (!fullUrl.startsWith("http")) {
            try {
              fullUrl = new URL(fullUrl, src.url).toString();
            } catch (e) {
              return;
            }
          }

          // ✅ DonanımHaber için filtre
          if (src.name.toLowerCase().includes("donanimhaber")) {
            if (!/\/[^/]+--\d+$/.test(fullUrl)) return;
          }

          // ✅ HackerNews için filtre
          if (src.name.toLowerCase().includes("hackernews")) {
            if (!/\d{4}\/\d{2}\//.test(fullUrl)) return;
          }

          // ✅ ShiftDelete için filtre (sadece yapay-zeka haberleri)
          if (src.name.toLowerCase().includes("shiftdelete")) {
            // gerçek haber slug'larını al (çoklu slug destekli)
            if (!/^https:\/\/shiftdelete\.net\/[a-z0-9-]+(?:-[a-z0-9-]+)*$/i.test(fullUrl))
              return;

            // kategori / sayfa linklerini at
            if (/\/(yapay-zeka|mobil|ios|android|donanim|haberler|sdntv|inceleme)(\/|$)/i.test(fullUrl)) 
              return;
            if (/\/page\//i.test(fullUrl)) return;
          }

          allLinks.push(fullUrl);
        });
      }

      console.log(`🔗 Filtrelenmiş link sayısı: ${allLinks.length}`);

      if (allLinks.length === 0) {
          console.log("⚠️ Link bulunamadı, bu kaynak atlanıyor.");
          continue; 
      }

      // 3. Kaynağa özel kurallar
      let linkRule = "";
      if (src.name.toLowerCase().includes("hackernews")) {
        linkRule = `- TheHackerNews linkleri "/YYYY/MM/...html" formatında olmalı.`;
      }
      if (src.name.toLowerCase().includes("donanimhaber")) {
        linkRule = `- DonanımHaber linkleri "...--123456" formatında olmalı.`;
      }

      // 4. AI prompt (✅ artık 7 haber)
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
        // console.log("🤖 AI raw output:", aiResult); // Log kirliliği olmasın diye kapattım

        // ✅ DÜZELTME: Sadece [ ... ] arasındaki JSON verisini çek
        const jsonMatch = aiResult.match(/\[[\s\S]*\]/);
        const clean = jsonMatch ? jsonMatch[0] : aiResult.replace(/```json|```/g, "").trim();

        try {
          parsed = JSON.parse(clean);
        } catch (err) {
          parsed = parse(clean);
        }
      } catch (err) {
        console.error("⚠️ Haber parse hatası:", err.message);
        // console.log("Hatalı Data:", clean); // Debug için açabilirsin
        continue;
      }

      // 5. DB’ye kaydet
      for (const post of parsed) {
        const safeTitle = post.title?.trim() || "No title";
        const safeSummary = post.summary?.trim() || null;
        const safeImage = post.image_url?.trim() || null;
        const safeLink = post.link?.trim() || null;

        if (!safeLink || !allLinks.includes(safeLink)) {
          console.warn("⚠️ Geçersiz veya listede olmayan link atlandı:", safeLink);
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

          // ✅ Dil algılama + fallback default_lang
          let lang = detectLanguage(safeTitle + " " + (safeSummary || ""));
          if (
            !lang ||
            (lang === "en" && src.name.toLowerCase() in SOURCE_DEFAULT_LANG)
          ) {
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
          console.error(`⚠️ DB insert hatası (source=${src.name}):`, dbErr.message);
        }
      }
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
