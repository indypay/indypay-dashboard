import { safeAny } from '../interfaces/global.interface';
import { resolvePBApi } from '../utils/common-utils';
import {
  GET_ALL_OPERATIONS_BY_MERCHANT,
  GET_MERCHANT_LIST_CHANNEL_PARTNER,
  GET_OPERATIONS_STATS,
  GET_UNSETTLED_COLLECTIONS,
} from '../constants/apiConstants/apiConstants';
import {
  IMerchantList,
  IMerchantListResponse,
  IMerchantListChannelPartnerResponse,
} from '../interfaces/merchant-list.interface';
import {
  ISettlementStatsResponse,
  IUnsettledCollectionsResponse,
} from '../interfaces/settlement.interface';

import axios from '@/app/api/axios';

const baseUrl = process.env.NEXT_PUBLIC_DEV_PB_BASE_URL;

export const callGetUnsettledCollections = async (
  page: number,
  limit: number,
  search: string,
): Promise<[IUnsettledCollectionsResponse | null, safeAny]> => {
  const [response, error] = await resolvePBApi<IUnsettledCollectionsResponse>(
    () =>
      axios.get<IUnsettledCollectionsResponse>(
        `${baseUrl}/${GET_UNSETTLED_COLLECTIONS}?page=${page}&limit=${limit}&search=${search}`,
      ),
    false,
    true,
    false,
  );
  return [response, error];
};

export const callGetOperationsStats = async (): Promise<
  [ISettlementStatsResponse | null, safeAny]
> => {
  const [response, error] = await resolvePBApi<ISettlementStatsResponse>(
    () =>
      axios.get<ISettlementStatsResponse>(`${baseUrl}/${GET_OPERATIONS_STATS}`),
    false,
    true,
    false,
  );
  return [response, error];
};

export const callGetAllOperationsByMerchant = async (): Promise<
  [{ data: IMerchantList[] } | null, safeAny]
> => {
  const [response, error] = await resolvePBApi<{ data: IMerchantList[] }>(
    () =>
      axios.get<{ data: IMerchantList[] }>(
        `${baseUrl}/${GET_ALL_OPERATIONS_BY_MERCHANT}`,
      ),
    false,
    true,
    false,
  );
  return [response, error];
};

export const callGetAllChannelPartnerMerchantList = async (
  search: string,
  page: number,
  limit: number,
): Promise<[IMerchantListChannelPartnerResponse | null, safeAny]> => {
  const [response, error] =
    await resolvePBApi<IMerchantListChannelPartnerResponse>(
      () =>
        axios.get<IMerchantListChannelPartnerResponse>(
          `${baseUrl}/${GET_MERCHANT_LIST_CHANNEL_PARTNER}?page=${page}&limit=${limit}&search=${search}`,
        ),
      false,
      true,
      false,
    );
  return [response, error];
};
