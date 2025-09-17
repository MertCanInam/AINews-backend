const savedPostsService = require("../services/savedPostsService");

async function savePost(req, res) {
  try {
    const user_id = req.user.user_id || req.user.id;
    const { post_id } = req.body;

    if (!user_id) return res.status(401).json({ success: false, message: "Yetkisiz erişim" });
    if (!post_id) return res.status(400).json({ success: false, message: "post_id gerekli" });

    await savedPostsService.savePost(user_id, post_id);
    res.json({ success: true, message: "Post kaydedildi" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
}

async function unsavePost(req, res) {
  try {
    const user_id = req.user?.id || req.user?.user_id;
    const { post_id } = req.body;

    if (!user_id) return res.status(401).json({ success: false, message: "Yetkisiz erişim" });
    if (!post_id) return res.status(400).json({ success: false, message: "post_id gerekli" });

    await savedPostsService.unsavePost(user_id, post_id);
    res.json({ success: true, message: "Post kayıttan çıkarıldı" });
  } catch (err) {
    console.error("❌ unsavePost hata:", err);
    res.status(500).json({ success: false, message: err.message });
  }
}

async function getUserSavedPosts(req, res) {
  try {
    const user_id = req.user?.id || req.user?.user_id;

    if (!user_id) return res.status(401).json({ success: false, message: "Yetkisiz erişim" });

    const posts = await savedPostsService.getUserSavedPosts(user_id);
    res.json({ success: true, data: posts });
  } catch (err) {
    console.error("❌ getUserSavedPosts hata:", err);
    res.status(500).json({ success: false, message: err.message });
  }
}

async function isPostSaved(req, res) {
  try {
    const user_id = req.user?.id || req.user?.user_id;
    const { post_id } = req.params;

    if (!user_id) return res.status(401).json({ success: false, message: "Yetkisiz erişim" });
    if (!post_id) return res.status(400).json({ success: false, message: "post_id gerekli" });

    const saved = await savedPostsService.isPostSaved(user_id, post_id);
    res.json({ success: true, saved });
  } catch (err) {
    console.error("❌ isPostSaved hata:", err);
    res.status(500).json({ success: false, message: err.message });
  }
}

module.exports = { savePost, unsavePost, getUserSavedPosts, isPostSaved };
