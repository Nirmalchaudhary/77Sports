'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Order extends Model {
    static associate(models) {
      Order.belongsTo(models.User, {
        foreignKey: 'userId',
        as: 'user'
      });
      Order.hasMany(models.OrderItem, {
        foreignKey: 'orderId',
        as: 'orderItems'
      });
    }
  }
  
  Order.init({
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Users',
        key: 'id'
      }
    },
    totalAmount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      validate: {
        min: 0
      }
    },
    status: {
      type: DataTypes.ENUM('pending', 'processing', 'shipped', 'delivered', 'cancelled'),
      defaultValue: 'pending'
    },
    shippingAddress: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    // trackingNumber: {
    //   type: DataTypes.STRING
    // }
  }, {
    sequelize,
    modelName: 'Order',
    hooks: {
      beforeCreate: async (order) => {
        // You can add any pre-save logic here
      },
      afterCreate: async (order) => {
        // You can add any post-save logic here
      }
    }
  });
  
  return Order;
}; 