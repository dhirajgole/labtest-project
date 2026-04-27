const pool = require('../db');

const getOrCreateCart = async (userId) => {
  const existingCart = await pool.query(
    'SELECT * FROM carts WHERE user_id = $1',
    [userId]
  );

  if (existingCart.rows.length > 0) {
    return existingCart.rows[0];
  }

  const newCart = await pool.query(
    'INSERT INTO carts (user_id, created_at, updated_at) VALUES ($1, NOW(), NOW()) RETURNING *',
    [userId]
  );

  return newCart.rows[0];
};

const getCartItemsByUserId = async (userId) => {
  const cart = await getOrCreateCart(userId);

  const result = await pool.query(
    `SELECT *
     FROM cart_items
     WHERE cart_id = $1
     ORDER BY id ASC`,
    [cart.id]
  );

  return {
    cartId: cart.id,
    items: result.rows
  };
};

const addItemToCart = async (userId, item) => {
  const cart = await getOrCreateCart(userId);

  const existingItem = await pool.query(
    'SELECT * FROM cart_items WHERE cart_id = $1 AND item_id = $2',
    [cart.id, String(item.id)]
  );

  if (existingItem.rows.length > 0) {
    const oldItem = existingItem.rows[0];
    const newQuantity = oldItem.quantity + 1;
    const newSubtotal = Number(oldItem.price) * newQuantity;

    const updated = await pool.query(
      `UPDATE cart_items
       SET quantity = $1, subtotal = $2
       WHERE cart_id = $3 AND item_id = $4
       RETURNING *`,
      [newQuantity, newSubtotal, cart.id, String(item.id)]
    );

    return updated.rows[0];
  }

  const inserted = await pool.query(
    `INSERT INTO cart_items
      (cart_id, item_id, name, price, quantity, type, img, category, subtotal)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
     RETURNING *`,
    [
      cart.id,
      String(item.id),
      item.name,
      Number(item.price),
      Number(item.quantity || 1),
      item.type || null,
      item.img || null,
      item.category || null,
      Number(item.price) * Number(item.quantity || 1)
    ]
  );

  await pool.query(
    'UPDATE carts SET updated_at = NOW() WHERE id = $1',
    [cart.id]
  );

  return inserted.rows[0];
};

const updateCartItemQuantity = async (userId, itemId, quantity) => {
  const cart = await getOrCreateCart(userId);

  if (Number(quantity) <= 0) {
    await pool.query(
      'DELETE FROM cart_items WHERE cart_id = $1 AND item_id = $2',
      [cart.id, itemId]
    );
    return null;
  }

  const existing = await pool.query(
    'SELECT * FROM cart_items WHERE cart_id = $1 AND item_id = $2',
    [cart.id, itemId]
  );

  if (existing.rows.length === 0) {
    return null;
  }

  const price = Number(existing.rows[0].price);
  const subtotal = price * Number(quantity);

  const updated = await pool.query(
    `UPDATE cart_items
     SET quantity = $1, subtotal = $2
     WHERE cart_id = $3 AND item_id = $4
     RETURNING *`,
    [Number(quantity), subtotal, cart.id, itemId]
  );

  await pool.query(
    'UPDATE carts SET updated_at = NOW() WHERE id = $1',
    [cart.id]
  );

  return updated.rows[0];
};

const removeCartItem = async (userId, itemId) => {
  const cart = await getOrCreateCart(userId);

  const deleted = await pool.query(
    'DELETE FROM cart_items WHERE cart_id = $1 AND item_id = $2 RETURNING *',
    [cart.id, itemId]
  );

  await pool.query(
    'UPDATE carts SET updated_at = NOW() WHERE id = $1',
    [cart.id]
  );

  return deleted.rows[0];
};

const clearCartByUserId = async (userId) => {
  const cart = await getOrCreateCart(userId);

  await pool.query(
    'DELETE FROM cart_items WHERE cart_id = $1',
    [cart.id]
  );

  await pool.query(
    'UPDATE carts SET updated_at = NOW() WHERE id = $1',
    [cart.id]
  );

  return true;
};

module.exports = {
  getCartItemsByUserId,
  addItemToCart,
  updateCartItemQuantity,
  removeCartItem,
  clearCartByUserId
};