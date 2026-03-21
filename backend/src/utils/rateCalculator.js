/**
 * Calculate rate for a parcel based on weight and rate configuration
 * @param {number} weight - Weight of the parcel in kg
 * @param {Array} rateConfigs - Array of rate configurations
 * @returns {number} Calculated rate
 */
exports.calculateRate = (weight, rateConfigs) => {
  // Find matching rate config
  const config = rateConfigs.find(
    (c) => weight >= c.weightRange.min && weight <= c.weightRange.max
  );

  if (!config) {
    // Default fallback calculation if no config matches
    // e.g., Base rate + (weight * ratePerKg)
    const baseRate = 50;
    const ratePerKg = 20;
    return baseRate + weight * ratePerKg;
  }

  return config.baseRate + weight * config.ratePerKg;
};

/**
 * Generate a unique booking ID
 * @returns {string} Unique booking ID (e.g., BK-2026-00001)
 */
exports.generateBookingId = () => {
  const date = new Date();
  const year = date.getFullYear();
  const random = Math.floor(Math.random() * 100000).toString().padStart(5, '0');
  return `BK-${year}-${random}`;
};
