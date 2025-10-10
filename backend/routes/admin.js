const express = require('express');
const Product = require('../models/Product');
const User = require('../models/User');
const Subscription = require('../models/Subscription');
const auth = require('../middleware/auth');
const adminAuth = require('../middleware/adminAuth');
const Cart = require('../models/Cart');
const Payment = require("../models/Payment");

const router = express.Router();

/**
 * GET /admin/products
 * Get all products (admin view)
 */
router.get('/products', auth, adminAuth, async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/**
 * POST /admin/products
 * Add a new product
 */
router.post('/products', auth, adminAuth, async (req, res) => {
  try {
    const product = new Product(req.body);
    await product.save();
    res.status(201).json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/**
 * PUT /admin/products/:id
 * Update a product
 */
router.put('/products/:id', auth, adminAuth, async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/**
 * DELETE /admin/products/:id
 * Delete a product
 */
router.delete('/products/:id', auth, adminAuth, async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/**
 * GET /admin/users
 * Get all users (admin view) with cart and subscriptions
 */
router.get('/users', auth, adminAuth, async (req, res) => {
  try {
    const users = await User.find().sort({ createdAt: -1 }).select('-password');

    // Attach cart + subscriptions to each user
    const usersWithDetails = await Promise.all(
      users.map(async (user) => {
        // Fetch cart for this user
        const cart = await Cart.findOne({ user: user._id })
          .populate('items.product', 'name price brand');

        // Fetch subscriptions for this user
        const subscriptions = await Subscription.find({ user: user._id })
          .populate('product', 'name price brand');

        return {
          ...user.toObject(),
          cart: cart ? cart.items : [],
          subscriptions: subscriptions || []
        };
      })
    );

    res.json(usersWithDetails);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/**
 * DELETE /admin/users/:id
 * Delete a user (non-admin only)
 */
router.delete('/users/:id', auth, adminAuth, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    if (user.isAdmin) return res.status(403).json({ message: 'Cannot delete admin user' });

    await User.findByIdAndDelete(req.params.id);
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
/**
 * GET /admin/payments
 * Fetch all payments (admin view)
 */
router.get("/payments", auth, adminAuth, async (req, res) => {
  try {
    const payments = await Payment.find()
      .populate("user", "name email phone") // include user info
      .sort({ createdAt: -1 });

    res.json(payments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


module.exports = router;
