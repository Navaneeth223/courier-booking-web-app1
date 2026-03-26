const express = require('express');
const router = express.Router();
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.json({ success: false, message: 'User not found' });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.json({ success: false, message: 'Invalid password' });
    }

    // Create token
    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET || 'your_secret_key',
      { expiresIn: '7d' }
    );

    res.json({
      success: true,
      token,
      data: {
        id: user._id,
        email: user.email,
        name: user.fullName, // Use fullName from model
        accountType: user.accountType,
        role: user.role
      },
      user: {
        id: user._id,
        email: user.email,
        name: user.fullName, // Use fullName from model
        accountType: user.accountType,
        role: user.role
      }
    });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
});

// Register
router.post('/register', async (req, res) => {
  try {
    const { email, password, name, phone, accountType } = req.body;

    // Check if user exists
    let user = await User.findOne({ email });
    if (user) {
      return res.json({ success: false, message: 'User already exists' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user
    user = new User({
      email,
      password: hashedPassword,
      name,
      phone,
      accountType,
      role: 'user'
    });

    await user.save();

    // Create token
    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET || 'your_secret_key',
      { expiresIn: '7d' }
    );

    res.json({
      success: true,
      token,
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        accountType,
        role: 'user'
      }
    });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
});

// Get current user
router.get('/me', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.json({ success: false, message: 'No token' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_secret_key');
    const user = await User.findById(decoded.id);
    
    // Return structured data for compatibility
    res.json({ 
      success: true, 
      user,
      data: user 
    });
  } catch (error) {
    res.json({ success: false, message: 'Invalid token' });
  }
});

// Get all users
router.get('/users', async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json({ success: true, users });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
});

module.exports = router;
