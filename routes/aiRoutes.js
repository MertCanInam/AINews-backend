// routes/aiRoutes.js
const express = require("express");
const router = express.Router();
const aiController = require("../controllers/aiController");
const authMiddleware = require("../middlewares/authMiddleware");

// Kaynaklardan haber çek (extractor)
router.post("/ai/extract", authMiddleware, aiController.extractPosts);

// Pending postları özetle (summarizer)
router.post("/ai/summarize", authMiddleware, aiController.summarizePosts);

// İstersen pipeline: önce extract sonra summarize
router.post("/ai/run", authMiddleware, aiController.runPipeline);

module.exports = router;
