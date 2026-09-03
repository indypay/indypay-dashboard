import { PBBaseResponse, safeAny } from '../interfaces/global.interface';
import { ApiResponse } from '../types/api.types';
import { resolvePBApi } from '../utils/common-utils';
import { API_CONFIG } from '../config/api.config';
import {
  ApiKeyData,
  SecretApiRequest,
  SecretAPIResponse,
} from '../interfaces/secret.interface';
import {
  WebhookApiRequest,
  WebhookApiResponse,
} from '../interfaces/webhook.interface';
import { ResetPasswordApiRequest } from '../interfaces/reset-password.interface';
import { TransactionApiResponse } from '../interfaces/transactions.interface';
import { DownloadTransactionAttachmentRequest } from '../interfaces/download.interface';
import { TransactionDetailsApiResponse } from '../interfaces/transaction-details.interface';
import {
  GetWhitelistIpsResponse,
  WhitelistIpsRequest,
} from '../interfaces/white-list.interface';
import { ChangedPasswordResponse } from '../interfaces/authentication.interface';

import {
  ADMIN_GENERATE_SECRET_KEY,
  ADMIN_TRANSACTION_DETAILS,
  CHANGE_PASSWORD,
  DELETE_WHITELIST_IPS,
  DOWNLOAD_ADMIN_TRANSACTION_CSV,
  DOWNLOAD_MERCHANT_TRANSACTION_CSV,
  GENERATE_WEBHOOK_URL,
  GET_WEBHOOK_URL,
  GET_WHITELIST_IPS,
  MERCHANT_GENERATE_SECRET_KEY,
  MERCHANT_TRANSACTION_DETAILS,
  VALIDATE_API_KEY,
  VIEW_TRANSACTIONS_ADMIN,
  VIEW_TRANSACTIONS_MERCHANT,
  WHITELIST_API,
} from '@/lib/constants/apiConstants/apiConstants';
import axios from '@/app/api/axios';

const baseUrl = API_CONFIG.baseURL;

export const callValidateApiKey = async (): Promise<
  [ApiKeyData | null, safeAny]
> => {
  const [response, error] = await resolvePBApi<ApiKeyData>(
    () => axios.get<ApiKeyData>(`${baseUrl}/${VALIDATE_API_KEY}`),
    false,
    true,
    false,
  );
  return [response, error];
};

export const callAdminGenerateSecretKey = async (
  mobile: SecretApiRequest,
): Promise<[SecretAPIResponse[] | null, safeAny]> => {
  const [response, error] = await resolvePBApi<SecretAPIResponse[]>(
    () =>
      axios.post<SecretAPIResponse[]>(
        `${baseUrl}/${ADMIN_GENERATE_SECRET_KEY}`,
        mobile,
      ),
    false,
    true,
    false,
  );
  return [response, error];
};

export const callMerchantGenerateSecretKey = async (): Promise<
  [SecretAPIResponse[] | null, safeAny]
> => {
  const [response, error] = await resolvePBApi<SecretAPIResponse[]>(
    () =>
      axios.post<SecretAPIResponse[]>(
        `${baseUrl}/${MERCHANT_GENERATE_SECRET_KEY}`,
      ),
    false,
    true,
    false,
  );
  return [response, error];
};

export const callAdminTransactionApi = async (): Promise<
  [TransactionApiResponse[] | null, safeAny]
> => {
  const [response, error] = await resolvePBApi<TransactionApiResponse[]>(
    () =>
      axios.get<TransactionApiResponse[]>(
        `${baseUrl}/${VIEW_TRANSACTIONS_ADMIN}`,
      ),
    false,
    true,
    false,
  );
  return [response, error];
};

export const callMerchantTransactionApi = async (): Promise<
  [TransactionApiResponse[] | null, safeAny]
> => {
  const [response, error] = await resolvePBApi<TransactionApiResponse[]>(
    () =>
      axios.get<TransactionApiResponse[]>(
        `${baseUrl}/${VIEW_TRANSACTIONS_MERCHANT}`,
      ),
    false,
    true,
    false,
  );
  return [response, error];
};

export const callUpdateWebhookUrl = async ({
  webhookUrl,
}: WebhookApiRequest): Promise<[PBBaseResponse[] | null, safeAny]> => {
  const [response, error] = await resolvePBApi<PBBaseResponse[]>(
    () =>
      axios.post<PBBaseResponse[]>(
        `${baseUrl}/${GENERATE_WEBHOOK_URL}`,
        webhookUrl,
      ),
    false,
    true,
    false,
  );
  return [response, error];
};

export const callgetWebhookUrl = async (): Promise<
  [WebhookApiResponse | null, safeAny]
> => {
  const [response, error] = await resolvePBApi<WebhookApiResponse>(
    () => axios.get<WebhookApiResponse>(`${baseUrl}/${GET_WEBHOOK_URL}`),
    false,
    true,
    false,
  );
  return [response, error];
};

export const resetPassword = async (
  data: ResetPasswordApiRequest,
): Promise<[ChangedPasswordResponse | null, safeAny]> => {
  const [response, error] = await resolvePBApi<ChangedPasswordResponse>(
    () =>
      axios.post<ChangedPasswordResponse>(
        `${baseUrl}/${CHANGE_PASSWORD}`,
        data,
      ),
    false,
    true,
    false,
  );
  return [response, error];
};

export const callTransactionAdminDetailsApi = async (
  id: string,
): Promise<[TransactionDetailsApiResponse[] | null, safeAny]> => {
  const [response, error] = await resolvePBApi<TransactionDetailsApiResponse[]>(
    () =>
      axios.get<TransactionDetailsApiResponse[]>(
        `${baseUrl}/${ADMIN_TRANSACTION_DETAILS}/${id}`,
      ),
    false,
    true,
    false,
  );
  return [response, error];
};

export const callTransactionMerchantDetailsApi = async (
  id: string,
): Promise<[TransactionDetailsApiResponse[] | null, safeAny]> => {
  const [response, error] = await resolvePBApi<TransactionDetailsApiResponse[]>(
    () =>
      axios.get<TransactionDetailsApiResponse[]>(
        `${baseUrl}/${MERCHANT_TRANSACTION_DETAILS}/${id}`,
      ),
    false,
    true,
    false,
  );
  return [response, error];
};

export const downloadTransactionMerchantAttachment = async (
  downloadTransactionAttachmentRequest: DownloadTransactionAttachmentRequest,
): Promise<[Blob | null, safeAny]> => {
  const [response, error] = await resolvePBApi<Blob>(() =>
    axios.post<Blob>(
      `${baseUrl}/${DOWNLOAD_MERCHANT_TRANSACTION_CSV}`,
      { ...downloadTransactionAttachmentRequest },
      { responseType: 'blob' },
    ),
  );
  return [response, error];
};

export const downloadTransactionAdminAttachment = async (
  downloadTransactionAttachmentRequest: DownloadTransactionAttachmentRequest,
): Promise<[Blob | null, safeAny]> => {
  const [response, error] = await resolvePBApi<Blob>(() =>
    axios.post<Blob>(
      `${baseUrl}/${DOWNLOAD_ADMIN_TRANSACTION_CSV}`,
      { ...downloadTransactionAttachmentRequest },
      { responseType: 'blob' },
    ),
  );
  return [response, error];
};

export const getTransactionDetails = async (id: string) => {
  try {
    const response = await axios.get(`/api/transactions/${id}`);
    return [response.data, null];
  } catch (error) {
    return [null, error];
  }
};

// Whitelist-api's

export const callAddWhitelistIps = async (
  whitelistIps: WhitelistIpsRequest,
): Promise<[PBBaseResponse[] | null, safeAny]> => {
  const [response, error] = await resolvePBApi<PBBaseResponse[]>(
    () =>
      axios.post<PBBaseResponse[]>(`${baseUrl}${WHITELIST_API}`, whitelistIps),
    false,
    true,
    false,
  );
  return [response, error];
};

export const callGetWhitelistIps = async (): Promise<
  [GetWhitelistIpsResponse | null, safeAny]
> => {
  const [response, error] = await resolvePBApi<GetWhitelistIpsResponse>(
    () => axios.get<GetWhitelistIpsResponse>(`${baseUrl}${GET_WHITELIST_IPS}`),
    false,
    true,
    false,
  );
  return [response, error];
};

export const callDeleteWhitelistIps = async (
  whitelistIps: WhitelistIpsRequest,
): Promise<[PBBaseResponse[] | null, safeAny]> => {
  const [response, error] = await resolvePBApi<PBBaseResponse[]>(
    () =>
      axios.delete<PBBaseResponse[]>(
        `${baseUrl}${DELETE_WHITELIST_IPS}${whitelistIps.ipAddress}`,
      ),
    false,
    true,
    false,
  );
  return [response, error];
};
