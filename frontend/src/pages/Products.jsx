import { useEffect, useState } from "react";
import api from "../api/axios";
import { createOrder } from "../api/orders";

export default function Products() {

    const handleBuy = async (id) => {
  try {
    const order = await createOrder(id);
    alert(`Order placed. Status: ${order.status}`);
  } catch {
    alert("Order failed");
  }
};

  const [products, setProducts] = useState([]);
  //setMessage("Order placed successfully");

  useEffect(() => {
    api.get("/products").then((res) => setProducts(res.data));
  }, []);

  return (
    <div>
      <h2>Products</h2>

      {products.map((product) => (
        <div key={product._id} style={{ border: "1px solid #ccc", margin: 10 }}>
          <h4>{product.title}</h4>
          <p>{product.description}</p>

          <p>
            Price: <strong>₹{product.dynamicPrice ?? product.price}</strong>
          </p>

         <button onClick={() => handleBuy(product._id)}>Buy Now</button>
        </div>
      ))}
    </div>
  );
}
