const Cart = require("../models/Cart");
const Product = require("../models/Product");
const Order = require("../models/Order");
const Seller = require("../models/Seller");
const Razorpay = require("razorpay");
const crypto = require("crypto");

/* ================= RAZORPAY INSTANCE ================= */

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

/* ================= CREATE RAZORPAY ORDER ================= */

exports.createRazorpayOrder = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id }).populate(
      "items.product"
    );

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: "Cart is empty" });
    }

    let totalAmount = 0;

    for (const item of cart.items) {
      const product = item.product;

      if (!product.isActive || product.stock < item.quantity) {
        return res.status(400).json({
          message: `Product ${product.title} unavailable`,
        });
      }

      totalAmount += product.price * item.quantity;
    }

    const options = {
      amount: totalAmount * 100, // Razorpay uses paise
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
    };

    const order = await razorpay.orders.create(options);

    res.json(order);

  } catch (error) {
    console.error("CREATE ORDER ERROR:", error);
    res.status(500).json({ message: "Failed to create Razorpay order" });
  }
};

/* ================= VERIFY PAYMENT ================= */

exports.verifyPayment = async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
    } = req.body;

    const body = razorpay_order_id + "|" + razorpay_payment_id;

    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({ message: "Invalid payment signature" });
    }

    const cart = await Cart.findOne({ user: req.user._id }).populate(
      "items.product"
    );

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: "Cart is empty" });
    }

    const sellerMap = {};

    for (const item of cart.items) {
      const product = item.product;

      const sellerId = product.seller.toString();

      if (!sellerMap[sellerId]) {
        sellerMap[sellerId] = {
          items: [],
          totalAmount: 0,
        };
      }

      sellerMap[sellerId].items.push({
        product: product._id,
        quantity: item.quantity,
        priceAtPurchase: product.price,
      });

      sellerMap[sellerId].totalAmount +=
        product.price * item.quantity;
    }

    for (const sellerId in sellerMap) {
      const sellerData = sellerMap[sellerId];

      await Order.create({
        user: req.user._id,
        seller: sellerId,
        items: sellerData.items,
        totalAmount: sellerData.totalAmount,
        status: "paid",
      });

      await Seller.findByIdAndUpdate(sellerId, {
        $inc: { revenue: sellerData.totalAmount },
      });

      for (const item of sellerData.items) {
        await Product.findByIdAndUpdate(item.product, {
          $inc: { stock: -item.quantity },
        });
      }
    }

    cart.items = [];
    await cart.save();

    res.json({ message: "Payment successful & orders created" });

  } catch (error) {
    console.error("VERIFY PAYMENT ERROR:", error);
    res.status(500).json({ message: "Payment verification failed" });
  }
};
