const Product = require("../models/Product");
const Seller = require("../models/Seller");
const calculateDynamicPrice = require("../utils/priceLogic");


/* CREATE PRODUCT (SELLER ONLY) */
exports.createProduct = async (req, res) => {
  
  const { title, description, price, stock, category } = req.body;

  if (!title || !price || !category)
    return res.status(400).json({ message: "Missing required fields" });

  const seller = await Seller.findOne({ user: req.user._id });

  if (!seller || !seller.isApproved)
    return res
      .status(403)
      .json({ message: "Seller not approved or not found" });

  const product = await Product.create({
    seller: seller._id,
    title,
    description,
    price,
    stock,
    category,
  });

  res.status(201).json(product);
};

/* GET SELLER PRODUCTS */
exports.getSellerProducts = async (req, res) => {
  const seller = await Seller.findOne({ user: req.user._id });

  if (!seller)
    return res.status(404).json({ message: "Seller not found" });

  const products = await Product.find({ seller: seller._id });

  const pricedProducts = products.map((product) => ({
    ...product.toObject(),
    dynamicPrice: calculateDynamicPrice({
      basePrice: product.price,
      stock: product.stock,
      createdAt: product.createdAt,
    }),
  }));

  res.json(pricedProducts);
};

