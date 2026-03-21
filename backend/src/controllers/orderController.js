const Booking = require('../models/Booking');
const { getIO } = require('../config/socket');

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

    // Update booking status and metadata
    booking.status = 'approved';
    booking.approvedAt = new Date();
    booking.approvedBy = req.user.id;
    booking.awbNumber = `AWB-${Math.floor(Math.random() * 1000000)}`; // Mock AWB

    // Add to tracking history
    booking.trackingHistory.push({
      status: 'approved',
      description: 'Order approved by admin',
      timestamp: new Date()
    });

    await booking.save();

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
