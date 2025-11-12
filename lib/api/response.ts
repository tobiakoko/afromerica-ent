import { NextResponse } from 'next/server';
import {
  type ApiSuccessResponse,
  type ApiErrorResponse,
  type PaginationMetadata,
  type ErrorCode,
  ErrorCodes,
  HttpStatus,
} from './types';

/**
 * Create a standardized success response
 */
export function successResponse<T>(
  data: T,
  options?: {
    message?: string;
    metadata?: PaginationMetadata;
    status?: number;
  }
): NextResponse<ApiSuccessResponse<T>> {
  const response: ApiSuccessResponse<T> = {
    success: true,
    data,
    ...(options?.message && { message: options.message }),
    ...(options?.metadata && { metadata: options.metadata }),
  };

  return NextResponse.json(response, {
    status: options?.status || HttpStatus.OK,
  });
}

/**
 * Create a standardized error response
 */
export function errorResponse(
  code: ErrorCode,
  message: string,
  options?: {
    details?: unknown;
    field?: string;
    status?: number;
  }
): NextResponse<ApiErrorResponse> {
  const response: ApiErrorResponse = {
    success: false,
    error: {
      code,
      message,
      ...(options?.details && { details: options.details }),
      ...(options?.field && { field: options.field }),
    },
  };

  return NextResponse.json(response, {
    status: options?.status || getStatusForErrorCode(code),
  });
}

/**
 * Map error codes to HTTP status codes
 */
function getStatusForErrorCode(code: ErrorCode): number {
  const mapping: Record<ErrorCode, number> = {
    [ErrorCodes.UNAUTHORIZED]: HttpStatus.UNAUTHORIZED,
    [ErrorCodes.FORBIDDEN]: HttpStatus.FORBIDDEN,
    [ErrorCodes.TOKEN_EXPIRED]: HttpStatus.UNAUTHORIZED,
    [ErrorCodes.INVALID_TOKEN]: HttpStatus.UNAUTHORIZED,
    [ErrorCodes.VALIDATION_ERROR]: HttpStatus.BAD_REQUEST,
    [ErrorCodes.INVALID_INPUT]: HttpStatus.BAD_REQUEST,
    [ErrorCodes.MISSING_REQUIRED_FIELD]: HttpStatus.BAD_REQUEST,
    [ErrorCodes.NOT_FOUND]: HttpStatus.NOT_FOUND,
    [ErrorCodes.ALREADY_EXISTS]: HttpStatus.CONFLICT,
    [ErrorCodes.CONFLICT]: HttpStatus.CONFLICT,
    [ErrorCodes.INSUFFICIENT_TICKETS]: HttpStatus.UNPROCESSABLE_ENTITY,
    [ErrorCodes.EVENT_FULL]: HttpStatus.UNPROCESSABLE_ENTITY,
    [ErrorCodes.ALREADY_VOTED]: HttpStatus.CONFLICT,
    [ErrorCodes.VOTING_CLOSED]: HttpStatus.UNPROCESSABLE_ENTITY,
    [ErrorCodes.PAYMENT_FAILED]: HttpStatus.UNPROCESSABLE_ENTITY,
    [ErrorCodes.BOOKING_EXPIRED]: HttpStatus.UNPROCESSABLE_ENTITY,
    [ErrorCodes.INTERNAL_ERROR]: HttpStatus.INTERNAL_SERVER_ERROR,
    [ErrorCodes.DATABASE_ERROR]: HttpStatus.INTERNAL_SERVER_ERROR,
    [ErrorCodes.EXTERNAL_SERVICE_ERROR]: HttpStatus.SERVICE_UNAVAILABLE,
    [ErrorCodes.RATE_LIMIT_EXCEEDED]: HttpStatus.TOO_MANY_REQUESTS,
  };

  return mapping[code] || HttpStatus.INTERNAL_SERVER_ERROR;
}

/**
 * Create pagination metadata
 */
export function createPaginationMetadata(
  page: number,
  limit: number,
  total: number
): PaginationMetadata {
  const totalPages = Math.ceil(total / limit);

  return {
    page,
    limit,
    total,
    totalPages,
    hasNext: page < totalPages,
    hasPrev: page > 1,
  };
}

/**
 * Parse pagination parameters from request
 */
export function parsePaginationParams(searchParams: URLSearchParams): {
  page: number;
  limit: number;
  skip: number;
} {
  const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10));
  const limit = Math.min(
    100,
    Math.max(1, parseInt(searchParams.get('limit') || '12', 10))
  );
  const skip = (page - 1) * limit;

  return { page, limit, skip };
}

/**
 * Handle common API errors
 */
export function handleApiError(error: unknown): NextResponse<ApiErrorResponse> {
  console.error('API Error:', error);

  // Validation errors from Zod
  if (error && typeof error === 'object' && 'issues' in error) {
    return errorResponse(
      ErrorCodes.VALIDATION_ERROR,
      'Validation failed',
      {
        details: error,
        status: HttpStatus.BAD_REQUEST,
      }
    );
  }

  // Database errors
  if (error instanceof Error && error.message.includes('violates')) {
    return errorResponse(
      ErrorCodes.DATABASE_ERROR,
      'Database constraint violation',
      {
        details: error.message,
        status: HttpStatus.CONFLICT,
      }
    );
  }

  // Default error
  return errorResponse(
    ErrorCodes.INTERNAL_ERROR,
    'An unexpected error occurred',
    {
      details:
        error instanceof Error ? error.message : 'Unknown error',
      status: HttpStatus.INTERNAL_SERVER_ERROR,
    }
  );
}

/**
 * Wrapper for API route handlers with error handling
 */
export function withErrorHandling<T = unknown>(
  handler: () => Promise<NextResponse<ApiSuccessResponse<T>>>
) {
  return async (): Promise<
    NextResponse<ApiSuccessResponse<T> | ApiErrorResponse>
  > => {
    try {
      return await handler();
    } catch (error) {
      return handleApiError(error);
    }
  };
}