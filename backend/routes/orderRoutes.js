const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const Product = require('../models/Product');

/**
 * POST /api/orders
 * Place a new order
 * - Validates customer info and cart items
 * - Looks up each product in MongoDB and verifies stock
 * - Calculates total on the SERVER (never trusts frontend total)
 * - Reduces product stock
 * - Saves order to MongoDB
 */
router.post('/', async (req, res) => {
  try {
    const { customer, items } = req.body;

    // Validate customer fields
    if (!customer) {
      return res.status(400).json({ message: 'Customer details are required' });
    }
    const { name, email, address, city, pincode } = customer;
    if (!name || !name.trim()) {
      return res.status(400).json({ message: 'Customer name is required' });
    }
    if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
      return res.status(400).json({ message: 'A valid email address is required' });
    }
    if (!address || !address.trim()) {
      return res.status(400).json({ message: 'Delivery address is required' });
    }
    if (!city || !city.trim()) {
      return res.status(400).json({ message: 'City is required' });
    }
    if (!pincode || !pincode.trim()) {
      return res.status(400).json({ message: 'Pincode is required' });
    }

    // Validate items
    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: 'Cart cannot be empty' });
    }

    // Look up each product and build order items on the server
    let totalAmount = 0;
    const orderItems = [];

    for (const item of items) {
      if (!item.productId) {
        return res.status(400).json({ message: 'Product ID is required for each item' });
      }

      const product = await Product.findById(item.productId);
      if (!product) {
        return res.status(404).json({ message: `Product not found: ${item.productId}` });
      }

      const quantity = parseInt(item.quantity, 10);
      if (!quantity || quantity < 1) {
        return res.status(400).json({ message: `Invalid quantity for ${product.name}` });
      }

      if (product.stock < quantity) {
        return res.status(400).json({
          message: `Insufficient stock for ${product.name}. Available: ${product.stock}`,
        });
      }

      // Use server-side price (never trust frontend)
      const itemTotal = product.price * quantity;
      totalAmount += itemTotal;

      orderItems.push({
        productId: product._id,
        name: product.name,
        price: product.price,
        quantity: quantity,
        image: product.image,
      });
    }

    // Create the order
    const order = new Order({
      customer: {
        name: name.trim(),
        email: email.trim().toLowerCase(),
        address: address.trim(),
        city: city.trim(),
        pincode: pincode.trim(),
      },
      items: orderItems,
      totalAmount,
      paymentMethod: 'Online Payment',
      paymentStatus: 'Paid',
      status: 'Placed',
    });

    const savedOrder = await order.save();

    // Reduce product stock after successful order creation
    for (const item of orderItems) {
      await Product.findByIdAndUpdate(item.productId, {
        $inc: { stock: -item.quantity },
      });
    }

    res.status(201).json(savedOrder);
  } catch (error) {
    if (error.kind === 'ObjectId') {
      return res.status(400).json({ message: 'Invalid product ID in cart' });
    }
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((e) => e.message);
      return res.status(400).json({ message: messages.join('. ') });
    }
    console.error('Order creation error:', error);
    res.status(500).json({ message: 'Failed to place order' });
  }
});

/**
 * GET /api/orders/admin/all
 * Get all orders (admin view) — sorted newest first
 */
router.get('/admin/all', async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch orders' });
  }
});

/**
 * GET /api/orders/:id
 * Get a single order by ID
 */
router.get('/:id', async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    res.json(order);
  } catch (error) {
    if (error.kind === 'ObjectId') {
      return res.status(400).json({ message: 'Invalid order ID' });
    }
    res.status(500).json({ message: 'Failed to fetch order' });
  }
});

/**
 * GET /api/orders?email=user@example.com
 * Get orders by customer email
 */
router.get('/', async (req, res) => {
  try {
    const { email } = req.query;
    if (!email) {
      return res.status(400).json({ message: 'Email is required to look up orders' });
    }

    const orders = await Order.find({ 'customer.email': email.toLowerCase().trim() }).sort({
      createdAt: -1,
    });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch orders' });
  }
});

module.exports = router;
