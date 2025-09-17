const express = require("express");
const router = express.Router();
const adminSourceController = require("../../controllers/admin/adminSourceController");
const authMiddleware = require("../../middlewares/authMiddleware");
const roleMiddleware = require("../../middlewares/roleMiddleware");

// sadece admin (role_id = 1) erişebilir
router.use(authMiddleware, roleMiddleware([1]));

// Tüm kaynaklar
router.get("/", adminSourceController.getAllSources);

// Yeni kaynak ekleme
router.post("/", adminSourceController.createSource);

// Kaynağı güncelle
router.patch("/:id", adminSourceController.updateSource);

// Kaynağı sil
router.delete("/:id", adminSourceController.deleteSource);

// Kaynak logları (opsiyonel - placeholder)
router.get("/:id/logs", adminSourceController.getSourceLogs);

module.exports = router;
