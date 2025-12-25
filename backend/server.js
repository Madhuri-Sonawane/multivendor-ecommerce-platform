const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db");

dotenv.config();
connectDB();

const app = express();

// middleware
app.use(cors());
app.use(express.json());

// test route
app.get("/api/health", (req, res) => {
  res.json({ status: "OK", time: new Date() });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () =>
  console.log(`Server running on http://localhost:${PORT}`)
);

const authRoutes = require("./routes/authRoutes");

app.use("/api/auth", authRoutes);

// user Routes

const userRoutes = require("./routes/userRoutes");

app.use("/api/users", userRoutes);

// seller Routes
const sellerRoutes = require("./routes/sellerRoutes");

app.use("/api/sellers", sellerRoutes);

// CONNECT PRODUCT ROUTES
const productRoutes = require("./routes/productRoutes");

app.use("/api/products", productRoutes);

// ORDER ROUTES
const orderRoutes = require("./routes/orderRoutes");

app.use("/api/orders", orderRoutes);

// CONNECT REFUND ROUTES
const refundRoutes = require("./routes/refundRoutes");

app.use("/api/refunds", refundRoutes);


// CONNECT ADMIN ROUTES

const adminRoutes = require("./routes/adminRoutes");

app.use("/api/admin", adminRoutes);
