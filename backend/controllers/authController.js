const User = require("../models/User");
const Seller = require("../models/Seller");
const bcrypt = require("bcryptjs");
const generateToken = require("../utils/generateToken");

/* ================================
   REGISTER USER / SELLER
================================ */
exports.registerUser = async (req, res) => {
  const { name, email, password, role } = req.body;

  if (!name || !email || !password || !role) {
    return res.status(400).json({ message: "All fields are required" });
  }

  const userExists = await User.findOne({ email });
  if (userExists) {
    return res.status(400).json({ message: "User already exists" });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await User.create({
    name,
    email,
    password: hashedPassword,
    role,
  });

  // 🔥 AUTO-CREATE SELLER PROFILE
  if (role === "seller") {
    await Seller.create({
      user: user._id,
      storeName: `${name}'s Store`,
      isApproved: false,
    });
  }

  res.status(201).json({
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    token: generateToken(user._id),
  });
};

/* ================================
   LOGIN USER
================================ */
exports.loginUser = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  const isMatch = await bcrypt.compare(password, user.password);
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
