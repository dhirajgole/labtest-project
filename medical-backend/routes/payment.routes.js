const express = require('express');
const router = express.Router();

const {
  createRazorpayOrder,
  verifyRazorpayPayment,
  getMyOrders
} = require('../controller/payment.controller');

const { verifyToken } = require('../middleware/auth.middleware');

router.post('/create-order', verifyToken, createRazorpayOrder);
router.post('/verify-payment', verifyToken, verifyRazorpayPayment);
router.get('/my-orders', verifyToken, getMyOrders);

module.exports = router;