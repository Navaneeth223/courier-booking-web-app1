const Booking = require('../models/Booking');
const { getIO } = require('../config/socket');
const delhiveryService = require('../services/delhiveryService');
const sendEmail = require('../services/emailService');
const sendSMS = require('../services/smsService');

// @desc    Get all orders for admin
// @route   GET /api/admin/orders
// @access  Private/Admin
exports.getOrders = async (req, res, next) => {
  try {
    const orders = await Booking.find().sort('-createdAt');

    res.status(200).json({
      success: true,
      count: orders.length,
      data: orders
    });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

// @desc    Approve order and generate AWB (mock)
// @route   POST /api/admin/orders/:id/approve
// @access  Private/Admin
exports.approveOrder = async (req, res, next) => {
  try {
    let booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ success: false, error: 'Booking not found' });
    }

    if (booking.status !== 'pending') {
      return res.status(400).json({ success: false, error: 'Order already processed' });
    }

    // Call Delhivery API to create shipment
    let delhiveryData = {};
    try {
      delhiveryData = await delhiveryService.createShipment({
        bookingId: booking.bookingId,
        sender: {
          name: booking.senderName,
          phone: booking.senderPhone,
          email: booking.senderEmail,
          address: booking.senderAddress
        },
        receiver: {
          name: booking.receiverName,
          phone: booking.receiverPhone,
          email: booking.receiverEmail,
          address: booking.receiverAddress
        },
        parcel: {
          weight: booking.parcelWeight,
          description: booking.parcelDescription
        }
      });
    } catch (delhiveryErr) {
      console.error('Delhivery shipment creation failed:', delhiveryErr.message);
      // Even if Delhivery fails, we continue with local approval for now (or handle as business rule)
    }

    // Update booking status and metadata
    booking.status = 'approved';
    booking.approvedAt = new Date();
    booking.approvedBy = req.user.id;
    booking.awbNumber = delhiveryData.awb || `AWB-${Math.floor(Math.random() * 1000000)}`;
    booking.delhiveryOrderId = delhiveryData.orderId;

    // Add to tracking history
    booking.trackingHistory.push({
      status: 'approved',
      description: 'Order approved by admin',
      timestamp: new Date()
    });

    await booking.save();

    // Send Approval Notifications
    try {
      await sendEmail({
        email: booking.senderEmail,
        subject: `Shipment Approved - ${booking.bookingId}`,
        message: `Your shipment with ID ${booking.bookingId} has been approved and is being processed. \n\nAWB Number: ${booking.awbNumber}`,
        html: `<h2>Order Approved!</h2>
               <p>Your shipment (ID: ${booking.bookingId}) has been approved.</p>
               <p><strong>AWB Number:</strong> ${booking.awbNumber}</p>
               <p>You can track it on our portal.</p>`
      });

      await sendSMS({
        phone: booking.senderPhone,
        message: `Great news! Your shipment ${booking.bookingId} is approved. AWB: ${booking.awbNumber}. Track: http://localhost:5173/track/${booking._id}`
      });
    } catch (notifyErr) {
      console.error('Approval notification failed:', notifyErr.message);
    }

    // Emit socket event
    const io = getIO();
    io.to(booking._id.toString()).emit('status-update', {
      bookingId: booking._id,
      status: 'approved',
      description: 'Order approved by admin'
    });

    res.status(200).json({
      success: true,
      data: booking
    });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

// @desc    Update tracking location/status
// @route   PUT /api/admin/orders/:id/status
// @access  Private/Admin
exports.updateStatus = async (req, res, next) => {
  try {
    const { status, description, lat, lng } = req.body;

    let booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ success: false, error: 'Booking not found' });
    }

    // Update fields
    if (status) booking.status = status;
    if (lat && lng) booking.currentLocation = { lat, lng };

    // Add to history
    booking.trackingHistory.push({
      status: status || booking.status,
      description: description || `Status updated to ${status}`,
      location: lat && lng ? { lat, lng } : booking.currentLocation,
      timestamp: new Date()
    });

    await booking.save();

    // Send Status Update Notifications
    if (status === 'in_transit' || status === 'delivered' || status === 'cancelled') {
        try {
          await sendEmail({
            email: booking.senderEmail,
            subject: `Shipment Update: ${status.replace('_', ' ').toUpperCase()} - ${booking.bookingId}`,
            message: `Your shipment with ID ${booking.bookingId} status has changed to: ${status.replace('_', ' ')}.\n\nDetails: ${description || 'No additional details.'}`,
            html: `<h2>Shipment Status Update</h2>
                   <p>Your shipment (ID: ${booking.bookingId}) is now <strong>${status.replace('_', ' ')}</strong>.</p>
                   <p>Message: ${description || 'Your shipment is moving towards destination.'}</p>`
          });

          await sendSMS({
            phone: booking.senderPhone,
            message: `Update: Your shipment ${booking.bookingId} is now ${status.replace('_', ' ')}. More info on portal.`
          });
        } catch (notifyErr) {
          console.error('Status notification failed:', notifyErr.message);
        }
    }

    // Emit socket event
    const io = getIO();
    io.to(booking._id.toString()).emit('location-update', {
      bookingId: booking._id,
      status: booking.status,
      currentLocation: booking.currentLocation,
      history: booking.trackingHistory[booking.trackingHistory.length - 1]
    });

    res.status(200).json({
      success: true,
      data: booking
    });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

// @desc    Get dashboard metrics
// @route   GET /api/admin/dashboard/metrics
// @access  Private/Admin
exports.getMetrics = async (req, res, next) => {
  try {
    const totalBookings = await Booking.countDocuments();
    const pendingCount = await Booking.countDocuments({ status: 'pending' });
    const inTransitCount = await Booking.countDocuments({ status: 'in_transit' });
    const deliveredCount = await Booking.countDocuments({ status: 'delivered' });

    res.status(200).json({
      success: true,
      data: {
        totalBookings,
        pendingCount,
        inTransitCount,
        deliveredCount
      }
    });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};
