import axios, { type AxiosResponse } from 'axios';

import { safeAny } from '@/lib/interfaces/global.interface';
import { ApiResponse, ApiError } from '@/lib/types/api.types';
import { NO_DATA_FOUND_MSG } from '@/lib/constants/global-constants';
import { deleteCookie } from './cookies.utils';
import { handleApiError, logError } from './error-handler';
import { API_CONFIG } from '@/lib/config/api.config';
import { emitToast } from './toast-emitter';

/**
 * Resolve PocketBase API calls with consistent error handling
 * @param aPromiseFn - Function that returns an Axios promise
 * @param showSpinner - Whether to show loading spinner (default: true)
 * @param showError - Whether to show error messages (default: true)
 * @param handle401 - Whether to handle 401 errors automatically (default: true)
 * @returns Tuple of [data, error, statusCode]
 */
export const resolvePBApi = async <T = unknown>(
  aPromiseFn: () => Promise<AxiosResponse<T>>,
  showSpinner = true,
  showError = true,
  handle401 = true,
): Promise<ApiResponse<T>> => {
  let apiResponse: AxiosResponse<T> | null = null;
  let errorResponse: ApiError | null = null;

  try {
    if (showSpinner) {
      // TODO: Integrate with global loading state management
      // globalStore.update((val) => ({ ...val, showSpinner: true }));
    }

    const response = await aPromiseFn();
    apiResponse = response;
  } catch (error: unknown) {
    errorResponse = handleApiError(error);

    // Handle 401 Unauthorized - token refresh logic
    if (errorResponse?.statusCode === 401) {
      try {
        await axios.post(
          `${API_CONFIG.baseURL}/api/v1/auth/refresh`,
          {},
          {
            withCredentials: true,
          },
        );
        // Token refreshed successfully — invalidate cached queries instead of full reload
        window.dispatchEvent(new Event('rf:token-refreshed'));
        return [null, null, 200];
      } catch (refreshError) {
        // Refresh token failed, redirect to sign-in
        logError(refreshError, 'Token Refresh Failed');
        deleteCookie('rtk');
        window.location.href = '/sign-in';
        return [null, errorResponse, 401];
      }
    }

    // Log error for debugging
    logError(error, 'API Call Failed');

    if (
      showError &&
      errorResponse.message &&
      errorResponse.message !== NO_DATA_FOUND_MSG &&
      !errorResponse.is_check_box
    ) {
      const errorMessage = Array.isArray(errorResponse.message)
        ? errorResponse.message.join(', ')
        : errorResponse.message;
      emitToast(errorMessage, 'error');
    }
  } finally {
    if (showSpinner) {
      // TODO: Integrate with global loading state management
      // globalStore.update((val) => ({ ...val, showSpinner: false }));
    }
  }

  return [
    apiResponse?.data ?? null,
    errorResponse,
    apiResponse?.status ?? (errorResponse?.statusCode || 500),
  ];
};

export const isIosOrSafariDevice = () =>
  typeof navigator !== 'undefined' &&
  (/iPad|iPhone|iPod|Safari/.test(navigator.userAgent || '') ||
    (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1));

export const isValidAndNonEmptyString = (str: string) =>
  str && typeof str === 'string' && str.length > 0;

export const parseJsonString = <T>(jsonString: string): T | null => {
  let jsonStringToParse = `${jsonString}`;
  if (!isValidAndNonEmptyString(jsonStringToParse)) {
    return null;
  }
  jsonStringToParse = jsonStringToParse.trim();
  try {
    const parsedJson = JSON.parse(jsonStringToParse);
    return parsedJson;
  } catch (e) {
    return null;
  }
};

export const isNonNumericKeyPressed = (e: KeyboardEvent) =>
  (!e.ctrlKey && !e.metaKey && e.key !== 'Backspace' && !/\d/.test(e.key)) ||
  e.key === ' ';

export const rightPadArray = (
  arrayToPad: safeAny[],
  requiredArrayLength: number,
  value: safeAny,
) => {
  if (arrayToPad.length >= requiredArrayLength) {
    return arrayToPad.slice(0, requiredArrayLength);
  }
  const arrayToConcat = Array(requiredArrayLength - arrayToPad.length).fill(
    value,
  );
  return arrayToPad.concat(arrayToConcat);
};

export const getRandomColor = (value: string | undefined) => {
  if (!value) {
    return '#EFEFEF';
  }
  let hash = 0;
  for (let i = 0; i < value.length; i++) {
    hash = value.charCodeAt(i) + ((hash << 5) - hash);
  }

  const color = '#' + (hash & 0x00ffffff).toString(16).toUpperCase();
  return color;
};

export const getNumberOfFiltersApplied = (
  filter: Record<safeAny, safeAny> | null,
) => {
  let numberOfFilters = 0;
  if (!filter) {
    return numberOfFilters;
  }
  Object.keys(filter ?? {}).forEach((aFilterKey) => {
    if (filter?.[aFilterKey]) {
      numberOfFilters += 1;
    }
  });
  return numberOfFilters;
};

export const formatSeconds = (duration: number, showSeconds = true) => {
  const hours = Math.floor(duration / 3600);
  const minutes = Math.floor((duration % 3600) / 60);
  const remainingSeconds = duration % 60;

  let formattedTime = `${hours.toString().padStart(2, '0')}hr ${minutes
    .toString()
    .padStart(2, '0')}m ${remainingSeconds.toString().padStart(2, '0')}s`;

  if (!showSeconds) {
    formattedTime = `${hours.toString().padStart(2, '0')}hr ${minutes
      .toString()
      .padStart(2, '0')}m`;
  }

  return formattedTime;
};

// export const loadScript = (src: string, successCallback: () => void) => {
//   const script: safeAny = document.createElement('script');
//   // script.type = 'text/javascript';
//   // if (script.readyState) {
//   //   // only required for IE <9
//   //   script.onreadystatechange = function () {
//   //     if (script.readyState === 'loaded' || script.readyState === 'complete') {
//   //       script.onreadystatechange = null;
//   //       successCallback();
//   //     }
//   //   };
//   // } else {
//   //   //Others
//   //   script.onload = () => {
//   //     successCallback();
//   //   };
//   // }

//   script.src = src;
//   script.async = true;
//   script.defer = true;
//   // document.getElementsByTagName('head')[0].appendChild(script);
// };

export const convertToTitleCase = (value: string) => {
  return value
    .split('_')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

export const formatPathWithTrailingSlash = (data: string | undefined) => {
  const path = data || '/';
  if (path.endsWith('/')) {
    return path;
  }
  return `${path}/`;
};

export const parsePathSegments = (data: string | undefined) => {
  const path = data || '';
  return path.split('/').filter(Boolean);
};

export const transformStringFromSnakeCase = (val: string) => {
  const abbreviations = ['gst', 'mca', 'tds'];

  for (const abbreviation of abbreviations) {
    if (val.toLowerCase().startsWith(abbreviation)) {
      const restOfTheString = val.substring(abbreviation.length).toLowerCase();
      const transformedString = abbreviation.toUpperCase() + restOfTheString;
      const words = transformedString.split(/[_\s]+/);
      const capitalizedWords = words.map(
        (word) => word.charAt(0).toUpperCase() + word.slice(1),
      );
      return capitalizedWords.join(' ');
    }
  }

  const words = val.split(/[_\s]+/);
  const capitalizedWords = words.map(
    (word) => word.charAt(0).toUpperCase() + word.slice(1),
  );
  return capitalizedWords.join(' ');
};

export const isProduction = () => {
  return process.env.NODE_ENV === 'production';
};
