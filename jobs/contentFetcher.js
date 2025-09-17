const axios = require("axios");
const { JSDOM } = require("jsdom");
const { Readability } = require("@mozilla/readability");
require("dotenv").config();

const postsRepository = require("../repositories/postsRepository");

async function run(limit = 20) {
  console.log("[INFO] Content fetcher started...");

  // 1. DB’den status = fetched postları çek
  const posts = await postsRepository.findByStatus("fetched", limit);

  if (!posts.length) {
    console.log("[INFO] No fetched posts found.");
    return;
  }

  for (const post of posts) {
    try {
      console.log(`🔍 Fetching content for: ${post.title}`);

      // 2. Detay sayfasını indir
      const res = await axios.get(post.source_url, { timeout: 20000 });
      const html = res.data;

      // 3. Readability ile içerik çıkar
      const dom = new JSDOM(html, { url: post.source_url });
      const reader = new Readability(dom.window.document);
      const article = reader.parse();

      if (!article || !article.textContent) {
        console.warn(`⚠️ İçerik bulunamadı: ${post.source_url}`);
        await postsRepository.updateStatus(post.id, "error");
        continue;
      }

      const raw = article.content;       // HTML
      const clean = article.textContent; // düz metin

      // 🚫 Junk filtre kontrolü
      const junkPatterns = [
        /neden bbc'ye güvenebilirsiniz/i,
        /gizlilik politikası/i,
        /çerez/i,
        /do not share or sell my info/i
      ];

      if (junkPatterns.some(p => p.test(clean))) {
        console.warn("⚠️ Junk content tespit edildi, atlanıyor:", post.source_url);
        await postsRepository.updateStatus(post.id, "error");
        continue;
      }

      // 4. DB güncelle
      await postsRepository.updatePost(post.id, {
        content_raw: raw,
        content_clean: clean,
        status: "pending_summary",
      });

      console.log(`✅ İçerik kaydedildi: ${post.title}`);
    } catch (err) {
      console.error(`❌ Hata (${post.source_url}):`, err.message);
      await postsRepository.updateStatus(post.id, "error");
    }
  }

  console.log("[INFO] Content fetcher finished.");
}

module.exports = run;

if (require.main === module) {
  run().then(console.log).catch(console.error);
}
