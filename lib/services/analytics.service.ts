import { resolvePBApi } from '@/lib/utils/common-utils';
import { safeAny } from '@/lib/interfaces/global.interface';
import { API_CONFIG } from '../config/api.config';
import axios from '@/app/api/axios';
import { AnalyticsApiResponse } from '../interfaces/analytics.interface';
import {
  GET_ADMIN_ANALYTICS_SUCCESS,
  GET_ANALYTICS_ADMIN_CONVERSION_RATE,
  GET_ANALYTICS_ADMIN_PAYMENT_FAILURE,
  GET_ANALYTICS_BUSINESS_TRENDS_ADMIN,
  GET_ANALYTICS_BUSINESS_TRENDS_CHANNEL_PARTNER,
  GET_ANALYTICS_BUSINESS_TRENDS_MERCHANT,
  GET_ANALYTICS_MERCHANT_CONVERSION_RATE,
  GET_ANALYTICS_MERCHANT_PAYMENT_FAILURE,
  GET_MERCHANT_ANALYTICS_SUCCESS,
  GET_ANALYTICS_CHANNEL_PARTNER_CONVERSION_RATE,
  GET_ANALYTICS_CHANNEL_PARTNER_PAYMENT_FAILURE,
  GET_ANALYTICS_CHANNEL_PARTNER_PAYMENT_SUCCESS,
} from '../constants/apiConstants/apiConstants';
import { isChannelPartner } from '../utils/utils';

const baseUrl = API_CONFIG.baseURL;

export const adminAnalyticsBusinessTrendsService = async (
  page?: number,
  limit?: number,
  search?: string,
  status?: string,
  startDate?: string,
  endDate?: string,
  role?: string | null,
): Promise<[AnalyticsApiResponse | null, safeAny]> => {
  const [response, error] = await resolvePBApi<AnalyticsApiResponse>(
    () => {
      const params = {
        page,
        limit,
        ...(search && { search }),
        ...(status && { status }),
        ...(startDate && { startDate }),
        ...(endDate && { endDate }),
      };
      if (isChannelPartner(role || '')) {
        return axios.get<AnalyticsApiResponse>(
          `${baseUrl}${GET_ANALYTICS_BUSINESS_TRENDS_CHANNEL_PARTNER}`,
          { params },
        );
      }
      return axios.get<AnalyticsApiResponse>(
        `${baseUrl}${GET_ANALYTICS_BUSINESS_TRENDS_ADMIN}`,
        { params },
      );
    },
    false,
    true,
    false,
  );
  return [response, error];
};

export const merchantAnalyticsBusinessTrendsService = async (
  page?: number,
  limit?: number,
  search?: string,
  status?: string,
  startDate?: string,
  endDate?: string,
): Promise<[AnalyticsApiResponse | null, safeAny]> => {
  const [response, error] = await resolvePBApi<AnalyticsApiResponse>(
    () => {
      const params = {
        page,
        limit,
        ...(search && { search }),
        ...(status && { status }),
        ...(startDate && { startDate }),
        ...(endDate && { endDate }),
      };
      return axios.get<AnalyticsApiResponse>(
        `${baseUrl}${GET_ANALYTICS_BUSINESS_TRENDS_MERCHANT}`,
        { params },
      );
    },
    false,
    true,
    false,
  );
  return [response, error];
};

export const adminAnalyticsConversionRateService = async (
  page?: number,
  limit?: number,
  search?: string,
  status?: string,
  startDate?: string,
  endDate?: string,
  role?: string | null,
): Promise<[AnalyticsApiResponse | null, safeAny]> => {
  const [response, error] = await resolvePBApi<AnalyticsApiResponse>(
    () => {
      const params = {
        page,
        limit,
        ...(search && { search }),
        ...(status && { status }),
        ...(startDate && { startDate }),
        ...(endDate && { endDate }),
      };
      if (isChannelPartner(role || '')) {
        return axios.get<AnalyticsApiResponse>(
          `${baseUrl}${GET_ANALYTICS_CHANNEL_PARTNER_CONVERSION_RATE}`,
          { params },
        );
      }
      return axios.get<AnalyticsApiResponse>(
        `${baseUrl}${GET_ANALYTICS_ADMIN_CONVERSION_RATE}`,
        { params },
      );
    },
    false,
    true,
    false,
  );
  return [response, error];
};

export const merchantAnalyticsConversionRateService = async (
  page?: number,
  limit?: number,
  search?: string,
  status?: string,
  startDate?: string,
  endDate?: string,
): Promise<[AnalyticsApiResponse | null, safeAny]> => {
  const [response, error] = await resolvePBApi<AnalyticsApiResponse>(
    () => {
      const params = {
        page,
        limit,
        ...(search && { search }),
        ...(status && { status }),
        ...(startDate && { startDate }),
        ...(endDate && { endDate }),
      };
      return axios.get<AnalyticsApiResponse>(
        `${baseUrl}${GET_ANALYTICS_MERCHANT_CONVERSION_RATE}`,
        { params },
      );
    },
    false,
    true,
    false,
  );
  return [response, error];
};

export const adminAnalyticsPaymentFailureService = async (
  page?: number,
  limit?: number,
  search?: string,
  status?: string,
  startDate?: string,
  endDate?: string,
  role?: string | null,
): Promise<[AnalyticsApiResponse | null, safeAny]> => {
  const [response, error] = await resolvePBApi<AnalyticsApiResponse>(
    () => {
      const params = {
        page,
        limit,
        ...(search && { search }),
        ...(status && { status }),
        ...(startDate && { startDate }),
        ...(endDate && { endDate }),
      };
      if (isChannelPartner(role || '')) {
        return axios.get<AnalyticsApiResponse>(
          `${baseUrl}${GET_ANALYTICS_CHANNEL_PARTNER_PAYMENT_FAILURE}`,
          { params },
        );
      }
      return axios.get<AnalyticsApiResponse>(
        `${baseUrl}${GET_ANALYTICS_ADMIN_PAYMENT_FAILURE}`,
        { params },
      );
    },
    false,
    true,
    false,
  );
  return [response, error];
};

export const merchantAnalyticsPaymentFailureService = async (
  page?: number,
  limit?: number,
  search?: string,
  status?: string,
  startDate?: string,
  endDate?: string,
): Promise<[AnalyticsApiResponse | null, safeAny]> => {
  const [response, error] = await resolvePBApi<AnalyticsApiResponse>(
    () => {
      const params = {
        page,
        limit,
        ...(search && { search }),
        ...(status && { status }),
        ...(startDate && { startDate }),
        ...(endDate && { endDate }),
      };
      return axios.get<AnalyticsApiResponse>(
        `${baseUrl}${GET_ANALYTICS_MERCHANT_PAYMENT_FAILURE}`,
        { params },
      );
    },
    false,
    true,
    false,
  );
  return [response, error];
};

export const adminAnalyticsPaymentSuccessService = async (
  page?: number,
  limit?: number,
  search?: string,
  status?: string,
  startDate?: string,
  endDate?: string,
  role?: string | null,
): Promise<[AnalyticsApiResponse | null, safeAny]> => {
  const [response, error] = await resolvePBApi<AnalyticsApiResponse>(
    () => {
      const params = {
        page,
        limit,
        ...(search && { search }),
        ...(status && { status }),
        ...(startDate && { startDate }),
        ...(endDate && { endDate }),
      };
      if (isChannelPartner(role || '')) {
        return axios.get<AnalyticsApiResponse>(
          `${baseUrl}${GET_ANALYTICS_CHANNEL_PARTNER_PAYMENT_SUCCESS}`,
          { params },
        );
      }
      return axios.get<AnalyticsApiResponse>(
        `${baseUrl}${GET_ADMIN_ANALYTICS_SUCCESS}`,
        { params },
      );
    },
    false,
    true,
    false,
  );
  return [response, error];
};

export const merchantAnalyticsPaymentSuccessService = async (
  page?: number,
  limit?: number,
  search?: string,
  status?: string,
  startDate?: string,
  endDate?: string,
): Promise<[AnalyticsApiResponse | null, safeAny]> => {
  const [response, error] = await resolvePBApi<AnalyticsApiResponse>(
    () => {
      const params = {
        page,
        limit,
        ...(search && { search }),
        ...(status && { status }),
        ...(startDate && { startDate }),
        ...(endDate && { endDate }),
      };
      return axios.get<AnalyticsApiResponse>(
        `${baseUrl}${GET_MERCHANT_ANALYTICS_SUCCESS}`,
        { params },
      );
    },
    false,
    true,
    false,
  );
  return [response, error];
};
