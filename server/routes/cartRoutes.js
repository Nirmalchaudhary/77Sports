const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cartController');
const { authenticateToken } = require('../middleware/auth');

router.post('/', authenticateToken, cartController.addToCart);
router.get('/', authenticateToken, cartController.getCart);

module.exports = router; 