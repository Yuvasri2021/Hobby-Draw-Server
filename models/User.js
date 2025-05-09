// models/User.js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs'); // ✅ match what you're using in routes

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['artist', 'customer'], required: true },  // <-- Add the role here
});

module.exports = mongoose.model('User', userSchema);
