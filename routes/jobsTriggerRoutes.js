const express = require("express");
const router = express.Router();
const path = require("path");
const { fork } = require("child_process");

// basit secret (opsiyonel ama önerilir)
const REQUIRED_KEY = process.env.JOB_TRIGGER_KEY;

// in-memory lock: aynı anda birden fazla pipeline çalışmasın
let isRunning = false;

// Sağlık testi
router.get("/test", (_req, res) => {
  res.json({ ok: true, message: "Jobs trigger endpoint is live 🚀", time: new Date().toISOString() });
});

// Manuel tetikleme
router.get("/trigger-pipeline", async (req, res) => {
  try {
    if (REQUIRED_KEY && req.query.key !== REQUIRED_KEY) {
      return res.status(403).json({ ok: false, message: "Forbidden" });
    }

    if (isRunning) {
      return res.status(409).json({ ok: false, message: "Pipeline already running, try later." });
    }

    isRunning = true;
    console.log("🚀 Manual pipeline trigger received!");

    // runner.js'i ayrı process'te çalıştır (arka planda)
    const runnerPath = path.join(__dirname, "..", "jobs", "runner.js");
    const child = fork(runnerPath, [], {
      stdio: "inherit",
      env: process.env,
    });

    // child bittiğinde lock'u bırak
    child.on("exit", (code) => {
      isRunning = false;
      console.log(`🏁 Pipeline process exited with code ${code}`);
    });

    // İsteğe hızlı cevap ver (cron servisleri için ideal)
    return res.status(202).json({ ok: true, message: "Pipeline started in background." });
  } catch (err) {
    isRunning = false;
    console.error("❌ Pipeline trigger error:", err);
    return res.status(500).json({ ok: false, message: err.message });
  }
});

router.get("/trigger-mailer", async (req, res) => {
  try {
    const mailerPath = path.join(__dirname, "..", "jobs", "mailer.js");
    const child = fork(mailerPath, [], { stdio: "inherit", env: process.env });
    return res.status(202).json({ ok: true, message: "Mailer started in background." });
  } catch (err) {
    console.error("❌ Mailer trigger error:", err);
    return res.status(500).json({ ok: false, message: err.message });
  }
});
module.exports = router;
