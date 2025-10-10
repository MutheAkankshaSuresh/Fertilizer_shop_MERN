import React from "react";
import { useCart } from "../context/CartContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const CheckoutPage = () => {
  const { cart, clearCart } = useCart();
  const navigate = useNavigate();

  const total = cart.reduce((acc, p) => acc + p.price * p.qty, 0);

  const handlePayment = async () => {
    try {
      // 1️⃣ Create order on backend
      const response = await axios.post(
        "http://localhost:5000/api/payment/create-product-order",
        { productId: cart[0]?._id },
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
      );

      const orderData = response.data;

      // 2️⃣ Razorpay options
      const options = {
        key: orderData.key_id,
        amount: orderData.amount, // keep in paisa
        currency: orderData.currency,
        name: "Fertilizer Shop",
        description: "Purchase",
        order_id: orderData.id,
        handler: async function (razorpayResp) {
          try {
            // 3️⃣ Save payment to backend
            const payload = {
              orderId: razorpayResp.razorpay_order_id,
              paymentId: razorpayResp.razorpay_payment_id,
              signature: razorpayResp.razorpay_signature, // ✅ add signature
              amount: orderData.amount, // in paisa
              currency: orderData.currency,
              paymentMethod: "Netbanking",
            };

            await axios.post(
              "http://localhost:5000/api/payment/save",
              payload,
              { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
            );

            alert(`Payment successful! Payment ID: ${razorpayResp.razorpay_payment_id}`);
            clearCart();
            navigate("/products");
          } catch (err) {
            console.error("Failed to save payment:", err);
            alert("Payment succeeded but failed to save in database.");
          }
        },
        prefill: {
          name: "Customer Name",
          email: "customer@example.com",
          contact: "9999999999",
        },
        theme: { color: "#3399cc" },
      };

      // 4️⃣ Open Razorpay checkout
      const rzp = new window.Razorpay(options);
      rzp.open();

      rzp.on("payment.failed", function (response) {
        console.error("Payment failed:", response.error);
        alert("Payment failed ❌ Please try again.");
      });
    } catch (error) {
      console.error("Payment failed:", error.response || error);
      alert("Payment failed ❌ Check console for details");
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Checkout</h1>
      <ul>
        {cart.map((p) => (
          <li key={p._id}>
            {p.name} x {p.qty} = ₹{p.price * p.qty}
          </li>
        ))}
      </ul>
      <h2>Total: ₹{total}</h2>
      <button onClick={handlePayment}>Pay Now</button>
    </div>
  );
};

export default CheckoutPage;
