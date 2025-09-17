const express = require("express");
const router = express.Router();
const adminReportController = require("../../controllers/admin/adminReportController");
const authMiddleware = require("../../middlewares/authMiddleware");
const roleMiddleware = require("../../middlewares/roleMiddleware");

// 🔒 sadece admin (role_id = 1) erişebilir
router.use(authMiddleware, roleMiddleware([1]));

// Günlük çekilen haber sayısı trendi
router.get("/daily-posts", adminReportController.getDailyPostTrends);

// Kaynak başına haber dağılımı
router.get("/posts-by-source", adminReportController.getPostDistributionBySource);

// Aylık kullanıcı artışı
router.get("/monthly-user-growth", adminReportController.getMonthlyUserGrowth);

// En çok ticket açan kullanıcılar
router.get("/top-ticket-creators", adminReportController.getTopTicketCreators);

// En aktif kullanıcılar
router.get("/most-active-users", adminReportController.getMostActiveUsers);

module.exports = router;
