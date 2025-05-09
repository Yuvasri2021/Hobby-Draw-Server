const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const authMiddleware = require('../middleware/authMiddleware');

router.get('/admin/artworks', authMiddleware, adminController.getAllArtworks);
router.get('/admin/orders', authMiddleware, adminController.getAllOrders);
router.get('/admin/artists', authMiddleware, adminController.getAllArtistsWithArtworks);
router.get('/admin/customers', authMiddleware, adminController.getAllCustomersWithOrders);

module.exports = router;
