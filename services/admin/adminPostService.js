const postRepository = require("../../repositories/postsRepository");

// 1. Tüm haberleri getir (opsiyonel filtre)
async function getAllPosts(filters = {}) {
  const where = {};

  if (filters.status) {
    where.status = filters.status; // örn: "active", "removed"
  }

  return await postRepository.getPaginatedPosts({
    page: filters.page || 1,
    limit: filters.limit || 20,
    statusIn: filters.status ? [filters.status] : undefined,
  });
}

// 2. Haberin durumunu güncelle (yayında / yayından kaldırıldı)
async function updatePostStatus(id, status) {
  return await postRepository.updateStatus(id, status);
}

// 3. Haberi tamamen sil
async function deletePost(id) {
  return await postRepository.deletePost(id);
}

module.exports = {
  getAllPosts,
  updatePostStatus,
  deletePost,
};
