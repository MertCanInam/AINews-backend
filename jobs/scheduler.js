const path = require("path");
const cron = require("node-cron");
const { exec } = require("child_process");

const runnerPath = path.join(__dirname, "jobs/runner.js");
const mailerPath = path.join(__dirname, "jobs/mailer.js");

// Türkiye saati 09:20 → UTC 06:20
cron.schedule("20 6 * * *", () => {
  console.log("⏰ Runner job başlıyor (09:20 TR / 06:20 UTC)...");
  exec(`node ${runnerPath}`, (err, stdout, stderr) => {
    if (err) {
      console.error("❌ Runner job hata:", err);
      return;
    }
    console.log("Runner job output:", stdout);
  });
});

// Türkiye saati 09:25 → UTC 06:25
cron.schedule("25 6 * * *", () => {
  console.log("📧 Mailer job başlıyor (09:25 TR / 06:25 UTC)...");
  exec(`node ${mailerPath}`, (err, stdout, stderr) => {
    if (err) {
      console.error("❌ Mailer job hata:", err);
      return;
    }
    console.log("Mailer job output:", stdout);
  });
});

console.log("🔄 Scheduler aktif: Runner 09:20’de, Mailer 09:25’te (Türkiye saati).");
