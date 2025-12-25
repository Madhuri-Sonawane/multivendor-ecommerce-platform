const express = require("express");
const {
  requestRefund,
  updateRefundStatus,
} = require("../controllers/refundController");

const { protect } = require("../middleware/authMiddleware");
const { allowRoles } = require("../middleware/roleMiddleware");

const router = express.Router();

/* USER */
router.post(
  "/:orderId",
  protect,
  allowRoles("user"),
  requestRefund
);

/* SELLER */
router.put(
  "/:id/status",
  protect,
  allowRoles("seller"),
  updateRefundStatus
);

module.exports = router;
