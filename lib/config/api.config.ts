import { env } from './env';

/**
 * Centralized API configuration
 * All API-related constants and configurations should be defined here
 */
export const API_CONFIG = {
  baseURL: env.NEXT_PUBLIC_DEV_PB_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
} as const;

/**
 * API endpoints constants
 * Centralized location for all API endpoints
 */
export const API_ENDPOINTS = {
  // Auth endpoints
  AUTH: {
    LOGIN: '/api/v1/auth/login',
    LOGOUT: '/api/v1/auth/logout',
    REFRESH: '/api/v1/auth/refresh',
    REGISTER: '/api/v1/auth/register',
  },
  // Add other endpoints as needed
} as const;

/**
 * Get full API URL
 */
export const getApiUrl = (endpoint: string): string => {
  return `${API_CONFIG.baseURL}${endpoint}`;
};
