import { useState, useEffect } from "react";
import { authFetch } from "../utils/auth";
import { useNavigate } from "react-router-dom";

const CheckoutPage = () => {
  const navigate = useNavigate();

  const [cart, setCart] = useState(null);

  const [form, setForm] = useState({
    name: "",
    address: "",
    phone: "",
    payment_method: "COD",
  });

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [loading, setLoading] = useState(false);

  // LOAD CART
  useEffect(() => {
    authFetch("/cart/")
      .then((res) => {
        if (!res) throw new Error();
        return res.json();
      })
      .then((data) => setCart(data))
      .catch(() => {
        alert("Please login again");
        navigate("/login");
      });
  }, []);

  // VALIDATION
  const validateField = (name, value) => {
    let error = "";

    if (name === "name") {
      if (!/^[A-Za-z ]+$/.test(value)) error = "Only letters allowed";
      else if (value.length < 3) error = "Minimum 3 characters";
    }

    if (name === "address") {
      if (value.length < 10) error = "Enter full address";
    }

    if (name === "phone") {
      if (!/^[0-9]+$/.test(value)) error = "Only numbers allowed";
      else if (!/^[6-9]\d{9}$/.test(value)) error = "Enter valid Indian number";
    }

    setErrors((prev) => ({ ...prev, [name]: error }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm({ ...form, [name]: value });
    setTouched({ ...touched, [name]: true });

    validateField(name, value);
  };

  // PLACE ORDER API
  const placeOrder = async () => {
    try {
      const res = await authFetch("/orders/create/", {
        method: "POST",
        body: JSON.stringify(form),
      });

      if (!res) return false;

      // ✅ IMPORTANT: TRIGGER NAVBAR UPDATE
      if (res.ok) {
        window.dispatchEvent(new Event("cartUpdated"));
      }

      return res.ok;
    } catch {
      return false;
    }
  };

  // RAZORPAY PAYMENT FLOW
  const handleRazorpay = () => {
    const options = {
      key: "rzp_test_1234567890",
      amount: cart.total * 100,
      currency: "INR",
      name: "My E-Commerce Store",
      description: "Order Payment",
      image: "https://cdn-icons-png.flaticon.com/512/3081/3081559.png",

      handler: async function () {
        alert("⚠️ Demo Mode: Payment Failed");

        const success = await placeOrder();

        if (success) {
          alert("🎉 Order placed successfully!");
          navigate("/");
        } else {
          alert("Order failed ❌");
        }
      },

      prefill: {
        name: form.name,
        contact: form.phone,
      },

      theme: {
        color: "#3399cc",
      },

      modal: {
        ondismiss: function () {
          alert("Payment popup closed");
        },
      },
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
  };

  // HANDLE ORDER BUTTON
  const handlePlaceOrder = async () => {
    if (Object.values(errors).some((e) => e)) {
      alert("Fix errors ❌");
      return;
    }

    if (!form.name || !form.address || !form.phone) {
      alert("Fill all fields ❌");
      return;
    }

    // COD FLOW
    if (form.payment_method === "COD") {
      const success = await placeOrder();

      success
        ? alert("🎉 Order placed successfully")
        : alert("Error placing order");

      navigate("/");
      return;
    }

    // ONLINE PAYMENT
    handleRazorpay();
  };

  if (!cart) return <h2 className="text-center mt-10">Loading...</h2>;

  return (
    <div className="max-w-6xl mx-auto p-6 grid md:grid-cols-2 gap-8">
      {/* LEFT */}
      <div className="bg-white p-6 rounded-2xl shadow">
        <h2 className="text-xl font-bold mb-4">Shipping Details</h2>

        <label>
          Name <span className="text-red-500">*</span>
        </label>
        <input
          name="name"
          className="w-full border p-2 rounded mt-1"
          value={form.name}
          onChange={handleChange}
        />
        {touched.name && <p className="text-red-500">{errors.name}</p>}

        <label className="block mt-3">
          Address <span className="text-red-500">*</span>
        </label>
        <textarea
          name="address"
          className="w-full border p-2 rounded mt-1"
          value={form.address}
          onChange={handleChange}
        />
        {touched.address && <p className="text-red-500">{errors.address}</p>}

        <label className="block mt-3">
          Phone <span className="text-red-500">*</span>
        </label>

        <div className="flex border rounded overflow-hidden">
          <span className="px-3 bg-gray-100">🇮🇳 +91</span>
          <input
            name="phone"
            className="w-full p-2"
            value={form.phone}
            onChange={handleChange}
          />
        </div>
        {touched.phone && <p className="text-red-500">{errors.phone}</p>}
      </div>

      {/* RIGHT */}
      <div className="space-y-6">
        <div className="bg-white p-6 rounded-2xl shadow">
          <h2 className="text-xl font-bold mb-4">Order Summary</h2>

          <div className="flex justify-between font-semibold border-b pb-2 mb-2">
            <span>Item</span>
            <span>Qty</span>
            <span>Price</span>
          </div>

          {cart.items.map((item) => (
            <div key={item.id} className="flex justify-between mb-2">
              <span>{item.product_name}</span>
              <span>{item.quantity}</span>
              <span>₹{item.product_price}</span>
            </div>
          ))}

          <hr className="my-3" />

          <div className="flex justify-between font-bold text-lg">
            <span>Total</span>
            <span>₹{cart.total}</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow">
          <h2 className="text-xl font-bold mb-4">Payment</h2>

          <label className="block mb-2">
            <input
              type="radio"
              checked={form.payment_method === "COD"}
              onChange={() => setForm({ ...form, payment_method: "COD" })}
            />
            <span className="ml-2">Cash on Delivery</span>
          </label>

          <label>
            <input
              type="radio"
              checked={form.payment_method === "ONLINE"}
              onChange={() => setForm({ ...form, payment_method: "ONLINE" })}
            />
            <span className="ml-2">Online Payment (Razorpay)</span>
          </label>

          <button
            onClick={handlePlaceOrder}
            disabled={loading}
            className="mt-4 w-full bg-green-600 text-white p-3 rounded-lg"
          >
            Pay ₹{cart.total}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
