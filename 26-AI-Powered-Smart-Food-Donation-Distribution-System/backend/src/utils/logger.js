const ActivityLog = require('../models/ActivityLog');

const logActivity = async ({
  userId,
  userName = 'System',
  userRole = 'system',
  action,
  description,
  entityType = 'System',
  entityId = null,
  metadata = {},
  ipAddress = '',
}) => {
  try {
    await ActivityLog.create({
      userId,
      userName,
      userRole,
      action,
      description,
      entityType,
      entityId,
      metadata,
      ipAddress,
    });
  } catch (error) {
    console.error('Failed to write activity log:', error.message);
  }
};

module.exports = { logActivity };
