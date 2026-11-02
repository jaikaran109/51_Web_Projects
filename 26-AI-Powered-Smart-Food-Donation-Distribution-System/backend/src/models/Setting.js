const mongoose = require('mongoose');

const settingSchema = new mongoose.Schema(
  {
    platformName: {
      type: String,
      default: 'Smart Food Donation Platform',
    },
    supportEmail: {
      type: String,
      default: 'support@smartfooddonation.org',
    },
    contactPhone: {
      type: String,
      default: '+1 (800) 555-FOOD',
    },
    autoVerifyDonors: {
      type: Boolean,
      default: true,
    },
    requireNgoGovCertificate: {
      type: Boolean,
      default: true,
    },
    defaultUrgencyThresholdHours: {
      type: Number,
      default: 4,
    },
    maxPickupDistanceKm: {
      type: Number,
      default: 50,
    },
    enableAiDemandPrediction: {
      type: Boolean,
      default: true,
    },
    enableSmsNotifications: {
      type: Boolean,
      default: false,
    },
    co2SavedPerKgFood: {
      type: Number,
      default: 2.5, // kg of CO2 equivalent prevented per kg food saved
    },
    costPerMealEstimateUsd: {
      type: Number,
      default: 2.75,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Setting', settingSchema);
