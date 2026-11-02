const PickupRequest = require('../models/PickupRequest');
const FoodListing = require('../models/FoodListing');
const User = require('../models/User');
const Notification = require('../models/Notification');
const { logActivity } = require('../utils/logger');

// @desc    NGO / Receiver creates a pickup claim request
// @route   POST /api/pickups
// @access  Private (Receiver / NGO, Admin)
exports.createPickupRequest = async (req, res, next) => {
  try {
    const {
      listingId,
      estimatedPickupTime,
      transportMode,
      volunteerCount,
      targetBeneficiaryGroup,
      estimatedBeneficiariesCount,
      pickupNotes,
    } = req.body;

    const listing = await FoodListing.findById(listingId);
    if (!listing) {
      return res.status(404).json({ success: false, message: 'Food listing not found' });
    }

    if (listing.status !== 'Available') {
      return res.status(400).json({
        success: false,
        message: `This food listing is currently '${listing.status}' and cannot be claimed.`,
      });
    }

    const user = req.user;

    const pickup = await PickupRequest.create({
      listingId: listing._id,
      donorId: listing.donorId,
      receiverId: user._id,
      receiverName: user.name,
      receiverOrg: user.organizationName || `${user.name} Charity`,
      receiverPhone: user.phone || '+1 555-0188',
      status: 'Pending',
      estimatedPickupTime: estimatedPickupTime ? new Date(estimatedPickupTime) : new Date(Date.now() + 2 * 60 * 60 * 1000),
      transportMode: transportMode || 'Light Commercial Van',
      volunteerCount: volunteerCount || 1,
      targetBeneficiaryGroup: targetBeneficiaryGroup || 'Urban Slum Community',
      estimatedBeneficiariesCount: estimatedBeneficiariesCount || listing.estimatedMeals || 25,
      pickupNotes: pickupNotes || '',
      verificationOtp: Math.floor(100000 + Math.random() * 900000).toString(),
      statusTimeline: [
        {
          status: 'Pending',
          timestamp: new Date(),
          note: `Claim requested by ${user.organizationName || user.name}`,
          updatedBy: user._id,
        },
      ],
    });

    // Update listing status to Requested
    listing.status = 'Requested';
    listing.activeClaimId = pickup._id;
    listing.claimedBy = user._id;
    await listing.save();

    // Send in-app notification to the Donor
    await Notification.create({
      recipientId: listing.donorId,
      senderId: user._id,
      title: '📦 New Pickup Request Received!',
      message: `${user.organizationName || user.name} has requested to pick up "${listing.title}". Please accept and coordinate handover.`,
      type: 'PICKUP_REQUEST_RECEIVED',
      link: '/donor-dashboard',
      relatedListingId: listing._id,
      relatedPickupId: pickup._id,
    });

    await logActivity({
      userId: user._id,
      userName: user.name,
      userRole: user.role,
      action: 'PICKUP_REQUESTED',
      description: `NGO ${user.organizationName || user.name} requested pickup for listing "${listing.title}"`,
      entityType: 'PickupRequest',
      entityId: pickup._id,
    });

    res.status(201).json({
      success: true,
      message: 'Pickup request submitted successfully',
      pickup,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Donor accepts pickup request
// @route   PUT /api/pickups/:id/accept
// @access  Private (Donor Owner, Admin)
exports.acceptPickupRequest = async (req, res, next) => {
  try {
    const pickup = await PickupRequest.findById(req.params.id);
    if (!pickup) {
      return res.status(404).json({ success: false, message: 'Pickup request not found' });
    }

    if (pickup.donorId.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Only the donor can accept this pickup request' });
    }

    pickup.status = 'Accepted';
    pickup.statusTimeline.push({
      status: 'Accepted',
      timestamp: new Date(),
      note: 'Donor confirmed and accepted pickup request',
      updatedBy: req.user._id,
    });
    await pickup.save();

    // Update Listing
    await FoodListing.findByIdAndUpdate(pickup.listingId, { status: 'Accepted' });

    // Notify NGO
    await Notification.create({
      recipientId: pickup.receiverId,
      senderId: req.user._id,
      title: '✅ Pickup Request Accepted!',
      message: `Donor ${req.user.name} accepted your pickup request. Your handover OTP is ${pickup.verificationOtp}.`,
      type: 'PICKUP_REQUEST_ACCEPTED',
      link: `/tracking/${pickup._id}`,
      relatedPickupId: pickup._id,
    });

    await logActivity({
      userId: req.user._id,
      userName: req.user.name,
      userRole: req.user.role,
      action: 'PICKUP_ACCEPTED',
      description: `Donor ${req.user.name} accepted pickup request #${pickup._id}`,
      entityType: 'PickupRequest',
      entityId: pickup._id,
    });

    res.status(200).json({
      success: true,
      message: 'Pickup request accepted',
      pickup,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    NGO marks food collected (Picked Up)
// @route   PUT /api/pickups/:id/pickup
// @access  Private (Receiver / NGO, Admin)
exports.markPickedUp = async (req, res, next) => {
  try {
    const pickup = await PickupRequest.findById(req.params.id);
    if (!pickup) {
      return res.status(404).json({ success: false, message: 'Pickup request not found' });
    }

    if (pickup.receiverId.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Only assigned NGO can mark as picked up' });
    }

    pickup.status = 'Picked Up';
    pickup.actualPickupTime = new Date();
    pickup.statusTimeline.push({
      status: 'Picked Up',
      timestamp: new Date(),
      note: 'Surplus food collected from donor premises and loaded into transit',
      updatedBy: req.user._id,
    });
    await pickup.save();

    // Update Listing
    await FoodListing.findByIdAndUpdate(pickup.listingId, { status: 'Picked Up' });

    // Notify Donor
    await Notification.create({
      recipientId: pickup.donorId,
      senderId: req.user._id,
      title: '🚚 Food Collected by NGO',
      message: `${pickup.receiverOrg || pickup.receiverName} has picked up the food from your location and is en-route for distribution.`,
      type: 'FOOD_PICKED_UP',
      link: `/tracking/${pickup._id}`,
      relatedPickupId: pickup._id,
    });

    await logActivity({
      userId: req.user._id,
      userName: req.user.name,
      userRole: req.user.role,
      action: 'PICKUP_COLLECTED',
      description: `NGO ${pickup.receiverName} collected food for pickup #${pickup._id}`,
      entityType: 'PickupRequest',
      entityId: pickup._id,
    });

    res.status(200).json({
      success: true,
      message: 'Status updated: Food Picked Up',
      pickup,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    NGO marks food delivered to beneficiaries + verifies OTP
// @route   PUT /api/pickups/:id/deliver
// @access  Private (Receiver / NGO, Admin)
exports.markDelivered = async (req, res, next) => {
  try {
    const { otp, proofImage, deliveryNote } = req.body;
    const pickup = await PickupRequest.findById(req.params.id).populate('listingId');

    if (!pickup) {
      return res.status(404).json({ success: false, message: 'Pickup request not found' });
    }

    if (pickup.receiverId.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Only assigned NGO can mark as delivered' });
    }

    // Check OTP if provided
    if (otp) {
      if (otp.toString().trim() === pickup.verificationOtp.toString().trim()) {
        pickup.isOtpVerified = true;
      }
    } else {
      pickup.isOtpVerified = true;
    }

    pickup.status = 'Delivered';
    pickup.deliveredTime = new Date();
    if (proofImage) pickup.proofImage = proofImage;
    pickup.statusTimeline.push({
      status: 'Delivered',
      timestamp: new Date(),
      note: deliveryNote || `Safely distributed to ${pickup.targetBeneficiaryGroup} (${pickup.estimatedBeneficiariesCount} people served)`,
      updatedBy: req.user._id,
    });
    await pickup.save();

    // Update Listing to Delivered
    if (pickup.listingId) {
      await FoodListing.findByIdAndUpdate(pickup.listingId._id, { status: 'Delivered' });
    }

    // Increment NGO stats
    const mealsCount = pickup.listingId?.estimatedMeals || pickup.estimatedBeneficiariesCount || 20;
    const kgCount = pickup.listingId?.quantityUnit === 'kg' ? pickup.listingId.quantity : Math.round(mealsCount * 0.4);

    await User.findByIdAndUpdate(pickup.receiverId, {
      $inc: {
        'metrics.totalPickupsCompleted': 1,
        'metrics.totalMealsSaved': mealsCount,
        'metrics.totalDonatedKg': kgCount,
      },
    });

    // Notify Donor of successful delivery
    await Notification.create({
      recipientId: pickup.donorId,
      senderId: req.user._id,
      title: '🌟 Food Successfully Delivered & Distributed!',
      message: `Your food donation has fed ${pickup.estimatedBeneficiariesCount} people at ${pickup.targetBeneficiaryGroup}. Thank you for making a difference!`,
      type: 'FOOD_DELIVERED',
      link: `/tracking/${pickup._id}`,
      relatedPickupId: pickup._id,
    });

    await logActivity({
      userId: req.user._id,
      userName: req.user.name,
      userRole: req.user.role,
      action: 'PICKUP_DELIVERED',
      description: `Delivery completed by ${pickup.receiverName} to ${pickup.targetBeneficiaryGroup}`,
      entityType: 'PickupRequest',
      entityId: pickup._id,
    });

    res.status(200).json({
      success: true,
      message: 'Donation delivery cycle completed successfully!',
      pickup,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Cancel pickup request
// @route   PUT /api/pickups/:id/cancel
// @access  Private (Donor, Receiver, Admin)
exports.cancelPickupRequest = async (req, res, next) => {
  try {
    const { reason = 'Cancelled by user' } = req.body;
    const pickup = await PickupRequest.findById(req.params.id);

    if (!pickup) {
      return res.status(404).json({ success: false, message: 'Pickup request not found' });
    }

    const isAuthorized =
      pickup.donorId.toString() === req.user.id ||
      pickup.receiverId.toString() === req.user.id ||
      req.user.role === 'admin';

    if (!isAuthorized) {
      return res.status(403).json({ success: false, message: 'Not authorized to cancel this request' });
    }

    pickup.status = 'Cancelled';
    pickup.statusTimeline.push({
      status: 'Cancelled',
      timestamp: new Date(),
      note: `Cancelled: ${reason}`,
      updatedBy: req.user._id,
    });
    await pickup.save();

    // Release food listing back to Available
    await FoodListing.findByIdAndUpdate(pickup.listingId, {
      status: 'Available',
      activeClaimId: null,
      claimedBy: null,
    });

    await logActivity({
      userId: req.user._id,
      userName: req.user.name,
      userRole: req.user.role,
      action: 'PICKUP_CANCELLED',
      description: `Pickup request #${pickup._id} cancelled by ${req.user.name}`,
      entityType: 'PickupRequest',
      entityId: pickup._id,
    });

    res.status(200).json({
      success: true,
      message: 'Pickup request cancelled and listing returned to available pool.',
      pickup,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single pickup tracking details
// @route   GET /api/pickups/:id
// @access  Private
exports.getPickupById = async (req, res, next) => {
  try {
    const pickup = await PickupRequest.findById(req.params.id)
      .populate('listingId')
      .populate('donorId', 'name organizationName phone email avatar address location')
      .populate('receiverId', 'name organizationName phone email avatar location isVerified');

    if (!pickup) {
      return res.status(404).json({ success: false, message: 'Pickup tracking record not found' });
    }

    res.status(200).json({
      success: true,
      pickup,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get user's pickups (Donor incoming / NGO active claims)
// @route   GET /api/pickups/my-pickups
// @access  Private
exports.getMyPickups = async (req, res, next) => {
  try {
    const query = req.user.role === 'donor'
      ? { donorId: req.user.id }
      : req.user.role === 'receiver'
      ? { receiverId: req.user.id }
      : {};

    const pickups = await PickupRequest.find(query)
      .populate('listingId')
      .populate('donorId', 'name organizationName phone avatar address')
      .populate('receiverId', 'name organizationName phone avatar isVerified')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: pickups.length,
      pickups,
    });
  } catch (error) {
    next(error);
  }
};
