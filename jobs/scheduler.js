const path = require("path");
const cron = require("node-cron");
const { exec } = require("child_process");

const runnerPath = path.join(__dirname, "runner.js");
const mailerPath = path.join(__dirname, "mailer.js");

// Gece 01:45'te (UTC) haberleri çeker.
cron.schedule("45 1 * * *", () => {
  console.log("⏰ Runner job başlıyor (01:45 UTC)...");
  exec(`node ${runnerPath}`, (err, stdout, stderr) => {
    if (err) {
      console.error("❌ Runner job hata:", err);
      return;
    }
    console.log("Runner job output:", stdout);
  });
});

// Gece 01:50'de (UTC) mailleri gönderir.
cron.schedule("50 1 * * *", () => {
  console.log("📧 Mailer job başlıyor (01:50 UTC)...");
  exec(`node ${mailerPath}`, (err, stdout, stderr) => {
    if (err) {
      console.error("❌ Mailer job hata:", err);
      return;
    }
    console.log("Mailer job output:", stdout);
  });
});

console.log(
  "🔄 Scheduler aktif: Runner 01:45’de, Mailer 01:50’de (UTC) çalışacak."
);