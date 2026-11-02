const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { logActivity } = require('../utils/logger');

// Generate JWT token
const sendTokenResponse = (user, statusCode, res) => {
  const token = jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET || 'super_secret_jwt_key_smart_food_donation_platform_2026',
    { expiresIn: process.env.JWT_EXPIRE || '30d' }
  );

  res.status(statusCode).json({
    success: true,
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      organizationName: user.organizationName,
      organizationType: user.organizationType,
      phone: user.phone,
      address: user.address,
      location: user.location,
      isVerified: user.isVerified,
      verificationStatus: user.verificationStatus,
      avatar: user.avatar,
      bio: user.bio,
      metrics: user.metrics,
    },
  });
};

// @desc    Register new user (Donor / Receiver / Admin)
// @route   POST /api/auth/register
// @access  Public
exports.register = async (req, res, next) => {
  try {
    const {
      name,
      email,
      password,
      role,
      organizationName,
      organizationType,
      phone,
      address,
      coordinates,
      bio,
    } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'An account with this email address already exists.',
      });
    }

    // Prepare location coords if provided
    let locationData = { type: 'Point', coordinates: [77.2090, 28.6139] };
    if (coordinates && Array.isArray(coordinates) && coordinates.length === 2) {
      locationData.coordinates = [Number(coordinates[0]), Number(coordinates[1])];
    }

    // For Donors auto-verify by default, for NGOs set verification to pending if org name provided
    let isVerified = false;
    let verificationStatus = 'unsubmitted';
    if (role === 'donor') {
      isVerified = true;
      verificationStatus = 'verified';
    } else if (role === 'receiver') {
      isVerified = false;
      verificationStatus = 'pending';
    } else if (role === 'admin') {
      isVerified = true;
      verificationStatus = 'verified';
    }

    const user = await User.create({
      name,
      email,
      password,
      role: role || 'donor',
      organizationName: organizationName || (role === 'donor' ? `${name}'s Kitchen` : 'Community Relief NGO'),
      organizationType: organizationType || (role === 'donor' ? 'Restaurant' : 'NGO / Non-Profit'),
      phone: phone || '+1 555-0199',
      address: address || {
        street: '124 Hope Avenue',
        city: 'Metro City',
        state: 'Central',
        pincode: '100001',
        formattedAddress: '124 Hope Avenue, Metro City',
      },
      location: locationData,
      isVerified,
      verificationStatus,
      bio: bio || '',
      avatar: `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(name)}`,
    });

    await logActivity({
      userId: user._id,
      userName: user.name,
      userRole: user.role,
      action: 'USER_REGISTERED',
      description: `New user registered as ${user.role}: ${user.name} (${user.organizationName || user.email})`,
      entityType: 'User',
      entityId: user._id,
    });

    sendTokenResponse(user, 201, res);
  } catch (error) {
    next(error);
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide an email and password.',
      });
    }

    // Check user
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials. User not found.',
      });
    }

    // Check password
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials. Password incorrect.',
      });
    }

    if (!user.isActive) {
      return res.status(403).json({
        success: false,
        message: 'Your account is deactivated. Please contact support.',
      });
    }

    await logActivity({
      userId: user._id,
      userName: user.name,
      userRole: user.role,
      action: 'USER_LOGIN',
      description: `${user.name} (${user.role}) logged in successfully.`,
      entityType: 'User',
      entityId: user._id,
    });

    sendTokenResponse(user, 200, res);
  } catch (error) {
    next(error);
  }
};

// @desc    Get current logged in user profile
// @route   GET /api/auth/me
// @access  Private
exports.getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update profile details
// @route   PUT /api/auth/updatedetails
// @access  Private
exports.updateDetails = async (req, res, next) => {
  try {
    const {
      name,
      organizationName,
      organizationType,
      phone,
      address,
      bio,
      operatingHours,
      coordinates,
    } = req.body;

    const fieldsToUpdate = {};
    if (name) fieldsToUpdate.name = name;
    if (organizationName !== undefined) fieldsToUpdate.organizationName = organizationName;
    if (organizationType) fieldsToUpdate.organizationType = organizationType;
    if (phone) fieldsToUpdate.phone = phone;
    if (address) fieldsToUpdate.address = address;
    if (bio !== undefined) fieldsToUpdate.bio = bio;
    if (operatingHours) fieldsToUpdate.operatingHours = operatingHours;
    if (coordinates && Array.isArray(coordinates)) {
      fieldsToUpdate.location = { type: 'Point', coordinates };
    }

    const user = await User.findByIdAndUpdate(req.user.id, fieldsToUpdate, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      user,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    1-Click Demo Login for quick testing
// @route   POST /api/auth/demo-login
// @access  Public
exports.demoLogin = async (req, res, next) => {
  try {
    const { role = 'donor' } = req.body;
    let user = await User.findOne({ role });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: `No demo account found for role: ${role}. Run database seeder first.`,
      });
    }

    sendTokenResponse(user, 200, res);
  } catch (error) {
    next(error);
  }
};
