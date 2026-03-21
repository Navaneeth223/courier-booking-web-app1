const express = require('express');
const {
  createBooking,
  getBookings,
  getBooking,
  updateBooking
} = require('../controllers/bookingController');

const router = express.Router();

const { protect } = require('../middleware/auth');

router.use(protect);

router.route('/')
  .post(createBooking)
  .get(getBookings);

router.route('/:id')
  .get(getBooking)
  .put(updateBooking);

module.exports = router;
