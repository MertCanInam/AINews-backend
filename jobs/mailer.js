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

  // 2. Userları çek (şimdilik tek sen varsın)
  const users = await User.findAll();

  const today = new Date();
  const start = new Date(today);
  start.setUTCHours(0, 0, 0, 0);
  const end = new Date(today);
  end.setUTCHours(23, 59, 59, 999);

  // 3. Haberleri çek (özetlenmiş olanlar)
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

  // 4. HTML bülten hazırla
  const html = `
    <h2>📢 Günlük Haber Bülteni</h2>
    <ul>
      ${posts
        .map(
          (p) => `
        <li>
          <b>${p.title}</b><br/>
          ${p.summary}<br/>
          <a href="${p.source_url}" target="_blank">Devamını oku</a>
        </li>
      `
        )
        .join("")}
    </ul>
  `;

  // 5. Kullanıcılara gönder
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
