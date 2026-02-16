const Seller = require("../models/Seller");
const User = require("../models/User");
const Order = require("../models/Order");

/* ================= PENDING SELLERS ================= */
exports.getPendingSellers = async (req, res) => {
  try {
    const sellers = await Seller.find({ isApproved: false })
      .populate("user", "name email role");

    res.json(sellers);
  } catch (error) {
    console.error("GET PENDING SELLERS ERROR:", error);
    res.status(500).json({ message: "Failed to fetch pending sellers" });
  }
};

/* ================= APPROVE SELLER ================= */
exports.approveSeller = async (req, res) => {
  try {
    const seller = await Seller.findById(req.params.id);

    if (!seller) {
      return res.status(404).json({ message: "Seller not found" });
    }

    if (seller.isApproved) {
      return res.status(400).json({ message: "Seller already approved" });
    }

    // ✅ Approve seller
    seller.isApproved = true;
    await seller.save();

    // ✅ Update user role to seller
    await User.findByIdAndUpdate(seller.user, {
      role: "seller",
    });

    res.json({ message: "Seller approved successfully" });

  } catch (error) {
    console.error("APPROVE SELLER ERROR:", error);
    res.status(500).json({ message: "Approval failed" });
  }
};

/* ================= REJECT SELLER ================= */
exports.rejectSeller = async (req, res) => {
  try {
    const seller = await Seller.findById(req.params.id);

    if (!seller) {
      return res.status(404).json({ message: "Seller not found" });
    }

    await Seller.findByIdAndDelete(req.params.id);

    res.json({ message: "Seller rejected and removed" });

  } catch (error) {
    console.error("REJECT SELLER ERROR:", error);
    res.status(500).json({ message: "Rejection failed" });
  }
};

/* ================= TRIGGER PAYOUT ================= */
exports.triggerPayout = async (req, res) => {
  try {
    const { sellerId } = req.body;

    if (!sellerId) {
      return res.status(400).json({ message: "Seller ID required" });
    }

    await Order.updateMany(
      { seller: sellerId, payoutStatus: "pending" },
      { payoutStatus: "paid" }
    );

    res.json({ message: "Seller payout completed" });

  } catch (error) {
    console.error("PAYOUT ERROR:", error);
    res.status(500).json({ message: "Payout failed" });
  }
};
