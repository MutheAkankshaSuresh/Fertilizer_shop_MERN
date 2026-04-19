import React from "react";
import axios from "axios";
import { apiUrl } from "../api";

const PaymentPage = () => {

  const loadRazorpay = () => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handlePayment = async () => {
    try {
      const res = await loadRazorpay();
      if (!res) {
        alert("Razorpay SDK failed to load. Check your internet connection.");
        return;
      }

      // Create order
      const { data } = await axios.post(
        apiUrl("/api/payment/create-order"),
        {},
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
      );

      const options = {
        key: data.key_id,
        amount: data.amount, // keep in paisa
        currency: data.currency,
        name: "Fertilizer Shop",
        description: "Cart Payment",
        order_id: data.id,
        handler: async function (razorpayResp) {
          try {
            const payload = {
              orderId: razorpayResp.razorpay_order_id,
              paymentId: razorpayResp.razorpay_payment_id,
              signature: razorpayResp.razorpay_signature, // ✅ add signature
              amount: data.amount, // in paisa
              currency: data.currency,
              paymentMethod: "Netbanking",
            };

            await axios.post(
              apiUrl("/api/payment/save"),
              payload,
              { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
            );

            alert("Payment successful ✅ " + razorpayResp.razorpay_payment_id);
          } catch (err) {
            console.error(err);
            alert("Payment succeeded but could not save in database.");
          }
        },
        prefill: {
          name: "Akanksha",
          email: "akanksha@example.com",
          contact: "9999999999"
        },
        theme: { color: "#3399cc" }
      };

      const rzp = new window.Razorpay(options);
      rzp.open();

      rzp.on("payment.failed", function (response) {
        console.error("Payment failed:", response.error);
        alert("Payment failed ❌ Please try again.");
      });

    } catch (err) {
      console.error(err);
      alert("Payment failed ❌");
    }
  };

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h2>Proceed to Payment</h2>
      <button
        onClick={handlePayment}
        style={{
          padding: "12px 24px",
          background: "green",
          color: "white",
          border: "none",
          borderRadius: "6px",
          cursor: "pointer"
        }}
      >
        Pay Now
      </button>
    </div>
  );
};

export default PaymentPage;
