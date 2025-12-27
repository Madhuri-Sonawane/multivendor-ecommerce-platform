import { useEffect, useState } from "react";
import api from "../api/axios";
import Layout from "../components/Layout";

export default function SellerDashboard() {
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);

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

  /* ================= FETCH ================= */
  const fetchData = async () => {
    const prodRes = await api.get("/products/my-products");
    const orderRes = await api.get("/orders/seller");
    setProducts(prodRes.data);
    setOrders(orderRes.data);
  };

  useEffect(() => {
    fetchData();
  }, []);

  /* ================= FORM ================= */
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

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
              <input name="title" value={form.title} onChange={handleChange} required className="w-full border p-2 rounded" placeholder="Title" />
              <textarea name="description" value={form.description} onChange={handleChange} required className="w-full border p-2 rounded" placeholder="Description" />

              <div className="grid grid-cols-2 gap-4">
                <input type="number" name="price" value={form.price} onChange={handleChange} required className="border p-2 rounded" placeholder="Price" />
                <input type="number" name="stock" value={form.stock} onChange={handleChange} required className="border p-2 rounded" placeholder="Stock" />
              </div>

              <input name="category" value={form.category} onChange={handleChange} required className="w-full border p-2 rounded" placeholder="Category" />

              <input type="file" multiple accept="image/*" onChange={handleImages} />

              {existingImages.length > 0 && (
                <div className="grid grid-cols-3 gap-2 mt-2">
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

      {/* ================= PRODUCTS ================= */}
      <div className="bg-white rounded shadow mb-8">
        <h2 className="text-lg font-semibold p-4 border-b">My Products</h2>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
          {products.map((p) => (
            <div key={p._id} className="border rounded-lg overflow-hidden">
              {p.images?.length ? (
                <img src={`http://localhost:5000/uploads/${p.images[0]}`} className="h-40 w-full object-cover" />
              ) : (
                <div className="h-40 bg-gray-200 flex items-center justify-center">No Image</div>
              )}

              <div className="p-4">
                {/* STATUS BADGE */}
                <span
                  className={`inline-block mb-1 px-2 py-0.5 text-xs rounded ${
                    p.isActive ? "bg-green-100 text-green-700" : "bg-gray-200 text-gray-600"
                  }`}
                >
                  {p.isActive ? "Active" : "Disabled"}
                </span>

                <p className="font-semibold">{p.title}</p>
                <p className="text-sm text-gray-500">{p.category}</p>
                <p className="text-sm mt-1">₹{p.price} · Stock: {p.stock}</p>

                <div className="flex justify-between mt-3">
                  <button
                    onClick={() => {
                      setEditingProduct(p);
                      setForm(p);
                      setExistingImages(p.images || []);
                      setRemovedImages([]);
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
                    className={`text-sm px-3 py-1 rounded ${
                      p.isActive ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"
                    }`}
                  >
                    {p.isActive ? "Disable" : "Enable"}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ================= ORDERS ================= */}
      <div className="bg-white rounded shadow">
        <h2 className="text-lg font-semibold p-4 border-b">Orders</h2>
        {orders.map((o) => (
          <div key={o._id} className="p-4 border-t">
            <p className="font-medium">Order #{o._id}</p>
            <p>Status: {o.status}</p>
            <div className="space-x-2 mt-2">
              <button disabled={o.status !== "pending"} onClick={() => updateStatus(o._id, "shipped")} className="px-3 py-1 border rounded">
                Ship
              </button>
              <button disabled={o.status !== "shipped"} onClick={() => updateStatus(o._id, "delivered")} className="px-3 py-1 border rounded">
                Deliver
              </button>
            </div>
          </div>
        ))}
      </div>
    </Layout>
  );
}
