const mongoose = require('mongoose');

const BookingSchema = new mongoose.Schema({
  bookingId: { type: String, unique: true },
  senderName: String,
  senderEmail: String,
  senderPhone: String,
  senderAddress: String,
  receiverName: String,
  receiverEmail: String,
  receiverPhone: String,
  receiverAddress: String,
  weight: Number,
  description: String,
  status: { 
    type: String, 
    enum: ['pending', 'approved', 'in_transit', 'delivered'],
    default: 'pending'
  },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Booking', BookingSchema);
