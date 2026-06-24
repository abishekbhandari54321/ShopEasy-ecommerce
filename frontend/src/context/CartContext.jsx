import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import { getToken } from "../utils/auth";

const CartContext = createContext();

const API_BASE = "http://127.0.0.1:8000/api";

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(null);

  const getHeaders = () => {
    const token = getToken();

    return {
      headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
      },
    };
  };

  // ✅ FETCH CART
  const fetchCart = async () => {
    try {
      const token = getToken();
      if (!token) return;

      const res = await axios.get(`${API_BASE}/cart/`, getHeaders());
      setCart(res.data);
    } catch (err) {
      console.log("Cart error:", err.response?.data || err.message);
    }
  };

  // ✅ ADD TO CART (FIXED)
  const addToCart = async (productId) => {
    try {
      const token = getToken();

      if (!token) {
        alert("Please login first");
        return;
      }

      const res = await axios.post(
        `${API_BASE}/cart/add/`,
        { product_id: productId },
        getHeaders(),
      );

      console.log("ADD SUCCESS:", res.data);

      fetchCart();
      alert("Added to cart ✅");
    } catch (err) {
      console.log("ADD ERROR:", err.response?.data || err.message);
      alert("Error adding to cart ❌");
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  return (
    <CartContext.Provider value={{ cart, addToCart, fetchCart }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
