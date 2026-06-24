import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { authFetch } from "../utils/auth";

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState({});

  // LOAD PRODUCT
  useEffect(() => {
    fetch(`http://127.0.0.1:8000/api/products/${id}/`)
      .then((res) => res.json())
      .then((data) => setProduct(data));
  }, [id]);

  // ADD TO CART
  const addToCart = async () => {
    try {
      const res = await authFetch("/cart/add/", {
        method: "POST",
        body: JSON.stringify({
          product_id: product.id,
        }),
      });

      if (!res) {
        alert("Session expired. Please login again");
        navigate("/login");
        return;
      }

      const data = await res.json();

      if (!res.ok) {
        alert(data.error || "Error adding to cart");
        return;
      }

      // ✅ NEW: UPDATE NAVBAR INSTANTLY
      window.dispatchEvent(new Event("cartUpdated"));

      alert("Added to cart ✅");
    } catch (err) {
      console.error(err);
      alert("Something went wrong ❌");
    }
  };

  return (
    <div className="w-full px-6 py-10 bg-gray-50 min-h-screen">
      <div className="grid md:grid-cols-2 gap-10 bg-white p-6 rounded-xl shadow">
        {/* IMAGE */}
        <div className="flex items-center justify-center bg-gray-100 rounded-xl p-6">
          <img
            src={product.image}
            alt={product.name}
            className="max-h-[400px] object-contain"
            onError={(e) => (e.target.src = "https://via.placeholder.com/300")}
          />
        </div>

        {/* DETAILS */}
        <div className="flex flex-col justify-between">
          <div>
            <h2 className="text-3xl font-bold text-gray-800">{product.name}</h2>

            <p className="text-gray-600 mt-4">
              {product.description || "No description available."}
            </p>

            <h3 className="text-3xl font-bold text-green-600 mt-6">
              ₹ {product.price}
            </h3>
          </div>

          {/* BUTTONS */}
          <div className="mt-8 flex gap-4">
            <button
              onClick={addToCart}
              className="bg-yellow-500 hover:bg-yellow-600 text-white px-6 py-3 rounded-lg transition"
            >
              Add to Cart
            </button>

            <button
              onClick={() => navigate("/cart")}
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg transition"
            >
              Go to Cart
            </button>
          </div>

          <button
            onClick={() => navigate(-1)}
            className="mt-6 text-blue-600 hover:underline"
          >
            ← Back
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
