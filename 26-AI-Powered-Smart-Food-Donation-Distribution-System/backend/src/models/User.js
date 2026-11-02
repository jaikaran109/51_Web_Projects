const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide a name'],
      trim: true,
      maxlength: [100, 'Name cannot exceed 100 characters'],
    },
    email: {
      type: String,
      required: [true, 'Please provide an email'],
      unique: true,
      trim: true,
      lowercase: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        'Please provide a valid email address',
      ],
    },
    password: {
      type: String,
      required: [true, 'Please provide a password'],
      minlength: [6, 'Password must be at least 6 characters'],
      select: false,
    },
    role: {
      type: String,
      enum: ['donor', 'receiver', 'admin'],
      default: 'donor',
      required: true,
    },
    organizationName: {
      type: String,
      trim: true,
      default: '',
    },
    organizationType: {
      type: String,
      enum: [
        'Individual',
        'Restaurant',
        'Caterer & Events',
        'Bakery',
        'Supermarket / Grocery',
        'NGO / Non-Profit',
        'Food Bank',
        'Shelter Home',
        'Community Kitchen',
        'Government Body',
        'Other',
      ],
      default: 'Individual',
    },
    phone: {
      type: String,
      trim: true,
      default: '',
    },
    address: {
      street: { type: String, default: '' },
      city: { type: String, default: 'Metropolis' },
      state: { type: String, default: 'State' },
      pincode: { type: String, default: '100001' },
      formattedAddress: { type: String, default: '' },
    },
    location: {
      type: {
        type: String,
        enum: ['Point'],
        default: 'Point',
      },
      coordinates: {
        type: [Number], // [longitude, latitude]
        default: [77.2090, 28.6139], // Default coords
      },
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    verificationStatus: {
      type: String,
      enum: ['pending', 'verified', 'rejected', 'unsubmitted'],
      default: 'unsubmitted',
    },
    avatar: {
      type: String,
      default: '',
    },
    bio: {
      type: String,
      maxlength: [500, 'Bio cannot exceed 500 characters'],
      default: '',
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    operatingHours: {
      type: String,
      default: '9:00 AM - 9:00 PM',
    },
    metrics: {
      totalDonationsCount: { type: Number, default: 0 },
      totalDonatedKg: { type: Number, default: 0 },
      totalMealsSaved: { type: Number, default: 0 },
      totalPickupsCompleted: { type: Number, default: 0 },
      rating: { type: Number, default: 5.0 },
      reviewCount: { type: Number, default: 0 },
    },
  },
  {
    timestamps: true,
  }
);

// Geospatial index for location queries
userSchema.index({ location: '2dsphere' });

// Hash password prior to save
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Compare password method
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
