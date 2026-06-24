return (
  <div className="p-6 max-w-5xl mx-auto">
    <h2 className="text-2xl font-bold mb-6">Your Cart</h2>

    {cart?.items?.map((item) => (
      <div
        key={item.id}
        className="flex items-center gap-6 bg-white p-4 rounded-lg shadow mb-4"
      >
        <img
          src={item.product_image}
          className="w-24 h-24 object-cover rounded"
        />

        <div className="flex-1">
          <h3 className="font-semibold">{item.product_name}</h3>
          <p className="text-gray-600">₹{item.product_price}</p>
          <p className="text-sm">Qty: {item.quantity}</p>
        </div>

        <button
          onClick={() => removeFromCart(item.id)}
          className="bg-red-500 text-white px-4 py-1 rounded hover:bg-red-600"
        >
          Remove
        </button>
      </div>
    ))}

    <div className="text-right mt-6">
      <h2 className="text-xl font-bold">Total: ₹{cart?.total}</h2>
    </div>
  </div>
);
