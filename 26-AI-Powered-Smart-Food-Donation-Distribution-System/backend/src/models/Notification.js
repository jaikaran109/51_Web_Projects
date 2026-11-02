const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema(
  {
    recipientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    title: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: [
        'NEW_LISTING_NEARBY',
        'PICKUP_REQUEST_RECEIVED',
        'PICKUP_REQUEST_ACCEPTED',
        'PICKUP_REQUEST_REJECTED',
        'FOOD_PICKED_UP',
        'FOOD_DELIVERED',
        'NGO_VERIFIED',
        'SYSTEM_ALERT',
      ],
      default: 'SYSTEM_ALERT',
    },
    link: {
      type: String,
      default: '',
    },
    isRead: {
      type: Boolean,
      default: false,
    },
    relatedListingId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'FoodListing',
    },
    relatedPickupId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'PickupRequest',
    },
  },
  { timestamps: true }
);

notificationSchema.index({ recipientId: 1, isRead: 1 });

module.exports = mongoose.model('Notification', notificationSchema);
