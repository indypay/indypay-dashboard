import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import { API_CONFIG } from '@/lib/config/api.config';
import { logError } from '@/lib/utils/error-handler';

/**
 * Configured Axios HTTP client instance
 * Uses centralized API configuration
 */
const httpClient = axios.create({
  baseURL: API_CONFIG.baseURL,
  timeout: API_CONFIG.timeout,
  headers: API_CONFIG.headers,
  withCredentials: API_CONFIG.withCredentials,
});

/**
 * Request interceptor
 * Add authentication tokens or modify requests here
 */
httpClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Future: Add authentication token here
    // const authenticatedUser = getAuthenticatedUser();
    // if (authenticatedUser?.token) {
    //   config.headers.Authorization = `Bearer ${authenticatedUser.token}`;
    // }

    return config;
  },
  (error: AxiosError) => {
    logError(error, 'Request Interceptor Error');
    return Promise.reject(error);
  },
);

/**
 * Response interceptor
 * Handle responses and errors globally
 */
httpClient.interceptors.response.use(
  (response) => {
    // Successful response - return as is
    return response;
  },
  (error: AxiosError) => {
    // Log error for debugging
    logError(error, 'Response Interceptor Error');

    // You can handle specific error codes here globally
    // For example, redirect to login on 401
    // if (error.response?.status === 401) {
    //   window.location.href = '/sign-in';
    // }

    return Promise.reject(error);
  },
);

export default httpClient;
