const userCategoriesService = require('../services/userCategoriesService');

// GET /users/:user_id/categories
const getUserCategories = async (req, res) => {
  try {
    const user_id = Number(req.params.user_id);
    if (!Number.isInteger(user_id) || user_id <= 0) {
      return res.status(400).json({ success: false, message: 'Geçersiz user_id.' });
    }
    if (String(req.user?.user_id) !== String(user_id)) {
      return res.status(403).json({ success: false, message: 'Bu veriyi görüntüleme yetkiniz yok.' });
    }
    const items = await userCategoriesService.getUserCategories(user_id);
    return res.status(200).json({ success: true, data: items });
  } catch (err) {
    console.error('getUserCategories error:', err);
    return res.status(500).json({ success: false, message: 'Kullanıcı kategorileri getirilirken hata oluştu.' });
  }
};

// POST /users/:user_id/categories  (body: { categoryIds: number[] })
const setUserCategories = async (req, res) => {
  try {
    const user_id = Number(req.params.user_id);
    const { categoryIds } = req.body;

    if (!Number.isInteger(user_id) || user_id <= 0) {
      return res.status(400).json({ success: false, message: 'Geçersiz user_id.' });
    }
    if (!Array.isArray(categoryIds)) {
      return res.status(400).json({ success: false, message: 'categoryIds dizi olmalı.' });
    }
    if (String(req.user?.user_id) !== String(user_id)) {
      return res.status(403).json({ success: false, message: 'Bu veriyi güncelleme yetkiniz yok.' });
    }

    const rows = await userCategoriesService.setUserCategories(user_id, categoryIds);
    return res.status(200).json({ success: true, data: rows });
  } catch (err) {
    console.error('setUserCategories error:', err);
    return res.status(400).json({ success: false, message: err.message || 'Güncelleme hatası.' });
  }
};

// DELETE /users/:user_id/categories
const clearUserCategories = async (req, res) => {
  try {
    const user_id = Number(req.params.user_id);
    if (!Number.isInteger(user_id) || user_id <= 0) {
      return res.status(400).json({ success: false, message: 'Geçersiz user_id.' });
    }
    if (String(req.user?.user_id) !== String(user_id)) {
      return res.status(403).json({ success: false, message: 'Bu veriyi temizleme yetkiniz yok.' });
    }
    const deleted = await userCategoriesService.clearUserCategories(user_id);
    return res.status(200).json({ success: true, data: { deleted } });
  } catch (err) {
    console.error('clearUserCategories error:', err);
    return res.status(500).json({ success: false, message: 'Temizleme hatası.' });
  }
};

module.exports = {
  getUserCategories,
  setUserCategories,
  clearUserCategories,
};
