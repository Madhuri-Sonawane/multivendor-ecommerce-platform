const Order = require("../models/Order");
const Seller = require("../models/Seller");
const Refund = require("../models/Refund");

/* ADMIN DASHBOARD STATS */
exports.getDashboardStats = async (req, res) => {
  const totalOrders = await Order.countDocuments();

  const totalRevenueData = await Order.aggregate([
    { $match: { status: { $in: ["paid", "shipped", "delivered"] } } },
    { $group: { _id: null, revenue: { $sum: "$totalAmount" } } },
  ]);

  const totalRevenue =
    totalRevenueData.length > 0 ? totalRevenueData[0].revenue : 0;

  const totalSellers = await Seller.countDocuments({ isApproved: true });
  const totalRefunds = await Refund.countDocuments();

  res.json({
    totalOrders,
    totalRevenue,
    totalSellers,
    totalRefunds,
  });
};
