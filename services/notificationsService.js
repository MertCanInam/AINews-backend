const notificationsRepo = require('../repositories/notificationsRepository');

const createNotification = async (data) => {
  if (!data || typeof data !== 'object') throw new Error('Geçersiz veri');
  if (!data.user_id) throw new Error('user_id gerekli');
  // İsteğe göre: title/message türü alanlar zorunlu kılınabilir.
  const created = await notificationsRepo.createNotification(data);
  return created;
};

const getUserNotifications = async (user_id, limit) => {
  if (!user_id) throw new Error('user_id gerekli');

  let safeLimit = null;
  if (limit !== undefined && limit !== null) {
    const n = Number(limit);
    if (!Number.isInteger(n) || n <= 0) throw new Error('limit pozitif tam sayı olmalı');
    safeLimit = n;
  }

  return await notificationsRepo.getUserNotifications(user_id, safeLimit);
};

const markAsRead = async (id) => {
  if (!id) throw new Error('Bildirim ID gerekli');
  const [affected] = await notificationsRepo.markAsRead(id);
  // affected: etkilenen satır sayısı (0/1)
  return affected > 0;
};

const clearOldNotifications = async (user_id) => {
  if (!user_id) throw new Error('user_id gerekli');
  const deletedCount = await notificationsRepo.clearOldNotifications(user_id);
  return deletedCount; // sayı döndürüyoruz
};

module.exports = {
  createNotification,
  getUserNotifications,
  markAsRead,
  clearOldNotifications,
};
