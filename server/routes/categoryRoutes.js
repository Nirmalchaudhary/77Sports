const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController');
const { authenticateToken } = require('../middleware/auth');

// Public routes
router.get('/admin', categoryController.getAllCategories);

// Admin routes
router.post('/admin', authenticateToken, categoryController.createCategory);
router.put('/admin/:id', authenticateToken, categoryController.updateCategory);
router.delete('/admin/:id', authenticateToken, categoryController.deleteCategory);

module.exports = router; 