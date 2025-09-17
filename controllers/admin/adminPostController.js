const adminPostService = require("../../services/admin/adminPostService");

// 1. Tüm haberleri getir
async function getAllPosts(req, res) {
  try {
    const filters = req.query; // ?status=active&limit=10&page=2
    const posts = await adminPostService.getAllPosts(filters);
    res.json(posts);
  } catch (err) {
    console.error("Admin getAllPosts error:", err);
    res.status(500).json({ error: "Haberler alınırken hata oluştu" });
  }
}

// 2. Haberin durumunu güncelle
async function updatePostStatus(req, res) {
  try {
    const { id } = req.params;
    const { status } = req.body;

    await adminPostService.updatePostStatus(id, status);
    res.json({ message: "Haber durumu güncellendi" });
  } catch (err) {
    console.error("Admin updatePostStatus error:", err);
    res.status(500).json({ error: "Haber durumu güncellenirken hata oluştu" });
  }
}

// 3. Haberi tamamen sil
async function deletePost(req, res) {
  try {
    const { id } = req.params;
    await adminPostService.deletePost(id);
    res.json({ message: "Haber silindi" });
  } catch (err) {
    console.error("Admin deletePost error:", err);
    res.status(500).json({ error: "Haber silinirken hata oluştu" });
  }
}

module.exports = {
  getAllPosts,
  updatePostStatus,
  deletePost,
};
