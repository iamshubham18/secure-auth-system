import bcrypt from 'bcrypt';

import ApiError from '../utils/ApiError.js';
import { HTTP_STATUS } from '../constants/httpStatus.js';
import { generateRandomToken } from '../utils/token.js';
import {
  generateAccessToken,
  generateRefreshToken,
} from '../utils/jwt.js';

import {
  findUserByEmail,
  findUserById,
  createUser,
  createRefreshToken,
  findRefreshToken,
  deleteRefreshToken,
  createEmailVerificationToken,
  findEmailVerificationToken,
  markUserAsVerified,
  deleteEmailVerificationToken,
  createPasswordResetToken,
  findPasswordResetToken,
  updateUserPassword,
  deletePasswordResetToken,
} from '../repositories/user.repository.js';

// ==========================
// Register User
// ==========================
const registerUser = async (userData) => {
  const { firstName, lastName, email, password } = userData;

  // Check if email already exists
  const existingUser = await findUserByEmail(email);

  if (existingUser) {
    throw new ApiError(
      HTTP_STATUS.CONFLICT,
      'User with this email already exists'
    );
  }

  // Hash password
  const passwordHash = await bcrypt.hash(password, 12);

  // Create user
  const user = await createUser({
    firstName,
    lastName,
    email,
    passwordHash,
  });

  // Generate email verification token
  const verificationToken = generateRandomToken();

  // Token expires in 24 hours
  const expiresAt = new Date();
  expiresAt.setHours(expiresAt.getHours() + 24);

  // Save verification token
  await createEmailVerificationToken({
    token: verificationToken,
    expiresAt,
    userId: user.id,
  });

  // Temporary: Print token to console
  console.log('===================================');
  console.log('Email Verification Token');
  console.log(verificationToken);
  console.log('===================================');

  // Remove passwordHash before returning
  const { passwordHash: _, ...safeUser } = user;

  return safeUser;
};

// ==========================
// Login User
// ==========================

const getRefreshTokenExpiry = () => {
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 7);
  return expiresAt;
};

const loginUser = async (loginData) => {
  const { email, password } = loginData;

  // Check if user exists
  const user = await findUserByEmail(email);

  if (!user) {
    throw new ApiError(
      HTTP_STATUS.UNAUTHORIZED,
      'Invalid email or password'
    );
  }

  // Compare password
  const isPasswordValid = await bcrypt.compare(
    password,
    user.passwordHash
  );

  if (!isPasswordValid) {
    throw new ApiError(
      HTTP_STATUS.UNAUTHORIZED,
      'Invalid email or password'
    );
  }

  // Generate JWT tokens
  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken(user);

  // Save refresh token in database
await createRefreshToken({
  token: refreshToken,
  expiresAt: getRefreshTokenExpiry(),
  userId: user.id,
});

  // Remove passwordHash before returning
  const { passwordHash: _, ...safeUser } = user;

  return {
    user: safeUser,
    accessToken,
    refreshToken,
  };
};

// ==========================
// Get Current User
// ==========================
const getCurrentUser = async (userId) => {
  const user = await findUserById(userId);

  if (!user) {
    throw new ApiError(
      HTTP_STATUS.NOT_FOUND,
      'User not found'
    );
  }

  // Remove passwordHash before returning
  const { passwordHash: _, ...safeUser } = user;

  return safeUser;
};

// ==========================
// Refresh Access Token
// ==========================
const refreshAccessToken = async (refreshToken) => {
  // Check if refresh token exists in database
  const storedToken = await findRefreshToken(refreshToken);

  if (!storedToken) {
    throw new ApiError(
      HTTP_STATUS.UNAUTHORIZED,
      'Invalid refresh token'
    );
  }

  // Check if refresh token has expired
  if (storedToken.expiresAt < new Date()) {
    throw new ApiError(
      HTTP_STATUS.UNAUTHORIZED,
      'Refresh token has expired'
    );
  }

  // ==========================
// Find User and Generate New Access Token
// ==========================

  // Find user
  const user = await findUserById(storedToken.userId);

  if (!user) {
    throw new ApiError(
      HTTP_STATUS.NOT_FOUND,
      'User not found'
    );
  }

  // Generate new access token
  const accessToken = generateAccessToken(user);

  return {
    accessToken,
  };
};

// ==========================
// Logout User
// ==========================
const logoutUser = async (refreshToken) => {
  const storedToken = await findRefreshToken(refreshToken);

  if (!storedToken) {
    throw new ApiError(
      HTTP_STATUS.UNAUTHORIZED,
      'Invalid refresh token'
    );
  }

  await deleteRefreshToken(refreshToken);

  return {
    message: 'Logged out successfully',
  };
};

// ==========================
// Verify Email
// ==========================
const verifyEmail = async (token) => {
  // Find verification token
  const verificationToken = await findEmailVerificationToken(token);

  if (!verificationToken) {
    throw new ApiError(
      HTTP_STATUS.BAD_REQUEST,
      'Invalid verification token'
    );
  }

  // Check expiration
  if (verificationToken.expiresAt < new Date()) {
    throw new ApiError(
      HTTP_STATUS.BAD_REQUEST,
      'Verification token has expired'
    );
  }

  // Mark user as verified
  await markUserAsVerified(verificationToken.userId);

  // Delete token so it cannot be reused
  await deleteEmailVerificationToken(token);

  return {
    message: 'Email verified successfully',
  };
};

// ==========================
// Forgot Password
// ==========================
const forgotPassword = async (email) => {
  const user = await findUserByEmail(email);

  if (!user) {
    throw new ApiError(
      HTTP_STATUS.NOT_FOUND,
      'User not found'
    );
  }

  const resetToken = generateRandomToken();

  const expiresAt = new Date();
  expiresAt.setHours(expiresAt.getHours() + 1);

  await createPasswordResetToken({
    token: resetToken,
    expiresAt,
    userId: user.id,
  });

  console.log('===================================');
  console.log('Password Reset Token');
  console.log(resetToken);
  console.log('===================================');

  return {
    message: 'Password reset token generated successfully',
  };
};

// ==========================
// Reset Password
// ==========================
const resetPassword = async (token, newPassword) => {
  // Find reset token
  const passwordResetToken = await findPasswordResetToken(token);

  if (!passwordResetToken) {
    throw new ApiError(
      HTTP_STATUS.BAD_REQUEST,
      'Invalid password reset token'
    );
  }

  // Check expiration
  if (passwordResetToken.expiresAt < new Date()) {
    throw new ApiError(
      HTTP_STATUS.BAD_REQUEST,
      'Password reset token has expired'
    );
  }

  // Hash new password
  const passwordHash = await bcrypt.hash(newPassword, 12);

  // Update user's password
  await updateUserPassword(
    passwordResetToken.userId,
    passwordHash
  );

  // Delete reset token
  await deletePasswordResetToken(token);

  return {
    message: 'Password reset successfully',
  };
};

export {
  registerUser,
  loginUser,
  getCurrentUser,
  refreshAccessToken,
  logoutUser,
  verifyEmail,
  forgotPassword,
  resetPassword,
};