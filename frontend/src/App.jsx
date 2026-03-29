import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";
import ProtectedRoute from "./components/ProtectedRoute";

import StorefrontLayout from "./components/StorefrontLayout";
import Home from "./pages/Home";
import Products from "./pages/Products";
import ProductDetails from "./pages/ProductDetails";
import Checkout from "./pages/Checkout";

import Login from "./pages/Login";
import Register from "./pages/Register";

import Dashboard from "./pages/Dashboard";
import SellerDashboard from "./pages/SellerDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import SellerPending from "./pages/SellerPending";
import ApplySeller from "./pages/ApplySeller";

import UserDashboard from "./pages/UserDashboard";
import UserProfile from "./pages/UserProfile";
import UserOrders from "./pages/UserOrders";

export default function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <BrowserRouter>
          <Routes>

            {/* PUBLIC STOREFRONT ROUTING */}
            <Route path="/" element={<StorefrontLayout />}>
              <Route index element={<Home />} />
              <Route path="products" element={<Products />} />
              <Route path="product/:id" element={<ProductDetails />} />
              <Route 
                path="checkout" 
                element={
                  <ProtectedRoute role="user">
                    <Checkout />
                  </ProtectedRoute>
                } 
              />
            </Route>

            {/* AUTH */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* GENERAL DASHBOARD */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />

            {/* SELLER */}
            <Route
              path="/seller"
              element={
                <ProtectedRoute role="seller">
                  <SellerDashboard />
                </ProtectedRoute>
              }
            />

            <Route
              path="/apply-seller"
              element={
                <ProtectedRoute>
                  <ApplySeller />
                </ProtectedRoute>
              }
            />

            <Route path="/seller-pending" element={<SellerPending />} />

            {/* ADMIN */}
            <Route
              path="/admin"
              element={
                <ProtectedRoute role="admin">
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />

            {/* USER DASHBOARD */}
            <Route
              path="/user"
              element={
                <ProtectedRoute role="user">
                  <UserDashboard />
                </ProtectedRoute>
              }
            >
              <Route path="profile" element={<UserProfile />} />
              <Route path="orders" element={<UserOrders />} />
            </Route>

            {/* CATCH ALL - ALWAYS LAST */}
            <Route path="*" element={<Navigate to="/" />} />

          </Routes>
        </BrowserRouter>
      </CartProvider>
    </AuthProvider>
  );
}