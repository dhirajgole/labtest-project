const express = require('express');
const router = express.Router();

const {
  getMyCart,
  addToCart,
  updateCartQuantity,
  removeFromCart,
  clearCart
} = require('../controller/cart.controller');

const { verifyToken } = require('../middleware/auth.middleware');

router.get('/', verifyToken, getMyCart);
router.post('/add', verifyToken, addToCart);
router.put('/update/:itemId', verifyToken, updateCartQuantity);
router.delete('/remove/:itemId', verifyToken, removeFromCart);
router.delete('/clear', verifyToken, clearCart);

module.exports = router;