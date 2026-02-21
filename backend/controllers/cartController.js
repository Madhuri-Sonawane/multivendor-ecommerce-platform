const Cart = require("../models/Cart");
const Product = require("../models/Product");

/* ================= GET CART ================= */
exports.getCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id }).populate(
      "items.product",
    );

    res.json(cart || { items: [] });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch cart" });
  }
};

/* ================= ADD TO CART ================= */
exports.addToCart = async (req, res) => {
  try {
    const { productId, quantity } = req.body;

    const product = await Product.findById(productId);

    if (!product || !product.isActive) {
      return res.status(400).json({ message: "Product not available" });
    }

    let cart = await Cart.findOne({ user: req.user._id });

    if (!cart) {
      cart = await Cart.create({
        user: req.user._id,
        items: [],
      });
    }

    const existingItem = cart.items.find(
      (item) => item.product.toString() === productId,
    );

    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      cart.items.push({
        product: productId,
        quantity,
      });
    }

    await cart.save();
    res.json({ message: "Added to cart" });
  } catch (error) {
    res.status(500).json({ message: "Add to cart failed" });
  }
};

/* ================= UPDATE QUANTITY ================= */
exports.updateCartItem = async (req, res) => {
  try {
    const { productId, quantity } = req.body;

    const cart = await Cart.findOne({ user: req.user._id });

    if (!cart) return res.status(404).json({ message: "Cart not found" });

    const item = cart.items.find((i) => i.product.toString() === productId);

    if (!item) return res.status(404).json({ message: "Item not found" });

    item.quantity = quantity;

    await cart.save();
    res.json({ message: "Cart updated" });
  } catch (error) {
    res.status(500).json({ message: "Update failed" });
  }
};

/* ================= REMOVE ITEM ================= */
exports.removeFromCart = async (req, res) => {
  try {
    const { productId } = req.params;

    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) return res.status(404).json({ message: "Cart not found" });

    cart.items = cart.items.filter(
      (item) => item.product.toString() !== productId,
    );

    await cart.save();

    res.json({ message: "Item removed" });
  } catch (error) {
    res.status(500).json({ message: "Remove failed" });
  }
};

/* ================= CLEAR CART ================= */
exports.clearCart = async (req, res) => {
  try {
    await Cart.findOneAndUpdate({ user: req.user._id }, { items: [] });

    res.json({ message: "Cart cleared" });
  } catch (error) {
    res.status(500).json({ message: "Clear failed" });
  }
};
