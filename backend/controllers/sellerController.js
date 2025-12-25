const Seller = require("../models/Seller");
const User = require("../models/User");

/* APPLY TO BECOME SELLER */
exports.applySeller = async (req, res) => {
  const { storeName } = req.body;

  if (!storeName)
    return res.status(400).json({ message: "Store name is required" });

  const existingSeller = await Seller.findOne({ user: req.user._id });
  if (existingSeller)
    return res.status(400).json({ message: "Seller already exists" });

  const seller = await Seller.create({
    user: req.user._id,
    storeName,
  });

  res.status(201).json({
    message: "Seller application submitted",
    seller,
  });
};

/* ADMIN: APPROVE SELLER */
exports.approveSeller = async (req, res) => {
  const seller = await Seller.findById(req.params.id);

  if (!seller)
    return res.status(404).json({ message: "Seller not found" });

  seller.isApproved = true;
  await seller.save();

  // update user role
  await User.findByIdAndUpdate(seller.user, { role: "seller" });

  res.json({ message: "Seller approved" });
};
