const mongoose = require('mongoose');

const statusTimelineSchema = new mongoose.Schema({
  status: {
    type: String,
    enum: ['Pending', 'Accepted', 'Picked Up', 'Delivered', 'Cancelled', 'Rejected'],
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
  note: {
    type: String,
    default: '',
  },
  updatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
});

const pickupRequestSchema = new mongoose.Schema(
  {
    listingId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'FoodListing',
      required: [true, 'Pickup request must reference a food listing'],
    },
    donorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    receiverId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    receiverName: {
      type: String,
      required: true,
    },
    receiverOrg: {
      type: String,
      default: '',
    },
    receiverPhone: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ['Pending', 'Accepted', 'Picked Up', 'Delivered', 'Cancelled', 'Rejected'],
      default: 'Pending',
    },
    estimatedPickupTime: {
      type: Date,
      required: [true, 'Please provide estimated pickup arrival time'],
    },
    actualPickupTime: {
      type: Date,
    },
    deliveredTime: {
      type: Date,
    },
    transportMode: {
      type: String,
      enum: ['Light Commercial Van', 'Car / Auto', 'Two Wheeler / Cargo Bike', 'Walk / Hand Cart', 'Refrigerated Vehicle'],
      default: 'Light Commercial Van',
    },
    volunteerCount: {
      type: Number,
      default: 1,
    },
    targetBeneficiaryGroup: {
      type: String,
      enum: [
        'Urban Slum Community',
        'Orphanage / Children Shelter',
        'Senior Citizens Home',
        'Homeless Night Shelter',
        'Migrant Workers Settlement',
        'Hospital Outpatient Attendants',
        'Community Kitchen Hub',
      ],
      default: 'Urban Slum Community',
    },
    estimatedBeneficiariesCount: {
      type: Number,
      default: 25,
    },
    pickupNotes: {
      type: String,
      default: '',
    },
    verificationOtp: {
      type: String,
      default: () => Math.floor(100000 + Math.random() * 900000).toString(),
    },
    isOtpVerified: {
      type: Boolean,
      default: false,
    },
    statusTimeline: [statusTimelineSchema],
    proofImage: {
      type: String,
      default: '',
    },
    donorFeedback: {
      rating: { type: Number, min: 1, max: 5 },
      comment: { type: String, default: '' },
      createdAt: { type: Date },
    },
    receiverFeedback: {
      rating: { type: Number, min: 1, max: 5 },
      comment: { type: String, default: '' },
      createdAt: { type: Date },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('PickupRequest', pickupRequestSchema);
