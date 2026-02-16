const User = require("../models/User");
const Seller = require("../models/Seller");
const bcrypt = require("bcryptjs");
const generateToken = require("../utils/generateToken");

/* ================================
   REGISTER USER / SELLER
================================ */
exports.registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // ✅ role is NOT required anymore
    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    const user = await User.create({
      name,
      email,
      password,
      role: "user", // ✅ ALWAYS USER
    });

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user._id),
    });
  } catch (error) {
    console.error("REGISTER ERROR:", error);
    res.status(500).json({ message: "Server error during registration" });
  }
};

/* ================================
   LOGIN USER
================================ */
exports.loginUser = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email }).select("+password");
  if (!user) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  // Use bcrypt directly OR model method
  const isMatch = await bcrypt.compare(password, user.password);
  // OR: await user.matchPassword(password);

  if (!isMatch) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  let isApproved = true;

  if (user.role === "seller") {
    const seller = await Seller.findOne({ user: user._id });
    isApproved = seller?.isApproved || false;
  }

  res.json({
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    isApproved,
    token: generateToken(user._id),
  });
};

exports.getMe = async (req, res) => {
  try {
    const seller = await Seller.findOne({ user: req.user._id });

    res.json({
      _id: req.user._id,
      name: req.user.name,
      email: req.user.email,
      role: req.user.role,
      isApproved: seller ? seller.isApproved : true,
      token: req.headers.authorization.split(" ")[1],
    });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch user" });
  }
};

/* ================= CURRENT USER ================= */
exports.getCurrentUser = async (req, res) => {
  const user = await User.findById(req.user._id);

  let isApproved = true;

  if (user.role === "seller") {
    const seller = await Seller.findOne({ user: user._id });
    isApproved = seller?.isApproved || false;
  }

  res.json({
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    isApproved,
  });
};
