const Product = require("../models/Product");
const Seller = require("../models/Seller");
const calculateDynamicPrice = require("../utils/priceLogic");

/* CREATE PRODUCT */
exports.createProduct = async (req, res) => {
  try {
    const { title, description, price, stock, category, subCategory, brand, mrp } = req.body;

    if (!title || !price || !category) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const seller = await Seller.findOne({ user: req.user._id });
    if (!seller || !seller.isApproved) {
      return res.status(403).json({ message: "Seller not approved" });
    }

    const images = req.files ? req.files.map((f) => f.filename) : [];

    const product = await Product.create({
      seller: seller._id,
      title,
      description,
      price,
      mrp: mrp || price,
      stock,
      category,
      subCategory: subCategory || "Other",
      brand: brand || "Generic",
      images,
    });

    res.status(201).json(product);
  } catch (err) {
    console.error("CREATE PRODUCT ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
};

/* GET SELLER PRODUCTS */
exports.getSellerProducts = async (req, res) => {
  try {
    const seller = await Seller.findOne({ user: req.user._id });
     if (!seller) {
      return res.status(404).json({ message: "Seller not found" });
    }

    if (!seller.isApproved) {
      return res.status(403).json({
        message: "Seller not approved yet",
      });
    }

    const products = await Product.find({ seller: seller._id });

    res.json(
      products.map((p) => ({
        ...p.toObject(),
        dynamicPrice: calculateDynamicPrice({
          basePrice: p.price,
          stock: p.stock,
          createdAt: p.createdAt,
        }),
      }))
    );
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

/* PUBLIC PRODUCTS */
exports.getAllProducts = async (req, res) => {
  try {
    const { category, subCategory, brand, minPrice, maxPrice, minDiscount } = req.query;
    
    // Base filter
    const filter = { isActive: true };
    
    if (category) filter.category = category;
    if (subCategory) filter.subCategory = subCategory;
    if (brand) {
      // brand can be comma separated e.g., ?brand=Apple,Samsung
      filter.brand = { $in: brand.split(",") };
    }

    const products = await Product.find(filter).populate("seller");

    let mappedProducts = products.map((p) => {
      const dynamicPrice = calculateDynamicPrice({
        basePrice: p.price,
        stock: p.stock,
        createdAt: p.createdAt,
      });
      
      const pObj = p.toObject();
      const actualMrp = pObj.mrp || pObj.price;
      const discountPercent = actualMrp > dynamicPrice 
        ? Math.round(((actualMrp - dynamicPrice) / actualMrp) * 100) 
        : 0;

      return {
        ...pObj,
        dynamicPrice,
        discountPercent,
      };
    });

    // Post-computation filtering for price and discount
    if (minPrice) mappedProducts = mappedProducts.filter(p => p.dynamicPrice >= Number(minPrice));
    if (maxPrice) mappedProducts = mappedProducts.filter(p => p.dynamicPrice <= Number(maxPrice));
    if (minDiscount) mappedProducts = mappedProducts.filter(p => p.discountPercent >= Number(minDiscount));

    res.json(mappedProducts);
  } catch (err) {
    console.error("GET PRODUCTS ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
};

/* UPDATE PRODUCT */
exports.updateProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });

    const seller = await Seller.findOne({ user: req.user._id });
    if (!seller || product.seller.toString() !== seller._id.toString()) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    const { title, description, price, stock, category, subCategory, brand, mrp, removedImages } =
      req.body;

    if (removedImages) {
      const removed = JSON.parse(removedImages);
      product.images = product.images.filter(
        (img) => !removed.includes(img)
      );
    }

    const newImages = req.files?.map((f) => f.filename) || [];
    product.images.push(...newImages);

    product.title = title || product.title;
    product.description = description || product.description;
    if (price !== undefined) product.price = price;
    if (stock !== undefined) product.stock = stock;
    product.category = category || product.category;
    product.subCategory = subCategory || product.subCategory;
    product.brand = brand || product.brand;
    if (mrp !== undefined) product.mrp = mrp;

    await product.save();
    res.json(product);
  } catch (err) {
    console.error("UPDATE PRODUCT ERROR:", err);
    res.status(500).json({ message: "Update failed" });
  }
};

/* TOGGLE PRODUCT (SOFT DELETE) */
exports.toggleProductStatus = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    const seller = await Seller.findOne({ user: req.user._id });

    if (!seller) {
      return res.status(403).json({ message: "Seller not found" });
    }

    // 🔒 HARD OWNERSHIP CHECK
    if (product.seller.toString() !== seller._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    // ✅ GUARANTEED BOOLEAN
    product.isActive = product.isActive === false ? true : false;

    await product.save();

    res.json({
      success: true,
      productId: product._id,
      isActive: product.isActive,
    });
  } catch (err) {
    console.error("TOGGLE PRODUCT ERROR:", err);
    res.status(500).json({ message: "Toggle failed" });
  }
};

