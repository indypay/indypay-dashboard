import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { AnalyticsApiResponse } from '../interfaces/analytics.interface';
import { safeAny } from '../interfaces/global.interface';
import { queryKeys } from '../config/query-client.config';
import {
  adminAnalyticsBusinessTrendsService,
  adminAnalyticsConversionRateService,
  adminAnalyticsPaymentFailureService,
  adminAnalyticsPaymentSuccessService,
  merchantAnalyticsBusinessTrendsService,
  merchantAnalyticsConversionRateService,
  merchantAnalyticsPaymentFailureService,
  merchantAnalyticsPaymentSuccessService,
} from '../services/analytics.service';

/**
 * Hook to fetch admin analytics business trends
 * @param role - User role (passed as parameter instead of using useRole inside)
 * @param startDate - Start date for analytics
 * @param endDate - End date for analytics
 */
export const callAdminAnalyticsBusinessTrends = (
  role: string,
  startDate: string,
  endDate: string,
  enabled = true,
): UseQueryResult<[AnalyticsApiResponse | null, safeAny], Error> => {
  return useQuery({
    queryKey: queryKeys.analytics.businessTrends(role, startDate, endDate),
    queryFn: () =>
      adminAnalyticsBusinessTrendsService(
        undefined, undefined, undefined, undefined,
        startDate, endDate, role,
      ),
    enabled,
  });
};

export const callMerchantAnalyticsBusinessTrends = (
  startDate: string,
  endDate: string,
  enabled = true,
): UseQueryResult<[AnalyticsApiResponse | null, safeAny], Error> => {
  return useQuery({
    queryKey: queryKeys.analytics.businessTrends('merchant', startDate, endDate),
    queryFn: () =>
      merchantAnalyticsBusinessTrendsService(
        undefined, undefined, undefined, undefined,
        startDate, endDate,
      ),
    enabled,
  });
};

export const callAdminAnalyticsConversionRate = (
  role: string,
  startDate: string,
  endDate: string,
  enabled = true,
): UseQueryResult<[AnalyticsApiResponse | null, safeAny], Error> => {
  return useQuery({
    queryKey: queryKeys.analytics.conversionRate(role, startDate, endDate),
    queryFn: () =>
      adminAnalyticsConversionRateService(
        undefined, undefined, undefined, undefined,
        startDate, endDate, role,
      ),
    enabled,
  });
};

export const callMerchantAnalyticsConversionRate = (
  startDate: string,
  endDate: string,
  enabled = true,
): UseQueryResult<[AnalyticsApiResponse | null, safeAny], Error> => {
  return useQuery({
    queryKey: queryKeys.analytics.conversionRate('merchant', startDate, endDate),
    queryFn: () =>
      merchantAnalyticsConversionRateService(
        undefined, undefined, undefined, undefined,
        startDate, endDate,
      ),
    enabled,
  });
};

export const callAdminAnalyticsPaymentFailure = (
  role: string,
  startDate: string,
  endDate: string,
  enabled = true,
): UseQueryResult<[AnalyticsApiResponse | null, safeAny], Error> => {
  return useQuery({
    queryKey: queryKeys.analytics.paymentFailure(role, startDate, endDate),
    queryFn: () =>
      adminAnalyticsPaymentFailureService(
        undefined, undefined, undefined, undefined,
        startDate, endDate, role,
      ),
    enabled,
  });
};

export const callMerchantAnalyticsPaymentFailure = (
  startDate: string,
  endDate: string,
  enabled = true,
): UseQueryResult<[AnalyticsApiResponse | null, safeAny], Error> => {
  return useQuery({
    queryKey: queryKeys.analytics.paymentFailure('merchant', startDate, endDate),
    queryFn: () =>
      merchantAnalyticsPaymentFailureService(
        undefined, undefined, undefined, undefined,
        startDate, endDate,
      ),
    enabled,
  });
};

export const callAdminAnalyticsSuccess = (
  role: string,
  startDate: string,
  endDate: string,
  enabled = true,
): UseQueryResult<[AnalyticsApiResponse | null, safeAny], Error> => {
  return useQuery({
    queryKey: queryKeys.analytics.paymentSuccess(role, startDate, endDate),
    queryFn: () =>
      adminAnalyticsPaymentSuccessService(
        undefined, undefined, undefined, undefined,
        startDate, endDate, role,
      ),
    enabled,
  });
};

export const callMerchantAnalyticsSuccess = (
  startDate: string,
  endDate: string,
  enabled = true,
): UseQueryResult<[AnalyticsApiResponse | null, safeAny], Error> => {
  return useQuery({
    queryKey: queryKeys.analytics.paymentSuccess('merchant', startDate, endDate),
    queryFn: () =>
      merchantAnalyticsPaymentSuccessService(
        undefined, undefined, undefined, undefined,
        startDate, endDate,
      ),
    enabled,
  });
};
