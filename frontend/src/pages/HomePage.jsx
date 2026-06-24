import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

// PUBLIC IMAGES
const categories = [
  { name: "Clothes", image: "/categories/clothes.png" },
  { name: "Electric", image: "/categories/electric.png" },
  { name: "Sports", image: "/categories/sports.png" },
  { name: "Household", image: "/categories/household.png" },
];

function HomePage() {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetch("http://127.0.0.1:8000/api/products/")
      .then((res) => res.json())
      .then(setProducts);
  }, []);

  return (
    <div className="bg-gray-50">
      {/* ================= HERO ================= */}
      <div className="relative bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-24 text-center overflow-hidden">
        {/* Background Blur Effect */}
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle,_white_1px,_transparent_1px)] bg-[size:20px_20px]" />

        <div className="relative z-10">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
            Welcome to ShopEasy 🛒
          </h1>

          <p className="mt-4 text-lg md:text-xl opacity-90">
            Discover the Best Deals, Trusted Products & Fast Delivery
          </p>

          <button
            onClick={() => navigate("/products")}
            className="mt-8 bg-white text-blue-600 px-8 py-3 rounded-full font-semibold shadow hover:bg-gray-100 hover:scale-105 transition"
          >
            Shop Now →
          </button>
        </div>
      </div>

      {/* ================= CATEGORIES ================= */}
      <div className="px-6 py-14">
        <h2 className="text-3xl font-bold mb-10 text-center text-gray-800">
          Shop by Category
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-6xl mx-auto">
          {categories.map((cat, index) => (
            <div
              key={index}
              onClick={() => navigate("/products")}
              className="cursor-pointer bg-white p-6 rounded-2xl shadow hover:shadow-xl hover:-translate-y-2 transition text-center"
            >
              <div className="h-28 flex items-center justify-center">
                <img
                  src={cat.image}
                  alt={cat.name}
                  className="h-full object-contain transition-transform duration-300 hover:scale-110"
                />
              </div>

              <h3 className="mt-4 font-semibold text-gray-800 text-lg">
                {cat.name}
              </h3>
            </div>
          ))}
        </div>
      </div>

      {/* ================= PRODUCTS ================= */}
      <div className="px-6 pb-16">
        <h2 className="text-3xl font-bold mb-8 text-center text-gray-800">
          Featured Products
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 max-w-7xl mx-auto">
          {products.slice(0, 10).map((p) => (
            <div
              key={p.id}
              onClick={() => navigate(`/product/${p.id}`)}
              className="cursor-pointer bg-white rounded-2xl shadow hover:shadow-xl transition overflow-hidden group"
            >
              {/* IMAGE */}
              <div className="h-52 bg-gray-100 flex items-center justify-center overflow-hidden">
                <img
                  src={p.image}
                  alt={p.name}
                  className="h-full object-contain group-hover:scale-110 transition duration-300"
                />
              </div>

              {/* CONTENT */}
              <div className="p-4">
                <h3 className="font-medium text-gray-800 line-clamp-2">
                  {p.name}
                </h3>

                <p className="text-green-600 font-bold mt-2 text-lg">
                  ₹ {p.price}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* VIEW ALL BUTTON */}
        <div className="text-center mt-10">
          <button
            onClick={() => navigate("/products")}
            className="bg-blue-600 text-white px-8 py-3 rounded-full font-semibold hover:bg-blue-700 transition shadow"
          >
            View All Products →
          </button>
        </div>
      </div>

      {/* ================= FOOTER ================= */}
      <div className="bg-gray-900 text-gray-300 py-8 mt-12">
        <div className="max-w-6xl mx-auto text-center">
          <h3 className="text-lg font-semibold text-white mb-2">ShopEasy</h3>
          <p className="text-sm">Your trusted online shopping destination</p>

          <div className="mt-4 text-sm opacity-70">
            © 2026 ShopEasy. All Rights Reserved.
          </div>
        </div>
      </div>
    </div>
  );
}

export default HomePage;
