const express = require('express');
const router = express.Router();
const Booking = require('../models/Booking');

// Get all bookings
router.get('/', async (req, res) => {
  try {
    const bookings = await Booking.find().sort({ createdAt: -1 });
    res.json({ success: true, bookings });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
});

// Create booking
router.post('/create', async (req, res) => {
  try {
    const { senderName, senderEmail, senderPhone, senderAddress, 
            receiverName, receiverEmail, receiverPhone, receiverAddress,
            weight, description } = req.body;

    // Generate booking ID
    const bookingId = 'BK-' + Date.now();

    const booking = new Booking({
      bookingId,
      senderName,
      senderEmail,
      senderPhone,
      senderAddress,
      receiverName,
      receiverEmail,
      receiverPhone,
      receiverAddress,
      weight,
      description,
      status: 'pending'
    });

    await booking.save();

    res.json({ 
      success: true, 
      message: 'Booking created successfully',
      booking 
    });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
});

// Update booking status
router.put('/:id', async (req, res) => {
  try {
    const { status } = req.body;
    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    res.json({ success: true, booking });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
});

module.exports = router;
