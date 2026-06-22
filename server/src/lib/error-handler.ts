import type { ErrorRequestHandler } from 'express'
import { ZodError } from 'zod'

import { AppError } from './errors.js'

/**
 * Single error boundary for the API. Maps typed `AppError`s and Zod validation
 * failures to clean HTTP responses; everything else is an unexpected 500.
 */
export const errorHandler: ErrorRequestHandler = (error, request, response, _next) => {
  if (error instanceof ZodError) {
    response.status(400).json({
      error: {
        code: 'validation_error',
        message: 'Request validation failed',
        details: error.issues,
      },
    })
    return
  }

  if (error instanceof AppError) {
    response.status(error.statusCode).json({
      error: {
        code: error.code,
        message: error.message,
        ...(error instanceof Object && 'details' in error && error.details !== undefined
          ? { details: error.details }
          : {}),
      },
    })
    return
  }

  request.log?.error(error)
  response.status(500).json({
    error: {
      code: 'internal_error',
      message: 'Internal server error',
    },
  })
}
