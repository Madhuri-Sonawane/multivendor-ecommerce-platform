const Seller = require("../models/Seller");
const Order = require("../models/Order");
const Product = require("../models/Product");
const calculateDynamicPrice = require("../utils/priceLogic");

/* ================================
   CREATE ORDER (USER)
================================ */
exports.createOrder = async (req, res) => {
  const { items } = req.body;

  if (!items || items.length === 0) {
    return res.status(400).json({ message: "Order items required" });
  }

  let totalAmount = 0;
  let sellerId = null;
  const orderItems = [];

  for (const item of items) {
    const product = await Product.findById(item.productId);

    if (!product || !product.isActive) {
      return res.status(404).json({ message: "Product not found" });
    }

    const dynamicPrice = calculateDynamicPrice({
      basePrice: product.price,
      stock: product.stock,
      createdAt: product.createdAt,
    });

    if (product.stock < item.quantity) {
      return res.status(400).json({ message: "Insufficient stock" });
    }

    // reduce stock
    product.stock -= item.quantity;
    await product.save();

    totalAmount += dynamicPrice * item.quantity;

    // assign seller from product
    sellerId = product.seller;

    orderItems.push({
      product: product._id,
      quantity: item.quantity,
      priceAtPurchase: dynamicPrice,
    });
  }

  const order = await Order.create({
    user: req.user._id,
    seller: sellerId, // IMPORTANT: seller._id
    items: orderItems,
    totalAmount,
    status: "pending",
  });

  res.status(201).json(order);
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
