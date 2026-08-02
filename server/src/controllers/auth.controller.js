import ApiResponse from '../utils/ApiResponse.js';
import { HTTP_STATUS } from '../constants/httpStatus.js';
import asyncHandler from '../utils/asyncHandler.js';

import { registerUser } from '../services/auth.service.js';

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

export { register };