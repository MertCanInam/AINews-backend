const express = require("express");
const router = express.Router();
const adminUserController = require("../../controllers/admin/adminUserController");
const authMiddleware = require("../../middlewares/authMiddleware");
const roleMiddleware = require("../../middlewares/roleMiddleware");

//  sadece admin (role_id = 1) erişebilir
router.use(authMiddleware, roleMiddleware([1]));

// Kullanıcı listesi
router.get("/", adminUserController.getAllUsers);

// Yeni kullanıcı ekleme
router.post("/", adminUserController.createUser);

// Kullanıcı rolünü değiştirme
router.patch("/:id/role", adminUserController.updateUserRole);

// Kullanıcı silme
router.delete("/:id", adminUserController.deleteUser);

// Kullanıcı aktiviteleri
router.get("/:id/activity", adminUserController.getUserActivity);

module.exports = router;
