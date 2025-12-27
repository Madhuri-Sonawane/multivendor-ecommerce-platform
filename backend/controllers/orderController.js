const Seller = require("../models/Seller");
const Order = require("../models/Order");
const Product = require("../models/Product");
const calculateDynamicPrice = require("../utils/priceLogic");

/* ================================
   CREATE ORDER (USER)
================================ */
const Order = require("../models/Order");
const Product = require("../models/Product");

exports.createOrder = async (req, res) => {
  try {
    const product = await Product.findById(req.body.productId);

    if (!product)
      return res.status(404).json({ message: "Product not found" });

    if (!product.isActive)
      return res
        .status(403)
        .json({ message: "Product is currently unavailable" });

    if (product.stock <= 0)
      return res.status(400).json({ message: "Out of stock" });

    const order = await Order.create({
      user: req.user._id,
      seller: product.seller,
      product: product._id,
      price: product.price,
      status: "pending",
    });

    product.stock -= 1;
    await product.save();

    res.status(201).json(order);
  } catch (err) {
    console.error("CREATE ORDER ERROR:", err);
    res.status(500).json({ message: "Order failed" });
  }
};


/* ================================
   USER: VIEW OWN ORDERS
================================ */
exports.getUserOrders = async (req, res) => {
  const orders = await Order.find({ user: req.user._id }).populate(
    "items.product"
  );
  res.json(orders);
};

/* ================================
   SELLER: GET OWN ORDERS (FIXED)
================================ */
exports.getSellerOrders = async (req, res) => {
  // 1️⃣ find seller profile for logged-in user
  const seller = await Seller.findOne({ user: req.user._id });

  if (!seller) {
    return res.status(404).json({ message: "Seller profile not found" });
  }

  // 2️⃣ fetch orders using seller._id (NOT user._id)
  const orders = await Order.find({ seller: seller._id }).populate(
    "items.product"
  );

  res.json(orders);
};

/* ================================
   SELLER: UPDATE ORDER STATUS
================================ */
exports.updateOrderStatus = async (req, res) => {
  const { status } = req.body;

  const order = await Order.findById(req.params.id);

  if (!order) {
    return res.status(404).json({ message: "Order not found" });
  }

  order.status = status;
  await order.save();

  res.json({ message: "Order status updated" });
};
