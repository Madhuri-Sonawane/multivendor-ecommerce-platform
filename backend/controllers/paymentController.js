const Cart = require("../models/Cart");
const Product = require("../models/Product");
const Order = require("../models/Order");
const Seller = require("../models/Seller");
const crypto = require("crypto");

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

    /* ================= GET CART ================= */

    const cart = await Cart.findOne({ user: req.user._id }).populate(
      "items.product"
    );

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: "Cart is empty" });
    }

    /* ================= GROUP BY SELLER ================= */

    const sellerMap = {};

    for (const item of cart.items) {
      const product = item.product;

      if (!product.isActive || product.stock < item.quantity) {
        return res.status(400).json({
          message: `Product ${product.title} unavailable`,
        });
      }

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

    /* ================= CREATE ORDERS ================= */

    for (const sellerId in sellerMap) {
      const sellerData = sellerMap[sellerId];

      await Order.create({
        user: req.user._id,
        seller: sellerId,
        items: sellerData.items,
        totalAmount: sellerData.totalAmount,
        paymentId: razorpay_payment_id,
        paymentStatus: "paid",
        status: "paid",
      });

      /* ================= UPDATE SELLER REVENUE ================= */
      await Seller.findByIdAndUpdate(sellerId, {
        $inc: { revenue: sellerData.totalAmount },
      });

      /* ================= REDUCE STOCK ================= */
      for (const item of sellerData.items) {
        await Product.findByIdAndUpdate(item.product, {
          $inc: { stock: -item.quantity },
        });
      }
    }

    /* ================= CLEAR CART ================= */
    cart.items = [];
    await cart.save();

    res.json({ message: "Payment successful & orders created" });

  } catch (error) {
    console.error("VERIFY PAYMENT ERROR:", error);
    res.status(500).json({ message: "Payment verification failed" });
  }
};
