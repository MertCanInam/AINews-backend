const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const authMiddleware = require('../middlewares/authMiddleware');

// Kayıt
router.post('/register', authController.register);

// Giriş
router.post('/login', authController.login);

// Token yenileme
router.post('/refresh-token', authController.refreshToken);

// Kullanıcı doğrulama (me)
router.get('/me', authMiddleware, authController.verifyUser);

// Çıkış
router.post('/logout', authMiddleware, authController.logout);

module.exports = router;
