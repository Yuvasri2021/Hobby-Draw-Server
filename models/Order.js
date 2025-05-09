const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  items: [
    {
      artwork: { type: mongoose.Schema.Types.ObjectId, ref: 'Artwork' },
      title: String,
      price: Number,
      imageUrl: String,
    }
  ],
  placedAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Order', orderSchema);
