const express = require('express');
const router = express.Router();
const controller = require('../controllers/settingsController');
const authMiddleware = require('../middlewares/authMiddleware');

router.get('/users/:user_id/settings', authMiddleware, controller.getSettingsByUserId);
router.put('/users/:user_id/settings', authMiddleware, controller.updateSettings);

module.exports = router;
