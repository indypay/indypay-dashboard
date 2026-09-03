import { resolvePBApi } from '@/lib/utils/common-utils';
import { PBBaseResponse, safeAny } from '@/lib/interfaces/global.interface';
import axios from '@/app/api/axios';
import {
  PayoutWalletList,
  WalletDetailsData,
} from '../interfaces/payout-wallet.interface';
import {
  GET_ALL_WALLET_LISTS,
  GET_CHANNEL_PARTNER_WALLET_LISTS,
  GET_MERCHANT_WALLET_LISTS,
  REFUND_WALLETS,
  TOP_UP_WALLETS,
} from '../constants/apiConstants/apiConstants';
import { TopUpRequest } from '../interfaces/payout-wallet.interface';
import { isChannelPartner } from '../utils/utils';

const baseUrl = process.env.NEXT_PUBLIC_DEV_PB_BASE_URL;

export const callPayoutWalletList = async (
  page?: number,
  limit?: number,
  search?: string,
  startDate?: string,
  endDate?: string,
  role?: string | null,
): Promise<[PayoutWalletList | null, safeAny]> => {
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
  const [response, error] = await resolvePBApi<PayoutWalletList>(
    () => {
      if (isChannelPartner(role || '')) {
        return axios.get<PayoutWalletList>(
          `${baseUrl}${GET_CHANNEL_PARTNER_WALLET_LISTS}`,
          {
            params,
          },
        );
      } else {
        return axios.get<PayoutWalletList>(
          `${baseUrl}${GET_ALL_WALLET_LISTS}`,
          {
            params,
          },
        );
      }
    },
    false,
    true,
    false,
  );
  return [response, error];
};

export const callMerchantWalletDetailsById = async (
  userId: string | null,
  page?: number,
  limit?: number,
  search?: string,
  startDate?: string,
  endDate?: string,
  role?: string | null,
): Promise<[WalletDetailsData | null, safeAny]> => {
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
  const [response, error] = await resolvePBApi<WalletDetailsData>(
    () => {
      if (isChannelPartner(role || '')) {
        return axios.get<WalletDetailsData>(
          `${baseUrl}${GET_CHANNEL_PARTNER_WALLET_LISTS}/${userId}`,
          {
            params,
          },
        );
      } else {
        return axios.get<WalletDetailsData>(
          `${baseUrl}${GET_ALL_WALLET_LISTS}/${userId}`,
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

export const callMerchantWalletDetails = async (
  page?: number,
  limit?: number,
  search?: string,
  startDate?: string,
  endDate?: string,
): Promise<[WalletDetailsData | null, safeAny]> => {
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
  const [response, error] = await resolvePBApi<WalletDetailsData>(
    () =>
      axios.get<WalletDetailsData>(`${baseUrl}${GET_MERCHANT_WALLET_LISTS}`, {
        params,
      }),
    false,
    true,
    false,
  );
  return [response, error];
};

export const callTopupWallet = async (
  topupRequest: TopUpRequest,
): Promise<[PBBaseResponse | null, safeAny]> => {
  const [response, error] = await resolvePBApi<PBBaseResponse>(
    () =>
      axios.post<PBBaseResponse>(`${baseUrl}${TOP_UP_WALLETS}`, topupRequest),
    false,
    true,
    false,
  );
  return [response, error];
};

export const callRefundWallet = async (
  refundRequest: TopUpRequest,
): Promise<[PBBaseResponse | null, safeAny]> => {
  const [response, error] = await resolvePBApi<PBBaseResponse>(
    () =>
      axios.post<PBBaseResponse>(`${baseUrl}${REFUND_WALLETS}`, refundRequest),
    false,
    true,
    false,
  );
  return [response, error];
};
