// routes/categoryRoutes.js
const express = require("express");
const router = express.Router();
const categoryController = require("../controllers/categoryController");
const authMiddleware = require("../middlewares/authMiddleware");

router.get("/categories", authMiddleware, categoryController.getAllCategories);
router.get(
  "/categories/:id",
  authMiddleware,
  categoryController.getCategoryById
);
router.get(
  "/categories/slug/:slug",
  authMiddleware,
  categoryController.getCategoryBySlug
);

module.exports = router;
