import { useMutation, useQuery, UseQueryResult } from '@tanstack/react-query';

import {
  checkChannelPartnerSettlementStatus,
  checkManualPayoutStatus,
  checkSettlementStatus,
  getChannelPartnerSettlementsTransactions,
  getSettlementsTransacions,
  postCallManualPayout,
  postCallSettlement,
} from '../services/manual-payout-service';
import { safeAny } from '../interfaces/global.interface';
import { IManualPayout, ManualPayout } from '../interfaces/payout.interface';

export interface ISettlement {
  // orderId: string;
  amount?: string;
  accountNumber?: string;
  ifscCode?: string;
  beneficiaryName?: string;
  beneficiaryMobile?: string;
  beneficiaryEmail?: string;
  beneficiaryAddress?: string;
  bankName?: string;
  transferMode: string;
  remarks: string;
  userId: string;
  bankId: string;
}

export interface IManualPayoutResponse {
  data: {
    message: string;
    status: string;
  };
}

export const postManualPayout = () => {
  return useMutation({
    mutationKey: ['post-Bulk-payout'],
    mutationFn: (data: ManualPayout) => postCallManualPayout(data),
  });
};

export const postSettlement = () => {
  return useMutation({
    mutationKey: ['post-settlement'],
    mutationFn: (data: ISettlement) => postCallSettlement(data),
  });
};

export const getSettlementsTransactions = ({
  page,
  limit,
  search,
  startDate,
  endDate,
}: {
  page: number;
  limit: number;
  search?: string;
  startDate?: string;
  endDate?: string;
}) => {
  return useQuery({
    queryKey: [
      'get-settlements-transactions',
      page,
      limit,
      search,
      startDate,
      endDate,
    ],
    queryFn: () =>
      getSettlementsTransacions(page, limit, search, startDate, endDate),
  });
};

export const useCheckSettlementStatus = (settlementId: string) => {
  return useQuery({
    queryKey: ['check-settlement-status', settlementId],
    queryFn: () => {
      if (!settlementId) {
        throw new Error('Settlement ID is required');
      }
      return checkSettlementStatus(settlementId);
    },
    enabled: false, // Disable automatic fetching
  });
};

export const useManualPayoutStatus = (orderId: string) => {
  return useQuery({
    queryKey: ['check-manual-payout-status', orderId],
    queryFn: () => {
      if (!orderId) {
        throw new Error('Order ID is required');
      }
      return checkManualPayoutStatus(orderId);
    },
    enabled: false, // Disable automatic fetching
  });
};

export const useChannelPartnerSettlementsTransactions = ({
  page,
  limit,
  search,
  startDate,
  endDate,
}: {
  page: number;
  limit: number;
  search?: string;
  startDate?: string;
  endDate?: string;
}): UseQueryResult<safeAny, Error> => {
  return useQuery({
    queryKey: [
      'get-channel-partner-settlements-transactions',
      page,
      limit,
      search,
      startDate,
      endDate,
    ],
    queryFn: () =>
      getChannelPartnerSettlementsTransactions(
        page,
        limit,
        search,
        startDate,
        endDate,
      ),
  });
};

export const useChannelPartnerCheckSettlementStatus = (
  settlementId: string,
) => {
  return useQuery({
    queryKey: ['check-settlement-status', settlementId],
    queryFn: () => {
      if (!settlementId) {
        throw new Error('Settlement ID is required');
      }
      return checkChannelPartnerSettlementStatus(settlementId);
    },
    enabled: false, // Disable automatic fetching
  });
};
