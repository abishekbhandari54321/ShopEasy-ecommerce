import { Link } from "react-router-dom";

function ProductCard({ product }) {
  return (
    <Link to={`/product/${product.id}`}>
      <div className="bg-white shadow rounded-xl p-4 hover:shadow-lg transition">
        <div className="h-52 bg-gray-100 flex items-center justify-center rounded overflow-hidden">
          <img
            src={product.image}
            alt={product.name}
            className="h-full w-full object-contain"
            onError={(e) => {
              e.target.src = "https://via.placeholder.com/200";
            }}
          />
        </div>

        <h2 className="mt-3 font-semibold text-gray-800">{product.name}</h2>

        <p className="text-green-600 font-bold">₹{product.price}</p>
      </div>
    </Link>
  );
}

export default ProductCard;
