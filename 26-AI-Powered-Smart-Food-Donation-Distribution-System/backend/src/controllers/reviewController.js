const Review = require('../models/Review');
const User = require('../models/User');

// @desc    Submit review for a completed donation handover
// @route   POST /api/reviews
// @access  Private
exports.createReview = async (req, res, next) => {
  try {
    const {
      targetUserId,
      targetRole,
      pickupRequestId,
      rating,
      comment,
      foodQualityRating,
      punctualityRating,
      communicationRating,
    } = req.body;

    const targetUser = await User.findById(targetUserId);
    if (!targetUser) {
      return res.status(404).json({ success: false, message: 'Recipient user not found' });
    }

    const review = await Review.create({
      authorId: req.user._id,
      authorName: req.user.name,
      authorRole: req.user.role,
      targetUserId,
      targetRole,
      pickupRequestId,
      rating: Number(rating),
      comment,
      foodQualityRating: foodQualityRating || 5,
      punctualityRating: punctualityRating || 5,
      communicationRating: communicationRating || 5,
    });

    // Update target user's aggregated rating
    const allReviews = await Review.find({ targetUserId });
    const avgRating =
      allReviews.reduce((acc, item) => acc + item.rating, 0) / allReviews.length;

    await User.findByIdAndUpdate(targetUserId, {
      'metrics.rating': Number(avgRating.toFixed(1)),
      'metrics.reviewCount': allReviews.length,
    });

    res.status(201).json({
      success: true,
      message: 'Review submitted successfully',
      review,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get reviews for a specific user profile
// @route   GET /api/reviews/user/:userId
// @access  Public
exports.getUserReviews = async (req, res, next) => {
  try {
    const reviews = await Review.find({ targetUserId: req.params.userId })
      .populate('authorId', 'name organizationName avatar')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: reviews.length,
      reviews,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get featured reviews for public landing page
// @route   GET /api/reviews/featured
// @access  Public
exports.getFeaturedReviews = async (req, res, next) => {
  try {
    const reviews = await Review.find({ rating: { $gte: 4 } })
      .populate('authorId', 'name organizationName avatar role')
      .populate('targetUserId', 'name organizationName')
      .sort({ createdAt: -1 })
      .limit(6);

    res.status(200).json({
      success: true,
      reviews,
    });
  } catch (error) {
    next(error);
  }
};
