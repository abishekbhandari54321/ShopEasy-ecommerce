import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import ProductList from "./pages/ProductList";
import ProductDetails from "./pages/ProductDetails";
import Navbar from "./components/Navbar";
import CartPage from "./pages/CartPage";
import CheckoutPage from "./pages/CheckoutPage";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Profile from "./pages/Profile";
import PrivateRouter from "./components/PrivateRouter";
import HomePage from "./pages/HomePage";
import OrderHistory from "./pages/OrderHistory";
import ScrollToTop from "./components/ScrollToTop";

function App() {
  return (
    <Router>
      {/*  ADD THIS LINE */}
      <ScrollToTop />

      <Navbar />

      <Routes>
        {/* Homepage */}
        <Route path="/" element={<HomePage />} />

        {/* Products Page */}
        <Route path="/products" element={<ProductList />} />

        {/* Order History */}
        <Route path="/orders" element={<OrderHistory />} />

        <Route path="/product/:id" element={<ProductDetails />} />
        <Route path="/cart" element={<CartPage />} />

        <Route element={<PrivateRouter />}>
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/profile" element={<Profile />} />
        </Route>

        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
      </Routes>
    </Router>
  );
}

export default App;
