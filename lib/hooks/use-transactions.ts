import { useQuery, UseQueryResult } from '@tanstack/react-query';

import { safeAny } from '../interfaces/global.interface';
import {
  callAdminTransactionApi,
  callMerchantTransactionApi,
  callTransactionAdminDetailsApi,
  callTransactionMerchantDetailsApi,
} from '../services/transaction-service';
import { TransactionDetailsApiResponse } from '../interfaces/transaction-details.interface';
import { TransactionApiResponse } from '../interfaces/transactions.interface';

export const getMerchantTransactionsData = (): UseQueryResult<
  [TransactionApiResponse[] | null, safeAny],
  Error
> => {
  return useQuery({
    queryKey: ['merchant-transactions-data'],
    queryFn: () => callMerchantTransactionApi(),
    refetchOnWindowFocus: true, // Refetch when the window is focused
    staleTime: 1000 * 60 * 5,
  });
};

export const getAdminTransactionsData = (): UseQueryResult<
  [TransactionApiResponse[] | null, safeAny],
  Error
> => {
  return useQuery({
    queryKey: ['admin-transactions-data'],
    queryFn: () => callAdminTransactionApi(),
    refetchOnWindowFocus: true, // Refetch when the window is focused
    staleTime: 1000 * 60 * 5,
  });
};

export const getMerchantTransactionDetails = (
  id: string,
): UseQueryResult<[TransactionDetailsApiResponse[] | null, safeAny], Error> => {
  return useQuery({
    queryKey: ['transaction-details', 'merchant', id],
    queryFn: () => callTransactionMerchantDetailsApi(id),
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60 * 5,
  });
};

export const getAdminTransactionDetails = (
  id: string,
): UseQueryResult<[TransactionDetailsApiResponse[] | null, safeAny], Error> => {
  return useQuery({
    queryKey: ['transaction-details', 'admin', id],
    queryFn: () => callTransactionAdminDetailsApi(id),
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60 * 5,
  });
};
