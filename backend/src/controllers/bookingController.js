const Booking = require('../models/Booking');
const RateConfig = require('../models/RateConfig');
const { calculateRate, generateBookingId } = require('../utils/rateCalculator');
const sendEmail = require('../services/emailService');
const sendSMS = require('../services/smsService');

// @desc    Create new booking
// @route   POST /api/bookings
// @access  Private
exports.createBooking = async (req, res, next) => {
  try {
    const {
      senderName, senderEmail, senderPhone, senderAddress,
      receiverName, receiverEmail, receiverPhone, receiverAddress,
      parcelWeight, parcelDescription
    } = req.body;

    // Get all rate configs
    const rateConfigs = await RateConfig.find();

    // Calculate rate
    const calculatedRate = calculateRate(parcelWeight, rateConfigs);

    // Create booking
    const booking = await Booking.create({
      customerId: req.user.id,
      bookingId: generateBookingId(),
      senderName, senderEmail, senderPhone, senderAddress,
      receiverName, receiverEmail, receiverPhone, receiverAddress,
      parcelWeight, parcelDescription,
      calculatedRate,
      status: 'pending',
      trackingHistory: [
        {
          status: 'pending',
          description: 'Booking created and awaiting approval',
          timestamp: new Date()
        }
      ]
    });

    // Send notifications
    try {
      // Email to sender
      await sendEmail({
        email: senderEmail,
        subject: `Booking Confirmed - ${booking.bookingId}`,
        message: `Dear ${senderName},\n\nYour booking with ID ${booking.bookingId} has been created successfully. \n\nTracking ID: ${booking._id}\nParcel: ${parcelDescription}\nWeight: ${parcelWeight}kg\nRate: ₹${calculatedRate}`,
        html: `<h2>Booking Confirmed!</h2>
               <p><strong>Booking ID:</strong> ${booking.bookingId}</p>
               <p><strong>Tracking ID:</strong> ${booking._id}</p>
               <p><strong>Parcel:</strong> ${parcelDescription}</p>
               <p><strong>Total Rate:</strong> ₹${calculatedRate}</p>
               <p>Your shipment is currently pending approval by our team.</p>`
      });

      // SMS to sender
      await sendSMS({
        phone: senderPhone,
        message: `Booking Confirmed! ID: ${booking.bookingId}. Your shipment is pending approval. Track at: http://localhost:5173/track/${booking._id}`
      });
    } catch (notifyErr) {
      console.error('Booking notification failed:', notifyErr.message);
    }

    res.status(201).json({
      success: true,
      data: booking
    });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

// @desc    Get all bookings for logged in user
// @route   GET /api/bookings
// @access  Private
exports.getBookings = async (req, res, next) => {
  try {
    const bookings = await Booking.find({ customerId: req.user.id }).sort('-createdAt');

    res.status(200).json({
      success: true,
      count: bookings.length,
      data: bookings
    });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

// @desc    Get single booking
// @route   GET /api/bookings/:id
// @access  Private
exports.getBooking = async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ success: false, error: 'Booking not found' });
    }

    // Check if user owns booking
    if (booking.customerId.toString() !== req.user.id && req.user.accountType !== 'business') {
        // Business check is a placeholder for admin/privileged users
        return res.status(401).json({ success: false, error: 'Not authorized' });
    }

    res.status(200).json({
      success: true,
      data: booking
    });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

// @desc    Update booking (cancel if pending)
// @route   PUT /api/bookings/:id
// @access  Private
exports.updateBooking = async (req, res, next) => {
  try {
    let booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ success: false, error: 'Booking not found' });
    }

    // Check if user owns booking
    if (booking.customerId.toString() !== req.user.id) {
      return res.status(401).json({ success: false, error: 'Not authorized' });
    }

    // Only allow update if pending
    if (booking.status !== 'pending') {
      return res.status(400).json({ success: false, error: 'Cannot update booking in current status' });
    }

    booking = await Booking.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.status(200).json({
      success: true,
      data: booking
    });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};
