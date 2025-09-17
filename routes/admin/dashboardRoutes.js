const express = require("express");
const router = express.Router();
const dashboardController = require("../../controllers/admin/dashboardController");
const authMiddleware = require("../../middlewares/authMiddleware");
const roleMiddleware = require("../../middlewares/roleMiddleware");

router.get(
  "/dashboard",
  authMiddleware,
  roleMiddleware([1]),
  dashboardController.getStats
);

module.exports = router;
