const globalSettingsRepo = require('../repositories/globalSettingsRepository');

const getGlobalSettings = async () => {
  const settings = await globalSettingsRepo.getGlobalSettings();
  return settings || null;
};

// Not: Sequelize update() genelde [affectedCount] döndürür.
// Burada güvenli olması için update sonrası güncel veriyi tekrar çekiyoruz.
const updateGlobalSettings = async (data) => {
  if (!data || typeof data !== 'object') {
    throw new Error('Geçersiz veri');
  }
  await globalSettingsRepo.updateGlobalSettings(data);
  const updated = await globalSettingsRepo.getGlobalSettings();
  return updated;
};

module.exports = {
  getGlobalSettings,
  updateGlobalSettings,
};
