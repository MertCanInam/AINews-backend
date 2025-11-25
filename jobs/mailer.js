// jobs/mailer.js
const nodemailer = require("nodemailer");
const { User, Post } = require("../models");
const { Op } = require("sequelize");

async function sendDailyMail() {
  console.log("📨 Mail job started...");

  // 1. SMTP transporter
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASS,
    },
  });

  // 2. Kullanıcıları çek
  const users = await User.findAll();

  const today = new Date();
  const start = new Date(today);
  start.setUTCHours(0, 0, 0, 0);
  const end = new Date(today);
  end.setUTCHours(23, 59, 59, 999);

  // 3. Günün özetlenmiş haberlerini çek
  const posts = await Post.findAll({
    where: {
      status: "summarized",
      created_at: {
        [Op.between]: [start, end],
      },
    },
    order: [["created_at", "DESC"]],
  });

  if (!posts.length) {
    console.log("⚠️ Bugün için gönderilecek haber yok.");
    return;
  }

  // 4. HTML bülteni oluştur
  const html = `
    <div style="font-family: Arial, sans-serif; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; background: #fafafa; border-radius: 8px;">
      <h2 style="text-align: center; color: #1d4ed8; margin-bottom: 10px;">📢 Günlük Haber Bülteni</h2>

      <p style="text-align: center; margin-bottom: 25px;">
        🔗 Tüm haberleri görmek için ziyaret et:<br/>
        <a href="https://portalainews.netlify.app" target="_blank" style="color: #2563eb; text-decoration: none; font-weight: bold;">
          portalainews.netlify.app
        </a>
      </p>

      <div style="background: white; padding: 15px 20px; border-radius: 8px; box-shadow: 0 2px 6px rgba(0,0,0,0.05);">
        <ul style="list-style: none; padding: 0; margin: 0;">
          ${posts
            .map(
              (p) => `
                <li style="margin-bottom: 20px; border-bottom: 1px solid #eee; padding-bottom: 15px;">
                  <h3 style="margin: 0; font-size: 18px; color: #111827;">${p.title}</h3>
                  <p style="font-size: 14px; color: #4b5563; margin-top: 8px; margin-bottom: 10px; line-height: 1.5;">
                    ${p.summary}
                  </p>
                  <a href="${p.source_url}" target="_blank" style="color: #2563eb; text-decoration: none; font-weight: 500;">
                    ➡️ Haberi Oku
                  </a>
                </li>
              `
            )
            .join("")}
        </ul>
      </div>

      <hr style="margin-top: 30px; border: none; border-top: 1px solid #ddd;" />

      <p style="font-size: 13px; color: #6b7280; text-align: center; margin-top: 20px;">
        Bu e-posta <b>Portal AI News</b> tarafından otomatik olarak gönderilmiştir.<br/>
        © ${today.getFullYear()} Portal AI News. Tüm hakları saklıdır.
      </p>
    </div>
  `;

  // 5. Mailleri gönder
  for (const u of users) {
    await transporter.sendMail({
      from: `"Haber Botu" <${process.env.MAIL_USER}>`,
      to: u.email,
      subject: `Günlük Haber Bülteni - ${today.toLocaleDateString("tr-TR")}`,
      html,
    });
    console.log(`✅ Mail gönderildi: ${u.email}`);
  }

  console.log("📨 Mail job finished.");
}

// Elle çalıştırmak için
if (require.main === module) {
  sendDailyMail();
}

module.exports = sendDailyMail;
