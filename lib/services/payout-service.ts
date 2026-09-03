import {
  PayoutApiResponse,
  MerchantPayoutRes,
  MerchantPayoutDetailsTransRes,
  PayoutStatusRes,
  // PayoutDetailsTransRes,
} from '../interfaces/payout.interface';

import {
  CHECK_PAYOUT_STATUS,
  GET_ALL_PAYOUT_BY_ADMIN,
  GET_ALL_PAYOUT_BY_CHANNEL_PARTNER,
  GET_ALL_PAYOUT_BY_MERCHANT,
  GET_PAYOUT_BY_MERCHANT,
  GET_PAYOUT_BY_PAYOUT_ID,
} from '../constants/apiConstants/apiConstants';

import { resolvePBApi } from '@/lib/utils/common-utils';
import { safeAny } from '@/lib/interfaces/global.interface';
import axios from '@/app/api/axios';
import { isChannelPartner } from '../utils/utils';

const baseUrl = process.env.NEXT_PUBLIC_DEV_PB_BASE_URL;

// Admin collections Api's

export const callAdminPayoutStats = async (
  page: number,
  limit: number,
  search: string,
  startDate: string,
  endDate: string,
  role?: string | null,
): Promise<[PayoutApiResponse | null, safeAny]> => {
  const [response, error] = await resolvePBApi<PayoutApiResponse>(
    () => {
      if (isChannelPartner(role || '')) {
        return axios.get<PayoutApiResponse>(
          `${baseUrl}/${GET_ALL_PAYOUT_BY_CHANNEL_PARTNER}?page=${page}&limit=${limit}&search=${search}&startDate=${startDate}&endDate=${endDate}`,
        );
      } else {
        return axios.get<PayoutApiResponse>(
          `${baseUrl}/${GET_ALL_PAYOUT_BY_ADMIN}?page=${page}&limit=${limit}&search=${search}&startDate=${startDate}&endDate=${endDate}`,
        );
      }
    },
    false,
    true,
    false,
  );
  return [response, error];
};

export const callMerchantPayoutById = async (
  userId: string | null,
  page: number,
  limit: number,
  search: string,
  status: string,
  startDate: string,
  endDate: string,
  role?: string | null,
): Promise<[MerchantPayoutDetailsTransRes | null, safeAny]> => {
  const [response, error] = await resolvePBApi<MerchantPayoutDetailsTransRes>(
    () => {
      const params = {
        page,
        limit,
        ...(search && { search }),
        ...(status && { status }),
        ...(startDate && { startDate }),
        ...(endDate && { endDate }),
      };
      if (isChannelPartner(role || '')) {
        return axios.get<MerchantPayoutDetailsTransRes>(
          `${baseUrl}/${GET_ALL_PAYOUT_BY_CHANNEL_PARTNER}/${userId}`,
          { params },
        );
      } else {
        return axios.get<MerchantPayoutDetailsTransRes>(
          `${baseUrl}/${GET_ALL_PAYOUT_BY_MERCHANT}/${userId}`,
          { params },
        );
      }
    },
    false,
    true,
    false,
  );
  return [response, error];
};

export const callMerchantPayoutDetailsById = async (
  payInId: string,
): Promise<[MerchantPayoutRes | null, safeAny]> => {
  const [response, error] = await resolvePBApi<MerchantPayoutRes>(
    () =>
      axios.get<MerchantPayoutRes>(
        `${baseUrl}${GET_PAYOUT_BY_PAYOUT_ID}/${payInId}`,
      ),
    false,
    true,
    false,
  );
  return [response, error];
};

export const callAllMerchantPayout = async (
  page: number,
  limit: number,
  search: string,
  startDate: string,
  endDate: string,
): Promise<[PayoutApiResponse | null, safeAny]> => {
  const params: Record<string, safeAny> = { page, limit };

  if (search) {
    params.search = search;
  }
  if (startDate) {
    params.startDate = startDate;
  }
  if (endDate) {
    params.endDate = endDate;
  }
  if (startDate) {
    params.startDate = startDate;
  }
  if (endDate) {
    params.endDate = endDate;
  }
  const [response, error] = await resolvePBApi<PayoutApiResponse>(
    () =>
      axios.get<PayoutApiResponse>(`${baseUrl}/${GET_PAYOUT_BY_MERCHANT}`, {
        params,
      }),
    false,
    true,
    false,
  );
  return [response, error];
};

export const callMerchantPayoutByPayoutId = async (
  payoutId: string,
): Promise<[MerchantPayoutRes | null, safeAny]> => {
  const [response, error] = await resolvePBApi<MerchantPayoutRes>(
    () =>
      axios.get<MerchantPayoutRes>(
        `${baseUrl}/${GET_PAYOUT_BY_PAYOUT_ID}${payoutId}`,
      ),
    false,
    true,
    false,
  );
  return [response, error];
};

export const callPayoutStatusApi = async (
  id: string,
): Promise<[PayoutStatusRes | null, safeAny]> => {
  if (!id) {
    throw new Error('Payout record ID is required');
  }

  const [response, error] = await resolvePBApi<PayoutStatusRes>(
    () =>
      axios.post<PayoutStatusRes>(`${baseUrl}/${CHECK_PAYOUT_STATUS}`, {
        id,
      }),
    false,
    true,
    false,
  );
  return [response, error];
};
