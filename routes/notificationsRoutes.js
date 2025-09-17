const express = require('express');
const router = express.Router();
const controller = require('../controllers/notificationsController');
const authMiddleware = require('../middlewares/authMiddleware');

router.post('/notifications', authMiddleware, controller.createNotification);
router.get('/users/:user_id/notifications', authMiddleware, controller.getUserNotifications);
router.patch('/notifications/:id/read', authMiddleware, controller.markAsRead);
router.delete('/users/:user_id/notifications/clear', authMiddleware, controller.clearOldNotifications);

module.exports = router;
