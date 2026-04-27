const { getAllLabTests , getAllMedicines} = require('../models/model');

const fetchLabTests = async (req, res) => {
  try {
    const tests = await getAllLabTests();
    res.status(200).json(tests);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching lab tests', error: error.message });
  }
};

const fetchMedicines = async (req, res) => {
  try {
    const medicines = await getAllMedicines();
    res.status(200).json(medicines);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching medicines', error: error.message });
  }
};

module.exports = { fetchLabTests , fetchMedicines};