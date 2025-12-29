import { useEffect, useState } from "react";
import api from "../api/axios";
import Layout from "../components/Layout";

/*
  SELLER DASHBOARD – FINAL VERSION
  Covers:
  S2.3 Product CRUD
  S2.4 Enable / Disable product
  S2.6 Seller Analytics
  S2.7 Notifications (Low stock + Order alerts)
*/

export default function SellerDashboard() {
  /* ===================== STATE ===================== */

  // Core data
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [analytics, setAnalytics] = useState(null);

  // Modal & edit state
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  // Images
  const [images, setImages] = useState([]);
  const [existingImages, setExistingImages] = useState([]);
  const [removedImages, setRemovedImages] = useState([]);

  // Product form
  const [form, setForm] = useState({
    title: "",
    description: "",
    price: "",
    stock: "",
    category: "",
  });

  /* ===================== FETCH DASHBOARD DATA ===================== */
  const fetchData = async () => {
    try {
      const [prodRes, orderRes, analyticsRes] = await Promise.all([
        api.get("/products/my-products"),
        api.get("/orders/seller"),
        api.get("/analytics/seller"),
      ]);

      setProducts(prodRes.data || []);
      setOrders(orderRes.data || []);
      setAnalytics(analyticsRes.data || null);
    } catch (err) {
      console.error("Dashboard fetch failed", err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  /* ===================== FORM HANDLERS ===================== */

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleImages = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 6) {
      alert("Maximum 6 images allowed");
      return;
    }
    setImages(files);
  };

  const resetForm = () => {
    setShowForm(false);
    setEditingProduct(null);
    setImages([]);
    setExistingImages([]);
    setRemovedImages([]);
    setForm({
      title: "",
      description: "",
      price: "",
      stock: "",
      category: "",
    });
  };

  const submitProduct = async (e) => {
    e.preventDefault();

    const fd = new FormData();
    Object.entries(form).forEach(([k, v]) => fd.append(k, v));
    images.forEach((img) => fd.append("images", img));
    fd.append("removedImages", JSON.stringify(removedImages));

    if (editingProduct) {
      await api.put(`/products/${editingProduct._id}`, fd);
    } else {
      await api.post("/products", fd);
    }

    resetForm();
    fetchData();
  };

  /* ===================== ORDER STATUS ===================== */

  const updateStatus = async (id, status) => {
    await api.put(`/orders/${id}/status`, { status });
    fetchData();
  };

  /* ===================== S2.7 NOTIFICATIONS ===================== */

  const lowStockProducts = analytics?.lowStockProducts || [];
  const pendingOrders = orders.filter((o) => o.status === "pending");

  return (
    <Layout>
      {/* ================= HEADER ================= */}
      <div className="flex justify-between items-center mb-10">
        <div>
          <h1 className="text-3xl font-bold">Seller Dashboard</h1>
          <p className="text-sm text-gray-500">
            Manage products, orders & revenue
          </p>
        </div>

        <button
          onClick={() => {
            resetForm();
            setShowForm(true);
          }}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-lg shadow"
        >
          + Add Product
        </button>
      </div>

      {/* ================= S2.7 NOTIFICATIONS ================= */}
      {(lowStockProducts.length > 0 || pendingOrders.length > 0) && (
        <div className="mb-10 space-y-3">
          {lowStockProducts.length > 0 && (
            <div className="bg-red-50 border border-red-200 p-4 rounded">
              ⚠ <b>{lowStockProducts.length}</b> product(s) are low on stock
            </div>
          )}

          {pendingOrders.length > 0 && (
            <div className="bg-yellow-50 border border-yellow-200 p-4 rounded">
              📦 <b>{pendingOrders.length}</b> pending order(s) to process
            </div>
          )}
        </div>
      )}

      {/* ================= ANALYTICS (S2.6) ================= */}
      {analytics && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <Stat label="Products" value={analytics.products?.total || 0} />
          <Stat label="Active" value={analytics.products?.active || 0} />
          <Stat label="Orders" value={analytics.orders?.total || 0} />
          <Stat label="Revenue" value={`₹${analytics.revenue || 0}`} />
        </div>
      )}

      {/* ================= PRODUCTS ================= */}
      <div className="bg-white rounded-xl shadow mb-14">
        <h2 className="text-xl font-semibold p-5 border-b">
          My Products ({products.length})
        </h2>

        {products.length === 0 ? (
          <p className="p-6 text-center text-gray-500">
            No products added yet.
          </p>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
            {products.map((p) => (
              <div
                key={p._id}
                className="border rounded-xl overflow-hidden hover:shadow-lg transition"
              >
                {p.images?.length ? (
                  <img
                    src={`http://localhost:5000/uploads/${p.images[0]}`}
                    className="h-44 w-full object-cover"
                  />
                ) : (
                  <div className="h-44 bg-gray-200 flex items-center justify-center">
                    No Image
                  </div>
                )}

                <div className="p-4">
                  <span
                    className={`text-xs px-2 py-0.5 rounded ${
                      p.isActive
                        ? "bg-green-100 text-green-700"
                        : "bg-gray-200 text-gray-600"
                    }`}
                  >
                    {p.isActive ? "Active" : "Disabled"}
                  </span>

                  <h3 className="font-semibold mt-2">{p.title}</h3>
                  <p className="text-sm text-gray-500">{p.category}</p>
                  <p className="text-sm mt-1">
                    ₹{p.price} · Stock: {p.stock}
                  </p>

                  <div className="flex justify-between mt-4">
                    <button
                      onClick={() => {
                        setEditingProduct(p);
                        setForm({
                          title: p.title,
                          description: p.description,
                          price: p.price,
                          stock: p.stock,
                          category: p.category,
                        });
                        setExistingImages(p.images || []);
                        setShowForm(true);
                      }}
                      className="text-sm text-indigo-600"
                    >
                      Edit
                    </button>

                    <button
                      onClick={async () => {
                        await api.patch(`/products/${p._id}/toggle`);
                        fetchData();
                      }}
                      className={`text-xs px-3 py-1 rounded ${
                        p.isActive
                          ? "bg-red-100 text-red-700"
                          : "bg-green-100 text-green-700"
                      }`}
                    >
                      {p.isActive ? "Disable" : "Enable"}
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
          orders.map((o) => (
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

      {/* ================= PRODUCT MODAL ================= */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white w-full max-w-lg rounded-xl p-6 relative">
            <button
              onClick={resetForm}
              className="absolute top-3 right-3"
            >
              ✕
            </button>

            <h2 className="text-xl font-semibold mb-4">
              {editingProduct ? "Edit Product" : "Add Product"}
            </h2>

            <form onSubmit={submitProduct} className="space-y-4">
              <input
                name="title"
                value={form.title}
                onChange={handleChange}
                required
                placeholder="Title"
                className="w-full border p-2 rounded"
              />

              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                required
                placeholder="Description"
                className="w-full border p-2 rounded"
              />

              <div className="grid grid-cols-2 gap-4">
                <input
                  type="number"
                  name="price"
                  value={form.price}
                  onChange={handleChange}
                  required
                  placeholder="Price"
                  className="border p-2 rounded"
                />
                <input
                  type="number"
                  name="stock"
                  value={form.stock}
                  onChange={handleChange}
                  required
                  placeholder="Stock"
                  className="border p-2 rounded"
                />
              </div>

              <input
                name="category"
                value={form.category}
                onChange={handleChange}
                required
                placeholder="Category"
                className="w-full border p-2 rounded"
              />

              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleImages}
              />

              <button className="w-full bg-indigo-600 text-white py-2 rounded">
                {editingProduct ? "Update Product" : "Save Product"}
              </button>
            </form>
          </div>
        </div>
      )}
    </Layout>
  );
}

/* ================= STAT CARD ================= */
const Stat = ({ label, value }) => (
  <div className="bg-white rounded-xl shadow p-5 text-center">
    <p className="text-sm text-gray-500">{label}</p>
    <p className="text-2xl font-bold">{value}</p>
  </div>
);
