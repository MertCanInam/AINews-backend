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

async function askAI(prompt, retries = 4, delay = 30000) { // 30 saniye ile başla
  try {
    // ✅ DEĞİŞİKLİK: Daha iyi rate limitlere sahip ücretsiz bir alternatif model
    const model = "mistralai/mistral-7b-instruct:free";
    
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
    if (err.response && err.response.status === 429 && retries > 0) { // 429 Rate Limit
      const waitTime = delay;
      console.warn(`⚠️ Rate Limit (429). ${waitTime / 1000} saniye bekleyip tekrar deneniyor... (Kalan deneme: ${retries})`);
      await sleep(waitTime);
      // Bir sonraki denemede bekleme süresini ikiye katla (Exponential Backoff)
      return askAI(prompt, retries - 1, delay * 2);
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