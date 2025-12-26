import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Layout({ children }) {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow px-6 py-4 flex justify-between">
        <h1 className="font-bold text-lg">MultiVendor Platform</h1>

        <div className="space-x-4">
          {user?.role === "user" && <Link to="/products">Products</Link>}
          {user?.role === "seller" && <Link to="/seller">Seller</Link>}
          {user?.role === "admin" && <Link to="/admin">Admin</Link>}

          <button
            onClick={logout}
            className="ml-4 text-red-500 font-medium"
          >
            Logout
          </button>
        </div>
      </nav>

      <main className="p-6">{children}</main>
    </div>
  );
}
