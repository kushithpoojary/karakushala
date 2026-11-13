const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const Artisan = require('../models/Artisan');
const upload = require('../middleware/upload');

// GET /api/products — Fetch all products with optional query filters for category and artisanId, populating artisan details
router.get('/', async (req, res, next) => {
  try {
    const { category, artisanId, inStock } = req.query;
    const query = {};
    if (category && category !== 'All Crafts') {
      query.category = category;
    }
    if (artisanId) {
      query.artisanId = artisanId;
    }
    if (inStock === 'true') {
      query.inStock = true;
    }

    const products = await Product.find(query, { populateArtisan: true });
    res.json({
      success: true,
      count: products.length,
      data: products
    });
  } catch (err) {
    next(err);
  }
});

// GET /api/products/:id — Fetch single product details along with full artisan profile and craft provenance story
router.get('/:id', async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id, { populateArtisan: true });
    if (!product) {
      return res.status(404).json({
        success: false,
        error: { message: `Product with id "${req.params.id}" not found`, statusCode: 404 }
      });
    }

    res.json({
      success: true,
      data: product
    });
  } catch (err) {
    next(err);
  }
});

// POST /api/products — Create a new product listing (supports Multer image upload or direct image URL)
router.post('/', upload.single('image'), async (req, res, next) => {
  try {
    const body = req.body || {};

    // Validate required fields
    if (!body.title || !body.category || !body.price) {
      return res.status(400).json({
        success: false,
        error: { message: 'Title, category, and price are required fields.', statusCode: 400 }
      });
    }

    // Determine artisanId - fallback to first artisan if not provided
    let artisanId = body.artisanId;
    if (!artisanId) {
      const allArtisans = await Artisan.find();
      if (allArtisans.length > 0) {
        artisanId = allArtisans[0].id;
      } else {
        return res.status(400).json({
          success: false,
          error: { message: 'No registered artisan found to associate with this product listing.', statusCode: 400 }
        });
      }
    }

    // Handle image from file upload or URL or fallback
    let images = [];
    if (req.file) {
      const serverUrl = `${req.protocol}://${req.get('host')}`;
      images = [`${serverUrl}/uploads/${req.file.filename}`];
    } else if (body.imageUrl) {
      images = [body.imageUrl];
    } else if (Array.isArray(body.images) && body.images.length > 0) {
      images = body.images;
    } else if (typeof body.images === 'string') {
      images = [body.images];
    } else {
      // Default authentic Karnataka textile / craft image fallback
      images = ['https://images.unsplash.com/photo-1606760227091-3dd870d97f1d?auto=format&fit=crop&w=800&q=80'];
    }

    // Parse craftStory if sent as string (from multipart form) or object
    let craftStory = {
      hoursSpent: 24,
      materialsUsed: 'Handspun organic cotton, naturally dyed threads',
      culturalSignificance: 'Heritage motif representing Karnataka handicraft traditions',
      provenanceLocation: 'Karnataka, India'
    };

    if (body.craftStory) {
      if (typeof body.craftStory === 'string') {
        try {
          craftStory = { ...craftStory, ...JSON.parse(body.craftStory) };
        } catch (e) {
          craftStory.culturalSignificance = body.craftStory;
        }
      } else if (typeof body.craftStory === 'object') {
        craftStory = { ...craftStory, ...body.craftStory };
      }
    }

    // Form fields might pass craftStory parts directly
    if (body.hoursSpent) craftStory.hoursSpent = Number(body.hoursSpent) || body.hoursSpent;
    if (body.materialsUsed) craftStory.materialsUsed = body.materialsUsed;
    if (body.culturalSignificance) craftStory.culturalSignificance = body.culturalSignificance;
    if (body.provenanceLocation) craftStory.provenanceLocation = body.provenanceLocation;

    const newProduct = await Product.create({
      artisanId,
      title: body.title.trim(),
      category: body.category.trim(),
      price: Number(body.price),
      stockQuantity: body.stockQuantity !== undefined ? Number(body.stockQuantity) : 5,
      images,
      craftStory
    });

    res.status(201).json({
      success: true,
      message: 'Product listing created successfully',
      data: newProduct
    });
  } catch (err) {
    next(err);
  }
});

// DELETE /api/products/:id — Remove/Delete a craft listing
router.delete('/:id', async (req, res, next) => {
  try {
    const deleted = await Product.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({
        success: false,
        error: { message: `Product with id "${req.params.id}" not found`, statusCode: 404 }
      });
    }

    res.json({
      success: true,
      message: `Product "${deleted.title}" was successfully deleted from catalogue.`,
      data: deleted
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
