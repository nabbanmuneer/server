const express = require("express");
const router = express.Router();

const adminControllers = require('../controllers/adminControllers');

router.post('/login',adminControllers.adminLogin);
router.get('/fullData',adminControllers.adminData);

module.exports = router;

