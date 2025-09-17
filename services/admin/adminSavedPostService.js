const savedPostsRepository = require("../../repositories/savedPostsRepository");

// 1. En çok beğenilen haberleri getir
async function getTopLikedPosts(limit = 10) {
  return await savedPostsRepository.getTopLikedPosts(limit);
}

// 2. Belirli bir kullanıcının kaydettiği haberler
async function getUserSavedPosts(userId) {
  return await savedPostsRepository.getUserSavedPosts(userId);
}

// 3. Belirli bir kullanıcının kaydettiği haber sayısı (istatistik amaçlı)
async function getUserSavedStats(userId) {
  const savedPosts = await savedPostsRepository.getUserSavedPosts(userId);
  return { userId, savedPostsCount: savedPosts.length };
}

module.exports = {
  getTopLikedPosts,
  getUserSavedPosts,
  getUserSavedStats,
};
