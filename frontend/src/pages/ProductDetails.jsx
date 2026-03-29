import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../api/axios";
import { useCart } from "../context/CartContext";

export default function ProductDetails() {
  const { id } = useParams();
  const { addToCart } = useCart();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState(null);

  useEffect(() => {
    api.get("/products") // Fallback fetching all products because there isn't a getProductById implemented yet based on standard assumptions
      .then((res) => {
        const found = res.data.find(p => p._id === id);
        setProduct(found);
        setActiveImage(found?.images?.[0] || null);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, [id]);

  const handleAddToCart = async () => {
    setAdding(true);
    await addToCart(product._id, quantity);
    setAdding(false);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl font-bold text-gray-900">Product not found</h2>
        <Link to="/products" className="mt-4 text-indigo-600 hover:underline">Go back to shop</Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
      <div className="lg:grid lg:grid-cols-2 lg:gap-x-12 xl:gap-x-16">
        
        {/* Left: Images */}
        <div className="flex flex-col gap-4">
          <div className="w-full aspect-square bg-gray-100 rounded-3xl overflow-hidden border border-gray-200">
            {activeImage ? (
              <img 
                src={`http://localhost:5000/uploads/${activeImage}`} 
                alt="Product" 
                className="w-full h-full object-cover object-center"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-300">
                <svg className="w-24 h-24" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
              </div>
            )}
          </div>
          
          {/* Thumbnails */}
          {product.images && product.images.length > 1 && (
            <div className="grid grid-cols-4 gap-4">
              {product.images.map((img, idx) => (
                <button 
                  key={idx}
                  onClick={() => setActiveImage(img)}
                  className={`aspect-square w-full rounded-xl overflow-hidden border-2 transition-all ${activeImage === img ? 'border-indigo-600 shadow-md ring-2 ring-indigo-600/20' : 'border-transparent hover:border-gray-300'}`}
                >
                  <img src={`http://localhost:5000/uploads/${img}`} alt={`Thumbnail ${idx}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right: Info */}
        <div className="mt-10 px-4 sm:px-0 lg:mt-0">
          <p className="text-sm font-semibold text-indigo-600 tracking-wide uppercase mb-2">{product.category}</p>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-gray-900 mb-4">{product.title}</h1>
          
          <div className="mb-6">
            <h2 className="sr-only">Product information</h2>
            <p className="text-3xl font-bold text-gray-900 flex items-center gap-3">
              ₹{product.dynamicPrice ?? product.price}
              <span className="text-sm font-medium text-green-600 bg-green-50 px-2.5 py-1 rounded-full border border-green-200">In Stock ({product.stock})</span>
            </p>
          </div>

          <div className="mt-6 border-t border-gray-200 pt-6">
            <h3 className="text-sm font-medium text-gray-900 mb-4 text-justify">Description</h3>
            <div className="prose prose-sm text-gray-600 max-w-none">
              <p>{product.description}</p>
            </div>
          </div>

          <form className="mt-8 border-t border-gray-200 pt-8" onSubmit={(e) => e.preventDefault()}>
            <div className="flex items-center gap-6">
              <label htmlFor="quantity" className="text-sm font-medium text-gray-900">Quantity</label>
              <div className="flex items-center border border-gray-300 rounded-xl overflow-hidden h-12 w-32">
                <button 
                  type="button"
                  disabled={quantity <= 1}
                  onClick={() => setQuantity(q => q - 1)}
                  className="w-10 h-full flex items-center justify-center text-gray-500 hover:bg-gray-100 disabled:opacity-50 transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" /></svg>
                </button>
                <input 
                  type="number" 
                  id="quantity" 
                  name="quantity" 
                  min="1" 
                  max={product.stock}
                  value={quantity}
                  onChange={(e) => setQuantity(Math.max(1, Math.min(product.stock, parseInt(e.target.value) || 1)))}
                  className="flex-1 h-full text-center border-x border-gray-300 font-semibold text-gray-900 outline-none p-0 focus:ring-0 appearance-none bg-white"
                />
                <button 
                  type="button"
                  disabled={quantity >= product.stock}
                  onClick={() => setQuantity(q => q + 1)}
                  className="w-10 h-full flex items-center justify-center text-gray-500 hover:bg-gray-100 disabled:opacity-50 transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                </button>
              </div>
            </div>

            <div className="mt-8 flex gap-4">
              <button
                type="button"
                disabled={adding || product.stock === 0}
                onClick={handleAddToCart}
                className="flex max-w-xs flex-1 items-center justify-center rounded-xl border border-transparent bg-indigo-600 px-8 py-4 text-base font-bold text-white hover:bg-indigo-700 focus:outline-none focus:ring-4 focus:ring-indigo-500/50 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-indigo-600/30 hover:shadow-indigo-600/50 hover:-translate-y-0.5"
              >
                {adding ? (
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                ) : "Add to Cart"}
              </button>
              
              <button
                type="button"
                className="flex items-center justify-center rounded-xl border-2 border-gray-200 bg-white px-4 py-4 text-gray-600 hover:bg-gray-50 hover:border-gray-300 focus:outline-none transition-colors"
              >
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
                <span className="sr-only">Add to favorites</span>
              </button>
            </div>
          </form>

          {/* Secure / Delivery Info */}
          <div className="mt-10 px-6 py-5 bg-gray-50 border border-gray-100 rounded-2xl">
            <ul className="space-y-4">
              <li className="flex items-center gap-3 text-sm text-gray-600 font-medium">
                <svg className="h-5 w-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                Cash on delivery available
              </li>
              <li className="flex items-center gap-3 text-sm text-gray-600 font-medium">
                <svg className="h-5 w-5 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                Ships within 48 hours
              </li>
            </ul>
          </div>
          
        </div>
      </div>
    </div>
  );
}
