'use client';
import { parseJsonString } from './common-utils';

export enum LocalStorageKeys {
  AUTHENTICATED_USER = 'pb_user',
  META = 'meta',
  QR_CODE = 'qrCode',
  ROLE = 'role',
  ONBOARDING_STATUS = 'onboardingStatus',
}
export const persistToLocalStorage = <T>(key: LocalStorageKeys, data: T) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem(key, JSON.stringify(data));
  }
};

export const getFromLocalStorage = <T>(key: LocalStorageKeys) => {
  if (typeof window !== 'undefined') {
    const dataFromStorage = localStorage.getItem(key);
    if (!dataFromStorage) {
      return null;
    }
    return parseJsonString<T>(dataFromStorage);
  }
};

export const removeFromLocalStorage = (key: LocalStorageKeys) => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(key);
  }
};
