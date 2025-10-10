const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth'); // your existing auth middleware
const Cart = require('../models/Cart');

// Add product to cart
router.post('/add', auth, async (req, res) => {
  const { productId, quantity = 1 } = req.body;
  const userId = req.user._id;

  try {
    let cart = await Cart.findOne({ user: userId });

    if (!cart) {
      cart = new Cart({ user: userId, items: [] });
    }

    // Check if product already exists
    const existingItem = cart.items.find(item => item.product.toString() === productId);
    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      cart.items.push({ product: productId, quantity });
    }

    await cart.save();
    res.json(cart);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to add product to cart' });
  }
});

// Get current user's cart
router.get('/', auth, async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id }).populate('items.product');
    res.json(cart || { items: [] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch cart' });
  }
});

// Remove item from cart
router.delete('/remove/:productId', auth, async (req, res) => {
  const { productId } = req.params;
  try {
    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) return res.status(404).json({ message: 'Cart not found' });

    cart.items = cart.items.filter(item => item.product.toString() !== productId);
    await cart.save();
    res.json(cart);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to remove item from cart' });
  }
});

module.exports = router;
