import { DashboardApiResponse } from '../interfaces/dashboard.interface';

import { resolvePBApi } from '@/lib/utils/common-utils';
import { safeAny } from '@/lib/interfaces/global.interface';
import axios from '@/app/api/axios';
import {
  GET_STATS_ADMIN,
  GET_STATS_MERCHANT,
  GET_STATS_CHANNEL_PARTNER,
} from '@/lib/constants/apiConstants/apiConstants';

const baseUrl = process.env.NEXT_PUBLIC_DEV_PB_BASE_URL;
export const callMerchantDashboardData = async (
  startDate: string,
  endDate: string,
): Promise<[DashboardApiResponse[] | null, safeAny]> => {
  const [response, error] = await resolvePBApi<DashboardApiResponse[]>(
    () =>
      axios.get<DashboardApiResponse[]>(`${baseUrl}/${GET_STATS_MERCHANT}`, {
        params: {
          startDate,
          endDate,
        },
      }),
    false,
    true,
    false,
  );
  return [response, error];
};

export const callAdminDashboardData = async (
  startDate: string,
  endDate: string,
): Promise<[DashboardApiResponse[] | null, safeAny]> => {
  const [response, error] = await resolvePBApi<DashboardApiResponse[]>(
    () =>
      axios.get<DashboardApiResponse[]>(`${baseUrl}/${GET_STATS_ADMIN}`, {
        params: {
          startDate,
          endDate,
        },
      }),
    false,
    true,
    false,
  );
  return [response, error];
};

export const callChannelPartnerDashboardData = async (
  startDate: string,
  endDate: string,
): Promise<[DashboardApiResponse[] | null, safeAny]> => {
  const [response, error] = await resolvePBApi<DashboardApiResponse[]>(
    () =>
      axios.get<DashboardApiResponse[]>(
        `${baseUrl}/${GET_STATS_CHANNEL_PARTNER}`,
        {
          params: {
            startDate,
            endDate,
          },
        },
      ),
    false,
    true,
    false,
  );
  return [response, error];
};
