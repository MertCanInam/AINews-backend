// services/usersService.js
const crypto = require("crypto");
const bcrypt = require("bcrypt");
const usersRepository = require("../repositories/userRepository");
const mailer = require("../utils/mailer"); // yoksa mock log'lar

// ─────────────────────────────────────────────────────────────
// Profil getir (me sayfası)
// ─────────────────────────────────────────────────────────────
async function getById(userId) {
  const user = await usersRepository.getUserById(userId, {
    attributes: ["user_id", "email", "first_name", "last_name", "role_id", "created_at"],
  });
  if (!user) return null;
  const plain = user.get ? user.get({ plain: true }) : user;
  return {
    id: plain.user_id ?? plain.id,
    user_id: plain.user_id ?? plain.id,
    email: plain.email,
    first_name: plain.first_name,
    last_name: plain.last_name,
    role_id: plain.role_id,
    created_at: plain.created_at,
  };
}

// ─────────────────────────────────────────────────────────────
// Profil güncelle (ad/soyad vb.)
// ─────────────────────────────────────────────────────────────
async function updateProfile(userId, { first_name, last_name }) {
  const payload = {};
  if (typeof first_name !== "undefined") payload.first_name = first_name;
  if (typeof last_name !== "undefined") payload.last_name = last_name;

  if (Object.keys(payload).length === 0) return false;
  await usersRepository.updateUser(userId, payload);
  return true;
}

// ─────────────────────────────────────────────────────────────
// Şifre değiştir
// ─────────────────────────────────────────────────────────────
async function changePassword(userId, currentPassword, newPassword) {
  const user = await usersRepository.getUserById(userId, { attributes: ["user_id", "password"] });
  if (!user) throw new Error("Kullanıcı bulunamadı");

  const plain = user.get ? user.get({ plain: true }) : user;
  const ok = await bcrypt.compare(currentPassword, plain.password);
  if (!ok) {
    const err = new Error("Mevcut şifre hatalı");
    err.code = "BAD_REQUEST";
    throw err;
  }

  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(newPassword, salt);
  await usersRepository.updatePassword(userId, hash);
  return true;
}

// ─────────────────────────────────────────────────────────────
// E-posta değişikliği talebi (onay maili gönderir)
// ─────────────────────────────────────────────────────────────
async function requestEmailChange(userId, newEmail) {
  const token = crypto.randomBytes(32).toString("hex");

  await usersRepository.setPendingEmail(userId, newEmail, token);

  const link = `${process.env.FRONTEND_URL || "http://localhost:5173"}/confirm-email?token=${token}`;

  if (mailer?.sendMail) {
    await mailer.sendMail({
      to: newEmail,
      subject: "E-posta Değişikliği Onayı",
      html: `<p>E-postanızı değiştirmek için <a href="${link}">buraya tıklayın</a>.</p>`,
    });
  } else {
    console.log("📧 [DEV] Email confirmation link:", link);
  }

  return true;
}

// ─────────────────────────────────────────────────────────────
// E-posta değişikliği onayı (token tüketir, maili kalıcı değiştirir)
// ─────────────────────────────────────────────────────────────
async function confirmEmailChange(token) {
  const user = await usersRepository.consumeEmailToken(token);
  if (!user) {
    const err = new Error("Geçersiz veya süresi dolmuş bağlantı");
    err.code = "BAD_REQUEST";
    throw err;
  }
  const plain = user.get ? user.get({ plain: true }) : user;
  return { user_id: plain.user_id, email: plain.email };
}

module.exports = {
  getById,
  updateProfile,
  changePassword,
  requestEmailChange,
  confirmEmailChange,
};
