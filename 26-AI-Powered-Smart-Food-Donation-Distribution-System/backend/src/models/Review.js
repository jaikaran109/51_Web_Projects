const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema(
  {
    authorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    authorName: {
      type: String,
      required: true,
    },
    authorRole: {
      type: String,
      enum: ['donor', 'receiver', 'admin'],
      required: true,
    },
    targetUserId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    targetRole: {
      type: String,
      enum: ['donor', 'receiver'],
      required: true,
    },
    pickupRequestId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'PickupRequest',
    },
    rating: {
      type: Number,
      required: [true, 'Please provide a rating between 1 and 5'],
      min: 1,
      max: 5,
    },
    comment: {
      type: String,
      required: [true, 'Please provide a review comment'],
      maxlength: [500, 'Review cannot exceed 500 characters'],
    },
    foodQualityRating: {
      type: Number,
      min: 1,
      max: 5,
      default: 5,
    },
    punctualityRating: {
      type: Number,
      min: 1,
      max: 5,
      default: 5,
    },
    communicationRating: {
      type: Number,
      min: 1,
      max: 5,
      default: 5,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Review', reviewSchema);
