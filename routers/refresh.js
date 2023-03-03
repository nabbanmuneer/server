const express = require('express');
const router = express.Router();
const refreshTokenController = require('../controllers/refreshTokenControllers');

router.get('/', refreshTokenController.handleRefreshToken);

module.exports = router;