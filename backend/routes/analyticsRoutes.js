const express = require("express");
const { protect } = require("../middleware/authMiddleware");
const { allowRoles } = require("../middleware/roleMiddleware");

const {
  getSellerAnalytics,
  getSellerEarnings,
} = require("../controllers/analyticsController");

const router = express.Router();

/* Seller dashboard analytics (S2.6) */
router.get(
  "/seller",
  protect,
  allowRoles("seller"),
  getSellerAnalytics
);

/* Seller earnings report (S2.8) */
router.get(
  "/seller/earnings",
  protect,
  allowRoles("seller"),
  getSellerEarnings
);

module.exports = router;
