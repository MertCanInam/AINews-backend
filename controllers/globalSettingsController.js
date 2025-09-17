const globalSettingsService = require('../services/globalSettingsService');

const getGlobalSettings = async (req, res) => {
  try {
    const data = await globalSettingsService.getGlobalSettings();
    return res.status(200).json({ success: true, data });
  } catch (err) {
    console.error('getGlobalSettings error:', err);
    return res.status(500).json({ success: false, message: 'Global ayarlar getirilirken hata oluştu.' });
  }
};

const updateGlobalSettings = async (req, res) => {
  try {
    const updated = await globalSettingsService.updateGlobalSettings(req.body);
    return res.status(200).json({ success: true, data: updated });
  } catch (err) {
    console.error('updateGlobalSettings error:', err);
    return res.status(400).json({ success: false, message: err.message || 'Güncelleme hatası.' });
  }
};

module.exports = {
  getGlobalSettings,
  updateGlobalSettings,
};
