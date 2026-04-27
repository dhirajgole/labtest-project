const pool = require('../db');

const findUserByEmail = async (email) => {
  const result = await pool.query(
    'SELECT * FROM users WHERE email = $1',
    [email]
  );
  return result.rows[0];
};

const findUserByUsername = async (username) => {
  const result = await pool.query(
    'SELECT * FROM users WHERE username = $1',
    [username]
  );
  return result.rows[0];
};

const findUserByEmailOrUsername = async (identifier) => {
  const result = await pool.query(
    'SELECT * FROM users WHERE email = $1 OR username = $1',
    [identifier]
  );
  return result.rows[0];
};

const createUser = async ({ fname, mname, lname, gender, dob, email, mobile, username, password_hash }) => {
  const result = await pool.query(
    `INSERT INTO users (fname, mname, lname, gender, dob, email, mobile, username, password_hash)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)
     RETURNING id, fname, mname, lname, gender, dob, email, mobile, username, created_at`,
    [fname, mname, lname, gender, dob, email, mobile, username, password_hash]
  );
  return result.rows[0];
};

const saveResetToken = async (user_id, reset_token, expires_at) => {
  await pool.query(
    `INSERT INTO password_resets (user_id, reset_token, expires_at)
     VALUES ($1, $2, $3)`,
    [user_id, reset_token, expires_at]
  );
};

const findValidResetToken = async (token) => {
  const result = await pool.query(
    `SELECT pr.*, u.email
     FROM password_resets pr
     JOIN users u ON u.id = pr.user_id
     WHERE pr.reset_token = $1
       AND pr.used = FALSE
       AND pr.expires_at > NOW()
     ORDER BY pr.id DESC
     LIMIT 1`,
    [token]
  );
  return result.rows[0];
};

const markResetTokenUsed = async (id) => {
  await pool.query(
    'UPDATE password_resets SET used = TRUE WHERE id = $1',
    [id]
  );
};

const updateUserPassword = async (user_id, password_hash) => {
  await pool.query(
    'UPDATE users SET password_hash = $1 WHERE id = $2',
    [password_hash, user_id]
  );
};

module.exports = {
  findUserByEmail,
  findUserByUsername,
  findUserByEmailOrUsername,
  createUser,
  saveResetToken,
  findValidResetToken,
  markResetTokenUsed,
  updateUserPassword
};