const express = require('express');
const router = express.Router();
const Artisan = require('../models/Artisan');
const Product = require('../models/Product');
const Order = require('../models/Order');

// 1. GET /api/artisans — List all registered artisans
router.get('/', async (req, res, next) => {
  try {
    const artisans = await Artisan.find(req.query);
    res.json({
      success: true,
      count: artisans.length,
      data: artisans
    });
  } catch (err) {
    next(err);
  }
});

// 2. POST /api/artisans/send-otp — Request simulated OTP for mobile login
router.post('/send-otp', async (req, res, next) => {
  try {
    const { phone } = req.body;
    if (!phone) {
      return res.status(400).json({
        success: false,
        error: { message: 'Mobile phone number is required.', statusCode: 400 }
      });
    }

    const cleanInput = phone.toString().replace(/\D/g, '').slice(-10);
    if (cleanInput.length < 10) {
      return res.status(400).json({
        success: false,
        error: { message: 'Please provide a valid 10-digit mobile number.', statusCode: 400 }
      });
    }

    const artisan = await Artisan.findByPhone(phone);
    if (!artisan) {
      return res.status(404).json({
        success: false,
        error: {
          message: 'No registered artisan found with this mobile number. Please register your artisan profile to continue.',
          statusCode: 404,
          requiresRegistration: true
        }
      });
    }

    // Demo OTP is 1234 for instant testing and demonstration
    const demoOtp = '1234';

    res.json({
      success: true,
      message: `OTP sent successfully to registered mobile ${artisan.phone}.`,
      demoOtp,
      data: {
        id: artisan.id,
        name: artisan.name,
        kannadaName: artisan.kannadaName || '',
        phone: artisan.phone,
        village: artisan.village,
        craftSpecialty: artisan.craftSpecialty
      }
    });
  } catch (err) {
    next(err);
  }
});

// 3. POST /api/artisans/login — Authenticate artisan via phone + OTP or 1-click artisanId
router.post('/login', async (req, res, next) => {
  try {
    const { phone, otp, artisanId } = req.body;

    let artisan = null;

    if (artisanId) {
      artisan = await Artisan.findById(artisanId);
    } else if (phone) {
      artisan = await Artisan.findByPhone(phone);
    } else {
      return res.status(400).json({
        success: false,
        error: { message: 'Mobile phone number or artisan ID is required.', statusCode: 400 }
      });
    }

    if (!artisan) {
      return res.status(404).json({
        success: false,
        error: {
          message: 'Artisan profile not found. Please verify your phone number or register as a new artisan.',
          statusCode: 404,
          requiresRegistration: true
        }
      });
    }

    // If OTP was provided in phone mode, verify it (demo OTP '1234' or any valid 4-digit OTP)
    if (phone && otp) {
      const cleanOtp = otp.toString().trim();
      if (cleanOtp.length < 4) {
        return res.status(400).json({
          success: false,
          error: { message: 'Please enter a valid 4-digit OTP (e.g. 1234).', statusCode: 400 }
        });
      }
      // Demo validation: accept '1234' or 4-digit code
      if (cleanOtp !== '1234' && !/^\d{4,6}$/.test(cleanOtp)) {
        return res.status(401).json({
          success: false,
          error: { message: 'Invalid OTP entered. Please use demo OTP 1234.', statusCode: 401 }
        });
      }
    }

    const token = `artisan_jwt_${artisan.id}_${Date.now()}`;

    res.json({
      success: true,
      message: `Namaskara, ${artisan.name}! Logged in successfully.`,
      token,
      data: artisan
    });
  } catch (err) {
    next(err);
  }
});

// 4. GET /api/artisans/me — Fetch currently authenticated artisan profile
router.get('/me', async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    const queryId = req.query.artisanId;
    let artisanId = queryId;

    if (!artisanId && authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.split(' ')[1];
      const match = token.match(/artisan_jwt_([a-zA-Z0-9_]+)_\d+/);
      if (match) artisanId = match[1];
    }

    if (!artisanId) {
      return res.status(401).json({
        success: false,
        error: { message: 'Not authenticated as an artisan.', statusCode: 401 }
      });
    }

    const artisan = await Artisan.findById(artisanId);
    if (!artisan) {
      return res.status(404).json({
        success: false,
        error: { message: 'Artisan not found.', statusCode: 404 }
      });
    }

    res.json({
      success: true,
      data: artisan
    });
  } catch (err) {
    next(err);
  }
});

// 5. POST /api/artisans — Register a new artisan
router.post('/', async (req, res, next) => {
  try {
    const { name, kannadaName, phone, village, craftSpecialty, bio, yearsOfExperience, profileImage, firstName, lastName } = req.body;
    const resolvedName = name || `${firstName || ''} ${lastName || ''}`.trim() || firstName || '';
    if (!resolvedName || !phone || !village || !craftSpecialty) {
      return res.status(400).json({
        success: false,
        error: { message: 'First Name/Name, phone, village, and craftSpecialty are required.', statusCode: 400 }
      });
    }

    // Check if phone already registered
    const existing = await Artisan.findByPhone(phone);
    if (existing) {
      const token = `artisan_jwt_${existing.id}_${Date.now()}`;
      return res.status(200).json({
        success: true,
        message: `Welcome back, ${existing.name}! Phone number already registered. Logged in directly.`,
        token,
        data: existing
      });
    }

    const newArtisan = await Artisan.create({
      name: resolvedName,
      firstName: firstName || '',
      lastName: lastName || '',
      kannadaName: kannadaName || lastName || '',
      phone,
      village,
      craftSpecialty,
      bio: bio || '',
      yearsOfExperience: Number(yearsOfExperience) || 0,
      profileImage: profileImage || 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=600&q=80'
    });

    const token = `artisan_jwt_${newArtisan.id}_${Date.now()}`;

    res.status(201).json({
      success: true,
      message: `Artisan profile registered successfully! Welcome, ${newArtisan.name}.`,
      token,
      data: newArtisan
    });
  } catch (err) {
    next(err);
  }
});

// 6. GET /api/artisans/:id/dashboard — Return all products and incoming orders belonging to a specific artisan
router.get('/:id/dashboard', async (req, res, next) => {
  try {
    const artisanId = req.params.id;
    const artisan = await Artisan.findById(artisanId);
    if (!artisan) {
      return res.status(404).json({
        success: false,
        error: { message: `Artisan with id "${artisanId}" not found`, statusCode: 404 }
      });
    }

    // Products by this artisan
    const products = await Product.find({ artisanId }, { populateArtisan: false });

    // Incoming orders containing products belonging to this artisan
    const orders = await Order.findByArtisanId(artisanId);

    // Calculate helpful statistics for the dashboard
    const totalEarnings = orders.reduce((sum, order) => sum + (order.artisanSubtotal || 0), 0);
    const pendingOrdersCount = orders.filter(o => o.orderStatus === 'Accepted' || o.orderStatus === 'Pending').length;
    const completedOrdersCount = orders.filter(o => o.orderStatus === 'Delivered').length;

    res.json({
      success: true,
      data: {
        artisan,
        metrics: {
          totalProducts: products.length,
          totalOrders: orders.length,
          pendingOrdersCount,
          completedOrdersCount,
          totalEarningsINR: totalEarnings
        },
        products,
        orders
      }
    });
  } catch (err) {
    next(err);
  }
});

// 7. GET /api/artisans/:id — Get artisan by id
router.get('/:id', async (req, res, next) => {
  try {
    const artisan = await Artisan.findById(req.params.id);
    if (!artisan) {
      return res.status(404).json({
        success: false,
        error: { message: `Artisan with id "${req.params.id}" not found`, statusCode: 404 }
      });
    }

    res.json({
      success: true,
      data: artisan
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
