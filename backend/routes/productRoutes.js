const express = require("express");
const {
  createProduct,
  getSellerProducts,
  getAllProducts,
  updateProduct,
  toggleProductStatus,
} = require("../controllers/productController");

const { protect } = require("../middleware/authMiddleware");
const { allowRoles } = require("../middleware/roleMiddleware");
const upload = require("../middleware/upload");

const router = express.Router();

/* CREATE PRODUCT */
router.post(
  "/",
  protect,
  allowRoles("seller"),
  upload.array("images", 6),
  createProduct
);

/* PUBLIC PRODUCTS */
router.get("/", getAllProducts);

/* SELLER PRODUCTS */
router.get(
  "/my-products",
  protect,
  allowRoles("seller"),
  getSellerProducts
);

/* UPDATE PRODUCT */
router.put(
  "/:id",
  protect,
  allowRoles("seller"),
  upload.array("images", 6),
  updateProduct
);

/* TOGGLE PRODUCT STATUS */
router.patch(
  "/:id/toggle",
  protect,
  allowRoles("seller"),
  toggleProductStatus
);

module.exports = router;
