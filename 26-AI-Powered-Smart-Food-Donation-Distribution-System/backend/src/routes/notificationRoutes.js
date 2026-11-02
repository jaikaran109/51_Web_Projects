const express = require('express');
const {
  getNotifications,
  markAsRead,
  markAllRead,
  deleteNotification,
} = require('../controllers/notificationController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.get('/', protect, getNotifications);
router.put('/:id/read', protect, markAsRead);
router.put('/read-all', protect, markAllRead);
router.delete('/:id', protect, deleteNotification);

module.exports = router;
