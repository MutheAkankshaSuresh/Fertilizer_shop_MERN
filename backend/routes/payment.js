const express = require('express');
const Razorpay = require('razorpay');
const Cart = require('../models/Cart');
const auth = require('../middleware/auth');
const Product = require('../models/Product'); // Adjust if your Product model is somewhere else

const router = express.Router();
const Payment = require("../models/Payment"); 

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// Create order for cart payment
router.post('/create-order', auth, async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user.id }).populate('items.product');

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: 'Cart is empty' });
    }

    // Calculate total cart amount
    let totalAmount = 0;
    cart.items.forEach(item => {
      totalAmount += item.product.price * item.quantity;
    });

    const options = {
      amount: totalAmount * 100, // convert to paisa
      currency: "INR",
      receipt: `order_rcptid_${Date.now()}`,
    };

    const order = await razorpay.orders.create(options);

    res.json({
      id: order.id,
      amount: order.amount,
      currency: order.currency,
      key_id: process.env.RAZORPAY_KEY_ID
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create order for single product (Buy Now)
router.post('/create-product-order', auth, async (req, res) => {
  try {
    const { productId } = req.body;
    const product = await Product.findById(productId);

    if (!product) return res.status(404).json({ message: 'Product not found' });

    const options = {
     amount: Number(product.price) * 100, // amount in paisa
      currency: 'INR',
      receipt: `order_${Date.now()}`,
    };

    const order = await razorpay.orders.create(options);

    res.json({
      id: order.id,
      amount: order.amount,
      currency: order.currency,
      key_id: process.env.RAZORPAY_KEY_ID,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

router.post("/save", auth, async (req, res) => {
  try {
    const { orderId, paymentId, signature, amount, currency, paymentMethod } = req.body;

    if (!req.user || !req.user._id) return res.status(401).json({ message: "Unauthorized" });

        const payment = new Payment({
        user: req.user._id,
        orderId,
        paymentId,
        signature,
        amount: amount, // keep in paisa
        currency,
        status: "success",
        paymentMethod
      });


    await payment.save();
    res.json({ message: "Payment saved successfully", payment });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});


module.exports = router;
