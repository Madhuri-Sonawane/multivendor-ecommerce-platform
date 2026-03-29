import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";

export default function CartDrawer() {
  const { cart, isCartOpen, setIsCartOpen, removeFromCart, updateQuantity, cartTotal, clearCart } = useCart();

  if (!isCartOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 transition-opacity"
        onClick={() => setIsCartOpen(false)}
      />

      {/* Drawer */}
      <div className="fixed inset-y-0 right-0 max-w-md w-full bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out flex flex-col">
        {/* Header */}
        <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
          <h2 className="text-xl font-bold text-gray-900 group flex items-center gap-2">
            Shopping Cart
            <span className="bg-indigo-100 text-indigo-700 py-0.5 px-2.5 rounded-full text-sm font-semibold">
              {cart?.items?.length || 0}
            </span>
          </h2>
          <button 
            onClick={() => setIsCartOpen(false)}
            className="p-2 -mr-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {!cart?.items || cart.items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-gray-500 space-y-4">
              <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mb-2">
                <svg className="w-12 h-12 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
              </div>
              <p className="text-lg font-medium text-gray-900">Your cart is empty</p>
              <p className="text-sm">Looks like you haven't added anything yet.</p>
              <button 
                onClick={() => setIsCartOpen(false)}
                className="mt-6 font-semibold text-indigo-600 hover:text-indigo-800 transition-colors"
              >
                Continue Shopping
              </button>
            </div>
          ) : (
            <ul className="space-y-6">
              {cart.items.map((item) => {
                const product = item.product;
                if (!product) return null;
                return (
                  <li key={item._id || product._id} className="flex gap-4 group">
                    <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-xl border border-gray-100 bg-gray-50 relative">
                      {product.images?.[0] ? (
                        <img
                          src={`http://localhost:5000/uploads/${product.images[0]}`}
                          alt={product.title}
                          className="h-full w-full object-cover object-center"
                        />
                      ) : (
                        <div className="flex items-center justify-center h-full text-gray-400">
                          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                        </div>
                      )}
                    </div>

                    <div className="flex flex-1 flex-col">
                      <div>
                        <div className="flex justify-between text-base font-semibold text-gray-900">
                          <h3 className="line-clamp-2 leading-tight">
                            <Link to={`/product/${product._id}`} onClick={() => setIsCartOpen(false)} className="hover:text-indigo-600">
                              {product.title}
                            </Link>
                          </h3>
                          <p className="ml-4 whitespace-nowrap">${product.price?.toFixed(2)}</p>
                        </div>
                        <p className="mt-1 text-sm text-gray-500 line-clamp-1">{product.category}</p>
                      </div>
                      
                      <div className="flex flex-1 items-end justify-between text-sm">
                        <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden h-8">
                          <button 
                            disabled={item.quantity <= 1}
                            onClick={() => updateQuantity(product._id, item.quantity - 1)}
                            className="px-2 text-gray-500 hover:bg-gray-100 disabled:opacity-50 transition-colors h-full flex items-center justify-center"
                          >
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" /></svg>
                          </button>
                          <span className="px-3 py-1 font-medium text-gray-900 border-x border-gray-200 h-full flex items-center justify-center min-w-[2rem]">{item.quantity}</span>
                          <button 
                            disabled={item.quantity >= product.stock}
                            onClick={() => updateQuantity(product._id, item.quantity + 1)}
                            className="px-2 text-gray-500 hover:bg-gray-100 disabled:opacity-50 transition-colors h-full flex items-center justify-center"
                          >
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                          </button>
                        </div>

                        <button
                          type="button"
                          onClick={() => removeFromCart(product._id)}
                          className="font-medium text-red-500 hover:text-red-700 flex items-center gap-1 transition-colors px-2 py-1 rounded hover:bg-red-50"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                          Remove
                        </button>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        {/* Footer */}
        {cart?.items?.length > 0 && (
          <div className="border-t border-gray-100 px-6 py-6 bg-gray-50/50">
            <div className="flex justify-between text-base font-bold text-gray-900 mb-2">
              <p>Subtotal</p>
              <p>${cartTotal.toFixed(2)}</p>
            </div>
            <p className="mt-0.5 text-sm text-gray-500 mb-6 flex justify-between">
              <span>Shipping and taxes calculated at checkout.</span>
            </p>
            
            <div className="space-y-3">
              <Link
                to="/checkout"
                onClick={() => setIsCartOpen(false)}
                className="flex items-center justify-center w-full rounded-xl bg-indigo-600 px-6 py-4 text-base font-bold text-white shadow-lg shadow-indigo-600/30 hover:shadow-indigo-600/50 hover:bg-indigo-700 transition-all transform hover:-translate-y-0.5"
              >
                Proceed to Checkout
              </Link>
              <button
                onClick={clearCart}
                className="flex items-center justify-center w-full rounded-xl bg-white border border-gray-200 px-6 py-3 text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-colors"
              >
                Clear Cart
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
