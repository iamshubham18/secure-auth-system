import express from 'express';

import validate from '../middleware/validate.middleware.js';
import authenticate from '../middleware/auth.middleware.js';
import authRateLimiter from '../middleware/rateLimit.middleware.js';

import {
  registerSchema,
  loginSchema,
  refreshTokenSchema,
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

router.post(
  '/register',
  validate(registerSchema),
  register
);

router.post(
  '/login',
  authRateLimiter,
  validate(loginSchema),
  login
);

router.post(
  '/refresh',
  validate(refreshTokenSchema),
  refresh
);

router.post(
  '/logout',
  validate(refreshTokenSchema),
  logout
);

router.post(
  '/verify-email',
  validate(verifyEmailSchema),
  verifyEmailController
);

router.post(
  '/forgot-password',
  authRateLimiter,
  validate(forgotPasswordSchema),
  forgotPasswordController
);

router.post(
  '/reset-password',
  authRateLimiter,
  validate(resetPasswordSchema),
  resetPasswordController
);

router.get(
  '/me',
  authenticate,
  getMe
);

export default router;