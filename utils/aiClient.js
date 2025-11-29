const axios = require("axios");

const client = axios.create({
  baseURL: "https://openrouter.ai/api/v1",
  timeout: 120000, // 2 dakika timeout
  headers: {
    Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
    "Content-Type": "application/json",
    "HTTP-Referer": "https://ai-news-bot.com",
    "X-Title": "News Bot",
  },
});

async function askAI(prompt) {
  try {
    // ✅ İSTEK: Kullanıcının isteği üzerine Mistral'e geçildi.
    // Alternatif olarak çok hızlı olan Llama 3.2 de kullanılabilir.
    const model = "mistralai/mistral-small-3.1-24b-instruct:free";
    
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
      console.log("⚠️ AI boş cevap döndü.");
      return null;
    }

  } catch (err) {
    console.log("❌ AI HATASI OLUŞTU:");
    if (err.response) {
      console.log(`Status: ${err.response.status}`);
      // Detaylı hatayı görmek için
      console.log(`Data: ${JSON.stringify(err.response.data)}`);
    } else if (err.code === 'ECONNABORTED') {
      console.log("Zaman aşımı (Timeout) hatası.");
    } else {
      console.log(err.message);
    }
    return null;
  }
}

module.exports = { askAI };