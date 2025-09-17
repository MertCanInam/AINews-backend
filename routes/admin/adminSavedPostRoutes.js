const express = require("express");
const router = express.Router();
const adminSavedPostController = require("../../controllers/admin/adminSavedPostContoller");
const authMiddleware = require("../../middlewares/authMiddleware");
const roleMiddleware = require("../../middlewares/roleMiddleware");

//  sadece admin (role_id = 1) erişebilir
router.use(authMiddleware, roleMiddleware([1]));

// En çok beğenilen haberler
router.get("/top", adminSavedPostController.getTopLikedPosts);

// Belirli kullanıcının kaydettiği haberler
router.get("/:userId", adminSavedPostController.getUserSavedPosts);

// Belirli kullanıcının beğeni istatistikleri
router.get("/:userId/stats", adminSavedPostController.getUserSavedStats);

module.exports = router;
