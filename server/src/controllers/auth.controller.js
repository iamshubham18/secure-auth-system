import ApiResponse from '../utils/ApiResponse.js';
import { HTTP_STATUS } from '../constants/httpStatus.js';
import asyncHandler from '../utils/asyncHandler.js';

import {
  registerUser,
  loginUser,
} from '../services/auth.service.js';

// ==========================
// Register Controller
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
// Login Controller
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

export {
  register,
  login,
};