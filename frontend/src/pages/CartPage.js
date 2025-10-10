import React from "react";
import { useCart } from "../context/CartContext";
import { Link, useNavigate } from "react-router-dom";

const CartPage = () => {
  const { cart, removeFromCart, updateQty, clearCart } = useCart();
  const navigate = useNavigate();

  const total = cart.reduce((acc, p) => acc + p.price * p.qty, 0);

  return (
    <div style={{ padding: "20px" }}>
      <h1>Your Cart</h1>
      {cart.length === 0 ? (
        <p>Cart is empty. <Link to="/products">Go shopping</Link></p>
      ) : (
        <>
          {cart.map((p) => (
            <div key={p._id} style={{ marginBottom: "15px" }}>
              <h3>{p.name}</h3>
              <p>₹{p.price} x {p.qty}</p>
              <button onClick={() => updateQty(p._id, p.qty + 1)}>+</button>
              <button onClick={() => updateQty(p._id, p.qty - 1)}>–</button>
              <button onClick={() => removeFromCart(p._id)}>Remove</button>
            </div>
          ))}
          <h2>Total: ₹{total}</h2>
          <button onClick={() => navigate("/checkout")}>Proceed to Payment</button>
          <button onClick={clearCart}>Clear Cart</button>
        </>
      )}
    </div>
  );
};

export default CartPage;
