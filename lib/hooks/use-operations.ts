import { useQuery, UseQueryResult } from '@tanstack/react-query';

import {
  callGetOperationsStats,
  callGetUnsettledCollections,
} from '../services/operations-service';
import { safeAny } from '../interfaces/global.interface';
import {
  ISettlementStatsResponse,
  IUnsettledCollectionsResponse,
} from '../interfaces/settlement.interface';

export const getOperationsStats = (): UseQueryResult<
  [ISettlementStatsResponse | null, safeAny],
  Error
> => {
  return useQuery({
    queryKey: ['operations-stats'],
    queryFn: () => callGetOperationsStats(),
    refetchOnWindowFocus: true, // Refetch when the window is focuse
  });
};

export const getUnsettledCollections = (
  page: number,
  limit: number,
  search: string,
): UseQueryResult<[IUnsettledCollectionsResponse | null, safeAny], Error> => {
  return useQuery({
    queryKey: ['unsettled-collections', page, limit, search],
    queryFn: () => callGetUnsettledCollections(page, limit, search),
    refetchOnWindowFocus: true, // Refetch when the window is focuse
  });
};
