const express = require('express');
const router = express.Router();
const Product = require('../models/Product');

/**
 * GET /api/products/categories
 * Get all distinct categories from products collection
 */
router.get('/categories', async (req, res) => {
  try {
    const categories = await Product.distinct('category');
    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch categories' });
  }
});

/**
 * GET /api/products
 * Get all products with optional search and category filter
 * Query params: search, category
 */
router.get('/', async (req, res) => {
  try {
    const { search, category } = req.query;
    let filter = {};

    // Category filter
    if (category && category !== 'All') {
      filter.category = category;
    }

    // Search filter — case-insensitive regex on name and description
    if (search) {
      const searchRegex = new RegExp(search, 'i');
      filter.$or = [
        { name: searchRegex },
        { description: searchRegex },
      ];
    }

    const products = await Product.find(filter).sort({ createdAt: -1 });
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch products' });
  }
});

/**
 * GET /api/products/:id
 * Get a single product by ID
 */
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json(product);
  } catch (error) {
    // Handle invalid ObjectId format
    if (error.kind === 'ObjectId') {
      return res.status(400).json({ message: 'Invalid product ID' });
    }
    res.status(500).json({ message: 'Failed to fetch product' });
  }
});

module.exports = router;
