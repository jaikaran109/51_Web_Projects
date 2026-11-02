const mongoose = require('mongoose');

const activityLogSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    userName: {
      type: String,
      default: 'System',
    },
    userRole: {
      type: String,
      default: 'system',
    },
    action: {
      type: String,
      required: true,
      enum: [
        'USER_REGISTERED',
        'USER_LOGIN',
        'LISTING_CREATED',
        'LISTING_UPDATED',
        'LISTING_DELETED',
        'PICKUP_REQUESTED',
        'PICKUP_ACCEPTED',
        'PICKUP_REJECTED',
        'PICKUP_COLLECTED',
        'PICKUP_DELIVERED',
        'PICKUP_CANCELLED',
        'USER_MODERATED',
        'NGO_VERIFIED',
        'SYSTEM_SETTING_CHANGED',
        'AI_PREDICTION_RUN',
      ],
    },
    description: {
      type: String,
      required: true,
    },
    entityType: {
      type: String,
      enum: ['User', 'FoodListing', 'PickupRequest', 'Setting', 'Review', 'System'],
      default: 'System',
    },
    entityId: {
      type: mongoose.Schema.Types.ObjectId,
    },
    metadata: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
    ipAddress: {
      type: String,
      default: '',
    },
  },
  { timestamps: true }
);

activityLogSchema.index({ createdAt: -1 });

module.exports = mongoose.model('ActivityLog', activityLogSchema);
