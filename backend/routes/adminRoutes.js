const express = require("express");
const { getDashboardStats } = require("../controllers/adminController");

const { protect } = require("../middleware/authMiddleware");
const { allowRoles } = require("../middleware/roleMiddleware");

const router = express.Router();

router.get(
  "/dashboard",
  protect,
  allowRoles("admin"),
  getDashboardStats
);

module.exports = router;
