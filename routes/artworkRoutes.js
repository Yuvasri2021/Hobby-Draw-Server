const express = require('express');
const router = express.Router();
const Artwork = require('../models/Artwork');
const authMiddleware = require('../middleware/authMiddleware');
const User = require('../models/User');
const jwt = require('jsonwebtoken'); // Import JWT for token verification

// Create Artwork (This should be an artist action, so it also needs role validation)
router.post('/', authMiddleware, async (req, res) => {
  const { title, description, price, imageUrl } = req.body;

  try {
    // Role validation to ensure only artists can create/upload artwork
    const user = await User.findById(req.user._id);
    if (user.role !== 'artist') {
      return res.status(403).json({ message: 'Only artists can upload artwork.' });
    }

    const artwork = new Artwork({
      title,
      description,
      price,
      imageUrl,
      uploadedBy: req.user._id, // user uploading the artwork
    });

    await artwork.save();
    res.status(201).json(artwork);
  } catch (err) {
    res.status(500).json({ message: 'Error uploading artwork', error: err.message });
  }
});

// Get all artworks with optional filters
router.get('/', async (req, res) => {
  const { search, minPrice, maxPrice } = req.query;
  let filter = {};

  if (search) filter.title = { $regex: search, $options: 'i' }; // Case-insensitive search
  if (minPrice || maxPrice) {
    filter.price = {};
    if (minPrice) filter.price.$gte = parseFloat(minPrice);
    if (maxPrice) filter.price.$lte = parseFloat(maxPrice);
  }

  try {
    const artworks = await Artwork.find(filter).sort({ createdAt: -1 });
    res.json(artworks);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching artworks' });
  }
});

// Get user artworks (only the artworks uploaded by the logged-in user)
router.get('/my-artworks', authMiddleware, async (req, res) => {
  try {
    const artworks = await Artwork.find({ uploadedBy: req.user._id });
    res.json(artworks);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching your artworks' });
  }
});

// Get a single artwork by ID
router.get('/:id', async (req, res) => {
  try {
    const artwork = await Artwork.findById(req.params.id);
    if (!artwork) return res.status(404).json({ message: 'Not found' });
    res.json(artwork);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching artwork' });
  }
});

// Update Artwork
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const updated = await Artwork.findByIdAndUpdate(
      req.params.id,
      { title: req.body.title, description: req.body.description, price: req.body.price },
      { new: true }
    );
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: 'Update failed' });
  }
});

// Delete Artwork
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const deleted = await Artwork.findByIdAndDelete(req.params.id);
    res.json({ message: 'Artwork deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Delete failed' });
  }
});

// Fetch only the artist's own artworks (this is for the artist to view their artworks)
router.get('/my-artworks', authMiddleware, async (req, res) => {
  try {
    const artworks = await Artwork.find({ uploadedBy: req.user._id });
    res.json(artworks);
  } catch (err) {
    res.status(500).json({ message: 'Error loading your artworks' });
  }
});

// Get the currently authenticated user's details
router.get('/me', authMiddleware, async (req, res) => {
  try {
      const user = await User.findById(req.user.id);
      if (!user) {
          console.error('User not found');
          return res.status(404).json({ message: 'User not found' });
      }
      res.json(user);
  } catch (error) {
      console.error('Error fetching user:', error);  // Log the error
      res.status(500).json({ message: 'Server error' });
  }
});



module.exports = router;
