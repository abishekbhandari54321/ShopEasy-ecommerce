import { Link, useNavigate } from "react-router-dom";
import { isLoggedIn, logout, authFetch } from "../utils/auth";
import { useState, useEffect } from "react";

const Navbar = () => {
  const navigate = useNavigate();

  const [search, setSearch] = useState("");
  const [products, setProducts] = useState([]);
  const [results, setResults] = useState([]);
  const [cartCount, setCartCount] = useState(0);

  // LOAD PRODUCTS
  useEffect(() => {
    fetch("http://127.0.0.1:8000/api/products/")
      .then((res) => res.json())
      .then(setProducts);
  }, []);

  // LOAD CART COUNT
  const loadCartCount = async () => {
    try {
      const res = await authFetch("/cart/");
      if (res && res.ok) {
        const data = await res.json();
        const totalItems = data.items.reduce(
          (sum, item) => sum + item.quantity,
          0,
        );
        setCartCount(totalItems);
      }
    } catch (err) {
      console.error(err);
    }
  };

  // INITIAL LOAD
  useEffect(() => {
    if (isLoggedIn()) loadCartCount();
  }, []);

  // ✅ REAL-TIME UPDATE (EVENT LISTENER)
  useEffect(() => {
    const updateCart = () => {
      loadCartCount();
    };

    window.addEventListener("cartUpdated", updateCart);

    return () => {
      window.removeEventListener("cartUpdated", updateCart);
    };
  }, []);

  // SEARCH
  useEffect(() => {
    if (!search.trim()) {
      setResults([]);
      return;
    }

    const filtered = products.filter((p) =>
      p.name.toLowerCase().includes(search.toLowerCase()),
    );

    setResults(filtered.slice(0, 5));
  }, [search, products]);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const goToProduct = (id) => {
    setSearch("");
    setResults([]);
    navigate(`/product/${id}`);
  };

  return (
    <nav className="bg-gray-900 text-white px-6 py-3 flex items-center justify-between sticky top-0 z-50 shadow">
      {/* LOGO */}
      <h2
        onClick={() => navigate("/")}
        className="text-2xl font-bold cursor-pointer"
      >
        🛒 ShopEasy
      </h2>

      {/* SEARCH */}
      <div className="relative w-1/3">
        <input
          type="text"
          placeholder="Search products..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full px-4 py-2 rounded text-black"
        />

        {/* RESULT BOX */}
        {search && (
          <div className="absolute bg-white text-black w-full mt-1 rounded shadow max-h-60 overflow-y-auto">
            {results.length > 0 ? (
              results.map((item) => (
                <div
                  key={item.id}
                  onClick={() => goToProduct(item.id)}
                  className="p-2 hover:bg-gray-100 cursor-pointer"
                >
                  {item.name}
                </div>
              ))
            ) : (
              <div className="p-2 text-red-500">Product not available ❌</div>
            )}
          </div>
        )}
      </div>

      {/* NAV LINKS */}
      <div className="flex items-center gap-6">
        <Link to="/" className="hover:text-gray-300">
          Home
        </Link>

        <Link to="/products" className="hover:text-gray-300">
          Products
        </Link>

        {/* CART */}
        <div
          className="flex items-center gap-1 cursor-pointer relative hover:text-gray-300"
          onClick={() => navigate("/cart")}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.8}
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M2.25 2.25h1.386a1.125 1.125 0 011.1.84l.383 1.532m0 0L6.75 12h10.5l1.5-6H5.119zm0 0L4.5 15h13.5m-13.5 0a1.5 1.5 0 103 0m10.5 0a1.5 1.5 0 103 0"
            />
          </svg>

          <span>Cart</span>

          {/* ✅ CART COUNT BADGE */}
          {cartCount > 0 && (
            <span className="absolute -top-2 -right-3 bg-red-500 text-xs px-2 py-[2px] rounded-full font-bold">
              {cartCount}
            </span>
          )}
        </div>

        {isLoggedIn() ? (
          <>
            <Link to="/orders" className="hover:text-gray-300">
              My Orders
            </Link>

            <Link to="/profile" className="hover:text-gray-300">
              Profile
            </Link>

            <button
              onClick={handleLogout}
              className="bg-red-500 px-3 py-1 rounded hover:bg-red-600"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="hover:text-gray-300">
              Login
            </Link>
            <Link to="/signup" className="hover:text-gray-300">
              Signup
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
