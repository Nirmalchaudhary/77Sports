const express = require('express');
const router = express.Router();
const { authenticateToken, isAdmin } = require('../middleware/auth');
const orderController = require('../controllers/orderController');

// Get all orders
router.get('/', authenticateToken, isAdmin, orderController.getAllOrders);

// Get user orders
router.get('/user/:userId', authenticateToken, orderController.getUserOrders);

// Create order
router.post('/', authenticateToken, orderController.createOrder);

// Update order status
router.put('/:id/status', authenticateToken, isAdmin, orderController.updateOrderStatus);

module.exports = router; 