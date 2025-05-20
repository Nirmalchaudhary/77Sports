const { Product, Category } = require('../models');

const productController = {
    getAllProducts: async (req, res) => {
        try {
            const products = await Product.findAll({
                include: [{ model: Category, as: 'category' }],
                order: [['createdAt', 'DESC']]
            });
            res.json(products);
        } catch (err) {
            console.error('Error fetching products:', err);
            res.status(500).json({ error: 'Failed to fetch products' });
        }
    },

    createProduct: async (req, res) => {
        try {
            const product = await Product.create(req.body);

            res.status(201).json(product);
        } catch (err) {
            console.error('Error creating product:', err);
            res.status(500).json({ error: 'Failed to create product' });
        }
    },

    updateProduct: async (req, res) => {
        try {
            const { id } = req.params;
            const {
                name,
                description,
                price,
                categoryId,
                stock,
                imageUrl,
                isReturn,
                isExchange
            } = req.body;

            const product = await Product.findByPk(id);
            if (!product) {
                return res.status(404).json({ error: 'Product not found' });
            }

            await product.update({
                name,
                description,
                price,
                categoryId,
                stock,
                imageUrl,
                isReturn,
                isExchange
            });

            res.json(product);
        } catch (err) {
            console.error('Error updating product:', err);
            res.status(500).json({ error: 'Failed to update product' });
        }
    },

    deleteProduct: async (req, res) => {
        try {
            const { id } = req.params;
            const product = await Product.findByPk(id);
            
            if (!product) {
                return res.status(404).json({ error: 'Product not found' });
            }

            await product.destroy();
            res.status(204).send();
        } catch (err) {
            console.error('Error deleting product:', err);
            res.status(500).json({ error: 'Failed to delete product' });
        }
    }
};

module.exports = productController; 