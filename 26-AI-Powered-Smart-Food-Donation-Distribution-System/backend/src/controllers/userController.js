const User = require('../models/User');
const Notification = require('../models/Notification');
const { logActivity } = require('../utils/logger');

// @desc    Get all users (Admin only)
// @route   GET /api/users
// @access  Private (Admin)
exports.getUsers = async (req, res, next) => {
  try {
    const { role, status, verification, search, page = 1, limit = 20 } = req.query;
    const query = {};

    if (role) query.role = role;
    if (status) query.isActive = status === 'active';
    if (verification) query.verificationStatus = verification;
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { organizationName: { $regex: search, $options: 'i' } },
      ];
    }

    const total = await User.countDocuments(query);
    const users = await User.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    res.status(200).json({
      success: true,
      count: users.length,
      total,
      totalPages: Math.ceil(total / limit),
      currentPage: Number(page),
      users,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single user by ID
// @route   GET /api/users/:id
// @access  Public
exports.getUserById = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Moderate user (activate/deactivate)
// @route   PUT /api/users/:id/status
// @access  Private (Admin)
exports.updateUserStatus = async (req, res, next) => {
  try {
    const { isActive } = req.body;
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { isActive },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    await logActivity({
      userId: req.user._id,
      userName: req.user.name,
      userRole: req.user.role,
      action: 'USER_MODERATED',
      description: `Admin ${req.user.name} set ${user.name} (${user.role}) status to ${isActive ? 'Active' : 'Deactivated'}`,
      entityType: 'User',
      entityId: user._id,
    });

    res.status(200).json({
      success: true,
      message: `User status changed to ${isActive ? 'active' : 'inactive'}`,
      user,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Verify or Reject NGO documentation
// @route   PUT /api/users/:id/verify-ngo
// @access  Private (Admin)
exports.verifyNgo = async (req, res, next) => {
  try {
    const { verificationStatus } = req.body; // 'verified' or 'rejected'
    const isVerified = verificationStatus === 'verified';

    const user = await User.findByIdAndUpdate(
      req.params.id,
      {
        verificationStatus,
        isVerified,
      },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Send in-app notification to the NGO
    await Notification.create({
      recipientId: user._id,
      senderId: req.user._id,
      title: isVerified ? '🎉 NGO Organization Verified!' : '⚠️ NGO Verification Update',
      message: isVerified
        ? 'Congratulations! Your NGO credentials have been verified by Platform Administrators. You can now claim high-priority surplus listings.'
        : 'Your NGO verification request could not be approved at this time. Please update your profile details.',
      type: 'NGO_VERIFIED',
      link: '/dashboard',
    });

    await logActivity({
      userId: req.user._id,
      userName: req.user.name,
      userRole: req.user.role,
      action: 'NGO_VERIFIED',
      description: `Admin ${req.user.name} verified NGO: ${user.organizationName || user.name} -> ${verificationStatus}`,
      entityType: 'User',
      entityId: user._id,
    });

    res.status(200).json({
      success: true,
      message: `NGO verification status updated to ${verificationStatus}`,
      user,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get verified NGOs list
// @route   GET /api/users/ngos
// @access  Public
exports.getNgos = async (req, res, next) => {
  try {
    const ngos = await User.find({ role: 'receiver', isActive: true })
      .select('-password')
      .sort({ 'metrics.totalMealsSaved': -1 });

    res.status(200).json({
      success: true,
      count: ngos.length,
      ngos,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get verified Donors list
// @route   GET /api/users/donors
// @access  Public
exports.getDonors = async (req, res, next) => {
  try {
    const donors = await User.find({ role: 'donor', isActive: true })
      .select('-password')
      .sort({ 'metrics.totalDonatedKg': -1 });

    res.status(200).json({
      success: true,
      count: donors.length,
      donors,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get Community Impact Leaderboard
// @route   GET /api/users/leaderboard
// @access  Public
exports.getLeaderboard = async (req, res, next) => {
  try {
    const topDonors = await User.find({ role: 'donor', isActive: true })
      .sort({ 'metrics.totalDonatedKg': -1 })
      .limit(5)
      .select('name organizationName organizationType avatar metrics location');

    const topNgos = await User.find({ role: 'receiver', isActive: true })
      .sort({ 'metrics.totalMealsSaved': -1 })
      .limit(5)
      .select('name organizationName organizationType avatar metrics location isVerified');

    res.status(200).json({
      success: true,
      topDonors,
      topNgos,
    });
  } catch (error) {
    next(error);
  }
};
