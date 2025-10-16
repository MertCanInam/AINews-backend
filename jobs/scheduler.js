const path = require("path");
const cron = require("node-cron");
const { exec } = require("child_process");

const runnerPath = path.join(__dirname, "runner.js");
const mailerPath = path.join(__dirname, "mailer.js");

// Sabah saat 8:00'de (UTC) haberleri çeker.
cron.schedule("0 8 * * *", () => {
  console.log("⏰ Runner job başlıyor (08:00 UTC)...");
  exec(`node ${runnerPath}`, (err, stdout, stderr) => {
    if (err) {
      console.error("❌ Runner job hata:", err);
      return;
    }
    console.log("Runner job output:", stdout);
  });
});

// Sabah saat 8:10'da (UTC) mailleri gönderir.
cron.schedule("10 8 * * *", () => {
  console.log("📧 Mailer job başlıyor (08:10 UTC)...");
  exec(`node ${mailerPath}`, (err, stdout, stderr) => {
    if (err) {
      console.error("❌ Mailer job hata:", err);
      return;
    }
    console.log("Mailer job output:", stdout);
  });
});

console.log("🔄 Scheduler aktif: Runner 08:00’de, Mailer 08:10’da (UTC) çalışacak.");