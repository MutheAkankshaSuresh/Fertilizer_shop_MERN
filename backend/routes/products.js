const express = require('express');
const Product = require('../models/Product');
const router = express.Router();

// Get all products with optional filtering
router.get('/', async (req, res) => {
  try {
    const { crop, category, season, price, sortBy } = req.query;
    let query = {};
    
    if (crop) query.tags = { $in: [new RegExp(crop, 'i')] };
    if (category) query.category = new RegExp(category, 'i');
    if (season) query.tags = { $in: [new RegExp(season, 'i')] };
    if (price) {
      const [min, max] = price.split('-').map(Number);
      query.price = { $gte: min, $lte: max };
    }
    
    let products = Product.find(query);
    
    if (sortBy === 'price-low') {
      products = products.sort({ price: 1 });
    } else if (sortBy === 'new') {
      products = products.sort({ createdAt: -1 });
    }
    
    const result = await products.exec();
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get single product
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;