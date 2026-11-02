const mongoose = require('mongoose');

const foodListingSchema = new mongoose.Schema(
  {
    donorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Food listing must belong to a donor'],
    },
    donorName: {
      type: String,
      required: true,
    },
    donorOrg: {
      type: String,
      default: '',
    },
    title: {
      type: String,
      required: [true, 'Please provide a listing title'],
      trim: true,
      maxlength: [150, 'Title cannot exceed 150 characters'],
    },
    category: {
      type: String,
      required: [true, 'Please select a food category'],
      enum: [
        'Cooked Meals',
        'Raw Groceries',
        'Bakery & Bread',
        'Packaged & Canned',
        'Fruits & Vegetables',
        'Dairy & Eggs',
        'Beverages',
        'Mixed Assortment',
      ],
      default: 'Cooked Meals',
    },
    dietaryType: {
      type: String,
      enum: ['Vegetarian', 'Non-Vegetarian', 'Vegan', 'Eggitarian', 'Halal'],
      default: 'Vegetarian',
    },
    quantity: {
      type: Number,
      required: [true, 'Please specify quantity'],
      min: [1, 'Quantity must be at least 1'],
    },
    quantityUnit: {
      type: String,
      enum: ['servings', 'kg', 'boxes', 'packets', 'liters'],
      default: 'servings',
    },
    estimatedMeals: {
      type: Number,
      default: function () {
        if (this.quantityUnit === 'servings') return this.quantity;
        if (this.quantityUnit === 'kg') return Math.round(this.quantity * 2.5);
        if (this.quantityUnit === 'boxes') return this.quantity * 5;
        return this.quantity;
      },
    },
    cookedTime: {
      type: Date,
      default: Date.now,
    },
    expiryTime: {
      type: Date,
      required: [true, 'Please specify estimated expiry time'],
    },
    storageCondition: {
      type: String,
      enum: ['Ambient (Room Temp)', 'Refrigerated (0-4°C)', 'Frozen (-18°C)', 'Insulated Hot Container'],
      default: 'Ambient (Room Temp)',
    },
    allergens: {
      type: [String],
      default: [],
    },
    description: {
      type: String,
      default: '',
      maxlength: [1000, 'Description cannot exceed 1000 characters'],
    },
    images: {
      type: [String],
      default: [
        'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80',
      ],
    },
    pickupAddress: {
      street: { type: String, required: true },
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
        default: [77.2090, 28.6139],
      },
    },
    contactPhone: {
      type: String,
      required: [true, 'Please provide contact phone for pickup coordination'],
    },
    specialInstructions: {
      type: String,
      default: 'Please bring insulated thermal bags or suitable containers for pickup.',
    },
    status: {
      type: String,
      enum: ['Available', 'Requested', 'Accepted', 'Picked Up', 'Delivered', 'Expired', 'Cancelled'],
      default: 'Available',
    },
    activeClaimId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'PickupRequest',
      default: null,
    },
    claimedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    urgencyScore: {
      type: Number,
      default: 50, // 0 - 100
    },
    viewsCount: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

// Location geospatial index
foodListingSchema.index({ location: '2dsphere' });
foodListingSchema.index({ status: 1, expiryTime: 1 });

// Helper to compute urgency score dynamically
foodListingSchema.methods.calculateUrgency = function () {
  const now = new Date();
  const msToExpiry = new Date(this.expiryTime).getTime() - now.getTime();
  const hoursToExpiry = msToExpiry / (1000 * 60 * 60);

  if (hoursToExpiry <= 0) {
    this.urgencyScore = 100;
    return;
  }

  // Closer to expiry -> higher urgency
  if (hoursToExpiry <= 2) {
    this.urgencyScore = 95;
  } else if (hoursToExpiry <= 4) {
    this.urgencyScore = 85;
  } else if (hoursToExpiry <= 8) {
    this.urgencyScore = 70;
  } else if (hoursToExpiry <= 16) {
    this.urgencyScore = 50;
  } else {
    this.urgencyScore = 30;
  }
};

module.exports = mongoose.model('FoodListing', foodListingSchema);
