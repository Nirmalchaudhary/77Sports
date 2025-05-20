const { OrderItem, Product, Order } = require('../models');

exports.getAllOrderItems = async (req, res) => {
  try {
    const items = await OrderItem.findAll({ 
      include: [
        { model: Product, as: 'product' }, 
        { model: Order, as: 'order' }
      ] 
    });
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.createOrderItem = async (req, res) => {
  try {
    const item = await OrderItem.create(req.body);
    res.status(201).json(item);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.updateOrderItem = async (req, res) => {
  try {
    const [updated] = await OrderItem.update(req.body, { 
      where: { id: req.params.id } 
    });
    if (!updated) return res.status(404).json({ error: 'Order item not found' });
    const updatedItem = await OrderItem.findByPk(req.params.id);
    res.json(updatedItem);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.deleteOrderItem = async (req, res) => {
  try {
    const deleted = await OrderItem.destroy({ 
      where: { id: req.params.id } 
    });
    if (!deleted) return res.status(404).json({ error: 'Order item not found' });
    res.json({ message: 'Order item deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}; 