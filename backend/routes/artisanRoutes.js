const express = require('express');
const router = express.Router();
const Artisan = require('../models/Artisan');
const Product = require('../models/Product');
const Order = require('../models/Order');

// GET /api/artisans — List all registered artisans
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

// GET /api/artisans/:id — Get artisan by id
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

// GET /api/artisans/:id/dashboard — Return all products and incoming orders belonging to a specific artisan
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

// POST /api/artisans — Register a new artisan
router.post('/', async (req, res, next) => {
  try {
    const { name, phone, village, craftSpecialty, bio, yearsOfExperience, profileImage } = req.body;
    if (!name || !phone || !village || !craftSpecialty) {
      return res.status(400).json({
        success: false,
        error: { message: 'Name, phone, village, and craftSpecialty are required.', statusCode: 400 }
      });
    }

    const newArtisan = await Artisan.create({
      name,
      phone,
      village,
      craftSpecialty,
      bio,
      yearsOfExperience,
      profileImage
    });

    res.status(201).json({
      success: true,
      message: 'Artisan profile registered successfully',
      data: newArtisan
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
