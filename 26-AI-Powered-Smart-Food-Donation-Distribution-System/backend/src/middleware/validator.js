const { validationResult } = require('express-validator');

// Validation Result Middleware
exports.validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const errorDetails = errors.array().map((err) => ({
      field: err.path || err.param,
      message: err.msg,
    }));
    return res.status(400).json({
      success: false,
      message: errorDetails[0]?.message || 'Invalid input data',
      errors: errorDetails,
    });
  }
  next();
};
