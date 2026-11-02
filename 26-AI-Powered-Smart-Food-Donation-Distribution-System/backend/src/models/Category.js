const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide category name'],
      unique: true,
      trim: true,
    },
    slug: {
      type: String,
      lowercase: true,
      default: function () {
        return this.name ? this.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') : '';
      },
    },
    description: {
      type: String,
      default: '',
    },
    icon: {
      type: String,
      default: 'Utensils',
    },
    estimatedShelfLifeHours: {
      type: Number,
      default: 6, // default hours before cooked food expires
    },
    storageRecommendation: {
      type: String,
      default: 'Keep refrigerated below 4°C or consume within standard window.',
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

categorySchema.pre('save', function (next) {
  if (this.name && !this.slug) {
    this.slug = this.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  }
  next();
});

module.exports = mongoose.model('Category', categorySchema);
