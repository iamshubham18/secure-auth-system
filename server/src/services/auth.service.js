import bcrypt from 'bcrypt';

import ApiError from '../utils/ApiError.js';
import { HTTP_STATUS } from '../constants/httpStatus.js';
import {
  generateAccessToken,
  generateRefreshToken,
} from '../utils/jwt.js';

import {
  findUserByEmail,
  findUserById,
  createUser,
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

  // Remove passwordHash before returning
  const { passwordHash: _, ...safeUser } = user;

  return safeUser;
};

// ==========================
// Login User
// ==========================
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

export {
  registerUser,
  loginUser,
  getCurrentUser,
};