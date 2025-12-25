const Refund = require("../models/Refund");
const Order = require("../models/Order");

/* USER: REQUEST REFUND */
exports.requestRefund = async (req, res) => {
  const { reason } = req.body;

  const order = await Order.findById(req.params.orderId);
  if (!order)
    return res.status(404).json({ message: "Order not found" });

  if (!order.user.equals(req.user._id))
    return res.status(403).json({ message: "Not your order" });

  if (order.status !== "delivered")
    return res
      .status(400)
      .json({ message: "Refund allowed only after delivery" });

  const existingRefund = await Refund.findOne({ order: order._id });
  if (existingRefund)
    return res.status(400).json({ message: "Refund already requested" });

  const refund = await Refund.create({
    order: order._id,
    user: req.user._id,
    seller: order.seller,
    reason,
  });

  res.status(201).json(refund);
};

/* SELLER: APPROVE / REJECT */
exports.updateRefundStatus = async (req, res) => {
  const { status } = req.body;

  const refund = await Refund.findById(req.params.id);
  if (!refund)
    return res.status(404).json({ message: "Refund not found" });

  refund.status = status;
  await refund.save();

  res.json({ message: "Refund status updated" });
};
