import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const categories = [
  { name: "Clothes", image: "/categories/clothes.png" },
  { name: "Electric", image: "/categories/electric.png" },
  { name: "Sports", image: "/categories/sports.png" },
  { name: "Household", image: "/categories/household.png" },
];

function ProductList() {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [filtered, setFiltered] = useState([]);

  useEffect(() => {
    fetch("http://127.0.0.1:8000/api/products/")
      .then((res) => res.json())
      .then((data) => {
        setProducts(data);
        setFiltered(data);
      });
  }, []);

  const filterCategory = (category) => {
    const filteredItems = products.filter((p) =>
      p.category_name?.toLowerCase().includes(category.toLowerCase()),
    );

    setFiltered(filteredItems);
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* ================= HEADER ================= */}
      <div className="bg-white shadow-sm py-6 mb-6">
        <h2 className="text-3xl font-bold text-center text-gray-800">
          Explore Products
        </h2>
        <p className="text-center text-gray-500 mt-1">
          Find the best items for your needs
        </p>
      </div>

      {/* ================= CATEGORIES ================= */}
      <div className="px-6 py-6">
        <h3 className="text-2xl font-semibold mb-6 text-center text-gray-700">
          Shop by Category
        </h3>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-6xl mx-auto">
          {categories.map((cat, index) => (
            <div
              key={index}
              onClick={() => filterCategory(cat.name)}
              className="cursor-pointer bg-white p-6 rounded-2xl shadow hover:shadow-xl hover:-translate-y-2 transition text-center group"
            >
              <div className="h-28 flex items-center justify-center">
                <img
                  src={cat.image}
                  alt={cat.name}
                  className="h-full object-contain group-hover:scale-110 transition duration-300"
                />
              </div>

              <h3 className="mt-4 font-semibold text-gray-800 text-lg">
                {cat.name}
              </h3>
            </div>
          ))}
        </div>

        {/* SHOW ALL BUTTON */}
        <div className="text-center mt-8">
          <button
            onClick={() => setFiltered(products)}
            className="bg-blue-600 text-white px-6 py-2 rounded-full font-medium hover:bg-blue-700 transition shadow"
          >
            Show All
          </button>
        </div>
      </div>

      {/* ================= PRODUCTS ================= */}
      <div className="px-6 pb-12">
        <h2 className="text-2xl font-bold mb-8 text-center text-gray-800">
          Products
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 max-w-7xl mx-auto">
          {filtered.length === 0 ? (
            <div className="col-span-full text-center py-16">
              <p className="text-xl text-gray-500">No products available ❌</p>
              <p className="text-sm text-gray-400 mt-2">
                Try selecting a different category
              </p>
            </div>
          ) : (
            filtered.map((p) => (
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

                {/* DETAILS */}
                <div className="p-4">
                  <h3 className="font-medium text-gray-800 line-clamp-2">
                    {p.name}
                  </h3>

                  <p className="text-green-600 font-bold mt-2 text-lg">
                    ₹ {p.price}
                  </p>

                  {/* EXTRA UI TOUCH */}
                  <button className="mt-3 w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition text-sm">
                    View Details
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default ProductList;
