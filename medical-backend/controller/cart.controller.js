const {
  getCartItemsByUserId,
  addItemToCart,
  updateCartItemQuantity,
  removeCartItem,
  clearCartByUserId
} = require('../models/cart.model');

const getMyCart = async (req, res) => {
  try {
    const userId = req.user.id;
    const cart = await getCartItemsByUserId(userId);

    return res.status(200).json({
      message: 'Cart fetched successfully',
      cart
    });
  } catch (error) {
    console.error('getMyCart error:', error);
    return res.status(500).json({ message: 'Failed to fetch cart' });
  }
};

const addToCart = async (req, res) => {
  
  console.log('req.user:', req.user);
  console.log('req.body:', req.body);
  
  try {
    const userId = req.user.id;
    const item = req.body;

    if (!item || !item.id || !item.name || !item.price) {
      return res.status(400).json({ message: 'Valid item data is required' });
    }

    const result = await addItemToCart(userId, item);

    return res.status(200).json({
      message: 'Item added to cart',
      item: result
    });
  } catch (error) {
    console.error('addToCart error:', error);
    return res.status(500).json({ message: 'Failed to add item to cart' });
  }
};

const updateCartQuantity = async (req, res) => {
  try {
    const userId = req.user.id;
    const { itemId } = req.params;
    const { quantity } = req.body;

    const updated = await updateCartItemQuantity(userId, itemId, quantity);

    return res.status(200).json({
      message: 'Cart item updated',
      item: updated
    });
  } catch (error) {
    console.error('updateCartQuantity error:', error);
    return res.status(500).json({ message: 'Failed to update cart item' });
  }
};

const removeFromCart = async (req, res) => {
  try {
    const userId = req.user.id;
    const { itemId } = req.params;

    const deleted = await removeCartItem(userId, itemId);

    return res.status(200).json({
      message: 'Item removed from cart',
      item: deleted
    });
  } catch (error) {
    console.error('removeFromCart error:', error);
    return res.status(500).json({ message: 'Failed to remove item from cart' });
  }
};

const clearCart = async (req, res) => {
  try {
    const userId = req.user.id;
    await clearCartByUserId(userId);

    return res.status(200).json({
      message: 'Cart cleared successfully'
    });
  } catch (error) {
    console.error('clearCart error:', error);
    return res.status(500).json({ message: 'Failed to clear cart' });
  }
};

module.exports = {
  getMyCart,
  addToCart,
  updateCartQuantity,
  removeFromCart,
  clearCart
};