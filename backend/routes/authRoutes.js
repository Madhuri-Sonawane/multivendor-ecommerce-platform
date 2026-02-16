const express = require("express");
const {registerUser,loginUser,} = require("../controllers/authController");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const { getMe } = require("../controllers/authController");
const { getCurrentUser } = require("../controllers/authController");

router.get("/me", protect, getCurrentUser);
router.get("/me", protect, getMe);
router.post("/register", registerUser);
router.post("/login", loginUser);

module.exports = router;
