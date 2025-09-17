const express = require("express");
const router = express.Router();
const adminPostController = require("../../controllers/admin/adminPostController");
const authMiddleware = require("../../middlewares/authMiddleware");
const roleMiddleware = require("../../middlewares/roleMiddleware");

// sadece admin (role_id = 1) erişebilir
router.use(authMiddleware, roleMiddleware([1]));

// Haberleri listele
router.get("/", adminPostController.getAllPosts);

// Haberin durumunu güncelle (ör: yayından kaldır)
router.patch("/:id/status", adminPostController.updatePostStatus);

// Haberi tamamen sil
router.delete("/:id", adminPostController.deletePost);

module.exports = router;
