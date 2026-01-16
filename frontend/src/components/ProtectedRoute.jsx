import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute({ children, role }) {
  const { user, loading } = useAuth();

  if (loading) return <p>Loading...</p>;

  // Not logged in
  if (!user) {
    return <Navigate to="/login" />;
  }

  // Seller role but not approved yet
  if (user.role === "seller" && user.isApproved === false) {
    return <Navigate to="/seller-pending" />;
  }

  // Role-based protection
  if (role && user.role !== role) {
    return <Navigate to="/login" />;
  }

  return children;
}
