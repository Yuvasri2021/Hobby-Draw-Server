// routes/dashboard.js
const express = require('express');
const router = express.Router();
const Artwork = require('../models/Artwork');
const Order = require('../models/Order');
const User = require('../models/User');

router.get('/stats', async (req, res) => {
  try {
    const [totalArtworks, totalOrders, totalArtists, totalCustomers, pendingOrders, revenueData] = await Promise.all([
      Artwork.countDocuments(),
      Order.countDocuments(),
      User.countDocuments({ role: 'artist' }),
      User.countDocuments({ role: 'customer' }),
      Order.countDocuments({ status: 'pending' }),
      Order.aggregate([
        { $match: { status: 'completed' } },
        { $group: { _id: null, total: { $sum: '$price' } } },
      ]),
    ]);

    const totalRevenue = revenueData[0]?.total || 0;

    res.json({
      totalArtworks,
      totalOrders,
      totalArtists,
      totalCustomers,
      pendingOrders,
      totalRevenue,
    });
  } catch (err) {
    console.error('Dashboard stats error:', err);
    res.status(500).json({ message: 'Error fetching dashboard stats' });
  }
});

module.exports = router;
