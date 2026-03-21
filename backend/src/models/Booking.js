const mongoose = require('mongoose');

const BookingSchema = new mongoose.Schema({
  customerId: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },
  bookingId: {
    type: String,
    required: true,
    unique: true
  },
  senderName: { type: String, required: true },
  senderEmail: { type: String, required: true },
  senderPhone: { type: String, required: true },
  senderAddress: { type: String, required: true },
  receiverName: { type: String, required: true },
  receiverEmail: { type: String, required: true },
  receiverPhone: { type: String, required: true },
  receiverAddress: { type: String, required: true },
  parcelWeight: { type: Number, required: true },
  parcelDescription: { type: String, required: true },
  calculatedRate: { type: Number, required: true },
  status: {
    type: String,
    enum: ['pending', 'approved', 'picked_up', 'in_transit', 'delivered'],
    default: 'pending'
  },
  awbNumber: String,
  delhiveryOrderId: String,
  approvedAt: Date,
  approvedBy: {
    type: mongoose.Schema.ObjectId,
    ref: 'User'
  },
  approvalReason: String,
  rejectionReason: String,
  trackingHistory: [
    {
      status: String,
      location: {
        lat: Number,
        lng: Number
      },
      timestamp: { type: Date, default: Date.now },
      description: String
    }
  ],
  currentLocation: {
    lat: Number,
    lng: Number
  },
  estimatedDeliveryTime: Date,
  actualDeliveryTime: Date,
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update the updatedAt field before saving
BookingSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Booking', BookingSchema);
