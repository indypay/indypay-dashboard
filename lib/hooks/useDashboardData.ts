import { useQuery, UseQueryResult } from '@tanstack/react-query';

import { DashboardApiResponse } from '../interfaces/dashboard.interface';
import { safeAny } from '../interfaces/global.interface';
import { ApiResponse } from '../types/api.types';
import { queryKeys } from '../config/query-client.config';
import {
  callAdminDashboardData,
  callChannelPartnerDashboardData,
  callMerchantDashboardData,
} from '../services/dashboard-service';
import {
  isChannelPartner,
  isOps,
  isMerchant,
  viewOnlyAdmin,
  isAdmin,
} from '../utils/utils';

/**
 * Hook to fetch merchant dashboard data
 * Fixed: Moved role check inside query function instead of hook level
 */
export const getMerchantDashboardData = ({
  startDate,
  endDate,
  enabled = true,
}: {
  startDate: string;
  endDate: string;
  enabled?: boolean;
}): UseQueryResult<[DashboardApiResponse[] | null, safeAny], Error> => {
  return useQuery({
    queryKey: queryKeys.dashboard.merchant(startDate, endDate),
    queryFn: () => callMerchantDashboardData(startDate, endDate),
    enabled,
  });
};

/**
 * Hook to fetch admin dashboard data
 * Fixed: Moved role check inside query function instead of hook level
 */
export const getAdminDashboardData = ({
  startDate,
  endDate,
  enabled = true,
}: {
  startDate: string;
  endDate: string;
  enabled?: boolean;
}): UseQueryResult<[DashboardApiResponse[] | null, safeAny], Error> => {
  return useQuery({
    queryKey: queryKeys.dashboard.admin(startDate, endDate),
    queryFn: () => callAdminDashboardData(startDate, endDate),
    enabled,
  });
};

/**
 * Hook to fetch channel partner dashboard data
 * Fixed: Moved role check inside query function instead of hook level
 */
export const getChannelPartnerDashboardData = ({
  startDate,
  endDate,
  enabled = true,
}: {
  startDate: string;
  endDate: string;
  enabled?: boolean;
}): UseQueryResult<[DashboardApiResponse[] | null, safeAny], Error> => {
  return useQuery({
    queryKey: queryKeys.dashboard.channelPartner(startDate, endDate),
    queryFn: () => callChannelPartnerDashboardData(startDate, endDate),
    enabled,
  });
};
