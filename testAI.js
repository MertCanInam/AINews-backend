require("dotenv").config();
const { askAI } = require("./utils/aiClient");

(async () => {
  const prompt = `
  HTML'den haber çıkar, JSON döndür:
  [
    {
      "title": "haber başlığı",
      "content": "haber içeriği",
      "image_url": "haber görsel linki"
    }
  ]

  HTML:
  <html><body><h1>Deneme Haber</h1><p>Bu bir test haberidir.</p><img src="test.jpg"/></body></html>
  `;

  const result = await askAI(prompt);
  console.log("AI Çıktısı:", result);
})();
