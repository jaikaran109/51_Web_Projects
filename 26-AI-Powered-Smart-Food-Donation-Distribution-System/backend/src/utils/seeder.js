const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('../models/User');
const Category = require('../models/Category');
const FoodListing = require('../models/FoodListing');
const PickupRequest = require('../models/PickupRequest');
const ActivityLog = require('../models/ActivityLog');
const Notification = require('../models/Notification');
const Review = require('../models/Review');
const Setting = require('../models/Setting');

const dns = require('dns');

try {
  dns.setServers(['8.8.8.8', '8.8.4.4', '1.1.1.1', '1.0.0.1']);
  if (typeof dns.setDefaultResultOrder === 'function') {
    dns.setDefaultResultOrder('ipv4first');
  }
} catch (e) {}

dotenv.config({ path: __dirname + '/../../.env' });

const seedDatabase = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/smart_food_donation';
    await mongoose.connect(mongoUri, {
      family: 4,
      serverSelectionTimeoutMS: 15000,
    });
    console.log('🌱 Connected to MongoDB for seeding...');

    // Clear existing data
    await User.deleteMany();
    await Category.deleteMany();
    await FoodListing.deleteMany();
    await PickupRequest.deleteMany();
    await ActivityLog.deleteMany();
    await Notification.deleteMany();
    await Review.deleteMany();
    await Setting.deleteMany();

    console.log('🧹 Purged existing collections.');

    // 1. Create Settings
    await Setting.create({
      platformName: 'Smart Food Donation Platform',
      supportEmail: 'support@smartfooddonation.org',
      contactPhone: '+1 (800) 555-FOOD',
      autoVerifyDonors: true,
      requireNgoGovCertificate: true,
      defaultUrgencyThresholdHours: 4,
      maxPickupDistanceKm: 40,
      enableAiDemandPrediction: true,
      co2SavedPerKgFood: 2.5,
    });

    // 2. Create Categories
    const categoriesData = [
      { name: 'Cooked Meals', slug: 'cooked-meals', icon: 'Utensils', estimatedShelfLifeHours: 6, description: 'Freshly prepared buffets, banquets, cooked rice, curry, and hot dishes' },
      { name: 'Bakery & Bread', slug: 'bakery-bread', icon: 'Croissant', estimatedShelfLifeHours: 36, description: 'Artisan bread, baguettes, buns, pastries, muffins, and dry baked goods' },
      { name: 'Raw Groceries', slug: 'raw-groceries', icon: 'ShoppingBag', estimatedShelfLifeHours: 120, description: 'Rice grains, flour, pulses, lentils, cooking oil, and dry staples' },
      { name: 'Fruits & Vegetables', slug: 'fruits-vegetables', icon: 'Apple', estimatedShelfLifeHours: 48, description: 'Fresh farm produce, seasonal fruits, greens, potatoes, and vegetables' },
      { name: 'Packaged & Canned', slug: 'packaged-canned', icon: 'Box', estimatedShelfLifeHours: 720, description: 'Sealed snacks, canned beans, soups, cereal boxes, and long shelf-life items' },
      { name: 'Dairy & Eggs', slug: 'dairy-eggs', icon: 'Milk', estimatedShelfLifeHours: 12, description: 'Pasteurized milk, cheese, yogurt tubs, butter, and farm eggs' },
      { name: 'Beverages', slug: 'beverages', icon: 'Coffee', estimatedShelfLifeHours: 24, description: 'Bottled fruit juices, clean mineral water, tea batches, and non-alcoholic drinks' },
      { name: 'Mixed Assortment', slug: 'mixed-assortment', icon: 'Layers', estimatedShelfLifeHours: 18, description: 'Assorted event food packages containing varied dishes and sides' },
    ];
    await Category.insertMany(categoriesData);

    // 3. Create Users (Admin, Donors, NGOs)
    // Note: password is 'password123'
    const admin = await User.create({
      name: 'System Administrator',
      email: 'admin@smartfood.org',
      password: 'password123',
      role: 'admin',
      organizationName: 'Smart Food Donation Foundation',
      organizationType: 'Government Body',
      phone: '+1 555-0100',
      address: { street: '100 Governance Blvd', city: 'Metro Central', state: 'Metro', pincode: '100001', formattedAddress: '100 Governance Blvd, Metro Central' },
      location: { type: 'Point', coordinates: [77.2190, 28.6149] },
      isVerified: true,
      verificationStatus: 'verified',
      bio: 'Platform administration and food redistribution oversight authority.',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
    });

    const donor1 = await User.create({
      name: 'Chef Marcus Vance',
      email: 'donor@tajkitchens.com',
      password: 'password123',
      role: 'donor',
      organizationName: 'Grand Horizon Banquet & Catering',
      organizationType: 'Caterer & Events',
      phone: '+1 555-0144',
      address: { street: '45 Royale Plaza, 5th Avenue', city: 'Metro Central', state: 'Metro', pincode: '100002', formattedAddress: '45 Royale Plaza, Metro Central' },
      location: { type: 'Point', coordinates: [77.2090, 28.6239] },
      isVerified: true,
      verificationStatus: 'verified',
      bio: 'Premium banquet catering creating quality surplus meals for community shelter programs.',
      avatar: 'https://images.unsplash.com/photo-1577219491135-ce391730fb2c?auto=format&fit=crop&w=300&q=80',
      metrics: { totalDonationsCount: 42, totalDonatedKg: 1850, totalMealsSaved: 4625, rating: 4.9, reviewCount: 18 },
    });

    const donor2 = await User.create({
      name: 'Elena Rostova',
      email: 'bakery@artisangold.com',
      password: 'password123',
      role: 'donor',
      organizationName: 'Artisan Gold Bakery & Patisserie',
      organizationType: 'Bakery',
      phone: '+1 555-0177',
      address: { street: '12 Baker Lane, East Wing', city: 'Metro East', state: 'Metro', pincode: '100008', formattedAddress: '12 Baker Lane, Metro East' },
      location: { type: 'Point', coordinates: [77.2490, 28.6189] },
      isVerified: true,
      verificationStatus: 'verified',
      bio: 'Daily surplus sourdough, whole wheat loaves, and savory baked goods.',
      avatar: 'https://images.unsplash.com/photo-1583394838336-acd977736f90?auto=format&fit=crop&w=300&q=80',
      metrics: { totalDonationsCount: 28, totalDonatedKg: 640, totalMealsSaved: 1600, rating: 4.8, reviewCount: 12 },
    });

    const donor3 = await User.create({
      name: 'David Sterling',
      email: 'metro@freshgrocers.com',
      password: 'password123',
      role: 'donor',
      organizationName: 'Metro Fresh Supermarket Chain',
      organizationType: 'Supermarket / Grocery',
      phone: '+1 555-0182',
      address: { street: '880 Westway Highway', city: 'Metro West', state: 'Metro', pincode: '100015', formattedAddress: '880 Westway Highway, Metro West' },
      location: { type: 'Point', coordinates: [77.1790, 28.6339] },
      isVerified: true,
      verificationStatus: 'verified',
      bio: 'Daily fresh produce, boxed pantry goods, and dairy redirection program.',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
      metrics: { totalDonationsCount: 56, totalDonatedKg: 2800, totalMealsSaved: 7000, rating: 5.0, reviewCount: 24 },
    });

    const ngo1 = await User.create({
      name: 'Sarah Jenkins',
      email: 'ngo@foodforall.ngo',
      password: 'password123',
      role: 'receiver',
      organizationName: 'Food For All Relief Foundation',
      organizationType: 'NGO / Non-Profit',
      phone: '+1 555-0122',
      address: { street: '77 Compassion Road', city: 'Metro Central', state: 'Metro', pincode: '100003', formattedAddress: '77 Compassion Road, Metro Central' },
      location: { type: 'Point', coordinates: [77.2150, 28.6190] },
      isVerified: true,
      verificationStatus: 'verified',
      bio: 'Operating 3 mobile food dispatch vans serving 1,200 underprivileged individuals daily.',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=300&q=80',
      metrics: { totalPickupsCompleted: 85, totalMealsSaved: 9400, totalDonatedKg: 3760, rating: 5.0, reviewCount: 31 },
    });

    const ngo2 = await User.create({
      name: 'Brother Thomas',
      email: 'shelter@hopecommunity.ngo',
      password: 'password123',
      role: 'receiver',
      organizationName: 'Hope Children & Shelter Home',
      organizationType: 'Shelter Home',
      phone: '+1 555-0155',
      address: { street: '302 Sanctuary Lane', city: 'Metro North', state: 'Metro', pincode: '100011', formattedAddress: '302 Sanctuary Lane, Metro North' },
      location: { type: 'Point', coordinates: [77.2020, 28.6490] },
      isVerified: true,
      verificationStatus: 'verified',
      bio: 'Housing and feeding 180 orphan children and senior destitute residents.',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80',
      metrics: { totalPickupsCompleted: 44, totalMealsSaved: 4800, totalDonatedKg: 1920, rating: 4.9, reviewCount: 16 },
    });

    const ngo3 = await User.create({
      name: 'Priya Sharma',
      email: 'feedthecity@care.org',
      password: 'password123',
      role: 'receiver',
      organizationName: 'Feed The City Community Kitchen',
      organizationType: 'Community Kitchen',
      phone: '+1 555-0166',
      address: { street: '14 Unity Nagar', city: 'Metro East', state: 'Metro', pincode: '100009', formattedAddress: '14 Unity Nagar, Metro East' },
      location: { type: 'Point', coordinates: [77.2550, 28.6110] },
      isVerified: true,
      verificationStatus: 'verified',
      bio: 'Serving freshly packed hot meals to migrant workers and daily wage laborers.',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&q=80',
      metrics: { totalPickupsCompleted: 38, totalMealsSaved: 3600, totalDonatedKg: 1440, rating: 4.8, reviewCount: 14 },
    });

    // 4. Create Food Listings
    const now = new Date();

    const listing1 = await FoodListing.create({
      donorId: donor1._id,
      donorName: donor1.name,
      donorOrg: donor1.organizationName,
      title: 'Buffet Surplus: Saffron Pilaf, Vegetable Curry & Naan Breads',
      category: 'Cooked Meals',
      dietaryType: 'Vegetarian',
      quantity: 65,
      quantityUnit: 'servings',
      estimatedMeals: 65,
      cookedTime: new Date(now.getTime() - 2 * 60 * 60 * 1000), // 2 hours ago
      expiryTime: new Date(now.getTime() + 4 * 60 * 60 * 1000), // 4 hours left
      storageCondition: 'Insulated Hot Container',
      allergens: ['Dairy (Butter/Ghee)'],
      description: 'Hot vegetarian wedding buffet surplus. Packed in high-grade food containers. Ready for immediate pickup and distribution.',
      images: [
        'https://images.unsplash.com/photo-1585937421612-70a008356fbe?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80',
      ],
      pickupAddress: donor1.address,
      location: donor1.location,
      contactPhone: donor1.phone,
      specialInstructions: 'Enter via rear kitchen service ramp. Security guard has container passes.',
      status: 'Available',
      urgencyScore: 85,
    });

    const listing2 = await FoodListing.create({
      donorId: donor2._id,
      donorName: donor2.name,
      donorOrg: donor2.organizationName,
      title: 'Artisan Whole Wheat Loaves, Brioche & Croissant Baskets',
      category: 'Bakery & Bread',
      dietaryType: 'Vegetarian',
      quantity: 40,
      quantityUnit: 'boxes',
      estimatedMeals: 200,
      cookedTime: new Date(now.getTime() - 4 * 60 * 60 * 1000),
      expiryTime: new Date(now.getTime() + 28 * 60 * 60 * 1000), // 28 hours left
      storageCondition: 'Ambient (Room Temp)',
      allergens: ['Gluten', 'Eggs (Brioche)'],
      description: 'Day-end freshly baked surplus. Cleanly boxed and labelled with baking times. Excellent condition for breakfast distribution.',
      images: [
        'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&w=800&q=80',
      ],
      pickupAddress: donor2.address,
      location: donor2.location,
      contactPhone: donor2.phone,
      specialInstructions: 'Pickup at front counter. Mention Food Donation Claim ID.',
      status: 'Available',
      urgencyScore: 45,
    });

    const listing3 = await FoodListing.create({
      donorId: donor3._id,
      donorName: donor3.name,
      donorOrg: donor3.organizationName,
      title: 'Fresh Organic Produce: Apples, Carrots, Tomatoes & Spinach Crates',
      category: 'Fruits & Vegetables',
      dietaryType: 'Vegan',
      quantity: 120,
      quantityUnit: 'kg',
      estimatedMeals: 300,
      cookedTime: new Date(now.getTime() - 8 * 60 * 60 * 1000),
      expiryTime: new Date(now.getTime() + 36 * 60 * 60 * 1000),
      storageCondition: 'Ambient (Room Temp)',
      allergens: [],
      description: 'High-grade surplus farm produce crated today. High nutritional value, ideal for community kitchens and soup shelters.',
      images: [
        'https://images.unsplash.com/photo-1610832958506-aa56368176cf?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=800&q=80',
      ],
      pickupAddress: donor3.address,
      location: donor3.location,
      contactPhone: donor3.phone,
      specialInstructions: 'Commercial loading bay #4. Forklift driver will assist loading.',
      status: 'Available',
      urgencyScore: 50,
    });

    const listing4 = await FoodListing.create({
      donorId: donor1._id,
      donorName: donor1.name,
      donorOrg: donor1.organizationName,
      title: 'Steamed Basmati Rice with Lentil Dal & Roasted Paneer',
      category: 'Cooked Meals',
      dietaryType: 'Vegetarian',
      quantity: 90,
      quantityUnit: 'servings',
      estimatedMeals: 90,
      cookedTime: new Date(now.getTime() - 1 * 60 * 60 * 1000),
      expiryTime: new Date(now.getTime() + 5 * 60 * 60 * 1000),
      storageCondition: 'Insulated Hot Container',
      allergens: ['Dairy'],
      description: 'Fresh lunch corporate event surplus. Hot, sealed, hygienic stainless containers provided.',
      images: [
        'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=800&q=80',
      ],
      pickupAddress: donor1.address,
      location: donor1.location,
      contactPhone: donor1.phone,
      specialInstructions: 'Please return stainless containers within 48 hours or transfer to your vessels.',
      status: 'Requested',
      urgencyScore: 80,
    });

    const listing5 = await FoodListing.create({
      donorId: donor3._id,
      donorName: donor3.name,
      donorOrg: donor3.organizationName,
      title: 'Pasteurized Whole Milk Tubs & Greek Yogurt Cups (60 Units)',
      category: 'Dairy & Eggs',
      dietaryType: 'Vegetarian',
      quantity: 60,
      quantityUnit: 'packets',
      estimatedMeals: 60,
      cookedTime: new Date(now.getTime() - 5 * 60 * 60 * 1000),
      expiryTime: new Date(now.getTime() + 14 * 60 * 60 * 1000),
      storageCondition: 'Refrigerated (0-4°C)',
      allergens: ['Dairy'],
      description: 'Chilled dairy approaching 2-day mark from commercial coolers. Must transport in cool bags.',
      images: [
        'https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&w=800&q=80',
      ],
      pickupAddress: donor3.address,
      location: donor3.location,
      contactPhone: donor3.phone,
      specialInstructions: 'Pickup at Cold Storage entrance near dock 2.',
      status: 'Accepted',
      urgencyScore: 68,
    });

    const listing6 = await FoodListing.create({
      donorId: donor1._id,
      donorName: donor1.name,
      donorOrg: donor1.organizationName,
      title: 'Grilled Herb Chicken with Roasted Potatoes & Green Beans',
      category: 'Cooked Meals',
      dietaryType: 'Non-Vegetarian',
      quantity: 50,
      quantityUnit: 'servings',
      estimatedMeals: 50,
      cookedTime: new Date(now.getTime() - 3 * 60 * 60 * 1000),
      expiryTime: new Date(now.getTime() + 3 * 60 * 60 * 1000),
      storageCondition: 'Insulated Hot Container',
      allergens: [],
      description: 'High protein cooked chicken dinner banquet trays. Sealed and kept in warmers.',
      images: [
        'https://images.unsplash.com/photo-1532550907401-a500c9a57435?auto=format&fit=crop&w=800&q=80',
      ],
      pickupAddress: donor1.address,
      location: donor1.location,
      contactPhone: donor1.phone,
      specialInstructions: 'Direct pickup from main banquet staging hall.',
      status: 'Picked Up',
      urgencyScore: 90,
    });

    // 5. Create Pickup Requests (Workflow Progression)

    // Request 1: Pending (on listing4)
    const pickup1 = await PickupRequest.create({
      listingId: listing4._id,
      donorId: donor1._id,
      receiverId: ngo1._id,
      receiverName: ngo1.name,
      receiverOrg: ngo1.organizationName,
      receiverPhone: ngo1.phone,
      status: 'Pending',
      estimatedPickupTime: new Date(now.getTime() + 90 * 60 * 1000), // 1.5h from now
      transportMode: 'Light Commercial Van',
      volunteerCount: 2,
      targetBeneficiaryGroup: 'Urban Slum Community',
      estimatedBeneficiariesCount: 90,
      pickupNotes: 'Van is nearby at Sector 4 and can reach within 45 minutes.',
      verificationOtp: '482910',
      statusTimeline: [
        { status: 'Pending', timestamp: new Date(now.getTime() - 30 * 60 * 1000), note: 'Claim submitted by Food For All Relief Foundation', updatedBy: ngo1._id },
      ],
    });
    listing4.activeClaimId = pickup1._id;
    listing4.claimedBy = ngo1._id;
    await listing4.save();

    // Request 2: Accepted (on listing5)
    const pickup2 = await PickupRequest.create({
      listingId: listing5._id,
      donorId: donor3._id,
      receiverId: ngo2._id,
      receiverName: ngo2.name,
      receiverOrg: ngo2.organizationName,
      receiverPhone: ngo2.phone,
      status: 'Accepted',
      estimatedPickupTime: new Date(now.getTime() + 60 * 60 * 1000),
      transportMode: 'Refrigerated Vehicle',
      volunteerCount: 2,
      targetBeneficiaryGroup: 'Orphanage / Children Shelter',
      estimatedBeneficiariesCount: 60,
      pickupNotes: 'Bringing insulated cooler boxes for dairy transfer.',
      verificationOtp: '719342',
      statusTimeline: [
        { status: 'Pending', timestamp: new Date(now.getTime() - 60 * 60 * 1000), note: 'Claim created', updatedBy: ngo2._id },
        { status: 'Accepted', timestamp: new Date(now.getTime() - 20 * 60 * 1000), note: 'Accepted by Metro Fresh Supermarket manager', updatedBy: donor3._id },
      ],
    });
    listing5.activeClaimId = pickup2._id;
    listing5.claimedBy = ngo2._id;
    await listing5.save();

    // Request 3: Picked Up (in transit on listing6)
    const pickup3 = await PickupRequest.create({
      listingId: listing6._id,
      donorId: donor1._id,
      receiverId: ngo3._id,
      receiverName: ngo3.name,
      receiverOrg: ngo3.organizationName,
      receiverPhone: ngo3.phone,
      status: 'Picked Up',
      estimatedPickupTime: new Date(now.getTime() - 40 * 60 * 1000),
      actualPickupTime: new Date(now.getTime() - 25 * 60 * 1000),
      transportMode: 'Light Commercial Van',
      volunteerCount: 3,
      targetBeneficiaryGroup: 'Migrant Workers Settlement',
      estimatedBeneficiariesCount: 50,
      pickupNotes: 'Collected and heading towards Eastern transit hub for distribution.',
      verificationOtp: '562891',
      statusTimeline: [
        { status: 'Pending', timestamp: new Date(now.getTime() - 120 * 60 * 1000), note: 'Request initiated', updatedBy: ngo3._id },
        { status: 'Accepted', timestamp: new Date(now.getTime() - 90 * 60 * 1000), note: 'Accepted by Chef Marcus', updatedBy: donor1._id },
        { status: 'Picked Up', timestamp: new Date(now.getTime() - 25 * 60 * 1000), note: 'Loaded in thermal vehicle #DL-04-A-9821', updatedBy: ngo3._id },
      ],
    });
    listing6.activeClaimId = pickup3._id;
    listing6.claimedBy = ngo3._id;
    await listing6.save();

    // 6. Create Completed Historical Pickups & Reviews for Rich Analytics
    const completedListing = await FoodListing.create({
      donorId: donor1._id,
      donorName: donor1.name,
      donorOrg: donor1.organizationName,
      title: 'Continental Buffet: Pasta, Garlic Breads & Baked Lasagna',
      category: 'Cooked Meals',
      dietaryType: 'Vegetarian',
      quantity: 110,
      quantityUnit: 'servings',
      estimatedMeals: 110,
      cookedTime: new Date(now.getTime() - 48 * 60 * 60 * 1000),
      expiryTime: new Date(now.getTime() - 40 * 60 * 60 * 1000),
      storageCondition: 'Insulated Hot Container',
      allergens: ['Dairy', 'Gluten'],
      description: 'Corporate gala dinner surplus redistributed to night shelters.',
      images: ['https://images.unsplash.com/photo-1551183053-bf91a1d81141?auto=format&fit=crop&w=800&q=80'],
      pickupAddress: donor1.address,
      location: donor1.location,
      contactPhone: donor1.phone,
      status: 'Delivered',
      urgencyScore: 20,
    });

    const completedPickup = await PickupRequest.create({
      listingId: completedListing._id,
      donorId: donor1._id,
      receiverId: ngo1._id,
      receiverName: ngo1.name,
      receiverOrg: ngo1.organizationName,
      receiverPhone: ngo1.phone,
      status: 'Delivered',
      estimatedPickupTime: new Date(now.getTime() - 46 * 60 * 60 * 1000),
      actualPickupTime: new Date(now.getTime() - 45 * 60 * 60 * 1000),
      deliveredTime: new Date(now.getTime() - 43 * 60 * 60 * 1000),
      transportMode: 'Light Commercial Van',
      volunteerCount: 4,
      targetBeneficiaryGroup: 'Homeless Night Shelter',
      estimatedBeneficiariesCount: 110,
      pickupNotes: 'Dispatched to 2 shelter homes in Metro Central.',
      verificationOtp: '839201',
      isOtpVerified: true,
      statusTimeline: [
        { status: 'Pending', timestamp: new Date(now.getTime() - 48 * 60 * 60 * 1000), note: 'Claimed by Food For All', updatedBy: ngo1._id },
        { status: 'Accepted', timestamp: new Date(now.getTime() - 47 * 60 * 60 * 1000), note: 'Accepted by donor', updatedBy: donor1._id },
        { status: 'Picked Up', timestamp: new Date(now.getTime() - 45 * 60 * 60 * 1000), note: 'Collected', updatedBy: ngo1._id },
        { status: 'Delivered', timestamp: new Date(now.getTime() - 43 * 60 * 60 * 1000), note: 'Distributed 110 meals to Homeless Night Shelter #3', updatedBy: ngo1._id },
      ],
      donorFeedback: {
        rating: 5,
        comment: 'Punctual pickup, professional volunteers, and wonderful communication.',
        createdAt: new Date(now.getTime() - 42 * 60 * 60 * 1000),
      },
      receiverFeedback: {
        rating: 5,
        comment: 'Food was piping hot, delicious, and hygienically packed. The shelter residents were overjoyed.',
        createdAt: new Date(now.getTime() - 42 * 60 * 60 * 1000),
      },
    });

    completedListing.activeClaimId = completedPickup._id;
    completedListing.claimedBy = ngo1._id;
    await completedListing.save();

    // 7. Create Reviews
    await Review.create({
      authorId: donor1._id,
      authorName: donor1.name,
      authorRole: 'donor',
      targetUserId: ngo1._id,
      targetRole: 'receiver',
      pickupRequestId: completedPickup._id,
      rating: 5,
      comment: 'Food For All Relief Foundation arrived exactly on time with thermal boxes. Outstanding execution and transparency!',
      foodQualityRating: 5,
      punctualityRating: 5,
      communicationRating: 5,
    });

    await Review.create({
      authorId: ngo1._id,
      authorName: ngo1.name,
      authorRole: 'receiver',
      targetUserId: donor1._id,
      targetRole: 'donor',
      pickupRequestId: completedPickup._id,
      rating: 5,
      comment: 'Chef Marcus and Grand Horizon Banquets are exemplary donors. Stainless insulated packaging kept the pasta warm and fresh!',
      foodQualityRating: 5,
      punctualityRating: 5,
      communicationRating: 5,
    });

    // 8. Create Notifications
    await Notification.create({
      recipientId: donor1._id,
      senderId: ngo1._id,
      title: '📦 New Pickup Request Received!',
      message: 'Food For All Relief Foundation requested pickup for "Steamed Basmati Rice with Lentil Dal".',
      type: 'PICKUP_REQUEST_RECEIVED',
      link: '/donor-dashboard',
      relatedListingId: listing4._id,
    });

    await Notification.create({
      recipientId: ngo2._id,
      senderId: donor3._id,
      title: '✅ Pickup Request Accepted!',
      message: 'Metro Fresh Supermarket accepted your claim for dairy products. Handover OTP: 719342.',
      type: 'PICKUP_REQUEST_ACCEPTED',
      link: `/tracking/${pickup2._id}`,
      relatedPickupId: pickup2._id,
    });

    // 9. Create Activity Logs
    await ActivityLog.create({
      userId: donor1._id,
      userName: donor1.name,
      userRole: 'donor',
      action: 'LISTING_CREATED',
      description: 'Donor Chef Marcus Vance created food donation: "Buffet Surplus: Saffron Pilaf, Vegetable Curry & Naan Breads" (65 servings)',
      entityType: 'FoodListing',
      entityId: listing1._id,
    });

    await ActivityLog.create({
      userId: ngo1._id,
      userName: ngo1.name,
      userRole: 'receiver',
      action: 'PICKUP_DELIVERED',
      description: 'NGO Food For All Foundation completed distribution of 110 meals to Homeless Night Shelter',
      entityType: 'PickupRequest',
      entityId: completedPickup._id,
    });

    console.log('✅ Database seeded successfully with:');
    console.log('   - 1 Admin: admin@smartfood.org (password: password123)');
    console.log('   - 3 Donors: donor@tajkitchens.com, bakery@artisangold.com, metro@freshgrocers.com (password: password123)');
    console.log('   - 3 NGOs: ngo@foodforall.ngo, shelter@hopecommunity.ngo, feedthecity@care.org (password: password123)');
    console.log('   - 7 Categories, 7 Food Listings, 4 Pickup Requests & Lifecycles, Reviews, Notifications, and Activity Logs.');

    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeder Error:', error);
    process.exit(1);
  }
};

seedDatabase();
