const express = require('express');
const router = express.Router();
const bannerController = require('../controllers/bannerController');

router.get('/admin', bannerController.getAllBanners);
router.post('/admin', bannerController.createBanner);
router.put('/admin/:id', bannerController.updateBanner);
router.delete('/admin/:id', bannerController.deleteBanner);
module.exports = router; 