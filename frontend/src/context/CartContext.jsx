import { createContext, useContext, useEffect, useState } from "react";
import api from "../api/axios";
import { useAuth } from "./AuthContext";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const { user } = useAuth();
  const [cart, setCart] = useState({ items: [] });
  const [isCartOpen, setIsCartOpen] = useState(false);

  const fetchCart = async () => {
    if (!user || user.role !== "user") return;
    try {
      const res = await api.get("/cart");
      setCart(res.data);
    } catch (err) {
      console.error("Failed to fetch cart", err);
    }
  };

  useEffect(() => {
    fetchCart();
  }, [user]);

  const addToCart = async (productId, quantity = 1) => {
    if (!user) {
      // You could handle local cart here, but for simplicity, we require login.
      alert("Please login to add to cart");
      return false;
    }
    
    try {
      await api.post("/cart/add", { productId, quantity });
      await fetchCart();
      setIsCartOpen(true); // Open drawer on add
      return true;
    } catch (err) {
      alert("Failed to add to cart. " + (err.response?.data?.message || ""));
      return false;
    }
  };

  const removeFromCart = async (productId) => {
    try {
      await api.delete(`/cart/remove/${productId}`);
      await fetchCart();
    } catch (err) {
      console.error("Remove failed", err);
    }
  };

  const updateQuantity = async (productId, quantity) => {
    if (quantity <= 0) return removeFromCart(productId);
    try {
      await api.put("/cart/update", { productId, quantity });
      await fetchCart();
    } catch (err) {
      console.error("Update failed", err);
    }
  };

  const clearCart = async () => {
    try {
      await api.delete("/cart/clear");
      setCart({ items: [] });
    } catch (err) {
      console.error("Clear cart failed", err);
    }
  };

  const toggleCart = () => setIsCartOpen(!isCartOpen);

  const cartItemCount = cart.items?.reduce((total, item) => total + item.quantity, 0) || 0;
  
  const cartTotal = cart.items?.reduce((total, item) => {
    // Some logic based on price. In this setup, we populated items.product
    return total + (item.product?.price || 0) * item.quantity;
  }, 0) || 0;

  return (
    <CartContext.Provider
      value={{
        cart,
        fetchCart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        isCartOpen,
        setIsCartOpen,
        toggleCart,
        cartItemCount,
        cartTotal
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
