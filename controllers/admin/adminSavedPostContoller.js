const adminSavedPostService = require("../../services/admin/adminSavedPostService");

// 1. En çok beğenilen haberler
async function getTopLikedPosts(req, res) {
  try {
    const limit = req.query.limit ? parseInt(req.query.limit, 10) : 10;
    const posts = await adminSavedPostService.getTopLikedPosts(limit);
    res.json(posts);
  } catch (err) {
    console.error("Admin getTopLikedPosts error:", err);
    res.status(500).json({ error: "En çok beğenilen haberler alınırken hata oluştu" });
  }
}

// 2. Belirli kullanıcının kaydettiği haberler
async function getUserSavedPosts(req, res) {
  try {
    const { userId } = req.params;
    const posts = await adminSavedPostService.getUserSavedPosts(userId);
    res.json(posts);
  } catch (err) {
    console.error("Admin getUserSavedPosts error:", err);
    res.status(500).json({ error: "Kullanıcının kaydettiği haberler alınırken hata oluştu" });
  }
}

// 3. Belirli kullanıcının kaydetme istatistikleri
async function getUserSavedStats(req, res) {
  try {
    const { userId } = req.params;
    const stats = await adminSavedPostService.getUserSavedStats(userId);
    res.json(stats);
  } catch (err) {
    console.error("Admin getUserSavedStats error:", err);
    res.status(500).json({ error: "Kullanıcı beğeni istatistikleri alınırken hata oluştu" });
  }
}

module.exports = {
  getTopLikedPosts,
  getUserSavedPosts,
  getUserSavedStats,
};
