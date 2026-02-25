/**
 * Auth Module — Type Definitions
 *
 * TypeScript interfaces for the authentication module's request and response shapes.
 * These are used by the controller, service, and validation layers for type safety.
 */

import { Request } from "express";

/**
 * Request body for POST /api/auth/register.
 * Contains all fields collected during the multi-step registration flow.
 */
export interface RegisterBody {
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  companyName: string; // Used to generate the workspace slug for tenant routing
  password: string;
}

/**
 * Request body for POST /api/auth/login.
 */
export interface LoginBody {
  email: string;
  password: string;
}

/**
 * Request body for POST /api/auth/refresh-token.
 */
export interface RefreshTokenBody {
  refreshToken: string;
}

/**
 * Extended Express Request with authenticated user data.
 * Populated by the authMiddleware after verifying the JWT access token.
 * Available in any route handler protected by authMiddleware.
 */
export interface AuthenticatedRequest extends Request {
  user?: {
    userId: string; // UUID of the authenticated user
    email: string; // User's email address
    domainId: string; // UUID of the user's tenant workspace
    role: string; // "ADMIN" or "AGENT"
  };
}
