const express = require("express");
const {
  getAdminOverview,
  getAdminSellerAnalytics,
  getMonthlyRevenue,
} = require("../controllers/adminAnalyticsController");

const { protect, adminOnly } = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/overview", protect, adminOnly, getAdminOverview);
router.get("/sellers", protect, adminOnly, getAdminSellerAnalytics);
router.get("/monthly-revenue", protect, adminOnly, getMonthlyRevenue);

module.exports = router;
