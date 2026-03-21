const express = require('express');
const {
  getOrders,
  approveOrder,
  updateStatus,
  getMetrics
} = require('../controllers/orderController');

const router = express.Router();

const { protect, authorize } = require('../middleware/auth');

router.use(protect);
// Assuming business users can act as admins for now as per prompt structure 
// (or I should explicitly check for 'business' role)
router.use(authorize('business', 'admin')); 

router.get('/orders', getOrders);
router.get('/dashboard/metrics', getMetrics);
router.post('/orders/:id/approve', approveOrder);
router.put('/orders/:id/status', updateStatus);

module.exports = router;
