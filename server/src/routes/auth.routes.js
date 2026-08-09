import express from 'express';

import validate from '../middleware/validate.middleware.js';
import authenticate from '../middleware/auth.middleware.js';
import authRateLimiter from '../middleware/rateLimit.middleware.js';

import {
  registerSchema,
  loginSchema,
  refreshSchema,
  verifyEmailSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
} from '../schemas/auth.schema.js';

import {
  register,
  login,
  getMe,
  refresh,
  logout,
  verifyEmailController,
  forgotPasswordController,
  resetPasswordController,
} from '../controllers/auth.controller.js';

const router = express.Router();

// ==========================
// Register
// ==========================
router.post(
  '/register',
  validate(registerSchema),
  register
);

// ==========================
// Login
// ==========================
router.post(
  '/login',
  authRateLimiter,
  validate(loginSchema),
  login
);

// ==========================
// Refresh Access Token
// ==========================
// Refresh token is now read from
// the HttpOnly cookie.
router.post(
  '/refresh',
  validate(refreshSchema),
  refresh
);

// ==========================
// Logout
// ==========================
router.post(
  '/logout',
  logout
);

// ==========================
// Verify Email
// ==========================
router.post(
  '/verify-email',
  validate(verifyEmailSchema),
  verifyEmailController
);

// ==========================
// Forgot Password
// ==========================
router.post(
  '/forgot-password',
  authRateLimiter,
  validate(forgotPasswordSchema),
  forgotPasswordController
);

// ==========================
// Reset Password
// ==========================
router.post(
  '/reset-password',
  authRateLimiter,
  validate(resetPasswordSchema),
  resetPasswordController
);

// ==========================
// Get Current User
// ==========================
router.get(
  '/me',
  authenticate,
  getMe
);

export default router;