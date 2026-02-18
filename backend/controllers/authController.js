const User = require("../models/User");
const Seller = require("../models/Seller");
const generateToken = require("../utils/generateToken");

/* ================= REGISTER USER ================= */
exports.registerUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password || !role) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    // 1️⃣ Create User
    const user = await User.create({
      name,
      email,
      password,
      role: role === "seller" ? "seller" : "user",
    });

    // 2️⃣ If Seller → Create Seller Document
    let isApproved = false;

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
      isApproved,
      token: generateToken(user._id),
    });

  } catch (error) {
    console.error("REGISTER ERROR:", error);
    res.status(500).json({ message: "Registration failed" });
  }
};

/* ================= LOGIN USER ================= */
exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const isMatch = await user.matchPassword(password);

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

  } catch (error) {
    console.error("LOGIN ERROR:", error);
    res.status(500).json({ message: "Login failed" });
  }
};


exports.getCurrentUser = async (req, res) => {
  res.json(req.user);
};
