'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('coupons', 'applicableCategories', {
      type: Sequelize.JSON,
      allowNull: true,
      defaultValue: null
    });

    await queryInterface.addColumn('coupons', 'applicableProducts', {
      type: Sequelize.JSON,
      allowNull: true,
      defaultValue: null
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('coupons', 'applicableCategories');
    await queryInterface.removeColumn('coupons', 'applicableProducts');
  }
}; 