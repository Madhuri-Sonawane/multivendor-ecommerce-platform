const express = require("express");
const {
  createProduct,
  getSellerProducts,
  getAllProducts,   // ✅ MUST BE HERE
} = require("../controllers/productController");

const { protect } = require("../middleware/authMiddleware");
const { allowRoles } = require("../middleware/roleMiddleware");

const router = express.Router();

router.get("/", getAllProducts);
router.post("/", protect, allowRoles("seller"), createProduct);
router.get("/my-products", protect, allowRoles("seller"), getSellerProducts);

module.exports = router;
