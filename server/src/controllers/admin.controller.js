import ApiResponse from '../utils/ApiResponse.js';
import { HTTP_STATUS } from '../constants/httpStatus.js';
import asyncHandler from '../utils/asyncHandler.js';

const getAdminDashboard = asyncHandler(async (req, res) => {
  return res.status(HTTP_STATUS.OK).json(
    new ApiResponse(
      HTTP_STATUS.OK,
      'Admin dashboard accessed successfully',
      {
        message: 'Welcome Admin',
        user: req.user,
      }
    )
  );
});

export {
  getAdminDashboard,
};