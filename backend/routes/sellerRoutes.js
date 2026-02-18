const express = require("express");
const {
  applySeller,
  approveSeller,
} = require("../controllers/sellerController");

const { protect } = require("../middleware/authMiddleware");
const { allowRoles } = require("../middleware/roleMiddleware");
const router = express.Router();
const { getAllSellers } = require("../controllers/sellerController");

/* ================= APPLY AS SELLER ================= */
router.post("/apply", protect, async (req, res) => {
  try {
    const existing = await Seller.findOne({ user: req.user._id });

    if (existing) {
      return res.status(400).json({ message: "Already applied" });
    }

    const seller = await Seller.create({
      user: req.user._id,
      isApproved: false,
    });

    res.status(201).json({
      message: "Application submitted. Waiting for admin approval.",
    });

  } catch (error) {
    console.error("APPLY SELLER ERROR:", error);
    res.status(500).json({ message: "Failed to apply" });
  }
});

module.exports = router;

/* ADMIN approves seller */
router.put("/approve/:id", protect, allowRoles("admin"), approveSeller);

router.get(
  "/",
  protect,
  allowRoles("admin"),
  getAllSellers
);

module.exports = router;
