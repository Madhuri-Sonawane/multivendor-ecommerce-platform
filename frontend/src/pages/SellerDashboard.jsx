import { useEffect, useState } from "react";
import api from "../api/axios";
import Layout from "../components/Layout";
import ProductForm from "../components/ProductForm";
import { useAuth } from "../context/AuthContext";
import { Navigate } from "react-router-dom";

export default function SellerDashboard() {
  const { user } = useAuth();

  /* ================= STATE ================= */
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [earnings, setEarnings] = useState(null);

  const [loadingProducts, setLoadingProducts] = useState(true);
  const [error, setError] = useState("");

  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  /* ================= HARD GUARD ================= */
  if (user?.role === "seller" && !user?.isApproved) {
    return <Navigate to="/seller-pending" />;
  }

  /* ================= FETCH PRODUCTS (CRITICAL) ================= */
  const fetchProducts = async () => {
    try {
      const res = await api.get("/products/my-products");
      setProducts(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      setError("Failed to load products");
    } finally {
      setLoadingProducts(false);
    }
  };

  /* ================= FETCH OPTIONAL DATA ================= */
  const fetchExtras = async () => {
    try {
      const [ordersRes, analyticsRes, earningsRes] = await Promise.allSettled([
        api.get("/orders/seller"),
        api.get("/analytics/seller"),
        api.get("/analytics/seller/earnings"),
      ]);

      if (ordersRes.status === "fulfilled") {
        setOrders(Array.isArray(ordersRes.value.data) ? ordersRes.value.data : []);
      }

      if (analyticsRes.status === "fulfilled") {
        setAnalytics(analyticsRes.value.data);
      }

      if (earningsRes.status === "fulfilled") {
        setEarnings(earningsRes.value.data);
      }
    } catch {
      // silently ignore — products must still show
    }
  };

  useEffect(() => {
    fetchProducts();   // MUST NEVER FAIL UI
    fetchExtras();    // OPTIONAL
  }, []);

  /* ================= DERIVED METRICS ================= */
  const pendingOrders = orders.filter(o => o.status === "pending").length;
  const shippedOrders = orders.filter(o => o.status === "shipped").length;
  const deliveredOrders = orders.filter(o => o.status === "delivered").length;

  const lowStockCount = products.filter(
    p => p.stock > 0 && p.stock <= 5
  ).length;

  const disabledProducts = products.filter(p => !p.isActive).length;

  /* ================= ORDER STATUS ================= */
  const updateStatus = async (id, status) => {
    await api.put(`/orders/${id}/status`, { status });
    fetchExtras();
  };

  /* ================= RENDER ================= */
  return (
    <Layout>
      {/* ================= HEADER ================= */}
      <div className="flex justify-between items-center mb-10">
        <div>
          <h1 className="text-3xl font-bold">Seller Dashboard</h1>
          <p className="text-sm text-gray-500">
            Manage products, orders & earnings
          </p>
        </div>

        <button
          onClick={() => setShowForm(true)}
          className="bg-indigo-600 text-white px-5 py-2 rounded-lg shadow"
        >
          + Add Product
        </button>
      </div>

      {/* ================= ANALYTICS ================= */}
      {analytics && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Stat label="Products" value={products.length} />
          <Stat label="Active Products" value={products.filter(p => p.isActive).length} />
          <Stat label="Orders" value={orders.length} />
          <Stat label="Revenue" value={`₹${analytics.revenue || 0}`} />
        </div>
      )}

      {/* ================= EARNINGS ================= */}
      {earnings && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-12">
          <EarningCard title="Total Earnings" value={`₹${earnings.totalEarnings}`} />
          <EarningCard title="Paid Out" value={`₹${earnings.paidOut}`} />
          <EarningCard title="Pending Payout" value={`₹${earnings.pendingPayout}`} />
        </div>
      )}

      {/* ================= OPERATIONAL METRICS ================= */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-6 mb-12">
        <Stat label="Pending Orders" value={pendingOrders} />
        <Stat label="Shipped Orders" value={shippedOrders} />
        <Stat label="Delivered Orders" value={deliveredOrders} />
        <Stat label="Low Stock" value={lowStockCount} />
        <Stat label="Disabled Products" value={disabledProducts} />
      </div>

      {/* ================= PRODUCTS ================= */}
      <div className="bg-white rounded-xl shadow mb-14">
        <h2 className="text-xl font-semibold p-5 border-b">
          My Products ({products.length})
        </h2>

        {loadingProducts ? (
          <p className="p-6 text-center">Loading products...</p>
        ) : products.length === 0 ? (
          <p className="p-6 text-center text-gray-500">
            No products found.
          </p>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
            {products.map(p => (
              <div key={p._id} className="border rounded-xl overflow-hidden">
                {p.images?.length ? (
                  <img
                    src={`http://localhost:5000/uploads/${p.images[0]}`}
                    alt={p.title}
                    className="h-44 w-full object-cover"
                  />
                ) : (
                  <div className="h-44 bg-gray-200 flex items-center justify-center">
                    No Image
                  </div>
                )}

                <div className="p-4">
                  <h3 className="font-semibold">{p.title}</h3>
                  <p className="text-sm text-gray-500">{p.category}</p>
                  <p className="mt-1">₹{p.price} · Stock: {p.stock}</p>

                  <div className="flex justify-between mt-4">
                    <button
                      onClick={() => {
                        setEditingProduct(p);
                        setShowForm(true);
                      }}
                      className="text-sm text-indigo-600"
                    >
                      Edit
                    </button>

                    <button
                      onClick={async () => {
                        await api.patch(`/products/${p._id}/toggle`);
                        fetchProducts();
                      }}
                      className="text-xs px-3 py-1 rounded bg-red-100 text-red-700"
                    >
                      Toggle
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ================= ORDERS ================= */}
      <div className="bg-white rounded-xl shadow">
        <h2 className="text-xl font-semibold p-5 border-b">Orders</h2>

        {orders.length === 0 ? (
          <p className="p-6 text-center text-gray-500">No orders yet.</p>
        ) : (
          orders.map(o => (
            <div key={o._id} className="p-5 border-t">
              <p className="font-medium">Order #{o._id}</p>
              <p className="text-sm text-gray-600">Status: {o.status}</p>

              <div className="space-x-2 mt-3">
                <button
                  disabled={o.status !== "pending"}
                  onClick={() => updateStatus(o._id, "shipped")}
                  className="px-3 py-1 border rounded"
                >
                  Ship
                </button>
                <button
                  disabled={o.status !== "shipped"}
                  onClick={() => updateStatus(o._id, "delivered")}
                  className="px-3 py-1 border rounded"
                >
                  Deliver
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {showForm && (
        <ProductForm
          editingProduct={editingProduct}
          onClose={() => {
            setShowForm(false);
            setEditingProduct(null);
          }}
          onSuccess={fetchProducts}
        />
      )}
    </Layout>
  );
}

/* ================= UI ================= */
const Stat = ({ label, value }) => (
  <div className="bg-white rounded-xl shadow p-5 text-center">
    <p className="text-sm text-gray-500">{label}</p>
    <p className="text-2xl font-bold">{value}</p>
  </div>
);

const EarningCard = ({ title, value }) => (
  <div className="bg-white rounded-xl shadow p-5 text-center">
    <p className="text-sm text-gray-500">{title}</p>
    <p className="text-2xl font-bold mt-1">{value}</p>
  </div>
);
