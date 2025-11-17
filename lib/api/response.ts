import { NextResponse } from 'next/server'
import {
  HttpStatus,
  ErrorCodes,
  type ApiSuccessResponse,
  type ApiErrorResponse,
  type PaginatedResponse,
  type PaginationMetadata
} from './types'

/**
 * Success Response Helper
 */
export function successResponse<T>(
  data: T,
  status: HttpStatus = HttpStatus.OK,
  meta?: Record<string, any>
): NextResponse<ApiSuccessResponse<T>> {
  return NextResponse.json(
    {
      success: true,
      data,
      ...(meta && { meta }),
    },
    { status }
  )
}

/**
 * Paginated Success Response Helper
 */
export function paginatedResponse<T>(
  data: T[],
  pagination: PaginationMetadata,
  status: HttpStatus = HttpStatus.OK
): NextResponse<PaginatedResponse<T>> {
  return NextResponse.json(
    {
      success: true,
      data,
      pagination,
    },
    { status }
  )
}

/**
 * Error Response Helper
 */
export function errorResponse(
  code: ErrorCodes,
  message: string,
  details?: any,
  status?: HttpStatus
): NextResponse<ApiErrorResponse> {
  // Map error codes to HTTP status if not provided
  const statusCode = status || getStatusFromErrorCode(code)

  return NextResponse.json(
    {
      success: false,
      error: {
        code,
        message,
        ...(details && { details }),
        timestamp: new Date().toISOString(),
      },
    },
    { status: statusCode }
  )
}

/**
 * Generic Error Handler
 */
export function handleApiError(error: any): NextResponse<ApiErrorResponse> {
  console.error('API Error:', error)

  // Supabase error
  if (error?.code === 'PGRST116') {
    return errorResponse(
      ErrorCodes.NOT_FOUND,
      'Resource not found',
      undefined,
      HttpStatus.NOT_FOUND
    )
  }

  // Validation error (Zod)
  if (error?.name === 'ZodError') {
    return errorResponse(
      ErrorCodes.VALIDATION_ERROR,
      'Validation failed',
      error.errors,
      HttpStatus.BAD_REQUEST
    )
  }

  // Default error
  return errorResponse(
    ErrorCodes.INTERNAL_ERROR,
    process.env.NODE_ENV === 'development'
      ? error.message
      : 'An unexpected error occurred',
    process.env.NODE_ENV === 'development' ? error.stack : undefined,
    HttpStatus.INTERNAL_SERVER_ERROR
  )
}

/**
 * Map error codes to HTTP status codes
 */
function getStatusFromErrorCode(code: ErrorCodes): HttpStatus {
  const mapping: Record<ErrorCodes, HttpStatus> = {
    [ErrorCodes.DATABASE_ERROR]: HttpStatus.INTERNAL_SERVER_ERROR,
    [ErrorCodes.QUERY_FAILED]: HttpStatus.INTERNAL_SERVER_ERROR,
    [ErrorCodes.VALIDATION_ERROR]: HttpStatus.BAD_REQUEST,
    [ErrorCodes.INVALID_INPUT]: HttpStatus.BAD_REQUEST,
    [ErrorCodes.MISSING_REQUIRED_FIELD]: HttpStatus.BAD_REQUEST,
    [ErrorCodes.UNAUTHORIZED]: HttpStatus.UNAUTHORIZED,
    [ErrorCodes.INVALID_TOKEN]: HttpStatus.UNAUTHORIZED,
    [ErrorCodes.TOKEN_EXPIRED]: HttpStatus.UNAUTHORIZED,
    [ErrorCodes.FORBIDDEN]: HttpStatus.FORBIDDEN,
    [ErrorCodes.INSUFFICIENT_PERMISSIONS]: HttpStatus.FORBIDDEN,
    [ErrorCodes.NOT_FOUND]: HttpStatus.NOT_FOUND,
    [ErrorCodes.ALREADY_EXISTS]: HttpStatus.CONFLICT,
    [ErrorCodes.RATE_LIMIT_EXCEEDED]: HttpStatus.TOO_MANY_REQUESTS,
    [ErrorCodes.PAYMENT_FAILED]: HttpStatus.BAD_REQUEST,
    [ErrorCodes.INSUFFICIENT_TICKETS]: HttpStatus.CONFLICT,
    [ErrorCodes.INTERNAL_ERROR]: HttpStatus.INTERNAL_SERVER_ERROR,
    [ErrorCodes.UNKNOWN_ERROR]: HttpStatus.INTERNAL_SERVER_ERROR,
  }

  return mapping[code] || HttpStatus.INTERNAL_SERVER_ERROR
}

/**
 * Create pagination metadata
 */
export function createPaginationMetadata(
  total: number,
  page: number,
  limit: number
): PaginationMetadata {
  const totalPages = Math.ceil(total / limit)

  return {
    page,
    limit,
    total,
    totalPages,
    hasNext: page < totalPages,
    hasPrev: page > 1,
  }
}
export { ErrorCodes }

