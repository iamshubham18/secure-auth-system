import ApiResponse from '../utils/ApiResponse.js';
import { HTTP_STATUS } from '../constants/httpStatus.js';
import asyncHandler from '../utils/asyncHandler.js';

import {
  registerUser,
  loginUser,
  getCurrentUser,
} from '../services/auth.service.js';

// ==========================
// Register
// ==========================
const register = asyncHandler(async (req, res) => {
  const user = await registerUser(req.validatedData);

  return res.status(HTTP_STATUS.CREATED).json(
    new ApiResponse(
      HTTP_STATUS.CREATED,
      'User registered successfully',
      user
    )
  );
});

// ==========================
// Login
// ==========================
const login = asyncHandler(async (req, res) => {
  const result = await loginUser(req.validatedData);

  return res.status(HTTP_STATUS.OK).json(
    new ApiResponse(
      HTTP_STATUS.OK,
      'Login successful',
      result
    )
  );
});

// ==========================
// Get Current User
// ==========================
const getMe = asyncHandler(async (req, res) => {
  const user = await getCurrentUser(req.user.userId);

  return res.status(HTTP_STATUS.OK).json(
    new ApiResponse(
      HTTP_STATUS.OK,
      'User profile fetched successfully',
      user
    )
  );
});

export {
  register,
  login,
  getMe,
};