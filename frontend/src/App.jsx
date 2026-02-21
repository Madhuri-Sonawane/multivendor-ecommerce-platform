import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Products from "./pages/Products";
import Dashboard from "./pages/Dashboard";
import SellerDashboard from "./pages/SellerDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import SellerPending from "./pages/SellerPending";
import ApplySeller from "./pages/ApplySeller";

import UserDashboard from "./pages/UserDashboard";
import UserProfile from "./pages/UserProfile";
import UserOrders from "./pages/UserOrders";

/* ================= ROLE BASED HOME REDIRECT ================= */

function HomeRedirect() {
  const { user } = useAuth();

  if (!user) return <Navigate to="/login" />;

  if (user.role === "seller") return <Navigate to="/seller" />;
  if (user.role === "admin") return <Navigate to="/admin" />;
  if (user.role === "user") return <Navigate to="/user/profile" />;

  return <Navigate to="/login" />;
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>

          {/* ROOT */}
          <Route path="/" element={<HomeRedirect />} />

          {/* AUTH */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* PRODUCTS */}
          <Route
            path="/products"
            element={
              <ProtectedRoute>
                <Products />
              </ProtectedRoute>
            }
          />

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
    </AuthProvider>
  );
}