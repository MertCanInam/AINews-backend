const axios = require("axios");

const client = axios.create({
  baseURL: "https://openrouter.ai/api/v1",
  headers: {
    Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
    "Content-Type": "application/json",
  },
});

async function askAI(prompt) {
  try {
    const res = await client.post("/chat/completions", {
      model: "mistralai/mistral-small-3.1-24b-instruct:free",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.3,
    });

    return res.data.choices[0].message.content.trim();
  } catch (err) {
    console.error("AI Hatası:", err.response?.data || err.message);
    throw err;
  }
}

module.exports = { askAI };
