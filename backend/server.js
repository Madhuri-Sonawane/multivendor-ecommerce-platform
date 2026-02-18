const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");
const connectDB = require("./config/db");

dotenv.config();
connectDB();

const app = express();
const server = http.createServer(app);

/* ================= SOCKET SETUP ================= */
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173", // Vite frontend
    methods: ["GET", "POST", "PATCH"],
  },
});

/* Make io available globally */
app.set("io", io);

io.on("connection", (socket) => {
  console.log("Socket connected:", socket.id);
});

/* ================= MIDDLEWARE ================= */
app.use(cors());
app.use(express.json());

/* ================= ROUTES ================= */
app.use("/api/payment", require("./routes/paymentRoutes"));
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/users", require("./routes/userRoutes"));
app.use("/api/sellers", require("./routes/sellerRoutes"));
app.use("/api/products", require("./routes/productRoutes"));
app.use("/api/orders", require("./routes/orderRoutes"));
app.use("/api/refunds", require("./routes/refundRoutes"));
app.use("/api/admin", require("./routes/adminRoutes"));
app.use("/api/admin/analytics", require("./routes/adminAnalyticsRoutes"));
app.use("/api/analytics", require("./routes/analyticsRoutes"));
app.use("/api/cart", require("./routes/cartRoutes"));

const PORT = process.env.PORT || 5000;

server.listen(PORT, () =>
  console.log(`Server running on http://localhost:${PORT}`)
);
