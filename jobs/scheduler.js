const path = require("path");
const cron = require("node-cron");
const { exec } = require("child_process");

const runnerPath = path.join(__dirname, "runner.js");   // scheduler.js ile aynı klasörde
const mailerPath = path.join(__dirname, "mailer.js");

// Türkiye saati 11:00 → UTC 08:00
cron.schedule("0 8 * * *", () => {
  console.log("⏰ Runner job başlıyor (11:00 TR / 08:00 UTC)...");
  exec(`node ${runnerPath}`, (err, stdout, stderr) => {
    if (err) {
      console.error("❌ Runner job hata:", err);
      return;
    }
    console.log("Runner job output:", stdout);
  });
});

// Türkiye saati 11:05 → UTC 08:05
cron.schedule("5 8 * * *", () => {
  console.log("📧 Mailer job başlıyor (11:05 TR / 08:05 UTC)...");
  exec(`node ${mailerPath}`, (err, stdout, stderr) => {
    if (err) {
      console.error("❌ Mailer job hata:", err);
      return;
    }
    console.log("Mailer job output:", stdout);
  });
});

console.log("🔄 Scheduler aktif: Runner 11:00’de, Mailer 11:05’te (Türkiye saati).");
