const crypto = require('crypto');
const Razorpay = require('razorpay');
const {
  createLocalOrder,
  markOrderPaid,
  markOrderFailed,
  getOrdersByUserId
} = require('../models/payment.model');

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET
});

const createRazorpayOrder = async (req, res) => {
  try {
    const userId = req.user.id;
    const { items, amount } = req.body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: 'Cart items are required' });
    }

    if (!amount || Number(amount) <= 0) {
      return res.status(400).json({ message: 'Valid amount is required' });
    }

    const amountInPaise = Math.round(Number(amount) * 100);

    const razorpayOrder = await razorpay.orders.create({
      amount: amountInPaise,
      currency: 'INR',
      receipt: `receipt_${Date.now()}`
    });

    const localOrder = await createLocalOrder({
      userId,
      razorpayOrderId: razorpayOrder.id,
      totalAmount: Number(amount),
      payment_status: 'created',
      items
    });

    return res.status(201).json({
      message: 'Order created successfully',
      order: localOrder,
      razorpayOrder
    });
  } catch (error) {
    console.error('createRazorpayOrder error:', error);
    return res.status(500).json({
      message: 'Failed to create Razorpay order',
      error: error.message
    });
  }
};

const verifyRazorpayPayment = async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature
    } = req.body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({
        message: 'Payment verification data is required'
      });
    }

    const generatedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest('hex');

    if (generatedSignature !== razorpay_signature) {
      await markOrderFailed({
        razorpayOrderId: razorpay_order_id,
        payment_status: 'failed'
      });

      return res.status(400).json({ message: 'Invalid payment signature' });
    }

    const updatedOrder = await markOrderPaid({
      razorpayOrderId: razorpay_order_id,
      razorpayPaymentId: razorpay_payment_id,
      razorpaySignature: razorpay_signature
    });

    return res.status(200).json({
      message: 'Payment verified successfully',
      order: updatedOrder
    });
  } catch (error) {
    console.error('verifyRazorpayPayment error:', error);
    return res.status(500).json({
      message: 'Payment verification failed',
      error: error.message
    });
  }
};

const getMyOrders = async (req, res) => {
  try {
    const userId = req.user.id;
    const orders = await getOrdersByUserId(userId);

    return res.status(200).json({
      message: 'Orders fetched successfully',
      orders
    });
  } catch (error) {
    console.error('getMyOrders error:', error);
    return res.status(500).json({
      message: 'Failed to fetch orders',
      error: error.message
    });
  }
};

module.exports = {
  createRazorpayOrder,
  verifyRazorpayPayment,
  getMyOrders
};