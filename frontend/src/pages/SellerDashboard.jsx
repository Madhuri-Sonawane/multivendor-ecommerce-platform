import { useEffect, useState } from "react";
import api from "../api/axios";
import Layout from "../components/Layout";

export default function SellerDashboard() {
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [analytics, setAnalytics] = useState(null);

  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  const [images, setImages] = useState([]);
  const [existingImages, setExistingImages] = useState([]);
  const [removedImages, setRemovedImages] = useState([]);

  const [form, setForm] = useState({
    title: "",
    description: "",
    price: "",
    stock: "",
    category: "",
  });

  /* ================= FETCH DATA ================= */
  const fetchData = async () => {
    const [prodRes, orderRes, analyticsRes] = await Promise.all([
      api.get("/products/my-products"),
      api.get("/orders/seller"),
      api.get("/analytics/seller"),
    ]);

    setProducts(prodRes.data);
    setOrders(orderRes.data);
    setAnalytics(analyticsRes.data);
  };

  useEffect(() => {
    fetchData();
  }, []);

  /* ================= FORM ================= */
  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleImages = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 6) return alert("Max 6 images allowed");
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

  /* ================= ORDER ================= */
  const updateStatus = async (id, status) => {
    await api.put(`/orders/${id}/status`, { status });
    fetchData();
  };

  return (
    <Layout>
      {/* ================= HEADER ================= */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-10">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">
            Seller Dashboard
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Manage your products, orders and revenue
          </p>
        </div>

        <button
          onClick={() => {
            resetForm();
            setShowForm(true);
          }}
          className="bg-indigo-600 hover:bg-indigo-700 transition text-white px-5 py-2.5 rounded-lg shadow"
        >
          + Add Product
        </button>
      </div>

      {/* ================= ANALYTICS ================= */}
      {analytics && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <Stat label="Products" value={analytics.products.total} />
          <Stat label="Active Products" value={analytics.products.active} />
          <Stat label="Orders" value={analytics.orders.total} />
          <Stat label="Revenue" value={`₹${analytics.revenue}`} />
        </div>
      )}

      {/* ================= MY PRODUCTS ================= */}
      <div className="bg-white rounded-2xl shadow-sm mb-14">
        <div className="flex items-center justify-between p-5 border-b">
          <h2 className="text-xl font-semibold text-gray-800">
            My Products
          </h2>
          <span className="text-sm text-gray-500">
            {products.length} items
          </span>
        </div>

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
                {/* IMAGE */}
                {p.images?.length ? (
                  <img
                    src={`http://localhost:5000/uploads/${p.images[0]}`}
                    alt={p.title}
                    className="h-44 w-full object-cover"
                  />
                ) : (
                  <div className="h-44 bg-gray-200 flex items-center justify-center text-gray-500">
                    No Image
                  </div>
                )}

                <div className="p-4">
                  {/* STATUS */}
                  <span
                    className={`inline-block mb-2 px-2 py-0.5 text-xs rounded ${
                      p.isActive
                        ? "bg-green-100 text-green-700"
                        : "bg-gray-200 text-gray-600"
                    }`}
                  >
                    {p.isActive ? "Active" : "Disabled"}
                  </span>

                  <h3 className="font-semibold text-lg">{p.title}</h3>
                  <p className="text-sm text-gray-500">{p.category}</p>

                  <p className="text-sm mt-1">
                    ₹{p.price} · Stock: {p.stock}
                  </p>

                  {/* ACTIONS */}
                  <div className="flex justify-between items-center mt-4">
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
                        setRemovedImages([]);
                        setImages([]);
                        setShowForm(true);
                      }}
                      className="text-sm text-indigo-600 hover:underline"
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
      <div className="bg-white rounded-2xl shadow-sm">
        <h2 className="text-xl font-semibold p-5 border-b text-gray-800">
          Orders
        </h2>

        {orders.length === 0 ? (
          <p className="p-6 text-center text-gray-500">
            No orders yet.
          </p>
        ) : (
          orders.map((o) => (
            <div key={o._id} className="p-5 border-t">
              <p className="font-medium">Order #{o._id}</p>
              <p className="text-sm text-gray-600">Status: {o.status}</p>

              <div className="space-x-2 mt-3">
                <button
                  disabled={o.status !== "pending"}
                  onClick={() => updateStatus(o._id, "shipped")}
                  className="px-3 py-1 border rounded disabled:opacity-40"
                >
                  Ship
                </button>
                <button
                  disabled={o.status !== "shipped"}
                  onClick={() => updateStatus(o._id, "delivered")}
                  className="px-3 py-1 border rounded disabled:opacity-40"
                >
                  Deliver
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* ================= MODAL ================= */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white max-w-lg w-full p-6 rounded-xl relative">
            <button onClick={resetForm} className="absolute top-3 right-3">
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
                className="w-full border p-2 rounded"
                placeholder="Title"
              />

              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                required
                className="w-full border p-2 rounded"
                placeholder="Description"
              />

              <div className="grid grid-cols-2 gap-4">
                <input
                  type="number"
                  name="price"
                  value={form.price}
                  onChange={handleChange}
                  required
                  className="border p-2 rounded"
                  placeholder="Price"
                />
                <input
                  type="number"
                  name="stock"
                  value={form.stock}
                  onChange={handleChange}
                  required
                  className="border p-2 rounded"
                  placeholder="Stock"
                />
              </div>

              <input
                name="category"
                value={form.category}
                onChange={handleChange}
                required
                className="w-full border p-2 rounded"
                placeholder="Category"
              />

              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleImages}
              />

              <button className="w-full bg-green-600 text-white py-2 rounded">
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
  <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition p-5 text-center">
    <p className="text-sm text-gray-500">{label}</p>
    <p className="text-2xl font-bold text-gray-800 mt-1">{value}</p>
  </div>
);
