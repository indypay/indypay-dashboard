import { ApiError } from '../types/api.types';

/**
 * Custom application error class
 */
export class AppError extends Error {
  constructor(
    public message: string,
    public code: string = 'UNKNOWN_ERROR',
    public statusCode: number = 500,
    public metadata?: Record<string, unknown>,
  ) {
    super(message);
    this.name = 'AppError';

    // Maintains proper stack trace for where our error was thrown
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, AppError);
    }
  }
}

/**
 * Handle API errors consistently
 */
export const handleApiError = (error: unknown): ApiError => {
  // If it's already our error format, return it
  if (isApiError(error)) {
    return error;
  }

  // If it's an axios error
  if (isAxiosError(error)) {
    return {
      message:
        error.response?.data?.message || error.message || 'An error occurred',
      statusCode: error.response?.status || 500,
      error: error.response?.data?.error || null,
      errors: error.response?.data?.errors,
    };
  }

  // If it's a standard Error
  if (error instanceof Error) {
    return {
      message: error.message,
      statusCode: 500,
      error: error.name,
    };
  }

  // Fallback for unknown error types
  return {
    message: 'An unexpected error occurred',
    statusCode: 500,
    error: 'UNKNOWN_ERROR',
  };
};

/**
 * Type guard for API errors
 */
export const isApiError = (error: unknown): error is ApiError => {
  return (
    typeof error === 'object' &&
    error !== null &&
    'message' in error &&
    typeof (error as ApiError).message === 'string' &&
    typeof (error as ApiError).statusCode === 'number' &&
    typeof (error as ApiError).error === 'string' &&
    typeof (error as ApiError).errors === 'object'
  );
};

/**
 * Type guard for Axios errors
 */
export const isAxiosError = (
  error: unknown,
): error is {
  response?: {
    data?: {
      message?: string;
      error?: string;
      errors?: Record<string, string[]>;
    };
    status?: number;
  };
  message?: string;
} => {
  return typeof error === 'object' && error !== null && 'response' in error;
};

/**
 * Log errors consistently
 */
export const logError = (error: unknown, context?: string): void => {
  const apiError = handleApiError(error);

  if (process.env.NODE_ENV === 'development') {
    console.error(`[Error${context ? ` - ${context}` : ''}]:`, {
      message: apiError.message,
      statusCode: apiError.statusCode,
      error: apiError.error,
      errors: apiError.errors,
    });
  }

  // In production, you might want to send this to a logging service
  // e.g., Sentry, LogRocket, etc.
};

/**
 * Error messages constants
 */
export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Network error. Please check your connection.',
  UNAUTHORIZED: 'You are not authorized to perform this action.',
  SESSION_EXPIRED: 'Your session has expired. Please login again.',
  SERVER_ERROR: 'Server error. Please try again later.',
  VALIDATION_ERROR: 'Please check your input and try again.',
  NOT_FOUND: 'The requested resource was not found.',
  UNKNOWN: 'An unexpected error occurred.',
} as const;

/**
 * Get user-friendly error message
 */
export const getUserFriendlyErrorMessage = (error: ApiError): string => {
  switch (error.statusCode) {
    case 401:
      return ERROR_MESSAGES.UNAUTHORIZED;
    case 404:
      return ERROR_MESSAGES.NOT_FOUND;
    case 422:
      return ERROR_MESSAGES.VALIDATION_ERROR;
    case 500:
    case 502:
    case 503:
      return ERROR_MESSAGES.SERVER_ERROR;
    default:
      return error.message || ERROR_MESSAGES.UNKNOWN;
  }
};
