const { Cart, Product } = require('../models');

const cartController = {
  // Get user's cart
  getCart: async (req, res) => {
    try {
      const cartItems = await Cart.findAll({
        where: { userId: req.user.id },
        include: [{
          model: Product,
          as: 'product',
          attributes: ['id', 'name', 'description', 'sellingPrice', 'imageUrl', 'stockQuantity']
        }]
      });
      res.json(cartItems);
    } catch (err) {
      console.error('Error fetching cart:', err);
      res.status(500).json({ error: 'Failed to fetch cart' });
    }
  },

  // Add item to cart
  addToCart: async (req, res) => {
    try {
      const { productId, quantity } = req.body;
      
      // Check if product exists and has enough stock
      const product = await Product.findByPk(productId);
      if (!product) {
        return res.status(404).json({ error: 'Product not found' });
      }
      if (product.stockQuantity < quantity) {
        return res.status(400).json({ error: 'Not enough stock available' });
      }

      // Check if item already exists in cart
      let cartItem = await Cart.findOne({
        where: { userId: req.user.id, productId }
      });

      if (cartItem) {
        // Update quantity if item exists
        cartItem.quantity += quantity;
        await cartItem.save();
      } else {
        // Create new cart item
        cartItem = await Cart.create({
          userId: req.user.id,
          productId,
          quantity
        });
      }

      res.status(201).json(cartItem);
    } catch (err) {
      console.error('Error adding to cart:', err);
      res.status(500).json({ error: 'Failed to add item to cart' });
    }
  },

  // Update cart item quantity
  updateCartItem: async (req, res) => {
    try {
      const { id } = req.params;
      const { quantity } = req.body;

      const cartItem = await Cart.findOne({
        where: { id, userId: req.user.id },
        include: [{ model: Product, as: 'product' }]
      });

      if (!cartItem) {
        return res.status(404).json({ error: 'Cart item not found' });
      }

      if (cartItem.product.stockQuantity < quantity) {
        return res.status(400).json({ error: 'Not enough stock available' });
      }

      cartItem.quantity = quantity;
      await cartItem.save();

      res.json(cartItem);
    } catch (err) {
      console.error('Error updating cart item:', err);
      res.status(500).json({ error: 'Failed to update cart item' });
    }
  },

  // Remove item from cart
  removeFromCart: async (req, res) => {
    try {
      const { id } = req.params;
      const cartItem = await Cart.findOne({
        where: { id, userId: req.user.id }
      });

      if (!cartItem) {
        return res.status(404).json({ error: 'Cart item not found' });
      }

      await cartItem.destroy();
      res.status(204).send();
    } catch (err) {
      console.error('Error removing from cart:', err);
      res.status(500).json({ error: 'Failed to remove item from cart' });
    }
  },

  // Clear cart
  clearCart: async (req, res) => {
    try {
      const userId = req.user.id;
      await Cart.destroy({
        where: { userId }
      });
      res.json({ message: 'Cart cleared successfully' });
    } catch (error) {
      console.error('Error clearing cart:', error);
      res.status(500).json({ error: 'Failed to clear cart' });
    }
  }
};

module.exports = cartController; 