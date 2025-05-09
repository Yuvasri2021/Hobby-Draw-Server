// server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

// Routes
const authRoutes = require('./routes/authRoutes');
const artworkRoutes = require('./routes/artworkRoutes');
const uploadRoutes = require('./routes/uploadRoutes');
const orderRoutes = require('./routes/orderRoutes');
const userRoutes = require('./routes/userRoutes');
const cartRoutes = require('./routes/cartRoutes'); // adjust path as needed
const dashboardRoutes = require('./routes/dashboard');
const artistRoutes = require('./routes/artist');
const adminRoutes = require('./routes/adminRoutes');



dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Serve static files from /uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.error('MongoDB connection error:', err));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/artworks', artworkRoutes);     // ✅ FIXED: use plural for consistency with frontend
app.use('/api/upload', uploadRoutes);
app.use('/api/orders', orderRoutes);         // ✅ FIXED: plural to match `/api/orders/my-orders`
app.use('/api/users', userRoutes);           // Optional: if you have user profile routes
app.use('/api/dashboard', dashboardRoutes);
app.use('./api/cart',cartRoutes);
app.use('/api/artists', artistRoutes);
app.use('/api', adminRoutes);



// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
