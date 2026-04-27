const express = require('express');
const router = express.Router();
const { fetchLabTests , fetchMedicines} = require('../controller/controller');

router.get('/labtests', fetchLabTests);
router.get('/medicines', fetchMedicines);

module.exports = router;