const cron = require("node-cron");
const { exec } = require("child_process");

// Türkiye saati 09:00 → UTC 06:00
cron.schedule("0 6 * * *", () => {
  console.log("⏰ Extractor job başlıyor (09:00 TR / 06:00 UTC)...");
  exec("node jobs/extractor.js", (err, stdout, stderr) => {
    if (err) {
      console.error("❌ Extractor job hata:", err);
      return;
    }
    console.log("Extractor job output:", stdout);
  });
});

// Türkiye saati 09:10 → UTC 06:10
cron.schedule("10 6 * * *", () => {
  console.log("📧 Mailer job başlıyor (09:10 TR / 06:10 UTC)...");
  exec("node jobs/mailer.js", (err, stdout, stderr) => {
    if (err) {
      console.error("❌ Mailer job hata:", err);
      return;
    }
    console.log("Mailer job output:", stdout);
  });
});

console.log("🔄 Scheduler aktif: Extractor 09:00’da, Mailer 09:10’da (Türkiye saati).");
