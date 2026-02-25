/**
 * Auth Module — Input Validation
 *
 * Validates request payloads for the register and login endpoints.
 * Returns structured error arrays so the controller can send
 * all validation errors in a single 400 response.
 */

import { RegisterBody, LoginBody } from "./auth.types.js";

/** Result of a validation check */
interface ValidationResult {
  valid: boolean; // True if all checks passed
  errors: string[]; // Human-readable error messages (empty if valid)
}

/**
 * Validate the registration request body.
 *
 * Checks:
 * - email: required, valid format (basic regex)
 * - firstName: required, min 2 characters
 * - lastName: required, min 2 characters
 * - phone: required
 * - companyName: required, min 2 characters
 * - password: required, min 8 characters
 *
 * @param body - The raw request body
 * @returns ValidationResult with `valid` flag and any error messages
 */
export function validateRegisterInput(body: RegisterBody): ValidationResult {
  const errors: string[] = [];

  // Email validation
  if (!body.email || typeof body.email !== "string") {
    errors.push("Email is required");
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(body.email)) {
    errors.push("Invalid email format");
  }

  // First name validation
  if (!body.firstName || typeof body.firstName !== "string") {
    errors.push("First name is required");
  } else if (body.firstName.trim().length < 2) {
    errors.push("First name must be at least 2 characters");
  }

  // Last name validation
  if (!body.lastName || typeof body.lastName !== "string") {
    errors.push("Last name is required");
  } else if (body.lastName.trim().length < 2) {
    errors.push("Last name must be at least 2 characters");
  }

  // Phone validation
  if (!body.phone || typeof body.phone !== "string") {
    errors.push("Phone number is required");
  }

  // Company name validation
  if (!body.companyName || typeof body.companyName !== "string") {
    errors.push("Company name is required");
  } else if (body.companyName.trim().length < 2) {
    errors.push("Company name must be at least 2 characters");
  }

  // Password validation
  if (!body.password || typeof body.password !== "string") {
    errors.push("Password is required");
  } else if (body.password.length < 8) {
    errors.push("Password must be at least 8 characters");
  }

  return { valid: errors.length === 0, errors };
}

/**
 * Validate the login request body.
 *
 * Checks:
 * - email: required, valid format
 * - password: required
 *
 * @param body - The raw request body
 * @returns ValidationResult with `valid` flag and any error messages
 */
export function validateLoginInput(body: LoginBody): ValidationResult {
  const errors: string[] = [];

  // Email validation
  if (!body.email || typeof body.email !== "string") {
    errors.push("Email is required");
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(body.email)) {
    errors.push("Invalid email format");
  }

  // Password validation
  if (!body.password || typeof body.password !== "string") {
    errors.push("Password is required");
  }

  return { valid: errors.length === 0, errors };
}
