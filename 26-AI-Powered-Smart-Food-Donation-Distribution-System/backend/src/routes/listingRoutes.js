const express = require('express');
const { body } = require('express-validator');
const {
  getListings,
  getListingById,
  createListing,
  updateListing,
  deleteListing,
  getMyDonations,
  getAiRecommendations,
  notifyRecommendedNgo,
} = require('../controllers/listingController');
const { protect, authorize } = require('../middleware/auth');
const { validate } = require('../middleware/validator');

const router = express.Router();

// Public explore & details
router.get('/', getListings);
router.get('/my-donations', protect, authorize('donor', 'admin'), getMyDonations);
router.get('/:id/ai-recommendations', getAiRecommendations);
router.post('/:id/notify-ngo/:ngoId', protect, authorize('donor', 'admin'), notifyRecommendedNgo);
router.get('/:id', getListingById);

// Create food listing
router.post(
  '/',
  protect,
  authorize('donor', 'admin'),
  [
    body('title', 'Title is required').notEmpty(),
    body('category', 'Category is required').notEmpty(),
    body('quantity', 'Quantity must be a positive number').isFloat({ min: 0.1 }),
    body('contactPhone', 'Contact phone is required').notEmpty(),
    validate,
  ],
  createListing
);

// Update / Delete listing
router.put('/:id', protect, authorize('donor', 'admin'), updateListing);
router.delete('/:id', protect, authorize('donor', 'admin'), deleteListing);

module.exports = router;
