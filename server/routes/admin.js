const express = require('express');
const router = express.Router();
const { isAdmin } = require('../middleware/auth');
const { User, Category, Product, Banner } = require('../models');
const bcrypt = require('bcryptjs');

// Get all users
router.get('/users', isAdmin, async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: ['id', 'username', 'email', 'role', 'createdAt'],
      order: [['createdAt', 'DESC']]
    });
    res.json(users);
  } catch (err) {
    console.error('Error fetching users:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Create new user
router.post('/users', isAdmin, async (req, res) => {
  const { username, email, password, role } = req.body;
  
  try {
    // Check if user already exists
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const user = await User.create({
      username,
      email,
      password: hashedPassword,
      role: role || 'user'
    });

    // Return user without password
    const { password: _, ...userWithoutPassword } = user.toJSON();
    res.status(201).json(userWithoutPassword);
  } catch (err) {
    console.error('Error creating user:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update user
router.put('/users/:id', isAdmin, async (req, res) => {
  const { id } = req.params;
  const { username, email, password, role } = req.body;

  try {
    // Check if user exists
    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Update user
    const updateData = { username, email, role };
    if (password) {
      updateData.password = await bcrypt.hash(password, 10);
    }

    await user.update(updateData);

    // Return updated user without password
    const { password: _, ...userWithoutPassword } = user.toJSON();
    res.json(userWithoutPassword);
  } catch (err) {
    console.error('Error updating user:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete user
router.delete('/users/:id', isAdmin, async (req, res) => {
  const { id } = req.params;

  try {
    // Check if user exists
    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Prevent self-deletion
    if (user.id === req.user.id) {
      return res.status(400).json({ error: 'Cannot delete your own account' });
    }

    await user.destroy();
    res.json({ message: 'User deleted successfully' });
  } catch (err) {
    console.error('Error deleting user:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get all categories
router.get('/categories', isAdmin, async (req, res) => {
  try {
    const categories = await Category.findAll({
      order: [['createdAt', 'DESC']]
    });
    res.json(categories);
  } catch (err) {
    console.error('Error fetching categories:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Create new category
router.post('/categories', isAdmin, async (req, res) => {
  const { name, description } = req.body;
  
  try {
    const category = await Category.create({
      name,
      description
    });
    res.status(201).json(category);
  } catch (err) {
    console.error('Error creating category:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update category
router.put('/categories/:id', isAdmin, async (req, res) => {
  const { id } = req.params;
  const { name, description } = req.body;

  try {
    const category = await Category.findByPk(id);
    if (!category) {
      return res.status(404).json({ error: 'Category not found' });
    }

    await category.update({ name, description });
    res.json(category);
  } catch (err) {
    console.error('Error updating category:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete category
router.delete('/categories/:id', isAdmin, async (req, res) => {
  const { id } = req.params;

  try {
    const category = await Category.findByPk(id);
    if (!category) {
      return res.status(404).json({ error: 'Category not found' });
    }

    await category.destroy();
    res.json({ message: 'Category deleted successfully' });
  } catch (err) {
    console.error('Error deleting category:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get all products (with optional category filter)
router.get('/products', isAdmin, async (req, res) => {
  try {
    const { categoryId } = req.query;
    const where = categoryId ? { categoryId } : {};
    
    const products = await Product.findAll({
      where,
      include: [{
        model: Category,
        as: 'category',
        attributes: ['name']
      }],
      order: [['createdAt', 'DESC']]
    });
    res.json(products);
  } catch (err) {
    console.error('Error fetching products:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Create new product
router.post('/products', isAdmin, async (req, res) => {
  try {
    const { 
      name, 
      description, 
      mrp, 
      discount, 
      stockQuantity, 
      categoryId, 
      imageUrl, 
      isReturn, 
      isExchange 
    } = req.body;

    // Validate required fields
    if (!name || !mrp || !stockQuantity || !categoryId) {
      return res.status(400).json({ 
        error: 'Missing required fields',
        required: ['name', 'mrp', 'stockQuantity', 'categoryId']
      });
    }

    // Calculate selling price
    const sellingPrice = mrp - (mrp * (discount || 0) / 100);

    // Create new product
    const product = await Product.create({
      name,
      description,
      mrp: parseFloat(mrp),
      discount: parseFloat(discount || 0),
      sellingPrice: parseFloat(sellingPrice),
      stockQuantity: parseInt(stockQuantity),
      categoryId: parseInt(categoryId),
      imageUrl: imageUrl || null,
      isReturn: Boolean(isReturn),
      isExchange: Boolean(isExchange)
    });

    res.status(201).json(product);
  } catch (err) {
    console.error('Error creating product:', err);
    
    if (err.name === 'SequelizeValidationError') {
      return res.status(400).json({ 
        error: 'Validation error', 
        details: err.errors.map(e => e.message) 
      });
    }
    
    if (err.name === 'SequelizeForeignKeyConstraintError') {
      return res.status(400).json({ 
        error: 'Invalid category ID' 
      });
    }

    res.status(500).json({ 
      error: 'Internal server error',
      message: err.message 
    });
  }
});

// Update product
router.put('/products/:id', isAdmin, async (req, res) => {
  const { id } = req.params;
  const { name, description, mrp, discount, stockQuantity, categoryId, imageUrl, isReturn, isExchange } = req.body;

  try {
    const product = await Product.findByPk(id);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    await product.update({
      name,
      description,
      mrp,
      discount,
      stockQuantity,
      categoryId,
      imageUrl,
      isReturn,
      isExchange
    });
    res.json(product);
  } catch (err) {
    console.error('Error updating product:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete product
router.delete('/products/:id', isAdmin, async (req, res) => {
  const { id } = req.params;

  try {
    const product = await Product.findByPk(id);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    await product.destroy();
    res.json({ message: 'Product deleted successfully' });
  } catch (err) {
    console.error('Error deleting product:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Banner Management Routes
router.get('/banners', isAdmin, async (req, res) => {
  try {
    const banners = await Banner.findAll({
      order: [['order', 'ASC']]
    });
    res.json(banners);
  } catch (err) {
    console.error('Error fetching banners:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.post('/banners', isAdmin, async (req, res) => {
  try {
    const { title, description, imageUrl, link, isActive, order } = req.body;

    if (!title || !imageUrl) {
      return res.status(400).json({ 
        error: 'Missing required fields',
        required: ['title', 'imageUrl']
      });
    }

    const banner = await Banner.create({
      title,
      description,
      imageUrl,
      link,
      isActive: Boolean(isActive),
      order: parseInt(order) || 0
    });

    res.status(201).json(banner);
  } catch (err) {
    console.error('Error creating banner:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.put('/banners/:id', isAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const banner = await Banner.findByPk(id);
    
    if (!banner) {
      return res.status(404).json({ error: 'Banner not found' });
    }

    await banner.update(req.body);
    res.json(banner);
  } catch (err) {
    console.error('Error updating banner:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.delete('/banners/:id', isAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const banner = await Banner.findByPk(id);
    
    if (!banner) {
      return res.status(404).json({ error: 'Banner not found' });
    }

    await banner.destroy();
    res.status(204).send();
  } catch (err) {
    console.error('Error deleting banner:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router; 