// controllers/postsController.js
const postsService = require('../services/postsService');

// POST /posts
const createPost = async (req, res) => {
  try {
    const created = await postsService.createPost(req.body);
    return res.status(201).json({ success: true, data: created });
  } catch (err) {
    console.error('createPost error:', err);
    return res.status(400).json({ success: false, message: err.message || 'Post oluşturulamadı.' });
  }
};

// GET /posts?page=1&limit=10
const getPaginatedPosts = async (req, res) => {
  try {
    const { page, limit } = req.query;
    const data = await postsService.getPaginatedPosts(page, limit);
    return res.status(200).json({ success: true, data });
  } catch (err) {
    console.error('getPaginatedPosts error:', err);
    return res.status(400).json({ success: false, message: err.message || 'Postlar getirilemedi.' });
  }
};

// GET /categories/:category_id/posts
const getPostsByCategory = async (req, res) => {
  try {
    const category_id = Number(req.params.category_id);
    if (!Number.isInteger(category_id) || category_id <= 0) {
      return res.status(400).json({ success: false, message: 'Geçersiz kategori ID.' });
    }
    const items = await postsService.getPostsByCategory(category_id);
    return res.status(200).json({ success: true, data: items });
  } catch (err) {
    console.error('getPostsByCategory error:', err);
    return res.status(400).json({ success: false, message: err.message || 'Kategorideki postlar alınamadı.' });
  }
};

// GET /posts/:id
const getPostById = async (req, res) => {
  try {
    const id = Number(req.params.id);
    if (!Number.isInteger(id) || id <= 0) {
      return res.status(400).json({ success: false, message: 'Geçersiz post ID.' });
    }
    const post = await postsService.getPostById(id);
    if (!post) return res.status(404).json({ success: false, message: 'Post bulunamadı.' });
    return res.status(200).json({ success: true, data: post });
  } catch (err) {
    console.error('getPostById error:', err);
    return res.status(500).json({ success: false, message: 'Post getirilirken hata oluştu.' });
  }
};
// PUT /posts/:id
const updatePost = async (req, res) => {
  try {
    const id = Number(req.params.id);
    if (!Number.isInteger(id) || id <= 0) {
      return res.status(400).json({ success: false, message: 'Geçersiz post ID.' });
    }
    const result = await postsService.updatePost(id, req.body);
    return res.status(200).json({ success: true, ...result });
  } catch (err) {
    console.error('updatePost error:', err);
    return res.status(400).json({ success: false, message: err.message || 'Post güncellenemedi.' });
  }
};

// PATCH /posts/:id/status
const updatePostStatus = async (req, res) => {
  try {
    const id = Number(req.params.id);
    const { status } = req.body || {};
    if (!Number.isInteger(id) || id <= 0) {
      return res.status(400).json({ success: false, message: 'Geçersiz post ID.' });
    }
    const data = await postsService.updatePostStatus(id, status);
    return res.status(200).json({ success: true, ...data });
  } catch (err) {
    console.error('updatePostStatus error:', err);
    return res.status(400).json({ success: false, message: err.message || 'Durum güncellenemedi.' });
  }
};

// DELETE /posts/:id
const deletePost = async (req, res) => {
  try {
    const id = Number(req.params.id);
    if (!Number.isInteger(id) || id <= 0) {
      return res.status(400).json({ success: false, message: 'Geçersiz post ID.' });
    }
    const data = await postsService.deletePost(id);
    return res.status(200).json({ success: true, ...data });
  } catch (err) {
    console.error('deletePost error:', err);
    return res.status(400).json({ success: false, message: err.message || 'Post silinemedi.' });
  }
};

async function getPostsByDate(req, res) {
  try {
    let { date } = req.query;
    const targetDate = date ? new Date(date) : new Date();

    if (isNaN(targetDate.getTime())) {
      console.warn("❌ Geçersiz tarih:", date);
      return res.status(400).json({
        success: false,
        message: "Geçersiz tarih formatı",
      });
    }

    const posts = await postsService.getPostsByDate(targetDate);
    console.log("📦 Gelen post sayısı:", posts.length);

    res.json({
      success: true,
      data: { posts },
    });
  } catch (err) {
    console.error("❌ Controller Hatası:", err);
    res.status(500).json({
      success: false,
      message: "Haberler alınamadı",
    });
  }
}







module.exports = {
  createPost,
  getPaginatedPosts,
  getPostsByCategory,
  getPostById,
  updatePost,
  updatePostStatus,
  deletePost,
  getPostsByDate

};
