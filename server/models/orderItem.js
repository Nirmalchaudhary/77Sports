'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class OrderItem extends Model {
    static associate(models) {
      OrderItem.belongsTo(models.Order, {
        foreignKey: 'orderId',
        as: 'order'
      });
      OrderItem.belongsTo(models.Product, {
        foreignKey: 'productId',
        as: 'product'
      });
    }
  }
  
  OrderItem.init({
    orderId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Orders',
        key: 'id'
      }
    },
    productId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Products',
        key: 'id'
      }
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 1
      }
    },
    price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      validate: {
        min: 0
      }
    },
    subtotal: {
      type: DataTypes.VIRTUAL,
      get() {
        return this.quantity * this.price;
      }
    }
  }, {
    sequelize,
    modelName: 'OrderItem',
    hooks: {
      beforeCreate: async (orderItem) => {
        // You can add any pre-save logic here
      },
      afterCreate: async (orderItem) => {
        // Update product stock
        const product = await sequelize.models.Product.findByPk(orderItem.productId);
        if (product) {
          await product.update({
            stockQuantity: product.stockQuantity - orderItem.quantity
          });
        }
      }
    }
  });
  
  return OrderItem;
}; 