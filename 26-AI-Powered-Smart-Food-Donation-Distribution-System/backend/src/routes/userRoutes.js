const express = require('express');
const {
  getUsers,
  getUserById,
  updateUserStatus,
  verifyNgo,
  getNgos,
  getDonors,
  getLeaderboard,
} = require('../controllers/userController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// Public routes
router.get('/ngos', getNgos);
router.get('/donors', getDonors);
router.get('/leaderboard', getLeaderboard);
router.get('/:id', getUserById);

// Admin-only routes
router.get('/', protect, authorize('admin'), getUsers);
router.put('/:id/status', protect, authorize('admin'), updateUserStatus);
router.put('/:id/verify-ngo', protect, authorize('admin'), verifyNgo);

module.exports = router;
