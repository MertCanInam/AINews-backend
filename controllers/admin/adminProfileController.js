const adminProfileService = require("../../services/admin/adminProfileService");

// 1. Profil bilgilerini getir
async function getProfile(req, res) {
  try {
    const adminId = req.user.user_id; // authMiddleware’den geliyor
    const profile = await adminProfileService.getProfile(adminId);
    res.json(profile);
  } catch (err) {
    console.error("Admin getProfile error:", err);
    res.status(500).json({ error: "Profil bilgileri alınırken hata oluştu" });
  }
}

// 2. Profil güncelle
async function updateProfile(req, res) {
  try {
    const adminId = req.user.user_id;
    const result = await adminProfileService.updateProfile(adminId, req.body);
    res.json(result);
  } catch (err) {
    console.error("Admin updateProfile error:", err);
    res.status(500).json({ error: err.message || "Profil güncellenirken hata oluştu" });
  }
}

// 3. Şifre değiştirme
async function changePassword(req, res) {
  try {
    const adminId = req.user.user_id;
    const { oldPassword, newPassword } = req.body;

    const result = await adminProfileService.changePassword(adminId, oldPassword, newPassword);
    res.json(result);
  } catch (err) {
    console.error("Admin changePassword error:", err);
    res.status(400).json({ error: err.message || "Şifre değiştirilemedi" });
  }
}

// 4. Yeni admin ekle
async function createAdmin(req, res) {
  try {
    const result = await adminProfileService.createAdmin(req.body);
    res.status(201).json(result);
  } catch (err) {
    console.error("Admin createAdmin error:", err);
    res.status(500).json({ error: "Yeni admin eklenirken hata oluştu" });
  }
}

module.exports = {
  getProfile,
  updateProfile,
  changePassword,
  createAdmin,
};
