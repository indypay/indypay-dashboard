import { useMutation, useQuery, UseQueryResult } from '@tanstack/react-query';

import {
  GetWhitelistIpsResponse,
  WhitelistIpsRequest,
} from '../interfaces/white-list.interface';
import {
  callAddWhitelistIps,
  callDeleteWhitelistIps,
  callGetWhitelistIps,
} from '../services/transaction-service';
import { safeAny } from '../interfaces/global.interface';

export const getListOfWhitelistIps = (): UseQueryResult<
  [GetWhitelistIpsResponse | null, safeAny],
  Error
> => {
  return useQuery({
    queryKey: ['list-of-whitelist-ips'],
    queryFn: () => callGetWhitelistIps(),
    refetchOnWindowFocus: true, // Refetch when the window is focuse
  });
};

export const useAddWhitelistIps = () => {
  return useMutation({
    mutationFn: (data: WhitelistIpsRequest) => {
      return callAddWhitelistIps(data);
    },
  });
};

export const useDeleteWhitelistIps = () => {
  return useMutation({
    mutationFn: (data: WhitelistIpsRequest) => {
      return callDeleteWhitelistIps(data);
    },
  });
};
