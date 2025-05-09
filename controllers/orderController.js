const Order = require('../models/Order');

exports.placeOrder = async (req, res) => {
  const { artworkId } = req.body;
  const order = await Order.create({ buyer: req.userId, artworkId });
  res.json(order);
};

exports.getMyOrders = async (req, res) => {
  const orders = await Order.find({ buyer: req.userId }).populate('artworkId');
  res.json(orders);
};
