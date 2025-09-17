const usersService = require("../services/userService");

// Profil getir
async function getMe(req, res) {
  try {
    const userId = req.user?.id || req.user?.user_id;
    if (!userId) return res.status(401).json({ success: false, message: "Yetkisiz" });

    const me = await usersService.getById(userId);
    if (!me) return res.status(404).json({ success: false, message: "Kullanıcı bulunamadı" });

    res.json({ success: true, data: me });
  } catch (err) {
    console.error("getMe error:", err);
    res.status(500).json({ success: false, message: err.message });
  }
}

// Profil güncelle
async function updateMe(req, res) {
  try {
    const userId = req.user?.id || req.user?.user_id;
    const { first_name, last_name } = req.body;
    await usersService.updateProfile(userId, { first_name, last_name });
    res.json({ success: true, message: "Profil güncellendi" });
  } catch (err) {
    console.error("updateMe error:", err);
    res.status(500).json({ success: false, message: err.message });
  }
}

// Şifre değiştir
async function changePassword(req, res) {
  try {
    const userId = req.user?.id || req.user?.user_id;
    const { current_password, new_password } = req.body;
    if (!current_password || !new_password) {
      return res.status(400).json({ success: false, message: "Eksik alanlar" });
    }

    await usersService.changePassword(userId, current_password, new_password);
    res.json({ success: true, message: "Şifre güncellendi" });
  } catch (err) {
    console.error("changePassword error:", err);
    const code = err.code === "BAD_REQUEST" ? 400 : 500;
    res.status(code).json({ success: false, message: err.message });
  }
}

// E-posta değişikliği talebi
async function requestEmailChange(req, res) {
  try {
    const userId = req.user?.id || req.user?.user_id;
    const { new_email } = req.body;
    if (!new_email) return res.status(400).json({ success: false, message: "Yeni email gerekli" });

    await usersService.requestEmailChange(userId, new_email);
    res.json({ success: true, message: "Onay maili gönderildi" });
  } catch (err) {
    console.error("requestEmailChange error:", err);
    res.status(500).json({ success: false, message: err.message });
  }
}

// E-posta onaylama
async function confirmEmailChange(req, res) {
  try {
    const { token } = req.query;
    if (!token) return res.status(400).json({ success: false, message: "token gerekli" });

    const data = await usersService.confirmEmailChange(token);
    res.json({ success: true, message: "Email değiştirildi", data });
  } catch (err) {
    const code = err.code === "BAD_REQUEST" ? 400 : 500;
    res.status(code).json({ success: false, message: err.message });
  }
}

module.exports = {
  getMe,
  updateMe,
  changePassword,
  requestEmailChange,
  confirmEmailChange,
};
