const { Wishlist, Product } = require('../models');

const wishlistController = {
  // Get user's wishlist
  getWishlist: async (req, res) => {
    try {
      const wishlistItems = await Wishlist.findAll({
        where: { userId: req.user.id },
        include: [{
          model: Product,
          as: 'product',
          attributes: ['id', 'name', 'description', 'sellingPrice', 'imageUrl', 'stockQuantity']
        }]
      });
      res.json(wishlistItems);
    } catch (err) {
      console.error('Error fetching wishlist:', err);
      res.status(500).json({ error: 'Failed to fetch wishlist' });
    }
  },

  // Add item to wishlist
  addToWishlist: async (req, res) => {
    try {
      const { productId } = req.body;
      
      // Check if product exists
      const product = await Product.findByPk(productId);
      if (!product) {
        return res.status(404).json({ error: 'Product not found' });
      }

      // Check if item already exists in wishlist
      const existingItem = await Wishlist.findOne({
        where: { userId: req.user.id, productId }
      });

      if (existingItem) {
        return res.status(400).json({ error: 'Item already in wishlist' });
      }

      const wishlistItem = await Wishlist.create({
        userId: req.user.id,
        productId
      });

      res.status(201).json(wishlistItem);
    } catch (err) {
      console.error('Error adding to wishlist:', err);
      res.status(500).json({ error: 'Failed to add item to wishlist' });
    }
  },

  // Remove item from wishlist
  removeFromWishlist: async (req, res) => {
    try {
      const { id } = req.params;
      const wishlistItem = await Wishlist.findOne({
        where: { id, userId: req.user.id }
      });

      if (!wishlistItem) {
        return res.status(404).json({ error: 'Wishlist item not found' });
      }

      await wishlistItem.destroy();
      res.status(204).send();
    } catch (err) {
      console.error('Error removing from wishlist:', err);
      res.status(500).json({ error: 'Failed to remove item from wishlist' });
    }
  }
};

module.exports = wishlistController; 