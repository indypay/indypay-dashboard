import { safeAny } from '../interfaces/global.interface';
import { resolvePBApi } from '../utils/common-utils';
import {
  ADD_BANK_DETAILS,
  GET_ALL_BANK_LIST,
  BANK_DETAILS_BY_BANK_ID,
} from '../constants/apiConstants/apiConstants';
import {
  BankListResponse,
  IBankDetails,
  IBankDetailsResponse,
} from '../interfaces/banks.interface';
import { IManualPayoutResponse } from '../hooks/use-manual-payout';

import axios from '@/app/api/axios';

const baseUrl = process.env.NEXT_PUBLIC_DEV_PB_BASE_URL;

export const addBankDetails = async (
  bankDetails: IBankDetails,
): Promise<[IManualPayoutResponse | null, safeAny]> => {
  const [response, error] = await resolvePBApi<IManualPayoutResponse>(
    () =>
      axios.post<IManualPayoutResponse>(
        `${baseUrl}/${ADD_BANK_DETAILS}`,
        bankDetails,
      ),
    false,
    true,
    false,
  );
  return [response, error];
};

export const callGetAllBankListByMerchantId = async (): Promise<
  [BankListResponse | null, safeAny]
> => {
  const [response, error] = await resolvePBApi<BankListResponse>(
    () => axios.get<BankListResponse>(`${baseUrl}/${GET_ALL_BANK_LIST}`),
    false,
    true,
    false,
  );
  return [response, error];
};

export const callGetAllBankList = async (
  userId: string,
): Promise<[BankListResponse | null, safeAny]> => {
  const [response, error] = await resolvePBApi<BankListResponse>(
    () =>
      axios.get<BankListResponse>(`${baseUrl}/${GET_ALL_BANK_LIST}/${userId}`),
    false,
    true,
    false,
  );
  return [response, error];
};

export const callGetBankDetailsByBankId = async (
  bankId: string,
): Promise<[IBankDetailsResponse | null, safeAny]> => {
  const [response, error] = await resolvePBApi<IBankDetailsResponse>(
    () =>
      axios.get<IBankDetailsResponse>(
        `${baseUrl}/${BANK_DETAILS_BY_BANK_ID}${bankId}`,
      ),
    false,
    true,
    false,
  );
  return [response, error];
};
