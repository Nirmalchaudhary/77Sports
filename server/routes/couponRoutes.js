const express = require('express');
const router = express.Router();
const { authenticateToken, isAdmin } = require('../middleware/auth');
const couponController = require('../controllers/couponController');

// Admin routes
router.post('/admin', authenticateToken, isAdmin, couponController.createCoupon);
router.get('/admin', authenticateToken, isAdmin, couponController.getAllCoupons);
router.get('/admin/:id', authenticateToken, isAdmin, couponController.getCouponById);
router.put('/admin/:id', authenticateToken, isAdmin, couponController.updateCoupon);
router.delete('/admin/:id', authenticateToken, isAdmin, couponController.deleteCoupon);

// Public route
router.get('/active', couponController.getActiveCoupons);
router.post('/validate', couponController.validate);

module.exports = router; 