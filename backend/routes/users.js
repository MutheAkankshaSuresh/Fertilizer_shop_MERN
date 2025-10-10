const express = require('express');
const Subscription = require('../models/Subscription');
const auth = require('../middleware/auth');
const router = express.Router();
const User = require('../models/User'); 

// Subscribe to product notifications
router.post('/subscribe', auth, async (req, res) => {
  try {
    const { productId } = req.body;
    const userId = req.user._id;

    const existingSubscription = await Subscription.findOne({ user: userId, product: productId });
    if (existingSubscription) {
      return res.status(400).json({ message: 'Already subscribed to this product' });
    }

    const subscription = new Subscription({ user: userId, product: productId });
    await subscription.save();

    res.status(201).json({ message: 'Subscription created successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get user's subscriptions
router.get('/subscriptions', auth, async (req, res) => {
  try {
    const subscriptions = await Subscription.find({ user: req.user._id })
      .populate('product', 'name brand price image stock')
      .sort({ createdAt: -1 });
    res.json(subscriptions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get user profile
router.get('/profile', auth, async (req, res) => {
  try {
    res.json(req.user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update user profile
// Update user profile
router.put('/profile', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check duplicate email
    if (req.body.email && req.body.email !== user.email) {
      const existingUser = await User.findOne({ email: req.body.email });
      if (existingUser) {
        return res.status(400).json({ message: 'Email already in use' });
      }
      user.email = req.body.email;
    }

    // Update fields
    user.name = req.body.name ?? user.name;
    user.phone = req.body.phone ?? user.phone;
    user.cropPreferences = req.body.cropPreferences ?? user.cropPreferences;

    // Handle password properly
    if (req.body.password) {
      user.password = req.body.password; // will be hashed by pre('save')
    }

    await user.save();

    res.json({
      message: 'Profile updated successfully',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        cropPreferences: user.cropPreferences
      }
    });
  } catch (error) {
    console.error('Profile update error:', error);
    res.status(500).json({ message: error.message });
  }
});



module.exports = router;