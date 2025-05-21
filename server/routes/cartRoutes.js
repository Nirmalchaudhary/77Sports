const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cartController');
const { authenticateToken } = require('../middleware/auth');

// All routes require authentication
router.use(authenticateToken);

// Get user's cart
router.get('/', cartController.getCart);

// Add item to cart
router.post('/', cartController.addToCart);

// Update cart item quantity
router.put('/:id', cartController.updateCartItem);

// Remove item from cart
router.delete('/:id', cartController.removeFromCart);

module.exports = router; 