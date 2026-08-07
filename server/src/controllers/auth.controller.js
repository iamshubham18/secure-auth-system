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
  forgotPassword,
  resetPassword,
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

// ==========================
// Forgot Password
// ==========================
const forgotPasswordController = asyncHandler(async (req, res) => {
  const { email } = req.validatedData;

  const result = await forgotPassword(email);

  return res.status(HTTP_STATUS.OK).json(
    new ApiResponse(
      HTTP_STATUS.OK,
      'Password reset token generated successfully',
      result
    )
  );
});

// ==========================
// Reset Password
// ==========================
const resetPasswordController = asyncHandler(async (req, res) => {
  const { token, password } = req.validatedData;

  const result = await resetPassword(token, password);

  return res.status(HTTP_STATUS.OK).json(
    new ApiResponse(
      HTTP_STATUS.OK,
      'Password reset successfully',
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
  forgotPasswordController,
  resetPasswordController,
};