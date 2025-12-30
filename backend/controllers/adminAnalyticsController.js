const User = require("../models/User");
const Seller = require("../models/Seller");
const Product = require("../models/Product");
const Order = require("../models/Order");

/* ================= OVERVIEW ================= */
exports.getAdminOverview = async (req, res) => {
  const totalUsers = await User.countDocuments();
  const totalSellers = await Seller.countDocuments();
  const approvedSellers = await Seller.countDocuments({ isApproved: true });

  const totalProducts = await Product.countDocuments();
  const activeProducts = await Product.countDocuments({ isActive: true });
  const disabledProducts = totalProducts - activeProducts;

  const totalOrders = await Order.countDocuments();
  const pendingOrders = await Order.countDocuments({ status: "pending" });

  const orders = await Order.find();
  const revenue = orders.reduce((sum, o) => sum + o.totalAmount, 0);

  res.json({
    users: totalUsers,
    sellers: totalSellers,
    approvedSellers,
    products: {
      total: totalProducts,
      active: activeProducts,
      disabled: disabledProducts,
    },
    orders: {
      total: totalOrders,
      pending: pendingOrders,
    },
    revenue: {
      gross: revenue,
      sellerEarnings: revenue * 0.9,
      platformCommission: revenue * 0.1,
      pendingPayout: 0,
    },
  });
};



/* ================= SELLER ANALYTICS ================= */
exports.getAdminSellerAnalytics = async (req, res) => {
  const sellers = await Seller.find().populate("user");

  const data = sellers.map((s) => ({
    sellerId: s._id,
    storeName: s.shopName,
    totalProducts: s.products?.length || 0,
    activeProducts: s.products?.filter(p => p.isActive).length || 0,
    orders: 0,
    revenue: 0,
    pendingPayout: 0,
  }));

  res.json(data);
};

/* ================= MONTHLY REVENUE ================= */
exports.getMonthlyRevenue = async (req, res) => {
  const data = await Order.aggregate([
    {
      $group: {
        _id: { $month: "$createdAt" },
        revenue: { $sum: "$totalAmount" },
      },
    },
    { $sort: { _id: 1 } },
  ]);

  res.json(data);
};
