const express = require('express');
const { createPaymentIntent, confirmOrder } = require('../controllers/paymentController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/create-intent', protect, createPaymentIntent);
router.post('/confirm-order', protect, confirmOrder);

module.exports = router;
