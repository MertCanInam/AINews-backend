const Post = require('../models/posts');
const { Op } = require('sequelize');

const createPost = (data) => Post.create(data);
const bulkCreate = (rows) => Post.bulkCreate(rows, { ignoreDuplicates: true });

const getPaginatedPosts = async ({ page = 1, limit = 10, statusIn, category_id }) => {
  const offset = (page - 1) * limit;
  const where = {};
  if (statusIn?.length) where.status = { [Op.in]: statusIn };
  if (category_id) where.category_id = category_id;

  const { count, rows } = await Post.findAndCountAll({
    where,
    limit,
    offset,
    order: [['published_at', 'DESC'], ['created_at', 'DESC']],
  });

  return {
    total: count,
    posts: rows,
    currentPage: page,
    totalPages: Math.ceil(count / limit),
  };
};

const getPostsByCategory = (category_id) =>
  Post.findAll({ where: { category_id }, order: [['created_at', 'DESC']] });

const getPostById = (id) => Post.findByPk(id);

// ⚠️ Güçlendirilmiş update: önce update dener; 0 ise find & save yapar
const updatePost = async (id, patch) => {
  const whereId = { id: typeof id === 'string' ? Number(id) || id : id };

  const [affected] = await Post.update(patch, { where: whereId });
  if (affected && affected > 0) return affected;

  const row = await Post.findOne({ where: whereId });
  if (!row) return 0;

  Object.assign(row, patch);
  await row.save();
  return 1;
};

const updateStatus = async (id, status) => {
  return Post.update({ status }, { where: { id } });
};

const deletePost = (id) => Post.destroy({ where: { id } });

const existsByFingerprint = async (fingerprint) => {
  const row = await Post.findOne({ where: { fingerprint } });
  return !!row;
};

async function findByStatus(status, limit) {
  const options = {
    where: { status },
    order: [['published_at', 'DESC'], ['created_at', 'DESC']],
  };
  if (limit) options.limit = limit;
  return Post.findAll(options);
}
async function findByFingerprint(fingerprint) {
  return await Post.findOne({ where: { fingerprint } });
}
async function findByUrl(url) {
  return await Post.findOne({ where: { source_url: url } });
}

async function findPostsByDate(date) {
  const targetDate = new Date(date);

  const start = new Date(targetDate);
  start.setUTCHours(0, 0, 0, 0);

  const end = new Date(targetDate);
  end.setUTCHours(23, 59, 59, 999);

  console.log("🗓 Repo - start:", start, "end:", end);

  const results = await Post.findAll({
    where: {
      created_at: {
        [Op.between]: [start, end],
      },
    },
    order: [["created_at", "DESC"]],
  });

  console.log("📊 Repo - bulunan kayıt sayısı:", results.length);
  return results;
}
const countPosts = async () => {
  return await Post.count();
};

const getLastPostDate = async () => {
  const last = await Post.findOne({
    order: [["created_at", "DESC"]],
  });
  return last ? last.created_at : null;
};
async function findByStatusAndDate(status, date) {
  const targetDate = new Date(date);

  const start = new Date(targetDate);
  start.setUTCHours(0, 0, 0, 0);

  const end = new Date(targetDate);
  end.setUTCHours(23, 59, 59, 999);

  return Post.findAll({
    where: {
      status,
      created_at: {
        [Op.between]: [start, end],
      },
    },
    order: [["created_at", "DESC"]],
  });
}



module.exports = {
  createPost,
  bulkCreate,
  getPaginatedPosts,
  getPostsByCategory,
  getPostById,
  updatePost,
  updateStatus,   // ✅ yeni eklendi
  deletePost,
  existsByFingerprint,
  findByStatus,
  findByFingerprint,
  findByUrl,
  findPostsByDate,
  countPosts,
  getLastPostDate,
  findByStatusAndDate
};
