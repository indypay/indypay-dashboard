// import axios from "axios";

import { IManualPayoutResponse, ISettlement } from '../hooks/use-manual-payout';
import { safeAny } from '../interfaces/global.interface';
import { resolvePBApi } from '../utils/common-utils';
import {
  CHECK_MANUAL_PAYOUT_STATUS,
  CHECK_SETTLEMENT_STATUS,
  CHECK_SETTLEMENT_STATUS_CHANNEL_PARTNER,
  GET_SETTLEMENTS_TRANSACTIONS,
  GET_SETTLEMENTS_TRANSACTIONS_CHANNEL_PARTNER,
  INITIATE_SETTLEMENTS,
  INITIATE_PAYOUT,
} from '../constants/apiConstants/apiConstants';
import {
  ICheckSettlementStatusResponse,
  ISettlementResponse,
} from '../interfaces/settlement.interface';

import httpClient from '@/app/api/axios';
import { ManualPayout } from '../interfaces/payout.interface';

export const postCallManualPayout = async (
  body: ManualPayout,
): Promise<[IManualPayoutResponse | null, safeAny]> => {
  const [response, error] = await resolvePBApi<IManualPayoutResponse>(
    () => httpClient.post<IManualPayoutResponse>(`${INITIATE_PAYOUT}`, body),
    false,
    true,
    false,
  );
  return [response, error];
};

export const postCallSettlement = async (
  body: ISettlement,
): Promise<[ISettlementResponse | null, safeAny]> => {
  const [response, error] = await resolvePBApi<ISettlementResponse>(
    () => httpClient.post<ISettlementResponse>(`${INITIATE_SETTLEMENTS}`, body),
    false,
    true,
    false,
  );
  return [response, error];
};

export const getSettlementsTransacions = async (
  page: number,
  limit: number,
  search?: string,
  startDate?: string,
  endDate?: string,
): Promise<[ISettlementResponse | null, safeAny]> => {
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

  const [response, error] = await resolvePBApi<ISettlementResponse>(
    () =>
      httpClient.get<ISettlementResponse>(`${GET_SETTLEMENTS_TRANSACTIONS}/merchant`, {
        params,
      }),
    false,
    true,
    false,
  );
  return [response, error];
};

export const checkSettlementStatus = async (
  settlementId: string,
): Promise<[ICheckSettlementStatusResponse | null, safeAny]> => {
  const [response, error] = await resolvePBApi<ICheckSettlementStatusResponse>(
    () => httpClient.get(`${CHECK_SETTLEMENT_STATUS}/${settlementId}`),
    false,
    true,
    false,
  );
  return [response, error];
};

export const getChannelPartnerSettlementsTransactions = async (
  page: number,
  limit: number,
  search?: string,
  startDate?: string,
  endDate?: string,
): Promise<[ISettlementResponse | null, safeAny]> => {
  const [response, error] = await resolvePBApi<ISettlementResponse>(
    () =>
      httpClient.get(
        `${GET_SETTLEMENTS_TRANSACTIONS_CHANNEL_PARTNER}?page=${page}&limit=${limit}&search=${search}&startDate=${startDate}&endDate=${endDate}`,
      ),
    false,
    true,
    false,
  );
  return [response, error];
};

export const checkChannelPartnerSettlementStatus = async (
  settlementId: string,
): Promise<[ICheckSettlementStatusResponse | null, safeAny]> => {
  const [response, error] = await resolvePBApi<ICheckSettlementStatusResponse>(
    () =>
      httpClient.get(
        `${CHECK_SETTLEMENT_STATUS_CHANNEL_PARTNER}/${settlementId}`,
      ),
    false,
    true,
    false,
  );
  return [response, error];
};

export const checkManualPayoutStatus = async (
  orderId: string,
): Promise<[ICheckSettlementStatusResponse | null, safeAny]> => {
  const [response, error] = await resolvePBApi<ICheckSettlementStatusResponse>(
    () => httpClient.get(`${CHECK_MANUAL_PAYOUT_STATUS}/${orderId}`),
    false,
    true,
    false,
  );
  return [response, error];
};
