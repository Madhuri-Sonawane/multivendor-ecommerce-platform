const Order = require("../models/Order");
const Seller = require("../models/Seller");

/* ================= S2.6 — SELLER DASHBOARD ANALYTICS ================= */
exports.getSellerAnalytics = async (req, res) => {
  try {
    const seller = await Seller.findOne({ user: req.user._id });
    if (!seller) {
      return res.status(404).json({ message: "Seller not found" });
    }

    const orders = await Order.find({ "items.seller": seller._id });

    const delivered = orders.filter(o => o.status === "delivered");
    const pending = orders.filter(o => o.status !== "delivered");

    res.json({
      orders: {
        total: orders.length,
        delivered: delivered.length,
        pending: pending.length,
      },
      products: {
        total: 0,   // frontend already calculates
        active: 0,
      },
      revenue: 0,
      lowStockProducts: [],
      revenueByDate: [],
      topProducts: [],
    });
  } catch (err) {
    console.error("SELLER ANALYTICS ERROR:", err);
    res.status(500).json({ message: "Analytics failed" });
  }
};

/* ================= S2.8 — SELLER EARNINGS REPORT ================= */
exports.getSellerEarnings = async (req, res) => {
  try {
    const seller = await Seller.findOne({ user: req.user._id });
    if (!seller) {
      return res.status(404).json({ message: "Seller not found" });
    }

    const orders = await Order.find({
      "items.seller": seller._id,
      status: "delivered",
    });

    const COMMISSION = 10;

    let totalEarnings = 0;
    const breakdown = [];

    orders.forEach(order => {
      order.items.forEach(item => {
        if (item.seller.toString() !== seller._id.toString()) return;

        const amount = item.price * item.quantity;
        const commission = (amount * COMMISSION) / 100;
        const earning = amount - commission;

        totalEarnings += earning;

        breakdown.push({
          orderId: order._id,
          amount,
          commission,
          earning,
          status: "pending",
          date: order.createdAt,
        });
      });
    });

    res.json({
      totalEarnings,
      paidOut: 0,
      pendingPayout: totalEarnings,
      orders: breakdown,
    });
  } catch (err) {
    console.error("SELLER EARNINGS ERROR:", err);
    res.status(500).json({ message: "Earnings fetch failed" });
  }
};
