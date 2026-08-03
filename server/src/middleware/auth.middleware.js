import jwt from 'jsonwebtoken';

import ApiError from '../utils/ApiError.js';
import { HTTP_STATUS } from '../constants/httpStatus.js';

const authenticate = (req, res, next) => {
  const authHeader = req.headers.authorization;

  // Check if Authorization header exists
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return next(
      new ApiError(
        HTTP_STATUS.UNAUTHORIZED,
        'Access token is missing'
      )
    );
  }

  // Extract token
  const token = authHeader.split(' ')[1];

  try {
    // Verify token
    const decoded = jwt.verify(
      token,
      process.env.JWT_ACCESS_SECRET
    );

    // Attach user info to request
    req.user = decoded;

    next();
  // eslint-disable-next-line no-unused-vars
  } catch (error) {
    return next(
      new ApiError(
        HTTP_STATUS.UNAUTHORIZED,
        'Invalid or expired access token'
      )
    );
  }
};

export default authenticate;