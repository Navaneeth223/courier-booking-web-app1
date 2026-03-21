const mongoose = require('mongoose');

const RateConfigSchema = new mongoose.Schema({
  weightRange: {
    min: { type: Number, required: true },
    max: { type: Number, required: true }
  },
  ratePerKg: { type: Number, required: true },
  baseRate: { type: Number, required: true },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('RateConfig', RateConfigSchema);
