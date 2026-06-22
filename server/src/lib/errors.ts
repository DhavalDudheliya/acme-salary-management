/**
 * Typed application errors. Services throw these; the error-handling middleware
 * (see `error-handler.ts`) maps them to an HTTP status + JSON body. No service
 * or controller should call `res.status(...)` for an error directly.
 */

export abstract class AppError extends Error {
  abstract readonly statusCode: number
  /** Stable machine-readable code for clients (e.g. 'not_found'). */
  abstract readonly code: string

  constructor(message: string) {
    super(message)
    this.name = new.target.name
  }
}

export class NotFoundError extends AppError {
  readonly statusCode = 404
  readonly code = 'not_found'
}

/** Request was understood but failed a business rule or validation. */
export class ValidationError extends AppError {
  readonly statusCode = 400
  readonly code = 'validation_error'
  readonly details?: unknown

  constructor(message: string, details?: unknown) {
    super(message)
    this.details = details
  }
}

/** Request conflicts with current state (e.g. duplicate email). */
export class ConflictError extends AppError {
  readonly statusCode = 409
  readonly code = 'conflict'
}
