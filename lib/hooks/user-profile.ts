import { useMutation, useQuery, UseQueryResult } from '@tanstack/react-query';

import { safeAny } from '../interfaces/global.interface';
import {
  AddressApiRequest,
  AddressListResponse,
  UsersApiResponse,
} from '../interfaces/users.interface';
import {
  callUpdateAdminAddressUpdateApi,
  callMerchantAddressUpdateApi,
  callAdminGetAddressList,
  callMerchantAddressList,
  callUsersProfileApi,
  callMerchantGetAddressList,
} from '../services/users-service';

export const getUserProfiles = (): UseQueryResult<
  [UsersApiResponse | null, safeAny],
  Error
> => {
  return useQuery({
    queryKey: ['user-profiles'],
    queryFn: () => callUsersProfileApi(),
    refetchOnWindowFocus: true, // Refetch when the window is focused
  });
};

export const updateAdminAddress = () => {
  return useMutation({
    mutationFn: (data: AddressApiRequest) => {
      return callUpdateAdminAddressUpdateApi(data);
    },
  });
};

export const updateMerchantAddress = () => {
  return useMutation({
    mutationFn: (data: AddressApiRequest) => {
      return callMerchantAddressUpdateApi(data);
    },
  });
};

export const getAdminAddressList = (
  userId: string,
): UseQueryResult<[AddressListResponse | null, safeAny], Error> => {
  return useQuery({
    queryKey: ['admin-address-list'],
    queryFn: () => callAdminGetAddressList(userId),
    refetchOnWindowFocus: true, // Refetch when the window is focused
    enabled: userId !== '',
  });
};

export const getMerchantAddressList = (): UseQueryResult<
  [AddressListResponse | null, safeAny],
  Error
> => {
  return useQuery({
    queryKey: ['merchant-address-list'],
    queryFn: () => callMerchantAddressList(),
    refetchOnWindowFocus: true, // Refetch when the window is focused
  });
};

export const getMerchantAddressesList = (): UseQueryResult<
  [AddressListResponse | null, safeAny],
  Error
> => {
  return useQuery({
    queryKey: ['merchant-address-list'],
    queryFn: () => callMerchantGetAddressList(),
    refetchOnWindowFocus: true, // Refetch when the window is focused
  });
};
