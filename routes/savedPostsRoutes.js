const express = require("express");
const router = express.Router();
const savedPostsController = require("../controllers/savedPostsController");
const authMiddleware = require("../middlewares/authMiddleware");

router.post("/saved-posts", authMiddleware, savedPostsController.savePost);
router.delete("/saved-posts", authMiddleware, savedPostsController.unsavePost);
router.get("/saved-posts", authMiddleware, savedPostsController.getUserSavedPosts);
router.get("/saved-posts/:post_id", authMiddleware, savedPostsController.isPostSaved);

module.exports = router;
