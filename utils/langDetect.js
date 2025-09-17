const { franc } = require("franc-min");
const langs = require("langs");

/**
 * Verilen metnin dilini tespit eder
 * @param {string} text
 * @returns {string} ISO 639-1 kodu (ör: "tr", "en", "de")
 */
function detectLanguage(text) {
  if (!text || text.trim().length < 5) return "en"; // çok kısa metin -> default EN

  const code3 = franc(text); // ISO 639-3 kodu (ör: "tur", "eng")
  if (code3 === "und") return "en"; // algılanamadıysa fallback

  const langData = langs.where("3", code3);
  if (!langData) return "en";

  return langData["1"]; // ISO 639-1 kodu döner (ör: "tr", "en")
}

module.exports = { detectLanguage };
