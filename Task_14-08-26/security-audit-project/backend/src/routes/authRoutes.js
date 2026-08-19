const express = require('express');
const router = express.Router();

const authController = require('../controllers/authController');
const { requireAuth } = require('../middleware/auth');
const { authLimiter } = require('../middleware/rateLimiter');
const { doubleCsrfProtection, issueCsrfToken } = require('../middleware/csrfProtection');
const {
  handleValidation,
  registerRules,
  loginRules,
} = require('../middleware/validators');

router.get('/csrf-token', issueCsrfToken);

router.post(
  '/register',
  authLimiter,
  doubleCsrfProtection,
  registerRules,
  handleValidation,
  authController.register
);

router.post(
  '/login',
  authLimiter,
  doubleCsrfProtection,
  loginRules,
  handleValidation,
  authController.login
);

router.post('/logout', doubleCsrfProtection, authController.logout);
router.get('/me', requireAuth, authController.me);

module.exports = router;
