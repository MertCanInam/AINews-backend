const adminUserService = require("../../services/admin/adminUserService");

// 1. Tüm kullanıcıları getir
async function getAllUsers(req, res) {
  try {
    const filters = req.query; // ?search= gibi parametreler
    const users = await adminUserService.getAllUsers(filters);
    res.json(users);
  } catch (err) {
    console.error("Admin getAllUsers error:", err);
    res.status(500).json({ error: "Kullanıcılar alınırken hata oluştu" });
  }
}

// 2. Yeni kullanıcı oluştur
async function createUser(req, res) {
  try {
    const user = await adminUserService.createUser(req.body);
    res.status(201).json(user);
  } catch (err) {
    console.error("Admin createUser error:", err);
    res.status(500).json({ error: "Kullanıcı oluşturulurken hata oluştu" });
  }
}

// 3. Kullanıcı rolünü güncelle
async function updateUserRole(req, res) {
  try {
    const { id } = req.params;
    const { role_id } = req.body;

    await adminUserService.updateUserRole(id, role_id);
    res.json({ message: "Kullanıcı rolü güncellendi" });
  } catch (err) {
    console.error("Admin updateUserRole error:", err);
    res.status(500).json({ error: "Kullanıcı rolü güncellenirken hata oluştu" });
  }
}

// 4. Kullanıcı sil
async function deleteUser(req, res) {
  try {
    const { id } = req.params;
    await adminUserService.deleteUser(id);
    res.json({ message: "Kullanıcı silindi" });
  } catch (err) {
    console.error("Admin deleteUser error:", err);
    res.status(500).json({ error: "Kullanıcı silinirken hata oluştu" });
  }
}

// 5. Kullanıcı aktiviteleri
async function getUserActivity(req, res) {
  try {
    const { id } = req.params;
    const activity = await adminUserService.getUserActivity(id);
    res.json(activity);
  } catch (err) {
    console.error("Admin getUserActivity error:", err);
    res.status(500).json({ error: "Kullanıcı aktiviteleri alınırken hata oluştu" });
  }
}

module.exports = {
  getAllUsers,
  createUser,
  updateUserRole,
  deleteUser,
  getUserActivity,
};
