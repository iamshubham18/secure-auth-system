import ApiResponse from '../utils/ApiResponse.js';
import { HTTP_STATUS } from '../constants/httpStatus.js';
import asyncHandler from '../utils/asyncHandler.js';

import {
  registerUser,
  loginUser,
  getCurrentUser,
  refreshAccessToken,
  logoutUser,
  verifyEmail,
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

// ==========================
// Refresh Access Token
// ==========================
const refresh = asyncHandler(async (req, res) => {
  const { refreshToken } = req.validatedData;

  const result = await refreshAccessToken(refreshToken);

  return res.status(HTTP_STATUS.OK).json(
    new ApiResponse(
      HTTP_STATUS.OK,
      'Access token refreshed successfully',
      result
    )
  );
});

// ==========================
// Logout User
// ==========================
const logout = asyncHandler(async (req, res) => {
  const { refreshToken } = req.validatedData;

  await logoutUser(refreshToken);

  return res.status(HTTP_STATUS.OK).json(
    new ApiResponse(
      HTTP_STATUS.OK,
      'Logged out successfully'
    )
  );
});

// ==========================
// Verify Email
// ==========================
const verifyEmailController = asyncHandler(async (req, res) => {
  const { token } = req.validatedData;

  const result = await verifyEmail(token);

  return res.status(HTTP_STATUS.OK).json(
    new ApiResponse(
      HTTP_STATUS.OK,
      'Email verified successfully',
      result
    )
  );
});

export {
  register,
  login,
  getMe,
  refresh,
  logout,
  verifyEmailController,
};