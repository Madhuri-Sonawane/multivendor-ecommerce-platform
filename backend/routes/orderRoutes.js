const express = require("express");
const {
  createOrder,
  getUserOrders,
  updateOrderStatus,
} = require("../controllers/orderController");

const { protect } = require("../middleware/authMiddleware");
const { allowRoles } = require("../middleware/roleMiddleware");
const { getSellerOrders } = require("../controllers/orderController");
const router = express.Router();

/* USER */
router.post("/", protect, allowRoles("user"), createOrder);
router.get("/my-orders", protect, allowRoles("user"), getUserOrders);

/* SELLER */
router.put("/:id/status", protect, allowRoles("seller"), updateOrderStatus);

router.get(
  "/seller",
  protect,
  allowRoles("seller"),
  getSellerOrders
);


module.exports = router;

