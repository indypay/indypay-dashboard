import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { safeAny } from '../interfaces/global.interface';

import {
  callAdminPayoutStats,
  callMerchantPayoutById,
  callMerchantPayoutDetailsById,
  callAllMerchantPayout,
  callMerchantPayoutByPayoutId,
  callPayoutStatusApi,
} from '../services/payout-service';
import {
  PayoutApiResponse,
  MerchantPayoutDetailsTransRes,
  MerchantPayoutRes,
  PayoutStatusRes,
} from '../interfaces/payout.interface';
import { useRole } from '../components/Role/RoleContext';

//  Payout Api's hooks for admin
export const getAdminPayoutData = ({
  page,
  limit,
  search,
  startDate,
  endDate,
}: {
  page: number;
  limit: number;
  search: string;
  startDate: string;
  endDate: string;
}): UseQueryResult<[PayoutApiResponse | null, safeAny], Error> => {
  const { role } = useRole();
  return useQuery({
    queryKey: [
      'admin-payout-data',
      page,
      limit,
      search,
      startDate,
      endDate,
      role,
    ],
    queryFn: () =>
      callAdminPayoutStats(page, limit, search, startDate, endDate, role),
    refetchOnWindowFocus: true, // Refetch when the window is focused
  });
};

export const getAdminPayoutByUserId = ({
  userId,
  page,
  limit,
  search,
  startDate,
  endDate,
}: {
  userId: string | null;
  page: number;
  limit: number;
  search: string;

  startDate: string;
  endDate: string;
}): UseQueryResult<[MerchantPayoutDetailsTransRes | null, safeAny], Error> => {
  const { role } = useRole();
  return useQuery({
    queryKey: [
      'admin-payout-by-user-id',
      userId,
      page,
      limit,
      search,
      startDate,
      endDate,
      role,
    ],
    queryFn: () =>
      callMerchantPayoutById(
        userId,
        page,
        limit,
        search,
        status,
        startDate,
        endDate,
        role,
      ),
    enabled: !!userId,
    refetchOnWindowFocus: true,
  });
};

export const getAdminPayoutDetailsByPayoutId = (
  payoutId: string,
): UseQueryResult<[MerchantPayoutRes | null, safeAny], Error> => {
  return useQuery({
    queryKey: ['admin-payout-details-by-pay-in-id', payoutId],
    queryFn: () => callMerchantPayoutDetailsById(payoutId),
    enabled: !!payoutId,
    refetchOnWindowFocus: true,
  });
};

// payout Api's hooks for merchant

export const getMerchantPayoutData = ({
  page,
  limit,
  search,
  startDate,
  endDate,
}: {
  page: number;
  limit: number;
  search: string;
  startDate: string;
  endDate: string;
}): UseQueryResult<[PayoutApiResponse | null, safeAny], Error> => {
  return useQuery({
    queryKey: ['merchant-payout-data', page, limit, search, startDate, endDate],
    queryFn: () =>
      callAllMerchantPayout(page, limit, search, startDate, endDate),
    refetchOnWindowFocus: true, // Refetch when the window is focused
  });
};

export const getMerchantPayoutByPayoutId = (
  payoutId: string,
): UseQueryResult<[MerchantPayoutRes | null, safeAny], Error> => {
  return useQuery({
    queryKey: ['merchant-payout', payoutId],
    queryFn: () => callMerchantPayoutByPayoutId(payoutId),
    enabled: !!payoutId,
    staleTime: 0,
    gcTime: 0,
    refetchOnMount: 'always',
    refetchOnWindowFocus: true,
  });
};

export const checkPayoutStatus = (
  orderId: string,
): UseQueryResult<[PayoutStatusRes | null, safeAny], Error> => {
  return useQuery({
    queryKey: ['payout-status', orderId],
    queryFn: () => {
      if (!orderId) throw new Error('Order ID is required');
      return callPayoutStatusApi(orderId);
    },
    enabled: false, // Don't auto-fetch, we'll trigger manually
    staleTime: 0,
    gcTime: 0,
    retry: 1,
  });
};
