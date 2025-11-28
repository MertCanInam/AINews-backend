// utils/aiClient.js
const axios = require("axios");

const client = axios.create({
  baseURL: "https://openrouter.ai/api/v1",
  timeout: 60000, // ✅ 60 saniye içinde cevap gelmezse işlemi iptal et
  headers: {
    Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
    "Content-Type": "application/json",
    // OpenRouter sıralamasında geri düşmemek için bu başlıkları eklemek iyi bir pratik:
    "HTTP-Referer": "https://ai-news-bot.com", 
    "X-Title": "News Bot",
  },
});

async function askAI(prompt) {
  try {
    console.log("🤖 AI isteği gönderiliyor..."); 

    const res = await client.post("/chat/completions", {
      // ✅ MODEL DEĞİŞİKLİĞİ: Llama 3.1 8B (Çok daha hızlı ve stabil ücretsiz model)
      model: "meta-llama/llama-3.1-8b-instruct:free", 
      messages: [{ role: "user", content: prompt }],
      temperature: 0.3, // Daha tutarlı cevaplar için düşük sıcaklık
    });

    console.log("🤖 AI cevabı başarıyla alındı.");
    return res.data.choices[0].message.content.trim();
  } catch (err) {
    // Hatayı detaylı görelim
    if (err.code === 'ECONNABORTED') {
      console.error("❌ AI Hatası: İstek zaman aşımına uğradı (60sn Timeout).");
    } else {
      console.error("❌ AI Hatası:", err.response?.data || err.message);
    }
    
    // Hata fırlatarak extractor'daki catch bloğunun yakalamasını sağla
    throw err;
  }
}

module.exports = { askAI };