const express = require("express");
const {
  createProduct,
  getSellerProducts,
} = require("../controllers/productController");

const { protect } = require("../middleware/authMiddleware");
const { allowRoles } = require("../middleware/roleMiddleware");

const router = express.Router();

/* Seller creates product */
router.post("/", protect, allowRoles("seller"), createProduct);

/* Seller views own products */
router.get("/my-products", protect, allowRoles("seller"), getSellerProducts);

module.exports = router;
