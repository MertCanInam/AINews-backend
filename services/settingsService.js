const settingsRepo = require('../repositories/settingsRepository');

// Kullanıcıya özel ayarları getir
const getSettingsByUserId = async (user_id) => {
  if (!user_id) throw new Error('user_id gerekli');
  const settings = await settingsRepo.getSettingsByUserId(user_id);
  return settings || null;
};

// Kullanıcıya özel ayarları güncelle
const updateSettings = async (user_id, data) => {
  if (!user_id) throw new Error('user_id gerekli');
  if (!data || typeof data !== 'object') throw new Error('Geçersiz veri');

  const [affected] = await settingsRepo.updateSettings(user_id, data);
  // affected 0 ise kayıt olmayabilir; dilersen burada otomatik create düşünebilirsin.
  const updated = await settingsRepo.getSettingsByUserId(user_id);
  return updated; // null olabilir
};

// (Legacy) Global ayarlar — tercihen globalSettingsService kullan
const getGlobalSettings = async () => {
  const s = await settingsRepo.getGlobalSettings();
  return s || null;
};

const updateGlobalSettings = async (data) => {
  if (!data || typeof data !== 'object') throw new Error('Geçersiz veri');
  const [affected] = await settingsRepo.updateGlobalSettings(data);
  // Güncel kaydı tekrar çekiyoruz
  const updated = await settingsRepo.getGlobalSettings();
  return updated;
};

module.exports = {
  getSettingsByUserId,
  updateSettings,
  // legacy global ops
  getGlobalSettings,
  updateGlobalSettings,
};
