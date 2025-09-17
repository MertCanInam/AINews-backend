const GlobalSetting = require('../models/globalSettings');

const getGlobalSettings = async () => {
  return await GlobalSetting.findOne({ where: { id: 1 } });
};

const updateGlobalSettings = async (data) => {
  return await GlobalSetting.update(data, { where: { id: 1 } });
};

module.exports = {
  getGlobalSettings,
  updateGlobalSettings,
};
