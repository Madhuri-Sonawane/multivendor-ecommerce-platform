const express = require("express");
const {
  applySeller,
  approveSeller,
} = require("../controllers/sellerController");

const { protect } = require("../middleware/authMiddleware");
const { allowRoles } = require("../middleware/roleMiddleware");

const router = express.Router();

/* USER applies to become seller */
router.post("/apply", protect, allowRoles("user"), applySeller);

/* ADMIN approves seller */
router.put("/approve/:id", protect, allowRoles("admin"), approveSeller);

module.exports = router;
