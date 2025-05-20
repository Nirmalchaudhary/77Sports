const express = require('express');
const router = express.Router();
const { authenticateToken, isAdmin } = require('../middleware/auth');
const productController = require('../controllers/productController');

// Get all products
router.get('/admin', productController.getAllProducts);

// Create product
router.post('/admin', authenticateToken, isAdmin, productController.createProduct);

// Update product
router.put('/admin/:id', authenticateToken, isAdmin, productController.updateProduct);

// Delete product
router.delete('/admin/:id', authenticateToken, isAdmin, productController.deleteProduct);

module.exports = router; 