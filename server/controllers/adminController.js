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
};

module.exports = adminController; 