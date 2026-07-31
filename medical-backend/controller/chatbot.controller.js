const pool = require("../db");
const axios = require("axios");

exports.chat = async (req, res) => {
   try {

      const { message } = req.body;
      const userId = req.user.id;

      // User Info
      const userQuery = await pool.query(
         `
         SELECT id, username, email
         FROM users
         WHERE id = $1
         `,
         [userId]
      );

      const user = userQuery.rows[0];

      // Cart Info
      const ordersQuery = await pool.query(
         `
         SELECT
            cart_items.name,
            cart_items.price,
            cart_items.quantity,
            cart_items.category,
            cart_items.type,
            carts.created_at
         FROM cart_items

         JOIN carts
            ON carts.id = cart_items.cart_id

         WHERE carts.user_id = $1

         ORDER BY carts.created_at DESC

         LIMIT 5
         `,
         [userId]
      );

      const orders = ordersQuery.rows;

      // Database Context
      const dbContext = `
User Name: ${user?.username}
User Email: ${user?.email}

Recent Cart Items:
${JSON.stringify(orders, null, 2)}
`;

      // Call Python RAG API
      const response = await axios.post(
         "http://127.0.0.1:8000/chat",
         {
            conversation_id: userId.toString(),
            question: message,
            db_context: dbContext
         }
      );

      res.json({
         answer: response.data.answer
      });

   }
   catch (err) {

      console.error(err.response?.data || err.message);

      res.status(500).json({
         error: "Server Error"
      });

   }
};