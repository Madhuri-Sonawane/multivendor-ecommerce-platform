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
      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Seller Dashboard</h1>
        <button
          onClick={() => {
            resetForm();
            setShowForm(true);
          }}
          className="bg-indigo-600 text-white px-4 py-2 rounded"
        >
          + Add Product
        </button>
      </div>

      {/* ANALYTICS */}
      {analytics && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Stat label="Products" value={analytics.products.total} />
          <Stat label="Active" value={analytics.products.active} />
          <Stat label="Orders" value={analytics.orders.total} />
          <Stat label="Revenue" value={`₹${analytics.revenue}`} />
        </div>
      )}

      {/* MODAL */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white max-w-lg w-full p-6 rounded-xl relative">
            <button onClick={resetForm} className="absolute top-3 right-3">✕</button>

            <h2 className="text-xl font-semibold mb-4">
              {editingProduct ? "Edit Product" : "Add Product"}
            </h2>

            <form onSubmit={submitProduct} className="space-y-4">
              <input name="title" value={form.title} onChange={handleChange} required className="w-full border p-2 rounded" placeholder="Title" />
              <textarea name="description" value={form.description} onChange={handleChange} required className="w-full border p-2 rounded" placeholder="Description" />

              <div className="grid grid-cols-2 gap-4">
                <input type="number" name="price" value={form.price} onChange={handleChange} required className="border p-2 rounded" placeholder="Price" />
                <input type="number" name="stock" value={form.stock} onChange={handleChange} required className="border p-2 rounded" placeholder="Stock" />
              </div>

              <input name="category" value={form.category} onChange={handleChange} required className="w-full border p-2 rounded" placeholder="Category" />

              <input type="file" multiple accept="image/*" onChange={handleImages} />

              {existingImages.length > 0 && (
                <div className="grid grid-cols-3 gap-2">
                  {existingImages.map((img) => (
                    <div key={img} className="relative">
                      <img src={`http://localhost:5000/uploads/${img}`} className="h-20 w-full object-cover rounded" />
                      <button
                        type="button"
                        onClick={() => {
                          setRemovedImages([...removedImages, img]);
                          setExistingImages(existingImages.filter((i) => i !== img));
                        }}
                        className="absolute top-1 right-1 bg-red-600 text-white text-xs px-1 rounded"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              )}

              <button className="w-full bg-green-600 text-white py-2 rounded">
                {editingProduct ? "Update Product" : "Save Product"}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ORDERS */}
      <div className="bg-white rounded shadow">
        <h2 className="text-lg font-semibold p-4 border-b">Orders</h2>
        {orders.map((o) => (
          <div key={o._id} className="p-4 border-t">
            <p className="font-medium">Order #{o._id}</p>
            <p>Status: {o.status}</p>
            <div className="space-x-2 mt-2">
              <button disabled={o.status !== "pending"} onClick={() => updateStatus(o._id, "shipped")} className="px-3 py-1 border rounded">Ship</button>
              <button disabled={o.status !== "shipped"} onClick={() => updateStatus(o._id, "delivered")} className="px-3 py-1 border rounded">Deliver</button>
            </div>
          </div>
        ))}
      </div>
    </Layout>
  );
}

const Stat = ({ label, value }) => (
  <div className="bg-white p-4 rounded shadow text-center">
    <p className="text-sm text-gray-500">{label}</p>
    <p className="text-xl font-bold">{value}</p>
  </div>
);
