import React, { createContext, useContext, useState } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);

  const addToCart = (product) => {
    const existing = cart.find((p) => p._id === product._id);
    if (existing) {
      setCart(cart.map(p => p._id === product._id ? {...p, qty: p.qty + 1} : p));
    } else {
      setCart([...cart, { ...product, qty: 1 }]);
    }
    toast.success(`${product.name} added to cart!`);
  };

  const removeFromCart = (id) => {
    setCart(cart.filter(p => p._id !== id));
  };

  const updateQty = (id, qty) => {
    setCart(cart.map(p => p._id === id ? { ...p, qty } : p));
  };

  const clearCart = () => setCart([]);

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, updateQty, clearCart }}>
      {children}
    </CartContext.Provider>
  );
};
