const express = require('express');
const router = express.Router();
const { isAdmin } = require('../middleware/auth');
const adminController = require('../controllers/adminController');

// User Management Routes
router.get('/users', isAdmin, adminController.getAllUsers);
router.post('/users', isAdmin, adminController.createUser);


module.exports = router; 