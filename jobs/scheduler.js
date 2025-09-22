const path = require("path");
const cron = require("node-cron");
const { exec } = require("child_process");

const runnerPath = path.join(__dirname, "runner.js");   // scheduler.js ile aynı klasörde
const mailerPath = path.join(__dirname, "mailer.js");

// Türkiye saati 10:45 → UTC 07:45
cron.schedule("45 7 * * *", () => {
  console.log("⏰ Runner job başlıyor (10:45 TR / 07:45 UTC)...");
  exec(`node ${runnerPath}`, (err, stdout, stderr) => {
    if (err) {
      console.error("❌ Runner job hata:", err);
      return;
    }
    console.log("Runner job output:", stdout);
  });
});

// Türkiye saati 10:50 → UTC 07:50
cron.schedule("50 7 * * *", () => {
  console.log("📧 Mailer job başlıyor (10:50 TR / 07:50 UTC)...");
  exec(`node ${mailerPath}`, (err, stdout, stderr) => {
    if (err) {
      console.error("❌ Mailer job hata:", err);
      return;
    }
    console.log("Mailer job output:", stdout);
  });
});

console.log("🔄 Scheduler aktif: Runner 10:45’te, Mailer 10:50’de (Türkiye saati).");
