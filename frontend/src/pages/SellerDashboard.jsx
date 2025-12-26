import { useEffect, useState } from "react";
import api from "../api/axios";
import Layout from "../components/Layout";

export default function SellerDashboard() {
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const updateStatus = async (orderId, status) => {
  await api.put(`/orders/${orderId}/status`, { status });
  const res = await api.get("/orders/seller");
  setOrders(res.data);
};


  useEffect(() => {
    api.get("/products/my-products").then((res) => setProducts(res.data));
    api.get("/orders/seller").then((res) => setOrders(res.data));
  }, []);

  return (
    <Layout>
  <h1 className="text-2xl font-bold mb-6">Seller Dashboard</h1>

  {/* PRODUCTS */}
  <div className="bg-white rounded shadow mb-8">
    <h2 className="text-lg font-semibold p-4 border-b">My Products</h2>

    {products.length === 0 ? (
      <p className="p-4 text-gray-500">No products added yet.</p>
    ) : (
      <ul>
        {products.map((p) => (
          <li
            key={p._id}
            className="p-4 border-t flex justify-between"
          >
            <span>{p.title}</span>
            <span className="text-gray-600">Stock: {p.stock}</span>
          </li>
        ))}
      </ul>
    )}
  </div>

  {/* ORDERS */}
  <div className="bg-white rounded shadow">
    <h2 className="text-lg font-semibold p-4 border-b">Orders</h2>

    {orders.length === 0 ? (
      <p className="p-4 text-gray-500">No orders yet.</p>
    ) : (
      orders.map((o) => (
        <div key={o._id} className="p-4 border-t">
          <p className="font-medium">Order #{o._id}</p>
          <p className="text-gray-600 mb-2">Status: {o.status}</p>

          <div className="space-x-2">
            <button
                disabled={o.status !== "pending"}
                onClick={() => updateStatus(o._id, "shipped")}
                className={`px-3 py-1 border rounded text-sm ${
                  o.status !== "pending" ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                Ship
              </button>

            <button
              onClick={() => updateStatus(o._id, "delivered")}
              className="px-3 py-1 border rounded text-sm"
            >
              Deliver
            </button>
          </div>
        </div>
      ))
    )}
  </div>
</Layout>

  );
}
