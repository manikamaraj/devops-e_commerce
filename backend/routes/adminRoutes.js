const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const Order = require('../models/Order');

// ============================================================
// ADMIN PRODUCT ROUTES
// ============================================================

/**
 * POST /api/admin/products
 * Create a new product
 */
router.post('/products', async (req, res) => {
  try {
    const { name, description, price, category, stock, image, rating } = req.body;

    // Server-side validation
    if (!name || !name.trim()) {
      return res.status(400).json({ message: 'Product name is required' });
    }
    if (!description || !description.trim()) {
      return res.status(400).json({ message: 'Product description is required' });
    }
    if (price === undefined || price === null || Number(price) < 0) {
      return res.status(400).json({ message: 'Price must be 0 or greater' });
    }
    if (!category || !category.trim()) {
      return res.status(400).json({ message: 'Category is required' });
    }
    if (stock !== undefined && Number(stock) < 0) {
      return res.status(400).json({ message: 'Stock cannot be negative' });
    }
    if (!image || !image.trim()) {
      return res.status(400).json({ message: 'Product image URL is required' });
    }

    const product = new Product({
      name: name.trim(),
      description: description.trim(),
      price: Number(price),
      category: category.trim(),
      stock: stock !== undefined ? Number(stock) : 0,
      image: image.trim(),
      rating: rating !== undefined ? Number(rating) : 0,
    });

    const savedProduct = await product.save();
    res.status(201).json(savedProduct);
  } catch (error) {
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((e) => e.message);
      return res.status(400).json({ message: messages.join('. ') });
    }
    console.error('Product creation error:', error);
    res.status(500).json({ message: 'Failed to create product' });
  }
});

/**
 * PUT /api/admin/products/:id
 * Update an existing product
 */
router.put('/products/:id', async (req, res) => {
  try {
    const { name, description, price, category, stock, image, rating } = req.body;

    // Server-side validation
    if (name !== undefined && !name.trim()) {
      return res.status(400).json({ message: 'Product name cannot be empty' });
    }
    if (description !== undefined && !description.trim()) {
      return res.status(400).json({ message: 'Product description cannot be empty' });
    }
    if (price !== undefined && Number(price) < 0) {
      return res.status(400).json({ message: 'Price must be 0 or greater' });
    }
    if (category !== undefined && !category.trim()) {
      return res.status(400).json({ message: 'Category cannot be empty' });
    }
    if (stock !== undefined && Number(stock) < 0) {
      return res.status(400).json({ message: 'Stock cannot be negative' });
    }
    if (image !== undefined && !image.trim()) {
      return res.status(400).json({ message: 'Image URL cannot be empty' });
    }

    const updateData = {};
    if (name !== undefined) updateData.name = name.trim();
    if (description !== undefined) updateData.description = description.trim();
    if (price !== undefined) updateData.price = Number(price);
    if (category !== undefined) updateData.category = category.trim();
    if (stock !== undefined) updateData.stock = Number(stock);
    if (image !== undefined) updateData.image = image.trim();
    if (rating !== undefined) updateData.rating = Number(rating);

    const product = await Product.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.json(product);
  } catch (error) {
    if (error.kind === 'ObjectId') {
      return res.status(400).json({ message: 'Invalid product ID' });
    }
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((e) => e.message);
      return res.status(400).json({ message: messages.join('. ') });
    }
    console.error('Product update error:', error);
    res.status(500).json({ message: 'Failed to update product' });
  }
});

/**
 * DELETE /api/admin/products/:id
 * Delete a product
 */
router.delete('/products/:id', async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    if (error.kind === 'ObjectId') {
      return res.status(400).json({ message: 'Invalid product ID' });
    }
    res.status(500).json({ message: 'Failed to delete product' });
  }
});

// ============================================================
// ADMIN ORDER ROUTES
// ============================================================

/**
 * PATCH /api/admin/orders/:id/status
 * Update order status
 */
router.patch('/orders/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    const validStatuses = ['Placed', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];

    if (!status || !validStatuses.includes(status)) {
      return res.status(400).json({
        message: `Invalid status. Must be one of: ${validStatuses.join(', ')}`,
      });
    }

    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    );

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    res.json(order);
  } catch (error) {
    if (error.kind === 'ObjectId') {
      return res.status(400).json({ message: 'Invalid order ID' });
    }
    res.status(500).json({ message: 'Failed to update order status' });
  }
});

module.exports = router;
