require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./src/models/User');
const RateConfig = require('./src/models/RateConfig');
const connectDB = require('./src/config/database');

const seedAdmin = async () => {
  try {
    await connectDB();

    // Create Admin/Business User
    const adminExists = await User.findOne({ email: 'admin@courier.com' });
    if (!adminExists) {
      await User.create({
        fullName: 'System Admin',
        email: 'admin@courier.com',
        password: 'admin123@password',
        phone: '9999999999',
        accountType: 'business',
        address: 'Admin HQ, New Delhi'
      });
      console.log('Admin user created successfully!');
      console.log('Email: admin@courier.com');
      console.log('Password: admin123@password');
    } else {
      console.log('Admin user already exists.');
    }

    // Create Initial Rate Configs
    const rateCount = await RateConfig.countDocuments();
    if (rateCount === 0) {
      await RateConfig.create([
        { weightRange: { min: 0, max: 2 }, ratePerKg: 20, baseRate: 50 },
        { weightRange: { min: 2, max: 5 }, ratePerKg: 18, baseRate: 45 },
        { weightRange: { min: 5, max: 50 }, ratePerKg: 15, baseRate: 40 }
      ]);
      console.log('Initial rate configurations created!');
    }

    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

seedAdmin();
