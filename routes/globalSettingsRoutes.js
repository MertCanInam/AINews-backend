const express = require('express');
const router = express.Router();
const controller = require('../controllers/globalSettingsController');
const authMiddleware = require('../middlewares/authMiddleware');

// Global ayarları sadece yetkili kullanıcılar görebilsin/güncelleyebilsin:
router.get('/global-settings', authMiddleware, controller.getGlobalSettings);
router.put('/global-settings', authMiddleware, controller.updateGlobalSettings);

module.exports = router;
