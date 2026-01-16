import { useAuth } from "../context/AuthContext";
import Layout from "../components/Layout";
import api from "../api/axios";
import { useState } from "react";

export default function Dashboard() {
  const { user } = useAuth();
  const [storeName, setStoreName] = useState("");
  const [message, setMessage] = useState("");

  const applySeller = async () => {
    try {
      await api.post("/sellers/apply", { storeName });
      setMessage("Seller application submitted. Await admin approval.");
    } catch (err) {
      setMessage(err.response?.data?.message || "Application failed");
    }
  };

  return (
    <Layout>
      <h1 className="text-2xl font-bold mb-4">Dashboard</h1>

      <div className="bg-white p-6 rounded shadow mb-6">
        <p className="text-lg">Welcome, {user?.name}</p>
        <p className="text-gray-600">Role: {user?.role}</p>
      </div>

      {/* APPLY SELLER SECTION */}
      {user.role === "user" && (
        <div className="bg-white p-6 rounded shadow">
          <h2 className="text-lg font-semibold mb-3">
            Become a Seller
          </h2>

          <input
            type="text"
            placeholder="Store Name"
            value={storeName}
            onChange={(e) => setStoreName(e.target.value)}
            className="w-full border px-3 py-2 rounded mb-3"
          />

          <button
            onClick={applySeller}
            className="bg-indigo-600 text-white px-4 py-2 rounded"
          >
            Apply as Seller
          </button>

          {message && (
            <p className="text-sm mt-3 text-gray-600">{message}</p>
          )}
        </div>
      )}
    </Layout>
  );
}
