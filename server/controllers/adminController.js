const { User, Category, Product, Banner } = require('../models');
const bcrypt = require('bcryptjs');

const adminController = {
    // User Management
    getAllUsers: async (req, res) => {
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
    },

    createUser: async (req, res) => {
        const { username, email, password, role } = req.body;
        
        try {
            const existingUser = await User.findOne({ where: { email } });
            if (existingUser) {
                return res.status(400).json({ error: 'User already exists' });
            }

            const hashedPassword = await bcrypt.hash(password, 10);

            const user = await User.create({
                username,
                email,
                password: hashedPassword,
                role: role || 'user'
            });

            const { password: _, ...userWithoutPassword } = user.toJSON();
            res.status(201).json(userWithoutPassword);
        } catch (err) {
            console.error('Error creating user:', err);
            res.status(500).json({ error: 'Internal server error' });
        }
    },

    // Category Management
    getAllCategories: async (req, res) => {
        try {
            const categories = await Category.findAll({
                order: [['createdAt', 'DESC']]
            });
            res.json(categories);
        } catch (err) {
            console.error('Error fetching categories:', err);
            res.status(500).json({ error: 'Internal server error' });
        }
    },

    createCategory: async (req, res) => {
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
    },

    // Banner Management
    getAllBanners: async (req, res) => {
        try {
            const banners = await Banner.findAll({
                order: [['order', 'ASC']]
            });
            res.json(banners);
        } catch (err) {
            console.error('Error fetching banners:', err);
            res.status(500).json({ error: 'Internal server error' });
        }
    },

    createBanner: async (req, res) => {
        const { title, description, imageUrl, link, order } = req.body;
        
        try {
            const banner = await Banner.create({
                title,
                description,
                imageUrl,
                link,
                order,
                isActive: true
            });
            res.status(201).json(banner);
        } catch (err) {
            console.error('Error creating banner:', err);
            res.status(500).json({ error: 'Internal server error' });
        }
    }
};

module.exports = adminController; 