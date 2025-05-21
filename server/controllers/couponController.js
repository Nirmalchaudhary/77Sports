const { Coupon } = require('../models');
const { Op } = require('sequelize');

const couponController = {
  // Create a new coupon
  createCoupon: async (req, res) => {
    try {
      const {
        code,
        name,
        description,
        discountType,
        discountValue,
        minPurchaseAmount,
        maxDiscountAmount,
        startDate,
        endDate,
        usageLimit,
        isActive,
        isFirstTimeUser
      } = req.body;

      // Validate required fields
      if (!code || !name || !discountType || !discountValue || !startDate || !endDate) {
        return res.status(400).json({ error: 'Missing required fields' });
      }

      // Validate discount type
      if (!['percentage', 'fixed'].includes(discountType)) {
        return res.status(400).json({ error: 'Invalid discount type' });
      }

      // Validate dates
      const start = new Date(startDate);
      const end = new Date(endDate);
      if (start >= end) {
        return res.status(400).json({ error: 'End date must be after start date' });
      }

      // Check if coupon code already exists
      const existingCoupon = await Coupon.findOne({ where: { code } });
      if (existingCoupon) {
        return res.status(400).json({ error: 'Coupon code already exists' });
      }

      // Create the coupon
      const coupon = await Coupon.create({
        code,
        name,
        description,
        discountType,
        discountValue,
        minPurchaseAmount: minPurchaseAmount || 0,
        maxDiscountAmount,
        startDate: start,
        endDate: end,
        usageLimit,
        isActive: isActive !== undefined ? isActive : true,
        isFirstTimeUser: isFirstTimeUser || false
      });

      res.status(201).json(coupon);
    } catch (err) {
      console.error('Error creating coupon:', err);
      res.status(500).json({ error: 'Failed to create coupon' });
    }
  },

  // Get all coupons
  getAllCoupons: async (req, res) => {
    try {
      const coupons = await Coupon.findAll({
        order: [['createdAt', 'DESC']]
      });
      res.json(coupons);
    } catch (err) {
      console.error('Error fetching coupons:', err);
      res.status(500).json({ error: 'Failed to fetch coupons' });
    }
  },

  // Get coupon by ID
  getCouponById: async (req, res) => {
    try {
      const coupon = await Coupon.findByPk(req.params.id);
      if (!coupon) {
        return res.status(404).json({ error: 'Coupon not found' });
      }
      res.json(coupon);
    } catch (err) {
      console.error('Error fetching coupon:', err);
      res.status(500).json({ error: 'Failed to fetch coupon' });
    }
  },

  // Update coupon
  updateCoupon: async (req, res) => {
    try {
      const coupon = await Coupon.findByPk(req.params.id);
      if (!coupon) {
        return res.status(404).json({ error: 'Coupon not found' });
      }

      const {
        code,
        name,
        description,
        discountType,
        discountValue,
        minPurchaseAmount,
        maxDiscountAmount,
        startDate,
        endDate,
        usageLimit,
        isActive,
        isFirstTimeUser
      } = req.body;

      // Validate dates if provided
      if (startDate && endDate) {
        const start = new Date(startDate);
        const end = new Date(endDate);
        if (start >= end) {
          return res.status(400).json({ error: 'End date must be after start date' });
        }
      }

      // Check for duplicate code if code is being updated
      if (code && code !== coupon.code) {
        const existingCoupon = await Coupon.findOne({ where: { code } });
        if (existingCoupon) {
          return res.status(400).json({ error: 'Coupon code already exists' });
        }
      }

      // Update the coupon
      await coupon.update({
        code: code || coupon.code,
        name: name || coupon.name,
        description: description || coupon.description,
        discountType: discountType || coupon.discountType,
        discountValue: discountValue || coupon.discountValue,
        minPurchaseAmount: minPurchaseAmount !== undefined ? minPurchaseAmount : coupon.minPurchaseAmount,
        maxDiscountAmount: maxDiscountAmount !== undefined ? maxDiscountAmount : coupon.maxDiscountAmount,
        startDate: startDate ? new Date(startDate) : coupon.startDate,
        endDate: endDate ? new Date(endDate) : coupon.endDate,
        usageLimit: usageLimit !== undefined ? usageLimit : coupon.usageLimit,
        isActive: isActive !== undefined ? isActive : coupon.isActive,
        isFirstTimeUser: isFirstTimeUser !== undefined ? isFirstTimeUser : coupon.isFirstTimeUser
      });

      res.json(coupon);
    } catch (err) {
      console.error('Error updating coupon:', err);
      res.status(500).json({ error: 'Failed to update coupon' });
    }
  },

  // Delete coupon
  deleteCoupon: async (req, res) => {
    try {
      const coupon = await Coupon.findByPk(req.params.id);
      if (!coupon) {
        return res.status(404).json({ error: 'Coupon not found' });
      }

      await coupon.destroy();
      res.status(204).send();
    } catch (err) {
      console.error('Error deleting coupon:', err);
      res.status(500).json({ error: 'Failed to delete coupon' });
    }
  },

  // Get active coupons
  getActiveCoupons: async (req, res) => {
    try {
      const coupons = await Coupon.findAll({
        where: {
          isActive: true,
          startDate: {
            [Op.lte]: new Date()
          },
          endDate: {
            [Op.gte]: new Date()
          }
        },
        order: [['createdAt', 'DESC']]
      });
      res.json(coupons);
    } catch (err) {
      console.error('Error fetching active coupons:', err);
      res.status(500).json({ error: 'Failed to fetch active coupons' });
    }
  },

  // Validate coupon
  validate: async (req, res) => {
    try {
      const { code , amount } = req.body;
      const now = new Date();

      const coupon = await Coupon.findOne({
        where: {
          code,
          isActive: true,
          startDate: {
            [Op.lte]: now
          },
          endDate: {
            [Op.gte]: now
          }
        }
      });

      if (!coupon) {
        return res.status(400).json({ error: 'Invalid or expired coupon' });
      }

      // Check usage limit
      if (coupon.usageLimit && coupon.usageCount >= coupon.usageLimit) {
        return res.status(400).json({ error: 'Coupon usage limit reached' });
      }

      // Check minimum purchase amount
      if (coupon.minPurchaseAmount && amount < coupon.minPurchaseAmount) {
        return res.status(400).json({ 
          error: `Minimum purchase amount of ₹${coupon.minPurchaseAmount} required` 
        });
      }

      // Calculate discount
      let discount = 0;
      if (coupon.discountType === 'percentage') {
        discount = (amount * coupon.discountValue) / 100;
        if (coupon.maxDiscountAmount) {
          discount = Math.min(discount, coupon.maxDiscountAmount);
        }
      } else {
        discount = coupon.discountValue;
      }

      res.json({
        coupon,
        discount,
        finalAmount: amount - discount
      });
    } catch (err) {
      console.error('Error validating coupon:', err);
      res.status(500).json({ error: 'Failed to validate coupon' });
    }
  }
};

module.exports = couponController; 