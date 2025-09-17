const Category = require('../models/categories');

// Tüm kategorileri getir
const getAllCategories = async () => {
  return await Category.findAll({ order: [['created_at', 'DESC']] });
};

// ID ile kategori getir
const getCategoryById = async (id) => {
  return await Category.findByPk(id);
};

// Slug ile kategori getir (URL bazlı erişim için)
const getCategoryBySlug = async (slug) => {
  return await Category.findOne({ where: { slug } });
};

module.exports = {
  getAllCategories,
  getCategoryById,
  getCategoryBySlug,
};
