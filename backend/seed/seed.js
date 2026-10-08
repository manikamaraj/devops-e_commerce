/**
 * Seed script — populates MongoDB with realistic product data
 * Run with: npm run seed
 */

const mongoose = require('mongoose');
const path = require('path');

// Load environment variables
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

const Product = require('../models/Product');

const products = [
  // ── Electronics ──────────────────────────────────────────
  {
    name: 'Wireless Headphones',
    description:
      'Premium over-ear wireless headphones with active noise cancellation, 40-hour battery life, and ultra-comfortable memory foam ear cushions. Perfect for music, calls, and focused work.',
    price: 4999,
    category: 'Electronics',
    stock: 25,
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&q=80',
    rating: 4.5,
  },
  {
    name: 'Mechanical Keyboard',
    description:
      'Compact 75% mechanical keyboard with hot-swappable switches, RGB backlighting, and a premium aluminium frame. Ideal for developers and gamers alike.',
    price: 3499,
    category: 'Electronics',
    stock: 18,
    image: 'https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?w=600&q=80',
    rating: 4.7,
  },
  {
    name: 'Wireless Mouse',
    description:
      'Ergonomic wireless mouse with precision tracking, silent clicks, and a rechargeable battery that lasts up to 3 months. Works on any surface.',
    price: 1299,
    category: 'Electronics',
    stock: 40,
    image: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=600&q=80',
    rating: 4.3,
  },
  {
    name: 'Smart Watch',
    description:
      'Feature-rich smartwatch with AMOLED display, heart rate monitoring, GPS tracking, and 7-day battery life. Water resistant up to 50 meters.',
    price: 7999,
    category: 'Electronics',
    stock: 12,
    image: 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=600&q=80',
    rating: 4.4,
  },
  {
    name: 'Portable Bluetooth Speaker',
    description:
      'Compact waterproof Bluetooth speaker with 360° surround sound, 12-hour playtime, and a rugged design built for outdoor adventures.',
    price: 2499,
    category: 'Electronics',
    stock: 30,
    image: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=600&q=80',
    rating: 4.2,
  },
  {
    name: 'USB-C Hub',
    description:
      '7-in-1 USB-C hub with HDMI 4K output, 100W power delivery, SD card reader, and 3 USB 3.0 ports. Essential for modern laptops.',
    price: 1999,
    category: 'Electronics',
    stock: 35,
    image: 'https://images.unsplash.com/photo-1625842268584-8f3296236761?w=600&q=80',
    rating: 4.1,
  },
  {
    name: 'Laptop Stand',
    description:
      'Adjustable aluminium laptop stand with ventilated design for optimal airflow. Elevates your screen to eye level for better posture.',
    price: 1499,
    category: 'Electronics',
    stock: 22,
    image: 'https://images.unsplash.com/photo-1623251606108-512c7c4a3507?w=600&q=80',
    rating: 4.6,
  },

  // ── Clothing ─────────────────────────────────────────────
  {
    name: 'Classic Cotton T-Shirt',
    description:
      'Essential crew-neck t-shirt made from 100% premium cotton. Breathable, pre-shrunk fabric with a relaxed modern fit in timeless colors.',
    price: 799,
    category: 'Clothing',
    stock: 50,
    image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600&q=80',
    rating: 4.3,
  },
  {
    name: 'Oversized Hoodie',
    description:
      'Ultra-soft oversized hoodie with brushed fleece interior, kangaroo pocket, and adjustable drawstring hood. Your go-to comfort layer.',
    price: 1999,
    category: 'Clothing',
    stock: 28,
    image: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=600&q=80',
    rating: 4.6,
  },
  {
    name: 'Denim Jacket',
    description:
      'Classic indigo denim jacket with a modern slim fit. Features brass buttons, chest pockets, and a slightly washed finish for effortless style.',
    price: 2799,
    category: 'Clothing',
    stock: 15,
    image: 'https://images.unsplash.com/photo-1576995853123-5a10305d93c0?w=600&q=80',
    rating: 4.5,
  },
  {
    name: 'Casual Polo Shirt',
    description:
      'Smart-casual polo shirt crafted from breathable piqué cotton. Ribbed collar and cuffs with a tailored fit perfect for both office and weekends.',
    price: 1299,
    category: 'Clothing',
    stock: 35,
    image: 'https://plus.unsplash.com/premium_photo-1763898811209-8b4e23994040?w=600&q=80',
    rating: 4.2,
  },
  {
    name: 'Relaxed Fit Shirt',
    description:
      'Lightweight relaxed-fit shirt in soft linen-cotton blend. Features a clean spread collar, chest pocket, and a comfortable loose silhouette perfect for warm days.',
    price: 1499,
    category: 'Clothing',
    stock: 32,
    image: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=600&q=80',
    rating: 4.4,
  },

  // ── Accessories ──────────────────────────────────────────
  {
    name: 'Urban Backpack',
    description:
      'Water-resistant urban backpack with padded laptop compartment, hidden anti-theft pocket, and ergonomic straps. 25L capacity for daily carry.',
    price: 2499,
    category: 'Accessories',
    stock: 20,
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&q=80',
    rating: 4.4,
  },
  {
    name: 'Polarized Sunglasses',
    description:
      'UV400 polarized sunglasses with lightweight titanium frame and anti-scratch lenses. Reduces glare for clear, comfortable vision.',
    price: 1799,
    category: 'Accessories',
    stock: 30,
    image: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=600&q=80',
    rating: 4.3,
  },
  {
    name: 'Leather Wallet',
    description:
      'Slim bi-fold wallet handcrafted from genuine leather. Features RFID-blocking technology, 6 card slots, and a bill compartment.',
    price: 999,
    category: 'Accessories',
    stock: 45,
    image: 'https://images.unsplash.com/photo-1627123424574-724758594e93?w=600&q=80',
    rating: 4.5,
  },
  {
    name: 'Minimalist Watch',
    description:
      'Elegant minimalist analog watch with a Japanese quartz movement, sapphire crystal glass, and a genuine leather strap. Water resistant to 30m.',
    price: 3999,
    category: 'Accessories',
    stock: 14,
    image: 'https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=600&q=80',
    rating: 4.7,
  },
  {
    name: 'Travel Organizer',
    description:
      'Compact travel organizer with dedicated compartments for cables, chargers, passport, and accessories. Durable nylon shell with water-resistant lining.',
    price: 899,
    category: 'Accessories',
    stock: 38,
    image: 'https://images.unsplash.com/photo-1553531384-cc64ac80f931?w=600&q=80',
    rating: 4.1,
  },
];

async function seed() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB.');

    // Clear existing products
    await Product.deleteMany({});
    console.log('Cleared existing products.');

    // Insert seed data
    const inserted = await Product.insertMany(products);
    console.log(`Successfully inserted ${inserted.length} products.`);

    await mongoose.connection.close();
    console.log('Database connection closed.');
    process.exit(0);
  } catch (error) {
    console.error('Seed error:', error.message);
    process.exit(1);
  }
}

seed();
