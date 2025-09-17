const userCategoriesRepo = require('../repositories/userCategoryRepository');

const getUserCategories = async (user_id) => {
  if (!user_id) throw new Error('user_id gerekli');
  return await userCategoriesRepo.getUserCategories(user_id);
};

const setUserCategories = async (user_id, categoryIds) => {
  if (!user_id) throw new Error('user_id gerekli');
  if (!Array.isArray(categoryIds)) throw new Error('categoryIds bir dizi olmalı');

  // İsteğe bağlı: Tüm elemanların sayı olduğuna dair kontrol
  const allInts = categoryIds.every((id) => Number.isInteger(Number(id)));
  if (!allInts) throw new Error('categoryIds sadece sayılardan oluşmalı');

  const rows = await userCategoriesRepo.setUserCategories(user_id, categoryIds);
  return rows; // bulkCreate dönüşü
};

const clearUserCategories = async (user_id) => {
  if (!user_id) throw new Error('user_id gerekli');
  const deletedCount = await userCategoriesRepo.clearUserCategories(user_id);
  return deletedCount;
};

module.exports = {
  getUserCategories,
  setUserCategories,
  clearUserCategories,
};
