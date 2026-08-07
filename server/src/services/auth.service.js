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
  createEmailVerificationToken
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

export {
  registerUser,
  loginUser,
  getCurrentUser,
  refreshAccessToken,
  logoutUser,
};