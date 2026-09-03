import { useQuery, UseQueryResult } from '@tanstack/react-query';

import { safeAny } from '../interfaces/global.interface';
import {
  callAdminCollectionsStats,
  callAllMerchantCollections,
  callChannelPartnerCollections,
  callChannelPartnerTransactionsById,
  callChannelPartnerTransactionsDetailsById,
  callMerchantCollectionsById,
  callMerchantCollectionsDetailsById,
  callMerchantTransactionsById,
} from '../services/collections-service';
import {
  CollectionDetailsTransRes,
  CollectionsApiResponse,
  MerchantDetailsRes,
} from '../interfaces/transactions.interface';
import { useRole } from '../components/Role/RoleContext';
import { isChannelPartner, isMerchant } from '../utils/utils';

export const getAdminCollectionData = ({
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
}): UseQueryResult<[CollectionsApiResponse | null, safeAny], Error> => {
  return useQuery({
    queryKey: ['admin-collection-data', page, limit, search, startDate, endDate],
    queryFn: () =>
      callAdminCollectionsStats(page, limit, search, '', startDate, endDate),
    refetchOnWindowFocus: false,
    staleTime: 30_000,
  });
};

export const getAdmincollectionByUserId = (
  userId: string | null,
  page: number,
  limit: number,
  search: string,
  status: string | null,
  startDate: string,
  endDate: string,
  enabled: boolean,
): UseQueryResult<[CollectionDetailsTransRes | null, safeAny], Error> => {
  const { role } = useRole();

  // Both queries always called to satisfy rules-of-hooks; enabled flag gates execution
  const cpQuery = useQuery({
    queryKey: ['channel-partner-collection-by-user-id', userId, page, limit, search, startDate, endDate],
    queryFn: () =>
      callChannelPartnerTransactionsById(
        userId, page, limit, search, '', startDate, endDate,
      ),
    enabled: enabled && isChannelPartner(role),
    staleTime: 30_000,
  });

  const adminQuery = useQuery({
    queryKey: ['admin-collection-by-user-id', userId, page, limit, search, startDate, endDate],
    queryFn: () =>
      callMerchantCollectionsById(
        userId, page, limit, search, '', startDate, endDate,
      ),
    enabled: enabled && !isChannelPartner(role),
    refetchOnWindowFocus: false,
    staleTime: 30_000,
  });

  return isChannelPartner(role) ? cpQuery : adminQuery;
};

export const getAdminCollectionDetailsByPayInId = (
  payInId: string,
): UseQueryResult<[MerchantDetailsRes | null, safeAny], Error> => {
  const { role } = useRole();

  // Both queries always called to satisfy rules-of-hooks; enabled flag gates execution
  const cpQuery = useQuery({
    queryKey: ['channel-partner-collection-details-by-pay-in-id', payInId],
    queryFn: () => callChannelPartnerTransactionsDetailsById(payInId),
    enabled: isChannelPartner(role),
  });

  const adminQuery = useQuery({
    queryKey: ['admin-collection-details-by-pay-in-id', payInId],
    queryFn: () => callMerchantCollectionsDetailsById(payInId),
    enabled: !isChannelPartner(role),
    refetchOnWindowFocus: false,
    staleTime: 30_000,
  });

  return isChannelPartner(role) ? cpQuery : adminQuery;
};

export const getMerchantCollectionData = ({
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
}): UseQueryResult<[CollectionsApiResponse | null, safeAny], Error> => {
  const { role } = useRole();
  return useQuery({
    queryKey: ['merchant-collection-data', page, limit, search, startDate, endDate],
    queryFn: () =>
      callAllMerchantCollections(page, limit, search, startDate, endDate),
    enabled: isMerchant(role),
    refetchOnWindowFocus: false,
    staleTime: 30_000,
  });
};

export const getMerchantCollectionByUserId = (
  userId: string,
): UseQueryResult<[CollectionsApiResponse | null, safeAny], Error> => {
  return useQuery({
    queryKey: ['merchant-collection-by-user-id', userId],
    queryFn: () => callMerchantTransactionsById(userId),
    refetchOnWindowFocus: false,
    staleTime: 30_000,
  });
};

export const getChannelPartnerCollectionData = ({
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
}): UseQueryResult<[CollectionsApiResponse[] | null, safeAny], Error> => {
  return useQuery({
    queryKey: ['channel-partner-collection-data', page, limit, search, startDate, endDate],
    queryFn: () =>
      callChannelPartnerCollections(page, limit, search, startDate, endDate),
    refetchOnWindowFocus: false,
    staleTime: 30_000,
  });
};

export const getChannelPartnerCollectionByUserId = (
  userId: string | null,
  page: number,
  limit: number,
  search: string,
  status: string | null,
  startDate: string,
  endDate: string,
): UseQueryResult<[CollectionDetailsTransRes | null, safeAny], Error> => {
  return useQuery({
    queryKey: ['channel-partner-collection-by-user-id', userId, page, limit, search, startDate, endDate],
    queryFn: () =>
      callChannelPartnerTransactionsById(
        userId, page, limit, search, '', startDate, endDate,
      ),
    refetchOnWindowFocus: false,
    staleTime: 30_000,
  });
};
