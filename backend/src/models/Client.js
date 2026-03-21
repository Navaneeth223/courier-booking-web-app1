const mongoose = require('mongoose');

const ClientSchema = new mongoose.Schema({
  businessOwnerId: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },
  clientName: { type: String, required: true },
  clientEmail: { type: String, required: true },
  clientPhone: { type: String, required: true },
  address: { type: String, required: true },
  totalBookings: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Client', ClientSchema);
