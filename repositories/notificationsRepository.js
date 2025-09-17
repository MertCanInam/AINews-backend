const Notification = require('../models/notifications');

// Yeni bir bildirim oluştur
const createNotification = async (data) => {
  return await Notification.create(data);
};

// Kullanıcının tüm bildirimlerini getir (isteğe bağlı limit)
const getUserNotifications = async (user_id, limit = null) => {
  const options = {
    where: { user_id },
    order: [['created_at', 'DESC']],
  };
  if (limit) options.limit = limit;
  return await Notification.findAll(options);
};

// Belirli bir bildirimi okundu olarak işaretle
const markAsRead = async (id) => {
  return await Notification.update({ is_read: true }, { where: { id } });
};

// (Opsiyonel) Belirli bir kullanıcının eski bildirimlerini temizle
const clearOldNotifications = async (user_id) => {
  return await Notification.destroy({ where: { user_id, is_read: true } });
};

module.exports = {
  createNotification,
  getUserNotifications,
  markAsRead,
  clearOldNotifications,
};
