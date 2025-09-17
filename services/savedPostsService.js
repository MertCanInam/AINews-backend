const savedPostsRepository = require("../repositories/savedPostsRepository");

async function savePost(user_id, post_id) {
  return await savedPostsRepository.savePost(user_id, post_id);
}

async function unsavePost(user_id, post_id) {
  return await savedPostsRepository.unsavePost(user_id, post_id);
}

async function getUserSavedPosts(user_id) {
  return await savedPostsRepository.getUserSavedPosts(user_id);
}

async function isPostSaved(user_id, post_id) {
  return await savedPostsRepository.isPostSaved(user_id, post_id);
}

module.exports = { savePost, unsavePost, getUserSavedPosts, isPostSaved };
