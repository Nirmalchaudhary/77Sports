const express = require('express');
const router = express.Router();
const { isAdmin } = require('../middleware/auth');
const adminController = require('../controllers/adminController');

// User Management Routes
router.get('/users', isAdmin, adminController.getAllUsers);
router.post('/users', isAdmin, adminController.createUser);

// Category Management Routes
router.get('/categories', isAdmin, adminController.getAllCategories);
router.post('/categories', isAdmin, adminController.createCategory);

// Banner Management Routes
router.get('/banners', isAdmin, adminController.getAllBanners);
router.post('/banners', isAdmin, adminController.createBanner);

module.exports = router; 