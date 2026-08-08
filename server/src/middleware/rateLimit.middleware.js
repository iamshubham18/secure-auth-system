import rateLimit from 'express-rate-limit';

const authRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes

  limit: 10, // Maximum 10 requests per IP

  standardHeaders: 'draft-7',
  legacyHeaders: false,

  message: {
    success: false,
    statusCode: 429,
    message: 'Too many authentication requests. Please try again later.',
  },
});

export default authRateLimiter;