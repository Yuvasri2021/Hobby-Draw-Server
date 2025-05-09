const express = require('express');
const router = express.Router();
const Cart = require('../models/Cart');
const authMiddleware = require('../middleware/authMiddleware');

// Add to cart
router.post('/', authMiddleware, async (req, res) => {
  const { artworkId } = req.body;
  if (!artworkId) return res.status(400).json({ message: 'Artwork ID required' });

  try {
    const cartItem = new Cart({ user: req.user._id, artwork: artworkId });
    await cartItem.save();
    res.status(201).json({ message: 'Artwork added to cart' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
