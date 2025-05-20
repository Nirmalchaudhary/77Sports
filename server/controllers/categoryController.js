const { Category } = require('../models');

const categoryController = {
  getAllCategories: async (req, res) => {
    try {
      const categories = await Category.findAll({
        order: [['createdAt', 'DESC']]
      });
      res.json(categories);
    } catch (err) {
      console.error('Error fetching categories:', err);
      res.status(500).json({ error: 'Failed to fetch categories' });
    }
  },

  createCategory: async (req, res) => {
    try {
      const { name, description, imageUrl } = req.body;
      
      if (!name) {
        return res.status(400).json({ error: 'Category name is required' });
      }
console.log(imageUrl)
      const category = await Category.create({
        name,
        description,
        imageUrl
      });
      res.status(201).json(category);
    } catch (err) {
      console.error('Error creating category:', err);
      res.status(500).json({ error: 'Failed to create category' });
    }
  },

  updateCategory: async (req, res) => {
    try {
      const { id } = req.params;
      const { name, description, imageUrl } = req.body;

      const category = await Category.findByPk(id);
      if (!category) {
        return res.status(404).json({ error: 'Category not found' });
      }

      await category.update({
        name,
        description,
        imageUrl
      });
      res.json(category);
    } catch (err) {
      console.error('Error updating category:', err);
      res.status(500).json({ error: 'Failed to update category' });
    }
  },

  deleteCategory: async (req, res) => {
    try {
      const { id } = req.params;
      const category = await Category.findByPk(id);
      
      if (!category) {
        return res.status(404).json({ error: 'Category not found' });
      }

      await category.destroy();
      res.status(204).send();
    } catch (err) {
      console.error('Error deleting category:', err);
      res.status(500).json({ error: 'Failed to delete category' });
    }
  }
};

module.exports = categoryController; 