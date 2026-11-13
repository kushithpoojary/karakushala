const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const path = require('path');
const { errorHandler, notFoundHandler } = require('./middleware/errorHandler');

const productRoutes = require('./routes/productRoutes');
const artisanRoutes = require('./routes/artisanRoutes');
const orderRoutes = require('./routes/orderRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(morgan('dev'));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Serve static uploaded files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Serve frontend static build if available
const frontendDistPath = path.join(__dirname, '..', 'frontend', 'dist');
if (require('fs').existsSync(frontendDistPath)) {
  app.use(express.static(frontendDistPath));
}

// Health check and API discovery
app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    service: 'KaraKushala Artisan Marketplace API',
    version: '1.0.0'
  });
});

app.get('/api', (req, res) => {
  res.json({
    name: 'KaraKushala REST API',
    description: 'Empowering Kasuti embroidery and Beedu craft artisans of Karnataka',
    endpoints: {
      products: {
        'GET /api/products': 'Fetch all products with optional query filters (category, artisanId, inStock)',
        'GET /api/products/:id': 'Fetch single product details with artisan profile and craft story',
        'POST /api/products': 'Create a new product listing (multipart image or imageUrl body)'
      },
      artisans: {
        'GET /api/artisans': 'List all registered artisans',
        'GET /api/artisans/:id': 'Fetch artisan profile details',
        'GET /api/artisans/:id/dashboard': 'Return all products and incoming orders for specific artisan',
        'POST /api/artisans/send-otp': 'Send demo OTP to artisan mobile number for authentication',
        'POST /api/artisans/login': 'Authenticate artisan with phone + OTP or quick artisanId',
        'GET /api/artisans/me': 'Get currently logged-in artisan profile',
        'POST /api/artisans': 'Register a new artisan profile'
      },
      orders: {
        'GET /api/orders': 'List all orders with optional orderStatus filter',
        'GET /api/orders/:id': 'Get single order details',
        'POST /api/orders': 'Create order, validate stock, decrement stockQuantity, return mock UPI receipt',
        'PATCH /api/orders/:id/status': 'Update order status (Accepted -> Shipped -> Delivered)'
      }
    }
  });
});

// Mount Routes
app.use('/api/products', productRoutes);
app.use('/api/artisans', artisanRoutes);
app.use('/api/orders', orderRoutes);

// SPA Fallback for client-side routing
app.get('*', (req, res, next) => {
  if (req.path.startsWith('/api') || req.path.startsWith('/uploads')) {
    return next();
  }
  const indexPath = path.join(frontendDistPath, 'index.html');
  if (require('fs').existsSync(indexPath)) {
    return res.sendFile(indexPath);
  }
  next();
});

// Error Handling
app.use(notFoundHandler);
app.use(errorHandler);

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`=======================================================`);
    console.log(` KaraKushala RESTful Backend running on port ${PORT}`);
    console.log(` API Documentation & Health: http://localhost:${PORT}/api`);
    console.log(` Products endpoint: http://localhost:${PORT}/api/products`);
    console.log(`=======================================================`);
  });
}

module.exports = app;
