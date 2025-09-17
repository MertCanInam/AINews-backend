const express = require("express");
const router = express.Router();
const usersController = require("../controllers/userController");
const authMiddleware = require("../middlewares/authMiddleware");

// Profil
router.get("/users/me", authMiddleware, usersController.getMe);
router.put("/users/me", authMiddleware, usersController.updateMe);

// Şifre değiştir
router.put("/users/me/password", authMiddleware, usersController.changePassword);

// E-posta değişikliği
router.post("/users/me/email-change", authMiddleware, usersController.requestEmailChange);
router.get("/users/confirm-email", usersController.confirmEmailChange);

module.exports = router;
