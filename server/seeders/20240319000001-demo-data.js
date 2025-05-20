'use strict';
const bcrypt = require('bcryptjs');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Create admin user
    await queryInterface.bulkInsert('Users', [{
      username: 'admin',
      email: 'admin@example.com',
      password: await bcrypt.hash('admin123', 10),
      role: 'admin',
      createdAt: new Date(),
      updatedAt: new Date()
    }]);

    // Create categories
    await queryInterface.bulkInsert('Categories', [
      {
        name: 'Electronics',
        description: 'Electronic devices and accessories',
        slug: 'electronics',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Clothing',
        description: 'Fashion and apparel',
        slug: 'clothing',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Users', null, {});
    await queryInterface.bulkDelete('Categories', null, {});
  }
}; 