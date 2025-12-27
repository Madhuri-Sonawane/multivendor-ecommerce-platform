const Product = require("../models/Product");
const Order = require("../models/Order");
const Seller = require("../models/Seller");

exports.getSellerAnalytics = async (req, res) => {
  try {
    const seller = await Seller.findOne({ user: req.user._id });
    if (!seller) return res.status(404).json({ message: "Seller not found" });

    const products = await Product.find({ seller: seller._id });
    const orders = await Order.find({ seller: seller._id });

    const totalRevenue = orders
      .filter((o) => o.status === "delivered")
      .reduce((sum, o) => sum + o.price, 0);

    res.json({
      products: {
        total: products.length,
        active: products.filter((p) => p.isActive).length,
        disabled: products.filter((p) => !p.isActive).length,
      },
      orders: {
        total: orders.length,
        pending: orders.filter((o) => o.status === "pending").length,
        shipped: orders.filter((o) => o.status === "shipped").length,
        delivered: orders.filter((o) => o.status === "delivered").length,
      },
      revenue: totalRevenue,
    });
  } catch (err) {
    console.error("ANALYTICS ERROR:", err);
    res.status(500).json({ message: "Analytics failed" });
  }
};
