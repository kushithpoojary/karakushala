const express = require('express');
const router = express.Router();
const User = require('../models/User');

// 1. GET /api/users — List demo buyers
router.get('/', async (req, res, next) => {
  try {
    const users = await User.find();
    res.json({
      success: true,
      count: users.length,
      data: users
    });
  } catch (err) {
    next(err);
  }
});

// 2. POST /api/users/send-otp — Simulated phone OTP for buyer
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

    const demoOtp = '1234';
    const existing = await User.findByPhone(phone);

    res.json({
      success: true,
      message: `OTP sent successfully to mobile ${phone}.`,
      demoOtp,
      data: existing || null
    });
  } catch (err) {
    next(err);
  }
});

// 3. POST /api/users/phone-login — Authenticate or auto-register buyer with phone + OTP
router.post('/phone-login', async (req, res, next) => {
  try {
    const { phone, otp, name } = req.body;
    if (!phone) {
      return res.status(400).json({
        success: false,
        error: { message: 'Mobile phone number is required.', statusCode: 400 }
      });
    }

    if (!otp || otp.toString().trim() !== '1234') {
      return res.status(401).json({
        success: false,
        error: { message: 'Invalid OTP code. Please enter demo OTP: 1234', statusCode: 401 }
      });
    }

    let user = await User.findByPhone(phone);
    if (!user) {
      const clean = phone.toString().replace(/\D/g, '').slice(-10);
      user = await User.create({
        name: name || `Craft Lover (${clean.slice(-4)})`,
        phone: `+91 ${clean}`,
        email: `${clean}@buyer.karakushala.in`,
        city: 'Karnataka, India',
        address: 'Karnataka, India'
      });
    }

    res.json({
      success: true,
      message: `Welcome, ${user.name}! Logged in successfully.`,
      token: `user_jwt_${user.id}_${Date.now()}`,
      data: user
    });
  } catch (err) {
    next(err);
  }
});

// 4. POST /api/users/google-login — Authenticate or register buyer with Google
router.post('/google-login', async (req, res, next) => {
  try {
    const { email, name, phone, avatar } = req.body;
    const targetEmail = email || 'ananya.rao@gmail.com';

    let user = await User.findByEmail(targetEmail);
    if (!user) {
      user = await User.create({
        email: targetEmail,
        name: name || targetEmail.split('@')[0],
        phone: phone || '+91 98801 23456',
        avatar: avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
        city: 'Bengaluru, Karnataka',
        address: 'Bengaluru, Karnataka'
      });
    }

    res.json({
      success: true,
      message: `Welcome, ${user.name}! Signed in with Google.`,
      token: `google_jwt_${user.id}_${Date.now()}`,
      data: user
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
