const path = require("path");
const cron = require("node-cron");
const { exec } = require("child_process");

const runnerPath = path.join(__dirname, "jobs", "runner.js");
const mailerPath = path.join(__dirname, "jobs", "mailer.js");

// Türkiye saati 09:10 → UTC 06:10
cron.schedule("10 6 * * *", () => {
  console.log("⏰ Runner job başlıyor (09:10 TR / 06:10 UTC)...");
  exec(`node ${runnerPath}`, (err, stdout, stderr) => {
    if (err) {
      console.error("❌ Runner job hata:", err);
      return;
    }
    console.log("Runner job output:", stdout);
  });
});

// Türkiye saati 09:15 → UTC 06:15
cron.schedule("15 6 * * *", () => {
  console.log("📧 Mailer job başlıyor (09:15 TR / 06:15 UTC)...");
  exec(`node ${mailerPath}`, (err, stdout, stderr) => {
    if (err) {
      console.error("❌ Mailer job hata:", err);
      return;
    }
    console.log("Mailer job output:", stdout);
  });
});

console.log("🔄 Scheduler aktif: Runner 09:10’da, Mailer 09:15’te (Türkiye saati).");
