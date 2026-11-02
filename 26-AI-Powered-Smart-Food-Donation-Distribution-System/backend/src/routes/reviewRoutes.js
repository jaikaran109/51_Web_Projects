const express = require('express');
const { body } = require('express-validator');
const {
  createReview,
  getUserReviews,
  getFeaturedReviews,
} = require('../controllers/reviewController');
const { protect } = require('../middleware/auth');
const { validate } = require('../middleware/validator');

const router = express.Router();

router.get('/featured', getFeaturedReviews);
router.get('/user/:userId', getUserReviews);

router.post(
  '/',
  protect,
  [
    body('targetUserId', 'Target user ID is required').notEmpty(),
    body('rating', 'Rating must be between 1 and 5').isInt({ min: 1, max: 5 }),
    body('comment', 'Comment is required').notEmpty(),
    validate,
  ],
  createReview
);

module.exports = router;
