const express = require("express");
const {
  createProduct,
  getSellerProducts,
  getAllProducts,
  updateProduct,
  toggleProductStatus, // ✅ IMPORTED
} = require("../controllers/productController");

const { protect } = require("../middleware/authMiddleware");
const { allowRoles } = require("../middleware/roleMiddleware");
const upload = require("../middleware/upload");

const router = express.Router();

/* CREATE */
router.post(
  "/",
  protect,
  allowRoles("seller"),
  upload.array("images", 6),
  createProduct
);

/* PUBLIC */
router.get("/", getAllProducts);

/* SELLER */
router.get("/my-products", protect, allowRoles("seller"), getSellerProducts);
router.put(
  "/:id",
  protect,
  allowRoles("seller"),
  upload.array("images", 6),
  updateProduct
);

/* SOFT DELETE */
router.patch(
  "/:id/toggle",
  protect,
  allowRoles("seller"),
  toggleProductStatus
);

module.exports = router;
