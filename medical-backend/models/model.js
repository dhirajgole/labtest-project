const pool = require('../db');

const getAllLabTests = async () => {
  const result = await pool.query('SELECT * FROM lab_tests ORDER BY id ASC');
  return result.rows;
};

const getAllMedicines = async () => {
  const result = await pool.query('SELECT * FROM medicines ORDER BY id ASC');
  return result.rows;
};

module.exports = { getAllLabTests , getAllMedicines };