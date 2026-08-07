import express from 'express';

import validate from '../middleware/validate.middleware.js';
import authenticate from '../middleware/auth.middleware.js';

import {
  registerSchema,
  loginSchema,
  refreshTokenSchema,
} from '../schemas/auth.schema.js';

import {
  register,
  login,
  getMe,
  refresh,
} from '../controllers/auth.controller.js';

const router = express.Router();

router.post(
  '/register',
  validate(registerSchema),
  register
);

router.post(
  '/login',
  validate(loginSchema),
  login
);

router.post(
  '/refresh',
  validate(refreshTokenSchema),
  refresh
);

router.get(
  '/me',
  authenticate,
  getMe
);

export default router;