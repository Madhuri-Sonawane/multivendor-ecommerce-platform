const express = require("express");
const {
  approveSeller,
  rejectSeller,
  getPendingSellers,
  triggerPayout,
} = require("../controllers/adminController");

const { protect, adminOnly } = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/sellers/pending", protect, adminOnly, getPendingSellers);
router.patch("/sellers/:id/approve", protect, adminOnly, approveSeller);
router.patch("/sellers/:id/reject", protect, adminOnly, rejectSeller);
router.post("/payout", protect, adminOnly, triggerPayout);

module.exports = router;
