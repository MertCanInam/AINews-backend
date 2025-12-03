const axios = require("axios");

// Yardımcı Fonksiyon: Bekleme
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const client = axios.create({
  baseURL: "https://openrouter.ai/api/v1",
  timeout: 120000, 
  headers: {
    Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
    "Content-Type": "application/json",
    "HTTP-Referer": "https://ai-news-bot.com",
    "X-Title": "News Bot",
  },
});

async function askAI(prompt, retries = 3) {
  try {
    // ✅ DEĞİŞİKLİK: En yüksek limitli ve hızlı ücretsiz model
    const model = "google/gemini-2.0-flash-exp:free"; 
    
    console.log(`🚀 AI isteği atılıyor (Model: ${model})...`);

    const res = await client.post("/chat/completions", {
      model: model,
      messages: [{ role: "user", content: prompt }],
      temperature: 0.3,
    });

    if (res.data && res.data.choices && res.data.choices.length > 0) {
      console.log("✅ AI Cevabı alındı!");
      return res.data.choices[0].message.content.trim();
    } else {
      return null;
    }

  } catch (err) {
    // 429 HATASI YAKALAMA
    if (err.response && err.response.status === 429 && retries > 0) {
      console.warn(`⚠️ Rate Limit (429). 60 saniye bekleyip tekrar deneniyor... (Kalan: ${retries})`);
      await sleep(60000); 
      return askAI(prompt, retries - 1);
    }

    console.log("❌ AI HATASI OLUŞTU:");
    if (err.response) {
        console.log(`Status: ${err.response.status}`);
    } else {
        console.log(err.message);
    }
    return null;
  }
}

module.exports = { askAI };