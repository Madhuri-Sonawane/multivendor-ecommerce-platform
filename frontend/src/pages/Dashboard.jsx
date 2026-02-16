import { useAuth } from "../context/AuthContext";
import Layout from "../components/Layout";
import api from "../api/axios";
import { useState } from "react";
import { Navigate } from "react-router-dom";

export default function Dashboard() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const applySeller = async () => {
    try {
      setLoading(true);
      await api.post("/sellers/apply", {
        storeName: `${user.name}'s Store`,
      });

      alert("Seller application submitted.");
      window.location.reload();
    } catch (err) {
      setError(err.response?.data?.message || "Application failed");
    } finally {
      setLoading(false);
    }
  };

  // If user already seller → go to seller dashboard
  if (user.role === "seller") {
    return <Navigate to="/seller" />;
  }

  return (
    <Layout>
      <h1 className="text-2xl font-bold mb-4">Dashboard</h1>

      <div className="bg-white p-6 rounded shadow space-y-4">
        <p className="text-lg">Welcome, {user?.name}</p>
        <p className="text-gray-600">Role: {user?.role}</p>

        {error && <p className="text-red-500">{error}</p>}

        <button
          onClick={applySeller}
          disabled={loading}
          className="bg-indigo-600 text-white px-4 py-2 rounded"
        >
          {loading ? "Applying..." : "Apply as Seller"}
        </button>
      </div>
    </Layout>
  );
}
