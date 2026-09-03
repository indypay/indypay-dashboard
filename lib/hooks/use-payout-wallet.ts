import { useQuery, useMutation, UseQueryResult } from '@tanstack/react-query';
import { PBBaseResponse, safeAny } from '../interfaces/global.interface';
import {
  callMerchantWalletDetails,
  callMerchantWalletDetailsById,
  callPayoutWalletList,
  callRefundWallet,
  callTopupWallet,
} from '../services/payout-wallet.service';
import {
  PayoutWalletList,
  TopUpRequest,
  WalletDetailsData,
} from '../interfaces/payout-wallet.interface';
import { useRole } from '../components/Role/RoleContext';
//  Payout Api's hooks for admin
export const getAllWalletList = ({
  page,
  limit,
  search,
  startDate,
  endDate,
  role,
}: {
  page: number;
  limit: number;
  search: string;
  startDate: string;
  endDate: string;
  role: string;
}): UseQueryResult<[PayoutWalletList | null, safeAny], Error> => {
  return useQuery({
    queryKey: [
      'admin-wallet-list',
      page,
      limit,
      search,
      startDate,
      endDate,
      role,
    ],
    queryFn: () =>
      callPayoutWalletList(page, limit, search, startDate, endDate, role),
    refetchOnWindowFocus: true, // Refetch when the window is focused
  });
};

export const getWalletDetailsById = (
  userId: string | null,
  page: number,
  limit: number,
  search: string,
  startDate: string,
  endDate: string,
): UseQueryResult<[WalletDetailsData | null, safeAny], Error> => {
  const { role } = useRole();
  return useQuery({
    queryKey: [
      'admin-wallet-details',
      userId,
      page,
      limit,
      search,
      startDate,
      endDate,
      role,
    ],
    queryFn: () =>
      callMerchantWalletDetailsById(
        userId,
        page,
        limit,
        search,
        startDate,
        endDate,
        role,
      ),
    enabled: !!userId, // Only run query if userId exists
    refetchOnWindowFocus: true, // Refetch when the window is focused
  });
};

export const getMerchantWalletDetails = (
  page?: number,
  limit?: number,
  search?: string,
  startDate?: string,
  endDate?: string,
): UseQueryResult<[WalletDetailsData | null, safeAny], Error> => {
  return useQuery({
    queryKey: [
      'merchant-wallet-details',
      page,
      limit,
      search,
      startDate,
      endDate,
    ],
    queryFn: () =>
      callMerchantWalletDetails(page, limit, search, startDate, endDate),
    refetchOnWindowFocus: true, // Refetch when the window is focused
  });
};

export const topupWallet = () => {
  return useMutation({
    mutationFn: (data: TopUpRequest) => callTopupWallet(data),
  });
};

export const refundWallet = () => {
  return useMutation({
    mutationFn: (data: TopUpRequest) => callRefundWallet(data),
  });
};
