const express = require("express");
const router = express.Router();
const postsController = require("../controllers/postsController");
const authMiddleware = require("../middlewares/authMiddleware");

// Public
router.get("/posts", postsController.getPaginatedPosts);

// ✅ önce özel route
router.get("/posts/by-date", postsController.getPostsByDate);

router.get("/categories/:id/posts", postsController.getPostsByCategory);
router.get("/posts/:id", postsController.getPostById);

// Protected (create/update/delete)
router.post("/posts", authMiddleware, postsController.createPost);
router.put("/posts/:id", authMiddleware, postsController.updatePost);
router.patch(
  "/posts/:id/status",
  authMiddleware,
  postsController.updatePostStatus
);
router.delete("/posts/:id", authMiddleware, postsController.deletePost);

module.exports = router;
