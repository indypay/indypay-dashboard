'use client';
import { useQuery } from '@tanstack/react-query';
import { UseQueryResult } from '@tanstack/react-query';

import { safeAny } from '../interfaces/global.interface';
import {
  callGetAllChannelPartnerMerchantList,
  callGetAllOperationsByMerchant,
} from '../services/operations-service';
import {
  IMerchantListChannelPartnerResponse,
  IMerchantListResponse,
} from '../interfaces/merchant-list.interface';
import { isAdmin, isChannelPartner, isOps, viewOnlyAdmin } from '../utils/utils';
import {
  callGetAllAdminMerchantList,
  callGetUserDetails,
} from '../services/users-service';
import {
  AdminUserListResponse,
  UsersApiResponse,
} from '../interfaces/users.interface';
import { useRole } from '../components/Role/RoleContext';
export const getMerchantList = (): UseQueryResult<
  [IMerchantListResponse | null, safeAny],
  Error
> => {
  const { role } = useRole();
  console.log('🔍 getMerchantList Hook - Role:', role);
  console.log('🔍 isAdmin:', isAdmin(role as string));
  console.log('🔍 isOps:', isOps(role as string));
  console.log(
    '🔍 Query Enabled:',
    isAdmin(role as string) || isOps(role as string),
  );

  return useQuery({
    queryKey: ['merchant-list'],
    queryFn: () => callGetAllOperationsByMerchant(),
    refetchOnWindowFocus: true, // Refetch when the window is focuse
    enabled:
      isAdmin(role as string) ||
      isOps(role as string) ||
      viewOnlyAdmin(role as string),
  });
};

export const getChannelPartnerMerchantList = ({
  search,
  page,
  limit,
}: {
  search: string;
  page: number;
  limit: number;
}): UseQueryResult<
  [IMerchantListChannelPartnerResponse | null, safeAny],
  Error
> => {
  const { role } = useRole();
  return useQuery({
    queryKey: ['channel-partner-merchant-list'],
    queryFn: () => callGetAllChannelPartnerMerchantList(search, page, limit),
    refetchOnWindowFocus: true, // Refetch when the window is focuse
    enabled: isChannelPartner(role as string),
  });
};

export const getAdminUserList = ({
  search,
  page,
  limit,
  role,
}: {
  search: string;
  page: number;
  limit: number;
  role: string;
}): UseQueryResult<[AdminUserListResponse | null, safeAny], Error> => {
  return useQuery({
    queryKey: ['admin-user-list'],
    queryFn: () => callGetAllAdminMerchantList(search, page, limit, role),
    refetchOnWindowFocus: true, // Refetch when the window is focuse
    enabled: isAdmin(role as string),
  });
};

export const getUserDetails = ({
  userId,
}: {
  userId: string;
}): UseQueryResult<[UsersApiResponse | null, safeAny], Error> => {
  return useQuery({
    queryKey: ['user-details'],
    queryFn: () => callGetUserDetails(userId),
  });
};
