const pool = require("../db");

const retrieveDocuments = require("../services/rag/retriever");
const askLLM = require("../services/rag/llm");

exports.chat = async (req, res) => {

   try {

      const { message } = req.body;

      // =====================================
      // USER FROM JWT
      // =====================================

      const userId = req.user.id;

      // =====================================
      // GET USER INFO
      // =====================================

      const userQuery = await pool.query(
         `
         SELECT id, username, email
         FROM users
         WHERE id = $1
         `,
         [userId]
      );

      const user = userQuery.rows[0];

      // =====================================
      // GET USER CART ITEMS
      // =====================================

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

      // =====================================
      // DATABASE CONTEXT
      // =====================================

      const dbContext = `
User Name: ${user?.username}
User Email: ${user?.email}

Recent Cart Items:
${JSON.stringify(orders, null, 2)}
`;

      console.log("DB CONTEXT:", dbContext);

      // =====================================
      // RAG RETRIEVAL
      // =====================================

      const docs = await retrieveDocuments(
         message,
         userId
      );

      console.log("DOCS:", docs);

      const ragContext = docs?.join("\n") || "";

      // =====================================
      // ASK LLM
      // =====================================

      const answer = await askLLM(
         message,
         dbContext,
         ragContext
      );

      // =====================================
      // RESPONSE
      // =====================================

      res.json({
         answer
      });

   }
   catch (err) {

      console.log("CHATBOT ERROR:", err);

      res.status(500).json({
         error: "Server Error"
      });
   }
};