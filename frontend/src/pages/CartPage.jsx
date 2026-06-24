import { useEffect, useState } from "react";
import { authFetch } from "../utils/auth";
import { useNavigate } from "react-router-dom";

const CartPage = () => {
  const [cart, setCart] = useState([]);
  const navigate = useNavigate();

  // ✅ LOAD CART
  const loadCart = async () => {
    try {
      const res = await authFetch("/cart/");

      if (!res) {
        alert("Session expired, login again");
        navigate("/login");
        return;
      }

      const data = await res.json();

      const sortedItems = (data.items || []).sort((a, b) => b.id - a.id);

      setCart(sortedItems);
    } catch (err) {
      console.error("Cart load error:", err);
    }
  };

  useEffect(() => {
    loadCart();
  }, []);

  // ✅ UPDATE QUANTITY
  const updateQuantity = async (itemId, quantity) => {
    try {
      await authFetch("/cart/update/", {
        method: "POST",
        body: JSON.stringify({
          item_id: itemId,
          quantity: quantity,
        }),
      });

      loadCart();
    } catch (err) {
      console.error("Update error:", err);
    }
  };

  // ✅ REMOVE ITEM
  const removeItem = async (itemId) => {
    try {
      await authFetch("/cart/remove/", {
        method: "POST",
        body: JSON.stringify({
          item_id: itemId,
        }),
      });

      loadCart();
    } catch (err) {
      console.error("Remove error:", err);
    }
  };

  // ✅ TOTAL CALCULATION
  const total = cart.reduce(
    (sum, item) => sum + item.product_price * item.quantity,
    0,
  );

  return (
    <div className="min-h-screen bg-gray-50 px-6 py-10">
      <h2 className="text-3xl font-bold mb-8 text-center">Your Cart 🛒</h2>

      {cart.length === 0 ? (
        <p className="text-center text-gray-500">Your cart is empty</p>
      ) : (
        <div className="grid md:grid-cols-3 gap-8">
          {/* 🛍️ ITEMS */}
          <div className="md:col-span-2 space-y-6">
            {cart.map((item) => (
              <div
                key={item.id}
                className="flex items-center gap-6 bg-white p-4 rounded-xl shadow hover:shadow-lg transition"
              >
                <img
                  src={item.product_image}
                  alt=""
                  className="w-24 h-24 object-contain rounded"
                />

                <div className="flex-1">
                  <h3 className="font-semibold text-lg">{item.product_name}</h3>

                  <p className="text-green-600 font-bold">
                    ₹ {item.product_price}
                  </p>

                  {/* ➕➖ QUANTITY */}
                  <div className="flex items-center gap-3 mt-3">
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="bg-gray-200 px-3 py-1 rounded"
                    >
                      -
                    </button>

                    <span className="font-semibold">{item.quantity}</span>

                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="bg-gray-200 px-3 py-1 rounded"
                    >
                      +
                    </button>

                    <button
                      onClick={() => removeItem(item.id)}
                      className="ml-4 text-red-500"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* 💳 SUMMARY */}
          <div className="bg-white p-6 rounded-xl shadow h-fit">
            <h3 className="text-xl font-bold mb-4">Order Summary</h3>

            <div className="flex justify-between mb-2">
              <span>Total Items</span>
              <span>{cart.length}</span>
            </div>

            <div className="flex justify-between text-lg font-bold mt-4">
              <span>Total Price</span>
              <span>₹ {total}</span>
            </div>

            <button
              onClick={() => navigate("/checkout")}
              className="w-full mt-6 bg-green-600 text-white py-3 rounded-lg hover:bg-green-700"
            >
              Proceed to Checkout
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartPage;
