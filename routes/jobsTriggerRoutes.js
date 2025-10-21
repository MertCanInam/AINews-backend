// routes/jobsTriggerRoutes.js
const express = require("express");
const { exec } = require("child_process");
const router = express.Router();

const SECRET_KEY = process.env.JOB_TRIGGER_KEY || "supersecretkey";

// 🔹 Runner (haber çekme)
router.post("/trigger/runner", async (req, res) => {
  const { key } = req.query;
  if (key !== SECRET_KEY) {
    console.warn("❌ Runner tetikleme yetkisiz giriş denemesi!");
    return res.status(403).json({ message: "Yetkisiz erişim" });
  }

  console.log("🚀 Runner job başlatılıyor...");
  exec("node jobs/runner.js", (err, stdout, stderr) => {
    if (err) {
      console.error("❌ Runner hata:", err);
      return res.status(500).json({ error: err.message });
    }
    if (stderr) console.error("Runner stderr:", stderr);
    console.log("✅ Runner tamamlandı:", stdout);
    res.json({ message: "Runner başlatıldı", output: stdout });
  });
});

// 🔹 Mailer (mail gönderme)
router.post("/trigger/mailer", async (req, res) => {
  const { key } = req.query;
  if (key !== SECRET_KEY) {
    console.warn("❌ Mailer tetikleme yetkisiz giriş denemesi!");
    return res.status(403).json({ message: "Yetkisiz erişim" });
  }

  console.log("📧 Mailer job başlatılıyor...");
  exec("node jobs/mailer.js", (err, stdout, stderr) => {
    if (err) {
      console.error("❌ Mailer hata:", err);
      return res.status(500).json({ error: err.message });
    }
    if (stderr) console.error("Mailer stderr:", stderr);
    console.log("✅ Mailer tamamlandı:", stdout);
    res.json({ message: "Mailer başlatıldı", output: stdout });
  });
});

module.exports = router;
