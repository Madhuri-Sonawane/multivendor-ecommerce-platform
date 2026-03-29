import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../api/axios";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";

export default function Checkout() {
  const { cart, cartTotal, fetchCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [form, setForm] = useState({
    name: user?.name || "",
    address: "",
    city: "",
    postalCode: "",
    phone: "",
  });
  
  const [isPlacing, setIsPlacing] = useState(false);
  const [error, setError] = useState(null);

  // If cart is empty, redirect
  useEffect(() => {
    if (!cart?.items || cart.items.length === 0) {
      navigate("/products");
    }
  }, [cart, navigate]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    setIsPlacing(true);
    setError(null);

    try {
      // Create order from the cart
      await api.post("/orders", { shippingAddress: form });
      
      // Refresh cart context (it should be empty now)
      await fetchCart();
      
      // Navigate to success or user profile
      navigate("/user/orders");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to place order. Try again.");
    } finally {
      setIsPlacing(false);
    }
  };

  if (!cart?.items?.length) return null;

  return (
    <div className="bg-gray-50 min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight mb-10">Checkout</h1>
        
        <div className="lg:grid lg:grid-cols-12 lg:gap-x-12">
          {/* Form */}
          <div className="lg:col-span-7">
            <form onSubmit={handlePlaceOrder}>
              <div className="bg-white px-6 py-8 rounded-2xl shadow-sm border border-gray-100">
                <h2 className="text-xl font-bold text-gray-900 mb-6">Shipping Information</h2>
                
                {error && (
                  <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 font-medium">
                    {error}
                  </div>
                )}
                
                <div className="grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-4">
                  <div className="sm:col-span-2">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Full Name</label>
                    <input type="text" name="name" required value={form.name} onChange={handleChange} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all" />
                  </div>
                  
                  <div className="sm:col-span-2">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Address</label>
                    <input type="text" name="address" required value={form.address} onChange={handleChange} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all" />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">City</label>
                    <input type="text" name="city" required value={form.city} onChange={handleChange} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all" />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Postal Code</label>
                    <input type="text" name="postalCode" required value={form.postalCode} onChange={handleChange} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all" />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Phone Number</label>
                    <input type="tel" name="phone" required value={form.phone} onChange={handleChange} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all" />
                  </div>
                </div>

                <div className="mt-10 border-t border-gray-200 pt-8">
                  <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                    Payment Method
                    <span className="bg-indigo-100 text-indigo-700 text-xs font-bold px-2 py-1 rounded">COD</span>
                  </h2>
                  <div className="relative border-2 border-indigo-600 rounded-2xl p-6 bg-indigo-50/30">
                    <div className="flex items-center gap-3">
                      <div className="w-6 h-6 rounded-full border-[6px] border-indigo-600"></div>
                      <span className="font-bold text-gray-900 text-lg">Cash on Delivery</span>
                    </div>
                    <p className="mt-3 text-gray-600 text-sm pl-9">You will pay for your order physically when it's delivered to your doorstep.</p>
                  </div>
                </div>
              </div>
              
              <button
                type="submit"
                disabled={isPlacing}
                className="mt-8 w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 rounded-2xl shadow-lg shadow-indigo-600/30 focus:outline-none focus:ring-4 focus:ring-indigo-500/50 disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:-translate-y-0.5 flex items-center justify-center text-lg"
              >
                {isPlacing ? (
                  <svg className="animate-spin h-6 w-6 text-white" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                ) : "Confirm & Place Order"}
              </button>
            </form>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-5 mt-10 lg:mt-0">
            <div className="bg-white px-6 py-8 rounded-2xl shadow-sm border border-gray-100 sticky top-24">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Order Summary</h2>
              
              <ul className="space-y-6 flex-1 max-h-[40vh] overflow-y-auto pr-2 mb-6">
                {cart.items.map((item) => {
                  const product = item.product;
                  if (!product) return null;
                  return (
                    <li key={item._id} className="flex gap-4">
                      <div className="h-16 w-16 bg-gray-50 rounded-lg overflow-hidden border border-gray-100 flex-shrink-0">
                         {product.images?.[0] ? (
                            <img src={`http://localhost:5000/uploads/${product.images[0]}`} className="h-full w-full object-cover" alt="" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-300">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                            </div>
                          )}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-sm text-gray-900 line-clamp-1">{product.title}</h4>
                        <p className="text-sm font-medium text-gray-500 mt-1">Qty {item.quantity}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-gray-900">₹{(product.price * item.quantity).toFixed(2)}</p>
                      </div>
                    </li>
                  )
                })}
              </ul>

              <div className="border-t border-gray-100 pt-6 space-y-4">
                <div className="flex justify-between text-sm text-gray-600">
                  <p>Subtotal</p>
                  <p className="font-medium text-gray-900">₹{cartTotal.toFixed(2)}</p>
                </div>
                <div className="flex justify-between text-sm text-gray-600">
                  <p>Shipping</p>
                  <p className="font-medium text-green-600">Free</p>
                </div>
                <div className="flex justify-between text-lg font-extrabold text-gray-900 pt-4 border-t border-gray-200">
                  <p>Total</p>
                  <p>₹{cartTotal.toFixed(2)}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
