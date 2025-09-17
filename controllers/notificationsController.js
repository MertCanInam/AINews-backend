const notificationsService = require('../services/notificationsService');

// POST /notifications
const createNotification = async (req, res) => {
  try {
    // Eğer sistem servisleri oluşturuyorsa, req.body.user_id şart değil.
    // Ama kullanıcı kendi adına post atıyorsa: req.body.user_id = req.user.user_id gibi düşünebilirsin.
    const created = await notificationsService.createNotification(req.body);
    return res.status(201).json({ success: true, data: created });
  } catch (err) {
    console.error('createNotification error:', err);
    return res.status(400).json({ success: false, message: err.message || 'Bildirim oluşturulamadı.' });
  }
};

// GET /users/:user_id/notifications?limit=10
const getUserNotifications = async (req, res) => {
  try {
    const { user_id } = req.params;

    // Sahiplik kontrolü (kullanıcı kendi bildirimlerini görebilsin)
    // Eğer admin/maintainer rol kontrolün varsa burada genişletebilirsin.
    if (String(req.user?.user_id) !== String(user_id)) {
      return res.status(403).json({ success: false, message: 'Bu bildirimi görüntüleme yetkiniz yok.' });
    }

    const { limit } = req.query;
    const items = await notificationsService.getUserNotifications(user_id, limit);
    return res.status(200).json({ success: true, data: items });
  } catch (err) {
    console.error('getUserNotifications error:', err);
    return res.status(400).json({ success: false, message: err.message || 'Bildirimler getirilemedi.' });
  }
};

// PATCH /notifications/:id/read
const markAsRead = async (req, res) => {
  try {
    const id = Number(req.params.id);
    if (!Number.isInteger(id) || id <= 0) {
      return res.status(400).json({ success: false, message: 'Geçersiz bildirim ID.' });
    }
    const ok = await notificationsService.markAsRead(id);
    if (!ok) return res.status(404).json({ success: false, message: 'Bildirim bulunamadı.' });
    return res.status(200).json({ success: true, data: { id, is_read: true } });
  } catch (err) {
    console.error('markAsRead error:', err);
    return res.status(400).json({ success: false, message: err.message || 'Güncellenemedi.' });
  }
};

// DELETE /users/:user_id/notifications/clear
const clearOldNotifications = async (req, res) => {
  try {
    const { user_id } = req.params;

    // Sahiplik kontrolü
    if (String(req.user?.user_id) !== String(user_id)) {
      return res.status(403).json({ success: false, message: 'Bu kullanıcıya ait veriyi temizleme yetkiniz yok.' });
    }

    const deleted = await notificationsService.clearOldNotifications(user_id);
    return res.status(200).json({ success: true, data: { deleted } });
  } catch (err) {
    console.error('clearOldNotifications error:', err);
    return res.status(400).json({ success: false, message: err.message || 'Temizleme hatası.' });
  }
};

module.exports = {
  createNotification,
  getUserNotifications,
  markAsRead,
  clearOldNotifications,
};
