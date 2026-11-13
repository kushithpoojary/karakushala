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

    const estDate = new Date();
    estDate.setDate(estDate.getDate() + 7);
    const estDeliveryStr = estDate.toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' });

    const isCod = (paymentMethod || '').toLowerCase().includes('cash on delivery') || (paymentMethod || '').toLowerCase().includes('cod');
    const paymentStatus = isCod ? 'Pending (Cash on Delivery)' : 'Paid - Mock UPI';
    const resolvedMethod = isCod ? 'Cash on Delivery (COD)' : (paymentMethod || 'Mock UPI (GPay / PhonePe / Paytm)');

    const newOrder = await Order.create({
      orderNumber,
      buyerName: buyerName.trim(),
      buyerPhone: buyerPhone.trim(),
      shippingAddress: shippingAddress.trim(),
      items: validatedItems,
      totalAmount,
      paymentMethod: resolvedMethod,
      paymentStatus,
      orderStatus: 'Placed',
      estimatedDeliveryDate: estDeliveryStr,
      statusHistory: [
        {
          status: 'Placed',
          timestamp: new Date().toISOString(),
          note: isCod 
            ? `Order confirmed with Cash on Delivery. ₹${totalAmount} payable at doorstep upon delivery.`
            : `Order placed and verified via UPI. ₹${totalAmount} artisan escrow reserved.`,
          updatedBy: 'Buyer'
        }
      ],
      createdAt: new Date().toISOString()
    });

    // Step 4: Return payment confirmation receipt
    const paymentReceipt = {
      transactionId: isCod 
        ? `COD-REF-${Date.now().toString().slice(-6)}` 
        : `UPI-UTR-${Date.now().toString().slice(-6)}${Math.floor(100000 + Math.random() * 900000)}`,
      paymentGateway: isCod 
        ? 'Cash on Delivery (Doorstep Settlement)' 
        : 'KaraKushala NPCI Direct Artisan UPI Gateway',
      paidAmountINR: isCod ? 0 : totalAmount,
      amountDueINR: isCod ? totalAmount : 0,
      paymentStatus: isCod ? 'PAYMENT DUE ON DELIVERY' : 'SUCCESS - PAID VIA UPI',
      paidAt: isCod ? null : new Date().toISOString(),
      fairArtisanShareINR: Math.round(totalAmount * 0.88), // 88% direct to artisan
      platformFeeINR: 0,
      isCod
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

// PATCH /api/orders/:id/status — Allow the artisan to update order status (Placed -> Confirmed -> Being crafted -> Packed -> Shipped -> Out for delivery -> Delivered / Cancelled)
router.patch('/:id/status', async (req, res, next) => {
  try {
    const { status, courier, trackingNumber, estimatedDeliveryDate, note, updatedBy } = req.body;
    if (!status) {
      return res.status(400).json({
        success: false,
        error: { message: 'Status field is required (Placed, Confirmed, Being crafted, Packed, Shipped, Out for delivery, Delivered, Cancelled).', statusCode: 400 }
      });
    }

    if (status.toLowerCase() === 'shipped') {
      if (!courier || !courier.trim() || !trackingNumber || !trackingNumber.trim()) {
        return res.status(400).json({
          success: false,
          error: {
            message: 'Courier partner and tracking number are strictly required when marking an order as Shipped.',
            statusCode: 400
          }
        });
      }
    }

    const updatedOrder = await Order.findByIdAndUpdateStatus(req.params.id, status, {
      courier,
      trackingNumber,
      estimatedDeliveryDate,
      note,
      updatedBy
    });

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

// POST /api/orders/:id/cancel — Cancel an order and restore stock
router.post('/:id/cancel', async (req, res, next) => {
  try {
    const { reason, cancelledBy } = req.body || {};
    const cancelledOrder = await Order.cancelOrder(req.params.id, reason, cancelledBy || 'Customer');

    res.json({
      success: true,
      message: `Order ${cancelledOrder.orderNumber} successfully cancelled and inventory restocked.`,
      data: cancelledOrder
    });
  } catch (err) {
    if (err.message && err.message.includes('cannot be cancelled')) {
      return res.status(400).json({
        success: false,
        error: { message: err.message, statusCode: 400 }
      });
    }
    next(err);
  }
});

// PATCH /api/orders/:id/cancel — Alternative PATCH method
router.patch('/:id/cancel', async (req, res, next) => {
  try {
    const { reason, cancelledBy } = req.body || {};
    const cancelledOrder = await Order.cancelOrder(req.params.id, reason, cancelledBy || 'Customer');

    res.json({
      success: true,
      message: `Order ${cancelledOrder.orderNumber} successfully cancelled and inventory restocked.`,
      data: cancelledOrder
    });
  } catch (err) {
    if (err.message && err.message.includes('cannot be cancelled')) {
      return res.status(400).json({
        success: false,
        error: { message: err.message, statusCode: 400 }
      });
    }
    next(err);
  }
});

// DELETE /api/orders/:id — Delete / remove an order and restore stock
router.delete('/:id', async (req, res, next) => {
  try {
    const removedOrder = await Order.deleteOrder(req.params.id);
    if (!removedOrder) {
      return res.status(404).json({
        success: false,
        error: { message: `Order "${req.params.id}" not found`, statusCode: 404 }
      });
    }

    res.json({
      success: true,
      message: `Order ${removedOrder.orderNumber} successfully deleted and removed.`,
      data: removedOrder
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
