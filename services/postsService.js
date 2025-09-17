// services/postsService.js
const postsRepository = require('../repositories/postsRepository');

const createPost = async (payload) => {
  const { title, content, content_raw, content_clean, summary, source_url, image_url,
          source_id, category_id, published_at, fingerprint, status, lang } = payload || {};

  if (!title) throw new Error('title zorunlu');
  // content veya content_clean/summary senin akışına göre opsiyonel olabilir

  const post = await postsRepository.createPost({
    title,
    content: content ?? null,
    content_raw: content_raw ?? null,
    content_clean: content_clean ?? null,
    summary: summary ?? null,
    source_url: source_url ?? null,
    image_url: image_url ?? null,
    source_id: source_id ?? null,
    category_id: category_id ?? null,
    published_at: published_at ?? null,
    fingerprint: fingerprint ?? null,
    status: status ?? 'pending',
    lang: lang ?? 'tr',
  });
  return post;
};

const getPaginatedPosts = async (page = 1, limit = 200, statusIn, category_id) => {
  return postsRepository.getPaginatedPosts({ page, limit, statusIn, category_id });
};

const getPostsByCategory = (category_id) => postsRepository.getPostsByCategory(category_id);

const getPostById = async (id) => {
  if (!id) throw new Error('id gerekli');
  const post = await postsRepository.getPostById(id);
  if (!post) throw new Error('Post bulunamadı');
  return post;
};

const updatePost = async (id, patch) => {
  if (!id) throw new Error('id gerekli');
  await postsRepository.updatePost(id, patch);
  return { success: true };
};

const updatePostStatus = async (id, status) => {
  if (!id || !status) throw new Error('id ve status gerekli');
  const allowed = ['pending', 'summarized', 'published', 'error'];
  if (!allowed.includes(status)) throw new Error('Geçersiz status');
  await postsRepository.updatePost(id, { status });
  return { success: true };
};

const deletePost = async (id) => {
  if (!id) throw new Error('id gerekli');
  await postsRepository.deletePost(id);
  return { success: true };
};
async function getPostsByDate(targetDate) {
  console.log("🛠 Service - targetDate:", targetDate);
  return await postsRepository.findPostsByDate(targetDate);
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
