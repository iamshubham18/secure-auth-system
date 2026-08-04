import prisma from '../config/prisma.js';

import ApiResponse from '../utils/ApiResponse.js';
import { HTTP_STATUS } from '../constants/httpStatus.js';
import asyncHandler from '../utils/asyncHandler.js';

const healthCheck = asyncHandler(async (req, res) => {
  // Check database connection
  await prisma.$queryRaw`SELECT 1`;

  return res.status(HTTP_STATUS.OK).json(
    new ApiResponse(
      HTTP_STATUS.OK,
      'Server is healthy',
      {
        status: 'UP',
        database: 'CONNECTED',
        environment: process.env.NODE_ENV,
        uptime: process.uptime(),
        timestamp: new Date().toISOString(),
      }
    )
  );
});

export { healthCheck };