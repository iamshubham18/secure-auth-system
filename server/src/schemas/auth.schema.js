import { z } from 'zod';

// ==========================
// Register Schema
// ==========================
export const registerSchema = z.object({
  firstName: z
    .string()
    .trim()
    .min(2, 'First name must be at least 2 characters long')
    .max(50, 'First name cannot exceed 50 characters'),

  lastName: z
    .string()
    .trim()
    .min(2, 'Last name must be at least 2 characters long')
    .max(50, 'Last name cannot exceed 50 characters'),

  email: z
    .string()
    .trim()
    .email('Invalid email address')
    .transform((email) => email.toLowerCase()),

  password: z
    .string()
    .min(8, 'Password must be at least 8 characters long')
    .max(128)
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number')
    .regex(
      /[^A-Za-z0-9]/,
      'Password must contain at least one special character'
    ),
});

// ==========================
// Login Schema
// ==========================
export const loginSchema = z.object({
  email: z
    .string()
    .trim()
    .email('Invalid email address')
    .transform((email) => email.toLowerCase()),

  password: z
    .string()
    .min(1, 'Password is required'),
});

// ==========================
// Refresh Schema
// ==========================
// Refresh token is now stored in an HttpOnly cookie,
// so the request body does not need to contain anything.
export const refreshSchema = z.object({});

// ==========================
// Refresh Token Schema
// ==========================
// Kept for logout if logout still receives
// the refresh token through the request body.
export const refreshTokenSchema = z.object({
  refreshToken: z
    .string()
    .trim()
    .min(1, 'Refresh token is required'),
});

// ==========================
// Verify Email Schema
// ==========================
export const verifyEmailSchema = z.object({
  token: z
    .string()
    .trim()
    .min(1, 'Verification token is required'),
});

// ==========================
// Forgot Password Schema
// ==========================
export const forgotPasswordSchema = z.object({
  email: z
    .string()
    .trim()
    .email('Invalid email address')
    .transform((email) => email.toLowerCase()),
});

// ==========================
// Reset Password Schema
// ==========================
export const resetPasswordSchema = z.object({
  token: z
    .string()
    .trim()
    .min(1, 'Reset token is required'),

  password: z
    .string()
    .min(8, 'Password must be at least 8 characters long')
    .max(128)
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number')
    .regex(
      /[^A-Za-z0-9]/,
      'Password must contain at least one special character'
    ),
});