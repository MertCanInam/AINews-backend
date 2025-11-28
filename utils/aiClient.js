const axios = require("axios");

const client = axios.create({
  baseURL: "https://openrouter.ai/api/v1",
  timeout: 120000, // 2 dakika bekleme süresi (Google bazen yavaş başlayabilir)
  headers: {
    Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
    "Content-Type": "application/json",
    "HTTP-Referer": "https://ai-news-bot.com",
    "X-Title": "News Bot",
  },
});

async function askAI(prompt) {
  try {
    console.log("🚀 AI isteği atılıyor (Model: Gemini 2.0 Flash)...");

    const res = await client.post("/chat/completions", {
      // ✅ GÜNCELLEME: Google'ın en yeni ve ücretsiz modeli. Çok daha stabil.
      model: "google/gemini-2.0-flash-exp:free", 
      messages: [{ role: "user", content: prompt }],
      temperature: 0.3,
    });

    if (res.data && res.data.choices && res.data.choices.length > 0) {
      console.log("✅ AI Cevabı alındı! (Uzunluk: " + res.data.choices[0].message.content.length + ")");
      return res.data.choices[0].message.content.trim();
    } else {
      console.log("⚠️ AI boş cevap döndü.");
      return null;
    }

  } catch (err) {
    // console.error yerine console.log kullanıyoruz ki kesin görelim
    console.log("❌ AI HATASI OLUŞTU:");
    if (err.response) {
      console.log(`Status: ${err.response.status}`);
      console.log(`Data: ${JSON.stringify(err.response.data)}`);
    } else if (err.code === 'ECONNABORTED') {
      console.log("Zaman aşımı (Timeout) hatası.");
    } else {
      console.log(err.message);
    }
    return null; // Hata fırlatmak yerine null dönelim ki diğer haberleri engellemesin
  }
}

module.exports = { askAI };