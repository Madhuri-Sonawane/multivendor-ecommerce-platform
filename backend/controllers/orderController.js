const Seller = require("../models/Seller");
const Order = require("../models/Order");
const Product = require("../models/Product");
const calculateDynamicPrice = require("../utils/priceLogic");



const Cart = require("../models/Cart");

exports.createOrder = async (req, res) => {
  try {
    // 1. Fetch user cart
    const cart = await Cart.findOne({ user: req.user._id }).populate("items.product");

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: "Cart is empty" });
    }

    // 2. Group items by seller
    const sellerOrders = {};

    for (const item of cart.items) {
      const product = item.product;

      if (!product || !product.isActive || product.stock < item.quantity) {
        return res.status(400).json({ message: `Product ${product?.title || "Unknown"} is unavailable or out of stock` });
      }

      const sellerId = product.seller.toString();

      if (!sellerOrders[sellerId]) {
        sellerOrders[sellerId] = {
          items: [],
          totalAmount: 0,
        };
      }

      sellerOrders[sellerId].items.push({
        product: product._id,
        quantity: item.quantity,
        priceAtPurchase: product.price, // simple price logic for now
      });

      sellerOrders[sellerId].totalAmount += product.price * item.quantity;
    }

    // 3. Create orders for each seller
    const createdOrders = [];
    for (const sellerId in sellerOrders) {
      const orderData = sellerOrders[sellerId];

      const order = await Order.create({
        user: req.user._id,
        seller: sellerId,
        items: orderData.items,
        totalAmount: orderData.totalAmount,
        status: "pending",
        paymentStatus: "pending", // COD
      });

      // Deduct stock
      for (const orderItem of orderData.items) {
        await Product.findByIdAndUpdate(orderItem.product, {
          $inc: { stock: -orderItem.quantity },
        });
      }

      createdOrders.push(order);
    }

    // 4. Clear cart
    cart.items = [];
    await cart.save();

    res.status(201).json({ message: "Order(s) placed successfully via COD", orders: createdOrders });
  } catch (err) {
    console.error("CREATE ORDER ERROR:", err);
    res.status(500).json({ message: "Checkout failed" });
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
