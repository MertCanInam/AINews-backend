const settingsService = require('../services/settingsService');

// GET /users/:user_id/settings
const getSettingsByUserId = async (req, res) => {
  try {
    const user_id = Number(req.params.user_id);
    if (!Number.isInteger(user_id) || user_id <= 0) {
      return res.status(400).json({ success: false, message: 'Geçersiz user_id.' });
    }

    // Sahiplik kontrolü (opsiyonel)
    if (String(req.user?.user_id) !== String(user_id)) {
      return res.status(403).json({ success: false, message: 'Bu ayarları görüntüleme yetkiniz yok.' });
    }

    const data = await settingsService.getSettingsByUserId(user_id);
    return res.status(200).json({ success: true, data });
  } catch (err) {
    console.error('getSettingsByUserId error:', err);
    return res.status(500).json({ success: false, message: 'Ayarlar getirilirken hata oluştu.' });
  }
};

// PUT /users/:user_id/settings
const updateSettings = async (req, res) => {
  try {
    const user_id = Number(req.params.user_id);
    if (!Number.isInteger(user_id) || user_id <= 0) {
      return res.status(400).json({ success: false, message: 'Geçersiz user_id.' });
    }

    // Sahiplik kontrolü (opsiyonel)
    if (String(req.user?.user_id) !== String(user_id)) {
      return res.status(403).json({ success: false, message: 'Bu ayarları güncelleme yetkiniz yok.' });
    }

    const updated = await settingsService.updateSettings(user_id, req.body);
    return res.status(200).json({ success: true, data: updated });
  } catch (err) {
    console.error('updateSettings error:', err);
    return res.status(400).json({ success: false, message: err.message || 'Güncelleme hatası.' });
  }
};

module.exports = {
  getSettingsByUserId,
  updateSettings,
};
