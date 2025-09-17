const express = require("express");
const router = express.Router();
const adminProfileController = require("../../controllers/admin/adminProfileController");
const authMiddleware = require("../../middlewares/authMiddleware");
const roleMiddleware = require("../../middlewares/roleMiddleware");

//  sadece admin (role_id = 1) erişebilir
router.use(authMiddleware, roleMiddleware([1]));

// Profil bilgilerini getir
router.get("/", adminProfileController.getProfile);

// Profil güncelle
router.patch("/", adminProfileController.updateProfile);

// Şifre değiştir
router.patch("/change-password", adminProfileController.changePassword);

// Yeni admin ekle
router.post("/create", adminProfileController.createAdmin);

module.exports = router;
