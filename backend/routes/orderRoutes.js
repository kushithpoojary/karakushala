const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const Product = require('../models/Product');

// GET /api/orders — Fetch all orders
router.get('/', async (req, res, next) => {
  try {
    const orders = await Order.find(req.query);
    res.json({
      success: true,
      count: orders.length,
      data: orders
    });
  } catch (err) {
    next(err);
  }
});

// GET /api/orders/:id — Fetch single order
router.get('/:id', async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({
        success: false,
        error: { message: `Order "${req.params.id}" not found`, statusCode: 404 }
      });
    }

    res.json({
      success: true,
      data: order
    });
  } catch (err) {
    next(err);
  }
});

// POST /api/orders — Create a new order, validate stock availability, decrement stockQuantity, and return a mocked payment confirmation receipt
router.post('/', async (req, res, next) => {
  try {
    const { buyerName, buyerPhone, shippingAddress, items, paymentMethod } = req.body;

    if (!buyerName || !buyerPhone || !shippingAddress) {
      return res.status(400).json({
        success: false,
        error: { message: 'Buyer name, phone, and shipping address are required.', statusCode: 400 }
      });
    }

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        success: false,
        error: { message: 'Order must contain at least one craft item.', statusCode: 400 }
      });
    }

    // Step 1: Validate stock for all items
    const validatedItems = [];
    let calculatedTotal = 0;

    for (const cartItem of items) {
      const prodId = cartItem.productId || cartItem.id;
      const requestedQty = Number(cartItem.quantity) || 1;

      if (requestedQty <= 0) {
        return res.status(400).json({
          success: false,
          error: { message: `Invalid quantity ${requestedQty} for product ${prodId}`, statusCode: 400 }
        });
      }

      const product = await Product.findById(prodId, { populateArtisan: false });
      if (!product) {
        return res.status(404).json({
          success: false,
          error: { message: `Product "${prodId}" not found in catalogue.`, statusCode: 404 }
        });
      }

      if (product.stockQuantity < requestedQty) {
        return res.status(400).json({
          success: false,
          error: {
            message: `Insufficient stock for "${product.title}". Available: ${product.stockQuantity}, Requested: ${requestedQty}.`,
            statusCode: 400
          }
        });
      }

      const unitPrice = Number(product.price);
      calculatedTotal += unitPrice * requestedQty;

      validatedItems.push({
        productId: product.id,
        title: product.title,
        quantity: requestedQty,
        priceAtPurchase: unitPrice
      });
    }

    // Step 2: Decrement stockQuantity for all validated items
    for (const item of validatedItems) {
      await Product.decrementStock(item.productId, item.quantity);
    }

    // Step 3: Create the order record
    const totalAmount = Number(req.body.totalAmount) || calculatedTotal;
    const orderNumber = `KK-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;

    const newOrder = await Order.create({
      orderNumber,
      buyerName: buyerName.trim(),
      buyerPhone: buyerPhone.trim(),
      shippingAddress: shippingAddress.trim(),
      items: validatedItems,
      totalAmount,
      paymentMethod: paymentMethod || 'Mock UPI (GPay / PhonePe / Paytm)',
      paymentStatus: 'Paid - Mock',
      orderStatus: 'Accepted', // Default accepted and routed to artisan
      createdAt: new Date().toISOString()
    });

    // Step 4: Return mocked payment confirmation receipt
    const paymentReceipt = {
      transactionId: `TXN-UPI-${Date.now()}-${Math.floor(Math.random() * 8999 + 1000)}`,
      paymentGateway: 'KaraKushala Direct Artisan UPI Gateway (Mocked)',
      paidAmountINR: totalAmount,
      paymentStatus: 'SUCCESS',
      paidAt: new Date().toISOString(),
      fairArtisanShareINR: Math.round(totalAmount * 0.88), // 88% direct to artisan
      platformFeeINR: 0 // Zero platform cut for rural artisans!
    };

    res.status(201).json({
      success: true,
      message: 'Order created successfully and stock reserved.',
      data: {
        order: newOrder,
        receipt: paymentReceipt
      }
    });
  } catch (err) {
    next(err);
  }
});

// PATCH /api/orders/:id/status — Allow the artisan to update order status (Accepted -> Shipped -> Delivered)
router.patch('/:id/status', async (req, res, next) => {
  try {
    const { status } = req.body;
    if (!status) {
      return res.status(400).json({
        success: false,
        error: { message: 'Status field is required (Accepted, Shipped, or Delivered).', statusCode: 400 }
      });
    }

    const updatedOrder = await Order.findByIdAndUpdateStatus(req.params.id, status);
    if (!updatedOrder) {
      return res.status(404).json({
        success: false,
        error: { message: `Order "${req.params.id}" not found`, statusCode: 404 }
      });
    }

    res.json({
      success: true,
      message: `Order status successfully updated to "${updatedOrder.orderStatus}"`,
      data: updatedOrder
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
