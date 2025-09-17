const categoryService = require('../services/categoryService');

// GET /categories
const getAllCategories = async (req, res) => {
  try {
    const categories = await categoryService.getAllCategories();
    return res.status(200).json({ success: true, data: categories });
  } catch (err) {
    console.error('getAllCategories error:', err);
    return res.status(500).json({ success: false, message: 'Kategoriler getirilirken bir hata oluştu.' });
  }
};

// GET /categories/:id
const getCategoryById = async (req, res) => {
  try {
    const id = Number(req.params.id);
    if (!Number.isInteger(id) || id <= 0) {
      return res.status(400).json({ success: false, message: 'Geçersiz kategori ID.' });
    }
    const category = await categoryService.getCategoryById(id);
    if (!category) {
      return res.status(404).json({ success: false, message: `ID '${id}' olan kategori bulunamadı.` });
    }
    return res.status(200).json({ success: true, data: category });
  } catch (err) {
    console.error('getCategoryById error:', err);
    return res.status(500).json({ success: false, message: 'Kategori getirilirken bir hata oluştu.' });
  }
};

// GET /categories/slug/:slug
const getCategoryBySlug = async (req, res) => {
  try {
    const { slug } = req.params;
    if (!slug || typeof slug !== 'string') {
      return res.status(400).json({ success: false, message: 'Geçersiz slug.' });
    }
    const category = await categoryService.getCategoryBySlug(slug);
    if (!category) {
      return res.status(404).json({ success: false, message: `Slug '${slug}' olan kategori bulunamadı.` });
    }
    return res.status(200).json({ success: true, data: category });
  } catch (err) {
    console.error('getCategoryBySlug error:', err);
    return res.status(500).json({ success: false, message: 'Kategori getirilirken bir hata oluştu.' });
  }
};

module.exports = {
  getAllCategories,
  getCategoryById,
  getCategoryBySlug,
};
