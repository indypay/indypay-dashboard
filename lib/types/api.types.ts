/**
 * Centralized API types to replace 'safeAny' usage
 * This provides type safety across the application
 */

/**
 * Generic API error structure
 */
export interface ApiError {
  message: string;
  statusCode?: number;
  error?: string | null;
  errors?: Record<string, string[]>;
  is_check_box?: boolean;
}

/**
 * Generic API response wrapper
 * First element: data or null
 * Second element: error or null
 * Third element: HTTP status code
 */
export type ApiResponse<T> = [T | null, ApiError | null, number];

/**
 * Base response structure from backend
 */
export interface BaseApiResponse {
  status: number;
}

/**
 * Data wrapper for responses
 */
export interface DataWrapper<T> {
  data: T;
}

/**
 * Response wrapper combining data and status
 */
export type ResponseWrapper<T> = DataWrapper<T> & BaseApiResponse;

/**
 * Generic paginated response
 */
export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
}

/**
 * Generic success response
 */
export interface SuccessResponse {
  message: string;
  statusCode: number;
  data?: unknown;
}

/**
 * For cases where we truly need any type (use sparingly)
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type SafeAny = any;
