require("dotenv").config();
const { Post } = require("../../models");
const { askAI } = require("../../utils/aiClient");

// ✅ Yardımcı Fonksiyon: Bekleme (Sleep)
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// Desteklenen diller ve prompt şablonları
const supportedLangs = {
  tr: (text) => `
Sen bir haber özetleyicisin.
Aşağıdaki haber metnini Türkçe olarak 2-3 cümlelik öz, net ve anlaşılır bir şekilde özetle:
---
${text}
  `,
  en: (text) => `
You are a news summarizer.
Summarize the following news text in English in 2-3 clear and concise sentences:
---
${text}
  `,
  de: (text) => `
Du bist ein Nachrichten-Zusammenfasser.
Fasse den folgenden Nachrichtentext in 2-3 klaren und präzisen Sätzen auf Deutsch zusammen:
---
${text}
  `,
  fr: (text) => `
Tu es un résumé d’articles.
Résume le texte suivant en 2-3 phrases claires et concises en français:
---
${text}
  `,
  es: (text) => `
Eres un resumidor de noticias.
Resume el siguiente texto en español en 2-3 oraciones claras y concisas:
---
${text}
  `,
};

async function runSummarizerJob(limit = 20) {
  console.log("[INFO] Summarizer job started...");

  // Özetlenmeyi bekleyen postlar
  const pendingPosts = await Post.findAll({
    where: { status: "pending_summary" },
    order: [["id", "DESC"]],
    limit,
  });

  if (!pendingPosts.length) {
    console.log("[INFO] No posts pending summary.");
    return;
  }

  for (const post of pendingPosts) {
    try {
      console.log(`🔍 Summarizing: ${post.title} (lang=${post.lang})`);

      // Dil bazlı prompt seçimi
      let prompt;
      if (supportedLangs[post.lang]) {
        prompt = supportedLangs[post.lang](post.content_clean);
      } else {
        console.warn(`⚠️ Unsupported lang "${post.lang}", falling back to English summarization.`);
        prompt = supportedLangs.en(post.content_clean);
      }

      const aiSummaryRaw = await askAI(prompt);
      
      // Eğer AI cevap vermezse (Rate Limit vb.), işlemi durdurma ama bu kaydı pas geç
      if (!aiSummaryRaw) {
          console.warn(`⚠️ AI cevap vermedi, 15 saniye soğuma süresi bekleniyor...`);
          await sleep(15000);
          continue; // Kaydetme, döngüden çıkma, sadece bu turu atla
      }

      // AI çıktısını temizle
      let aiSummary = aiSummaryRaw.replace(/```/g, "").trim();
      
      if (aiSummary) {
          // "Özet:", "Summary:" gibi önekleri ve tırnak işaretlerini temizle
          aiSummary = aiSummary.replace(/^(Özet:|Summary:|Abstract:|Here is the summary:)/i, "").trim();
          aiSummary = aiSummary.replace(/^["']|["']$/g, "");
      }

      if (aiSummary && aiSummary.length > 0) {
        post.summary = aiSummary;
        post.status = "summarized";
        await post.save();
        console.log(`✅ Summary saved for: ${post.title}`);
        
        // ✅ KRİTİK EKLEME: Her başarılı özetten sonra 10 saniye bekle
        console.log("⏳ Rate Limit koruması: 10 saniye bekleniyor...");
        await sleep(10000); 

      } else {
        post.status = "error";
        await post.save();
        console.warn(`⚠️ No summary generated for: ${post.title}`);
      }
    } catch (err) {
      console.error(`❌ Error summarizing ${post.title}:`, err.message);
      post.status = "error";
      await post.save();
    }
  }

  console.log("[INFO] Summarizer job finished.");
}

// Script direkt çalıştırıldığında tetikle
if (require.main === module) {
  runSummarizerJob().then(() => process.exit(0));
}

module.exports = runSummarizerJob;