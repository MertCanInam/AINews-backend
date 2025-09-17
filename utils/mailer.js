// utils/mailer.js
const nodemailer = require("nodemailer");

let transporter = null;

function getTransporter() {
  if (transporter) return transporter;

  const { MAIL_HOST, MAIL_PORT, MAIL_USER, MAIL_PASS } = process.env;

  transporter = nodemailer.createTransport({
    host: MAIL_HOST,
    port: Number(MAIL_PORT),
    secure: Number(MAIL_PORT) === 465, // 465 = SSL
    auth: {
      user: MAIL_USER,
      pass: MAIL_PASS,
    },
  });

  return transporter;
}

async function sendMail({ to, subject, html, text }) {
  const { MAIL_USER } = process.env; // ✅ Burada tekrar destructure ettik
  const from = process.env.MAIL_FROM || MAIL_USER || "no-reply@localhost";
  const tx = getTransporter();

  if (!tx) {
    console.log("📧 [DEV MAIL] To:", to);
    console.log("📧 Subject:", subject);
    console.log("📧 HTML:", html || "(yok)");
    console.log("📧 TEXT:", text || "(yok)");
    return { dev: true };
  }

  const info = await tx.sendMail({ from, to, subject, html, text });
  return info;
}

module.exports = { sendMail };
