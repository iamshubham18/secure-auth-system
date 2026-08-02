import bcrypt from 'bcrypt';

import ApiError from '../utils/ApiError.js';
import { HTTP_STATUS } from '../constants/httpStatus.js';

import {
  findUserByEmail,
  createUser,
} from '../repositories/user.repository.js';

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

export { registerUser };