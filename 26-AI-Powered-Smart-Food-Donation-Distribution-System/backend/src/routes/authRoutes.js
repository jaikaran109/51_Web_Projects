const express = require('express');
const { body } = require('express-validator');
const {
  register,
  login,
  getMe,
  updateDetails,
  demoLogin,
} = require('../controllers/authController');
const { protect } = require('../middleware/auth');
const { validate } = require('../middleware/validator');

const router = express.Router();

router.post(
  '/register',
  [
    body('name', 'Name is required').notEmpty(),
    body('email', 'Valid email is required').isEmail(),
    body('password', 'Password must be 6 or more characters').isLength({ min: 6 }),
    body('role', 'Role must be donor, receiver, or admin').isIn(['donor', 'receiver', 'admin']),
    validate,
  ],
  register
);

router.post(
  '/login',
  [
    body('email', 'Please provide a valid email').isEmail(),
    body('password', 'Password is required').exists(),
    validate,
  ],
  login
);

router.post('/demo-login', demoLogin);

router.get('/me', protect, getMe);
router.put('/updatedetails', protect, updateDetails);

module.exports = router;
