// module.exports = {
//   apps: [
//     {
//       name: "news-pipeline",             // PM2 içinde görülecek isim
//       script: "jobs/runner.js",          // Çalıştırılacak dosya
//       watch: false,                      // Dosya değişiminde restart etmesin
//       instances: 1,                      // Tek instance yeter
//       autorestart: true,                 // Çökerse yeniden başlat
//       cron_restart: "*/5 * * * *",       // ⏰ her 5 dakikada bir çalıştır (test için)
//       env: {
//         NODE_ENV: "production"
//       }
//     }

//   ]
// };
