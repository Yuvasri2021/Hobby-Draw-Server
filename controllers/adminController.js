const Artwork = require('../models/Artwork');
const Order = require('../models/Order');
const User = require('../models/User');

exports.getAllArtworks = async (req, res) => {
  try {
    const artworks = await Artwork.find().populate('artist', 'name email');
    res.json(artworks);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate('customer', 'name email')
      .populate('items.artwork', 'title price imageUrl');
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getAllArtistsWithArtworks = async (req, res) => {
  try {
    const artists = await User.find({ role: 'artist' }).select('-password');
    const artistsWithArtworks = await Promise.all(
      artists.map(async (artist) => {
        const artworks = await Artwork.find({ artist: artist._id });
        return { ...artist.toObject(), artworks };
      })
    );
    res.json(artistsWithArtworks);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getAllCustomersWithOrders = async (req, res) => {
  try {
    const customers = await User.find({ role: 'customer' }).select('-password');
    const customersWithOrders = await Promise.all(
      customers.map(async (customer) => {
        const orders = await Order.find({ customer: customer._id }).populate('items.artwork', 'title price imageUrl');
        return { ...customer.toObject(), orders };
      })
    );
    res.json(customersWithOrders);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};
