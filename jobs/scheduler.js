const cron = require("node-cron");
const { exec } = require("child_process");

// Türkiye saati 08:30 → UTC 05:30
cron.schedule("30 5 * * *", () => {
  console.log("⏰ Runner job başlıyor (08:30 TR / 05:30 UTC)...");
  exec("node jobs/runner.js", (err, stdout, stderr) => {
    if (err) {
      console.error("❌ Runner job hata:", err);
      return;
    }
    console.log("Runner job output:", stdout);
  });
});

// Türkiye saati 08:35 → UTC 05:35
cron.schedule("35 5 * * *", () => {
  console.log("📧 Mailer job başlıyor (08:35 TR / 05:35 UTC)...");
  exec("node jobs/mailer.js", (err, stdout, stderr) => {
    if (err) {
      console.error("❌ Mailer job hata:", err);
      return;
    }
    console.log("Mailer job output:", stdout);
  });
});

console.log("🔄 Scheduler aktif: Runner 08:30’da, Mailer 08:35’te (Türkiye saati).");
