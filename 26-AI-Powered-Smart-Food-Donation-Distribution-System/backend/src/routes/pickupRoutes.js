const express = require('express');
const { body } = require('express-validator');
const {
  createPickupRequest,
  acceptPickupRequest,
  markPickedUp,
  markDelivered,
  cancelPickupRequest,
  getPickupById,
  getMyPickups,
} = require('../controllers/pickupController');
const { protect, authorize } = require('../middleware/auth');
const { validate } = require('../middleware/validator');

const router = express.Router();

// User pickups list (Donor or Receiver)
router.get('/my-pickups', protect, getMyPickups);
router.get('/:id', protect, getPickupById);

// Claim listing (NGO)
router.post(
  '/',
  protect,
  authorize('receiver', 'admin'),
  [
    body('listingId', 'Listing ID is required').notEmpty(),
    validate,
  ],
  createPickupRequest
);

// Pickup status workflow
router.put('/:id/accept', protect, authorize('donor', 'admin'), acceptPickupRequest);
router.put('/:id/pickup', protect, authorize('receiver', 'admin'), markPickedUp);
router.put('/:id/deliver', protect, authorize('receiver', 'admin'), markDelivered);
router.put('/:id/cancel', protect, cancelPickupRequest);

module.exports = router;
