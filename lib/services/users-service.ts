import {
  AddressApiRequest,
  AddressApiResponse,
  AddressListResponse,
  AdminUserListResponse,
  editCountRequest,
  editCountResponse,
  getCountResponse,
  KYCDetails,
  UsersApiResponse,
} from '../interfaces/users.interface';

import { resolvePBApi } from '@/lib/utils/common-utils';
import { safeAny } from '@/lib/interfaces/global.interface';
import axios from '@/app/api/axios';
import {
  GET_ADDRESS_LIST,
  UPDATE_ADDRESS_ADMIN,
  UPDATE_ADDRESS_MERCHANT,
  USERS_PROFILE,
  GET_MERCHANT_LIST_ADMIN,
  GET_KYC_DETAILS,
  GET_KYC_PENDING,
  CHANGE_KYC_STATUS,
  EDIT_COUNT,
} from '@/lib/constants/apiConstants/apiConstants';
import { IMerchantList } from '../interfaces/merchant-list.interface';
import { ONBOARDING_STATUS } from '../enum';

const baseUrl = process.env.NEXT_PUBLIC_DEV_PB_BASE_URL;

export const callUsersProfileApi = async (): Promise<
  [UsersApiResponse | null, safeAny]
> => {
  const [response, error] = await resolvePBApi<UsersApiResponse>(
    () => axios.get<UsersApiResponse>(`${baseUrl}/${USERS_PROFILE}`),
    false,
    true,
    false,
  );
  return [response, error];
};

export const callUpdateAdminAddressUpdateApi = async (
  data: AddressApiRequest,
): Promise<[AddressApiResponse | null, safeAny]> => {
  const [response, error] = await resolvePBApi<AddressApiResponse>(
    () =>
      axios.post<AddressApiResponse>(
        `${baseUrl}/${UPDATE_ADDRESS_ADMIN}`,
        data,
      ),
    false,
    true,
    false,
  );
  return [response, error];
};

export const callAdminGetAddressList = async (
  userId: string,
): Promise<[AddressListResponse | null, safeAny]> => {
  const [response, error] = await resolvePBApi<AddressListResponse>(
    () =>
      axios.get<AddressListResponse>(
        `${baseUrl}/${GET_ADDRESS_LIST}/${userId}`,
      ),
    false,
    true,
    false,
  );
  return [response, error];
};

export const callMerchantGetAddressList = async (): Promise<
  [AddressListResponse | null, safeAny]
> => {
  const [response, error] = await resolvePBApi<AddressListResponse>(
    () => axios.get<AddressListResponse>(`${baseUrl}/${GET_ADDRESS_LIST}`),
    false,
    true,
    false,
  );
  return [response, error];
};

export const callMerchantAddressUpdateApi = async (
  data: AddressApiRequest,
): Promise<[AddressApiResponse | null, safeAny]> => {
  const [response, error] = await resolvePBApi<AddressApiResponse>(
    () =>
      axios.post<AddressApiResponse>(
        `${baseUrl}/${UPDATE_ADDRESS_MERCHANT}`,
        data,
      ),
    false,
    true,
    false,
  );
  return [response, error];
};

export const callMerchantAddressList = async (): Promise<
  [AddressListResponse | null, safeAny]
> => {
  const [response, error] = await resolvePBApi<AddressListResponse>(
    () =>
      axios.get<AddressListResponse>(`${baseUrl}/${UPDATE_ADDRESS_MERCHANT}`),
    false,
    true,
    false,
  );
  return [response, error];
};

export const callGetAllAdminMerchantList = async (
  search: string,
  page: number,
  limit: number,
  role: string,
): Promise<[AdminUserListResponse | null, safeAny]> => {
  const params: Record<string, safeAny> = { page, limit, role };
  if (search) {
    params.search = search;
  }
  const [response, error] = await resolvePBApi<AdminUserListResponse>(
    () =>
      axios.get<AdminUserListResponse>(
        `${baseUrl}/${GET_MERCHANT_LIST_ADMIN}`,
        {
          params,
        },
      ),
    false,
    true,
    false,
  );
  return [response, error];
};

export const callGetUserDetails = async (
  userId: string,
): Promise<[UsersApiResponse | null, safeAny]> => {
  const [response, error] = await resolvePBApi<UsersApiResponse>(
    () =>
      axios.get<UsersApiResponse>(
        `${baseUrl}/${GET_MERCHANT_LIST_ADMIN}/${userId}`,
      ),
    false,
    true,
    false,
  );
  return [response, error];
};

export const callGetKYCDetails = async (
  userId: string,
): Promise<[KYCDetails | null, safeAny]> => {
  const [response, error] = await resolvePBApi<KYCDetails>(
    () => axios.get<KYCDetails>(`${baseUrl}/${GET_KYC_DETAILS}/${userId}`),
    false,
    true,
    false,
  );
  return [response, error];
};

export const callGetKYCPending = async (
  search: string,
  page: number,
  limit: number,
): Promise<[AdminUserListResponse | null, safeAny]> => {
  const [response, error] = await resolvePBApi<AdminUserListResponse>(
    () =>
      axios.get<AdminUserListResponse>(`${baseUrl}/${GET_KYC_PENDING}`, {
        params: { search, page, limit },
      }),
    false,
    true,
    false,
  );
  return [response, error];
};

export const callChangeKYCStatus = async (
  userId: string,
  onboardingStatus: ONBOARDING_STATUS,
): Promise<[KYCDetails | null, safeAny]> => {
  const [response, error] = await resolvePBApi<KYCDetails>(
    () =>
      axios.patch<KYCDetails>(`${baseUrl}/${CHANGE_KYC_STATUS}`, {
        userId,
        onboardingStatus,
      }),
    false,
    true,
    false,
  );
  return [response, error];
};

export const callAllCounts = async (): Promise<
  [editCountResponse | null, safeAny]
> => {
  const [response, error] = await resolvePBApi<editCountResponse>(
    () => axios.get<editCountResponse>(`${baseUrl}/${EDIT_COUNT}`),
    false,
    true,
    false,
  );
  return [response, error];
};

export const callEditCount = async (
  data: editCountRequest,
): Promise<[editCountResponse | null, safeAny]> => {
  const [response, error] = await resolvePBApi<editCountResponse>(
    () => axios.patch<editCountResponse>(`${baseUrl}/${EDIT_COUNT}`, data),
    false,
    true,
    false,
  );
  return [response, error];
};
export const callGetCount = async (
  userId: string,
): Promise<[getCountResponse | null, safeAny]> => {
  if (!userId.trim()) return [{ data: { count: 0 } }, null];
  const [response, error] = await resolvePBApi<getCountResponse>(
    () => axios.get<getCountResponse>(`${baseUrl}/${EDIT_COUNT}/${userId}`),
    false,
    true,
    false,
  );
  return [response, error];
};
