const express = require("express");
const { protect } = require("../middleware/authMiddleware");
const { allowRoles } = require("../middleware/roleMiddleware");
const { getSellerAnalytics } = require("../controllers/analyticsController");

const router = express.Router();

router.get(
  "/seller",
  protect,
  allowRoles("seller"),
  getSellerAnalytics
);

module.exports = router;
