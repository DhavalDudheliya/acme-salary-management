/**
 * Auth Module — Zod Validation Schemas
 *
 * Declarative validation for auth endpoints using Zod.
 * Types are inferred from these schemas in auth.types.ts,
 * keeping validation rules and TypeScript types in sync.
 */

import { z } from "zod";

/**
 * POST /api/auth/register
 *
 * Rules:
 * - email:       valid email format
 * - firstName:   at least 2 characters (after trim)
 * - lastName:    at least 2 characters (after trim)
 * - phone:      required, non-empty
 * - companyName: at least 2 characters (after trim)
 * - password:    at least 8 characters
 */
export const registerSchema = z.object({
  email: z.email("Invalid email format"),
  firstName: z
    .string({ message: "First name is required" })
    .trim()
    .min(2, "First name must be at least 2 characters"),
  lastName: z
    .string({ message: "Last name is required" })
    .trim()
    .min(2, "Last name must be at least 2 characters"),
  phone: z
    .string({ message: "Phone number is required" })
    .min(1, "Phone number is required"),
  companyName: z
    .string({ message: "Company name is required" })
    .trim()
    .min(2, "Company name must be at least 2 characters"),
  password: z
    .string({ message: "Password is required" })
    .min(8, "Password must be at least 8 characters"),
});

/**
 * POST /api/auth/login
 *
 * Rules:
 * - email:    valid email format
 * - password: required
 */
export const loginSchema = z.object({
  email: z.email("Invalid email format"),
  password: z
    .string({ message: "Password is required" })
    .min(1, "Password is required"),
});

/**
 * POST /api/auth/lookup-workspace
 *
 * Rules:
 * - email: valid email format
 */
export const lookupWorkspaceSchema = z.object({
  email: z.email("Invalid email format"),
});

/**
 * POST /api/auth/refresh-token
 *
 * Rules:
 * - refreshToken: required non-empty string
 */
export const refreshTokenSchema = z.object({
  refreshToken: z
    .string({ message: "Refresh token is required" })
    .min(1, "Refresh token is required"),
});

/**
 * POST /api/auth/resend-verification
 *
 * Rules:
 * - email: valid email format
 */
export const resendVerificationSchema = z.object({
  email: z.email("Invalid email format"),
});

/**
 * POST /api/auth/forgot-password
 *
 * Rules:
 * - email: valid email format
 */
export const forgotPasswordSchema = z.object({
  email: z.email("Invalid email format"),
});

/**
 * POST /api/auth/reset-password
 *
 * Rules:
 * - token: required non-empty string
 * - password: at least 8 chars with upper/lower/number/special
 */
export const resetPasswordSchema = z.object({
  token: z
    .string({ message: "Reset token is required" })
    .min(1, "Reset token is required"),
  password: z
    .string({ message: "Password is required" })
    .min(8, "Password must be at least 8 characters")
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/,
      "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character",
    ),
});
