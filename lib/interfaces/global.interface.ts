/**
 * @deprecated Use SafeAny from lib/types/api.types.ts instead
 * Kept for backward compatibility - will be removed in future versions
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type safeAny = any;

/**
 * Base response structure
 */
export interface PTBaseResponse {
  status: number;
}

/**
 * PocketBase response wrapper
 */
export interface PB_RESPONSE {
  data: {
    message: string;
  };
}

/**
 * PocketBase base response
 */
export interface PBBaseResponse {
  data: {
    message: string;
  };
}

/**
 * Merchant basic info response
 */
export interface MerchantBasicInfoResponse {
  message: string;
  statusCode: number;
  error?: string | null;
}

/**
 * Google sign-in response
 */
export interface GoogleSignInResponse {
  message: string;
  statusCode: number;
  error?: string | null;
}

/**
 * Generic data wrapper
 */
export interface DataWrapper<T> {
  data: T;
}

/**
 * Response wrapper combining data and status
 */
export type ResponseWrapper<T> = DataWrapper<T> & PTBaseResponse;

/**
 * Local storage keys enum
 */
export enum LocalStorageKeys {
  META = 'meta',
  ROLE = 'role',
  ONBOARDING_STATUS = 'onboardingStatus',
}

/**
 * QR code generation response
 */
export interface GenerateQRCodeResponse {
  qrCode: string;
  message: string;
  error: string;
}

/**
 * @deprecated Use GenerateQRCodeResponse instead (PascalCase)
 */
export interface generateQRCodeResponse extends GenerateQRCodeResponse {}

/**
 * User login response
 */
export interface UserLogInResponse {
  message: string;
  statusCode: number;
  error?: string | null;
}
