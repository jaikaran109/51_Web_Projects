const express = require('express');
const {
  getOverviewStats,
  getDonorStats,
  getNgoStats,
  getActivityLogs,
} = require('../controllers/analyticsController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.get('/overview', getOverviewStats);
router.get('/donor', protect, authorize('donor', 'admin'), getDonorStats);
router.get('/ngo', protect, authorize('receiver', 'admin'), getNgoStats);
router.get('/activity-logs', protect, authorize('admin'), getActivityLogs);

module.exports = router;
