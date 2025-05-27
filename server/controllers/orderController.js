const { Order, User, OrderItem, Product } = require('../models');

const orderController = {
    getAllOrders: async (req, res) => {
        try {
            const orders = await Order.findAll({
                include: [
                    { model: User, as: 'user' },
                    { 
                        model: OrderItem, 
                        as: 'orderItems',
                        include: [{ model: Product, as: 'product' }]
                    }
                ],
                order: [['createdAt', 'DESC']]
            });
            res.json(orders);
        } catch (err) {
            console.error('Error fetching orders:', err);
            res.status(500).json({ error: 'Failed to fetch orders' });
        }
    },

    getUserOrders: async (req, res) => {
        try {
            const  userId = req.params.userId;
            console.log(userId)
            const orders = await Order.findAll({
                where: { userId },
                include: [
                    { 
                        model: OrderItem, 
                        as: 'orderItems',
                        include: [{ model: Product, as: 'product' }]
                    }
                ],
                order: [['createdAt', 'DESC']]
            });
            res.json(orders);
        } catch (err) {
            console.error('Error fetching user orders:', err);
            res.status(500).json({ error: 'Failed to fetch user orders' });
        }
    },

    createOrder: async (req, res) => {
        try {
            const { userId, items, totalAmount, shippingAddress, paymentMethod } = req.body;

            if (!userId || !items || !totalAmount || !paymentMethod) {
                return res.status(400).json({ error: 'Required fields missing' });
            }

            const order = await Order.create({
                userId,
                totalAmount,
                shippingAddress,
                status: 'pending',
            });

            // Create order items
            await Promise.all(items.map(item => 
                OrderItem.create({
                    orderId: order.id,
                    productId: item.productId,
                    quantity: item.quantity,
                    price: item.price
                })
            ));

            const createdOrder = await Order.findByPk(order.id, {
                include: [
                    { model: User, as: 'user' },
                    { 
                        model: OrderItem, 
                        as: 'orderItems',
                        include: [{ model: Product, as: 'product' }]
                    }
                ]
            });

            res.status(201).json(createdOrder);
        } catch (err) {
            console.error('Error creating order:', err);
            res.status(500).json({ error: 'Failed to create order' });
        }
    },

    updateOrderStatus: async (req, res) => {
        try {
            const { id } = req.params;
            const { status } = req.body;

            const order = await Order.findByPk(id);
            if (!order) {
                return res.status(404).json({ error: 'Order not found' });
            }

            await order.update({ status });
            res.json(order);
        } catch (err) {
            console.error('Error updating order:', err);
            res.status(500).json({ error: 'Failed to update order' });
        }
    }
};

module.exports = orderController; 