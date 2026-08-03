import express from 'express';

import validate from '../middleware/validate.middleware.js';
import authenticate from '../middleware/auth.middleware.js';

import {
  registerSchema,
  loginSchema,
} from '../schemas/auth.schema.js';

import {
  register,
  login,
  getMe,
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

router.get(
  '/me',
  authenticate,
  getMe
);

export default router;