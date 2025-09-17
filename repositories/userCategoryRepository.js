const UserCategory = require("../models/user_categories");

const getUserCategories = async (user_id) => {
  return await UserCategory.findAll({ where: { user_id } });
};

const setUserCategories = async (user_id, categoryIds) => {
  await UserCategory.destroy({ where: { user_id } });

  const newRecords = categoryIds.map((category_id) => ({
    user_id,
    category_id,
  }));
  return await UserCategory.bulkCreate(newRecords);
};

const clearUserCategories = async (user_id) => {
  return await UserCategory.destroy({ where: { user_id } });
};

module.exports = {
  getUserCategories,
  setUserCategories,
  clearUserCategories,
};
