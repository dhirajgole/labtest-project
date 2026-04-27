const pool = require('../db');

const createLocalOrder = async ({
  userId,
  razorpayOrderId,
  totalAmount,
  payment_status,
  items
}) => {
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    const orderQuery = `
      INSERT INTO orders (
        user_id,
        razorpay_order_id,
        total_amount,
        payment_status,
        delivery_status,
        created_at
      )
      VALUES ($1, $2, $3, $4, $5, NOW())
      RETURNING *
    `;

    const orderValues = [
      userId,
      razorpayOrderId,
      totalAmount,
      payment_status,
      'Processing'
    ];

    const orderResult = await client.query(orderQuery, orderValues);
    const order = orderResult.rows[0];

    for (const item of items) {
      const itemQuery = `
        INSERT INTO order_items (
          order_id,
          item_id,
          name,
          price,
          quantity,
          type,
          img,
          category,
          subtotal
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      `;

      const itemValues = [
        order.id,
        String(item.id),
        item.name,
        Number(item.price),
        Number(item.quantity),
        item.type || null,
        item.img || null,
        item.category || null,
        Number(item.price) * Number(item.quantity)
      ];

      await client.query(itemQuery, itemValues);
    }

    await client.query('COMMIT');
    return order;
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
};

const markOrderPaid = async ({
  razorpayOrderId,
  razorpayPaymentId,
  razorpaySignature
}) => {
  const query = `
    UPDATE orders
    SET
      razorpay_payment_id = $1,
      razorpay_signature = $2,
      payment_status = 'paid',
      paid_at = NOW()
    WHERE razorpay_order_id = $3
    RETURNING *
  `;

  const values = [razorpayPaymentId, razorpaySignature, razorpayOrderId];
  const result = await pool.query(query, values);
  return result.rows[0];
};

const markOrderFailed = async ({
  razorpayOrderId,
  payment_status = 'failed'
}) => {
  const query = `
    UPDATE orders
    SET payment_status = $1
    WHERE razorpay_order_id = $2
    RETURNING *
  `;

  const values = [payment_status, razorpayOrderId];
  const result = await pool.query(query, values);
  return result.rows[0];
};

const getOrdersByUserId = async (userId) => {
  const ordersQuery = `
    SELECT *
    FROM orders
    WHERE user_id = $1
    ORDER BY created_at DESC
  `;

  const ordersResult = await pool.query(ordersQuery, [userId]);
  const orders = ordersResult.rows;

  for (const order of orders) {
    const itemsQuery = `
      SELECT *
      FROM order_items
      WHERE order_id = $1
      ORDER BY id ASC
    `;
    const itemsResult = await pool.query(itemsQuery, [order.id]);
    order.items = itemsResult.rows;
  }

  return orders;
};

module.exports = {
  createLocalOrder,
  markOrderPaid,
  markOrderFailed,
  getOrdersByUserId
};