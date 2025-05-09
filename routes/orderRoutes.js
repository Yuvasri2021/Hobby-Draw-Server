// routes/orders.js

const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const Artwork = require('../models/Artwork');
const authMiddleware = require('../middleware/authMiddleware');

// POST /api/orders/place
router.post('/place', authMiddleware, async (req, res) => {
  try {
    const { items } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ message: 'Cart is empty' });
    }

    // Fetch full artwork details for each item
    const populatedItems = await Promise.all(items.map(async (item) => {
      const artwork = await Artwork.findById(item.artwork);
      return {
        artwork: artwork._id,
        title: artwork.title,
        price: artwork.price,
        imageUrl: artwork.imageUrl,
      };
    }));

    const newOrder = new Order({
      user: req.user._id,
      items: populatedItems,
      placedAt: new Date()
    });

    await newOrder.save();

    res.status(201).json({ message: 'Order placed successfully', order: newOrder });
  } catch (err) {
    console.error('Order placement failed:', err);
    res.status(500).json({ message: 'Failed to place order' });
  }
});


// GET /api/orders/my-orders
router.get('/my-orders', authMiddleware, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort({ placedAt: -1 });
    res.json(orders);
  } catch (err) {
    console.error('Error fetching orders:', err.message);
    res.status(500).json({ message: 'Server error fetching orders' });
  }
});

// DELETE /api/orders/:orderId
router.delete('/:orderId', authMiddleware, async (req, res) => {
  try {
    const { orderId } = req.params;
    const userId = req.user._id;

    const order = await Order.findById(orderId);
    if (!order) return res.status(404).json({ message: 'Order not found' });
    if (order.user.toString() !== userId.toString()) return res.status(403).json({ message: 'Unauthorized' });

    await Order.findByIdAndDelete(orderId);
    res.json({ message: 'Order deleted successfully' });
  } catch (err) {
    console.error('Error deleting order:', err.message);
    res.status(500).json({ message: 'Server error deleting order' });
  }
});

module.exports = router;
