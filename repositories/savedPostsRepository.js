const { Sequelize } = require("sequelize");
// 🔥 Modelleri index.js'ten al ki ilişkiler (alias) aynı instance üzerinde olsun
const { SavedPost, Post } = require("../models");

async function savePost(user_id, post_id) {
  // Aynı kaydı iki kez eklememek için istersen findOrCreate kullanabilirsin:
  // return SavedPost.findOrCreate({ where: { user_id, post_id } });
  return SavedPost.create({ user_id, post_id });
}

async function unsavePost(user_id, post_id) {
  return SavedPost.destroy({ where: { user_id, post_id } });
}

async function getUserSavedPosts(user_id) {
  const rows = await SavedPost.findAll({
    where: { user_id },
    include: [
      {
        model: Post,
        as: "Post", // ⬅️ alias ZORUNLU (index.js'teki ilişkiyle birebir aynı)
        attributes: ["id", "title", "summary", "source_id", "created_at"],
      },
    ],
    order: [["created_at", "DESC"]],
  });

  // saved_posts kaydından Post modelini düz objeye çevirip dönüyoruz
  return rows.map((row) => ({
    ...(row.Post ? row.Post.get({ plain: true }) : {}),
    initiallySaved: true,
  }));
}

async function isPostSaved(user_id, post_id) {
  const row = await SavedPost.findOne({ where: { user_id, post_id } });
  return !!row;
}

async function getTopLikedPosts(limit = 5) {
  const rows = await SavedPost.findAll({
    attributes: [
      "post_id",
      [Sequelize.fn("COUNT", Sequelize.col("SavedPost.post_id")), "likeCount"],
    ],
    include: [
      {
        model: Post,
        as: "Post",
        attributes: ["id", "title", "summary", "source_id", "created_at"],
      },
    ],
    group: ["SavedPost.post_id", "Post.id"],
    order: [[Sequelize.col("likeCount"), "DESC"]],
    limit,
  });

  return rows.map((row) => {
    const plain = row.get({ plain: true });
    return {
      post_id: plain.post_id,
      likeCount: parseInt(plain.likeCount, 10),
      title: plain.Post?.title || null,
      summary: plain.Post?.summary || null,
      created_at: plain.Post?.created_at || null,
    };
  });
}


module.exports = {
  savePost,
  unsavePost,
  getUserSavedPosts,
  isPostSaved,
  getTopLikedPosts,
};
