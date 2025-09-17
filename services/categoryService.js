const categoryRepository = require("../repositories/categoryRepository.js");

const getAllCategories = async () => {
  const categories = await categoryRepository.getAllCategories();

  if (!categories || categories.length === 0) {
    console.log("Kategoriler boş!");
    return [];
  }

  return categories;
};

const getCategoryById = async (id) => {
    if (!id) {
        throw new Error("Kategori ID gerekli");
    }

    const category = await categoryRepository.getCategoryById(id);

    if (!category) {
        console.log(`ID'si ${id} olan kategori bulunamadı.`);
        return null;
    }

    return category;
};

const getCategoryBySlug = async (slug) => {
    if (!slug) {
        throw new Error("Slug gerekli");
    }

    const category = await categoryRepository.getCategoryBySlug(slug);

    if (!category) {
        console.log(`Slug '${slug}' olan kategori bulunamadı.`);
        return null;
    }

    return category;
};


module.exports = {
  getAllCategories,
  getCategoryById,
  getCategoryBySlug
};
