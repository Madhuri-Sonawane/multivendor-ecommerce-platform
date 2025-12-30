const Seller = require("../models/Seller");
const Order = require("../models/Order");

/* ================= PENDING SELLERS ================= */
exports.getPendingSellers = async (req, res) => {
  try {
    const sellers = await Seller.find({ isApproved: false })
      .populate("user", "name email");

    res.json(sellers);
  } catch (err) {
    res.status(500).json({ message: "Failed to load pending sellers" });
  }
};

/* ================= APPROVE SELLER ================= */
exports.approveSeller = async (req, res) => {
  try {
    const seller = await Seller.findById(req.params.id);
    if (!seller) return res.status(404).json({ message: "Seller not found" });

    seller.isApproved = true;
    await seller.save();

    res.json({ message: "Seller approved" });
  } catch (err) {
    res.status(500).json({ message: "Approval failed" });
  }
};

/* ================= REJECT SELLER ================= */
exports.rejectSeller = async (req, res) => {
  try {
    await Seller.findByIdAndDelete(req.params.id);
    res.json({ message: "Seller rejected & removed" });
  } catch (err) {
    res.status(500).json({ message: "Rejection failed" });
  }
};

/* ================= TRIGGER PAYOUT ================= */
exports.triggerPayout = async (req, res) => {
  try {
    const { sellerId } = req.body;

    await Order.updateMany(
      { seller: sellerId, payoutStatus: "pending" },
      { payoutStatus: "paid" }
    );

    res.json({ message: "Seller payout completed" });
  } catch (err) {
    res.status(500).json({ message: "Payout failed" });
  }
};
