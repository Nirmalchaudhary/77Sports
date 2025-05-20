const { Product } = require('../models');

const cartController = {
  addToCart: async (req, res) => {
    try {
      const { productId, quantity } = req.body;
      const product = await Product.findByPk(productId);
      
      if (!product) {
        return res.status(404).json({ error: 'Product not found' });
      }

      let cart = req.session.cart || [];
      const existingItem = cart.find(item => item.productId === productId);

      if (existingItem) {
        existingItem.quantity += quantity;
      } else {
        cart.push({
          productId,
          quantity,
          price: product.sellingPrice
        });
      }

      req.session.cart = cart;
      res.json(cart);
    } catch (err) {
      res.status(500).json({ error: 'Failed to add item to cart' });
    }
  },

  getCart: async (req, res) => {
    try {
      const cart = req.session.cart || [];
      const cartItems = await Promise.all(
        cart.map(async (item) => {
          const product = await Product.findByPk(item.productId);
          return {
            ...item,
            product: {
              id: product.id,
              name: product.name,
              imageUrl: product.imageUrl,
              price: product.sellingPrice
            }
          };
        })
      );
      res.json(cartItems);
    } catch (err) {
      res.status(500).json({ error: 'Failed to fetch cart' });
    }
  }
};

module.exports = cartController; 