import { useState, useEffect } from "react";
import api from "../api/axios";

export default function ProductForm({
  onClose,
  onSuccess,
  editingProduct,
}) {
  const [form, setForm] = useState({
    title: "",
    description: "",
    price: "",
    mrp: "",
    stock: "",
    category: "",
    subCategory: "",
    brand: "",
  });

  const [images, setImages] = useState([]);

  /* PREFILL WHEN EDITING */
  useEffect(() => {
    if (editingProduct) {
      setForm({
        title: editingProduct.title || "",
        description: editingProduct.description || "",
        price: editingProduct.price || "",
        mrp: editingProduct.mrp || "",
        stock: editingProduct.stock || "",
        category: editingProduct.category || "",
        subCategory: editingProduct.subCategory || "",
        brand: editingProduct.brand || "",
      });
    }
  }, [editingProduct]);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = new FormData();
    Object.entries(form).forEach(([k, v]) => data.append(k, v));
    images.forEach((img) => data.append("images", img));

    try {
      if (editingProduct) {
        await api.put(`/products/${editingProduct._id}`, data);
      } else {
        await api.post("/products", data);
      }

      onSuccess();
      onClose();
    } catch (err) {
      console.error("Product save failed", err);
      alert("Failed to save product");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-xl w-full max-w-lg space-y-4 max-h-[90vh] overflow-y-auto"
      >
        <h2 className="text-xl font-bold">
          {editingProduct ? "Edit Product" : "Add Product"}
        </h2>

        <input
          name="title"
          placeholder="Title"
          value={form.title}
          onChange={handleChange}
          className="w-full border p-2 rounded focus:ring-2 focus:ring-indigo-500 outline-none"
          required
        />

        <textarea
          name="description"
          placeholder="Description"
          value={form.description}
          onChange={handleChange}
          className="w-full border p-2 rounded focus:ring-2 focus:ring-indigo-500 outline-none"
        />

        <div className="grid grid-cols-2 gap-4">
          <input
            name="price"
            type="number"
            placeholder="Sale Price"
            value={form.price}
            onChange={handleChange}
            className="w-full border p-2 rounded focus:ring-2 focus:ring-indigo-500 outline-none"
            required
          />
          <input
            name="mrp"
            type="number"
            placeholder="Original MRP"
            value={form.mrp}
            onChange={handleChange}
            className="w-full border p-2 rounded focus:ring-2 focus:ring-indigo-500 outline-none"
          />
        </div>

        <input
          name="stock"
          type="number"
          placeholder="Stock Quantity"
          value={form.stock}
          onChange={handleChange}
          className="w-full border p-2 rounded focus:ring-2 focus:ring-indigo-500 outline-none"
        />

        <div className="grid grid-cols-2 gap-4">
          <input
            name="category"
            placeholder="Master Category (e.g. Mobiles)"
            value={form.category}
            onChange={handleChange}
            className="w-full border p-2 rounded focus:ring-2 focus:ring-indigo-500 outline-none"
            required
          />
          <input
            name="subCategory"
            placeholder="Sub Category (e.g. Earbuds)"
            value={form.subCategory}
            onChange={handleChange}
            className="w-full border p-2 rounded focus:ring-2 focus:ring-indigo-500 outline-none"
          />
        </div>

        <input
          name="brand"
          placeholder="Brand (e.g. Apple)"
          value={form.brand}
          onChange={handleChange}
          className="w-full border p-2 rounded focus:ring-2 focus:ring-indigo-500 outline-none"
        />

        <div className="pt-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">Product Images</label>
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={(e) => setImages([...e.target.files].slice(0, 6))}
            className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
          />
        </div>

        <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-gray-100">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 border rounded font-medium text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button className="px-6 py-2 bg-[#2874f0] hover:bg-blue-600 text-white rounded font-bold shadow-md">
            Save Product
          </button>
        </div>
      </form>
    </div>
  );
}
