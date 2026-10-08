# NovaCart

**Good products. Simple shopping.**

NovaCart is a full-stack e-commerce web application built with Node.js, Express.js, MongoDB, and vanilla JavaScript. It features a professional UI, complete product catalog, shopping cart, checkout, order history, and an admin dashboard.

---

## Features

### Customer Features
- Browse and search products
- Filter products by category
- View product details
- Add to cart with quantity selection
- Shopping cart with quantity management
- Professional checkout experience
- Order confirmation
- Order history lookup by email

### Admin Features
- Product management (add, edit, delete)
- Update price, stock, category, description, image
- Order management with status updates
- View customer details and ordered products

---

## Technology Stack

| Layer | Technology |
|-------|-----------|
| Frontend | HTML5, CSS3, Bootstrap 5, Vanilla JavaScript |
| Backend | Node.js, Express.js |
| Database | MongoDB, Mongoose |
| Dev Tools | Nodemon, dotenv, CORS |

---

## Architecture

```
Browser (HTML/CSS/JS)
    ↕ Fetch API (REST)
Express.js Server (Port 5000)
    ↕ Mongoose ODM
MongoDB (simple_store database)
```

The Express server serves the frontend as static files and exposes REST APIs under `/api/`. The frontend communicates with the backend exclusively through these APIs. All data is persisted in MongoDB.

---

## Folder Structure

```
novacart/
├── backend/
│   ├── server.js              # Express server entry point
│   ├── package.json
│   ├── .env                   # Environment variables
│   ├── .env.example
│   ├── config/
│   │   └── db.js              # MongoDB connection
│   ├── models/
│   │   ├── Product.js         # Product Mongoose model
│   │   └── Order.js           # Order Mongoose model
│   ├── routes/
│   │   ├── productRoutes.js   # Product API routes
│   │   ├── orderRoutes.js     # Order API routes
│   │   └── adminRoutes.js     # Admin API routes
│   └── seed/
│       └── seed.js            # Database seed script
├── frontend/
│   ├── index.html             # Home / Product Catalog
│   ├── product.html           # Product Details
│   ├── cart.html              # Shopping Cart
│   ├── checkout.html          # Checkout + Order Confirmation
│   ├── orders.html            # Order History
│   ├── admin.html             # Admin Dashboard
│   ├── css/
│   │   └── style.css          # Global stylesheet
│   └── js/
│       ├── common.js          # Shared utilities (Cart, API, formatting)
│       ├── products.js        # Home page logic
│       ├── product.js         # Product detail logic
│       ├── cart.js            # Cart page logic
│       ├── checkout.js        # Checkout logic
│       ├── orders.js          # Order history logic
│       └── admin.js           # Admin dashboard logic
└── README.md
```

---

## MongoDB Setup

1. Install MongoDB Community Edition from [mongodb.com](https://www.mongodb.com/try/download/community)
2. Start the MongoDB service:
   ```bash
   # Windows
   net start MongoDB

   # macOS/Linux
   sudo systemctl start mongod
   ```
3. Verify MongoDB is running:
   ```bash
   mongosh
   ```

---

## Environment Variables

Create a `.env` file in the `backend/` directory:

```env
MONGO_URI=mongodb://127.0.0.1:27017/simple_store
PORT=5000
```

A `.env.example` file is provided as a template.

---

## Installation

```bash
# Navigate to the backend directory
cd novacart/backend

# Install dependencies
npm install
```

---

## Seeding the Database

Populate the database with 17 realistic products:

```bash
cd novacart/backend
npm run seed
```

This will:
1. Connect to MongoDB
2. Clear the existing products collection
3. Insert 17 products across Electronics, Clothing, and Accessories
4. Print how many products were inserted

---

## Running the Application

```bash
cd novacart/backend
npm run dev
```

The application will start at: **http://localhost:5000**

Admin dashboard: **http://localhost:5000/admin.html**

---

## API Endpoints

### Products

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/products` | Get all products |
| GET | `/api/products/:id` | Get product by ID |
| GET | `/api/products/categories` | Get all categories |
| GET | `/api/products?search=headphones` | Search products |
| GET | `/api/products?category=Electronics` | Filter by category |

### Orders

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/orders` | Place a new order |
| GET | `/api/orders?email=user@example.com` | Get orders by email |
| GET | `/api/orders/:id` | Get order by ID |
| GET | `/api/orders/admin/all` | Get all orders (admin) |

### Admin

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/admin/products` | Create product |
| PUT | `/api/admin/products/:id` | Update product |
| DELETE | `/api/admin/products/:id` | Delete product |
| PATCH | `/api/admin/orders/:id/status` | Update order status |

### Health

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/health` | Health check |

---

## Testing the Application

1. **Start the server**: `npm run dev`
2. **Open**: http://localhost:5000
3. **Browse products**: Search and filter
4. **Add to cart**: Click "Add" on product cards
5. **Review cart**: Adjust quantities
6. **Checkout**: Fill in details, click "Place Order"
7. **Order confirmation**: Verify order details
8. **Order history**: Look up orders using your email
9. **Admin dashboard**: http://localhost:5000/admin.html
   - Add/edit/delete products
   - View and update order statuses

---

## Order Placement Flow

1. Customer fills checkout form → frontend sends POST to `/api/orders`
2. Backend validates customer details and cart items
3. Backend looks up each product in MongoDB
4. Backend verifies stock availability
5. Backend calculates total on the server (never trusts frontend)
6. Backend creates the order document
7. Backend reduces product stock
8. Backend returns the created order
9. Frontend clears cart and shows confirmation

---

## License

This project is for educational purposes.
