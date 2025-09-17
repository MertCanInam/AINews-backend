const Setting = require('../models/settings');

const getSettingsByUserId = async (user_id) => {
  return await Setting.findOne({ where: { user_id } });
};

const updateSettings = async (user_id, data) => {
  return await Setting.update(data, { where: { user_id } });
};

const getGlobalSettings = async () => {
  return await Setting.findOne({ where: { id: 1 } }); // varsayılan global ayar
};

const updateGlobalSettings = async (data) => {
  return await Setting.update(data, { where: { id: 1 } });
};

module.exports = {
  getSettingsByUserId,
  updateSettings,
  getGlobalSettings,
  updateGlobalSettings,
};
