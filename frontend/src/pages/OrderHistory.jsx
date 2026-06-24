import { useEffect, useState } from "react";
import { authFetch } from "../utils/auth";
import { useNavigate } from "react-router-dom";

const OrderHistory = () => {
  const [orders, setOrders] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      const res = await authFetch("/orders/"); // ✅ CORRECT API
      if (!res.ok) return;

      const data = await res.json();
      setOrders(data);
    } catch (err) {
      console.error(err);
    }
  };

  // ✅ STATUS COLOR
  const getStatusStyle = (status) => {
    if (status === "PENDING") return "bg-yellow-100 text-yellow-600";
    if (status === "SHIPPED") return "bg-blue-100 text-blue-600";
    return "bg-green-100 text-green-600";
  };

  // ✅ FORMAT STATUS TEXT
  const formatStatus = (status) => {
    return status.charAt(0) + status.slice(1).toLowerCase();
  };

  return (
    <div className="bg-gray-50 min-h-screen py-10 px-4">
      <div className="max-w-5xl mx-auto">
        {/* HEADER */}
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold text-gray-800">Your Orders</h2>

          <button
            onClick={() => navigate("/")}
            className="bg-blue-600 text-white px-5 py-2 rounded hover:bg-blue-700 transition"
          >
            Continue Shopping
          </button>
        </div>

        {/* EMPTY STATE */}
        {orders.length === 0 ? (
          <div className="bg-white p-10 text-center rounded shadow">
            <p className="text-gray-500 text-lg">You have no orders yet</p>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <div
                key={order.id}
                className="bg-white rounded shadow border hover:shadow-lg transition"
              >
                {/* ORDER HEADER */}
                <div className="bg-gray-100 px-6 py-4 flex justify-between items-center border-b">
                  <div className="flex gap-8 text-sm">
                    <div>
                      <p className="text-gray-500">ORDER ID</p>
                      <p className="font-semibold">#{order.id}</p>
                    </div>

                    <div>
                      <p className="text-gray-500">PAYMENT</p>
                      <p className="font-semibold">{order.payment_method}</p>
                    </div>

                    <div>
                      <p className="text-gray-500">TOTAL</p>
                      <p className="font-bold text-green-600">
                        ₹ {order.total_amount}
                      </p>
                    </div>
                  </div>

                  {/* ✅ FIXED STATUS */}
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusStyle(
                      order.status,
                    )}`}
                  >
                    {formatStatus(order.status)}
                  </span>
                </div>

                {/* ITEMS */}
                <div className="divide-y">
                  {order.items.map((item) => (
                    <div
                      key={item.id}
                      className="flex justify-between items-center px-6 py-4 hover:bg-gray-50"
                    >
                      <div>
                        <p className="font-medium text-gray-800">
                          {item.product_name}
                        </p>
                        <p className="text-sm text-gray-500">
                          Quantity: {item.quantity}
                        </p>
                      </div>

                      <p className="font-semibold text-gray-700">
                        ₹ {item.price}
                      </p>
                    </div>
                  ))}
                </div>

                {/* FOOTER */}
                <div className="flex justify-between items-center px-6 py-3 bg-gray-50 text-sm">
                  <span className="text-gray-600">
                    {order.items.length} items
                  </span>

                  <button
                    onClick={() => navigate("/")}
                    className="text-blue-600 hover:underline font-medium"
                  >
                    Buy Again
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderHistory;
