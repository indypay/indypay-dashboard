import httpClient from '@/app/api/axios';
import {
  ENABLE_MULTI_AUTH,
  VERIFY_MULTI_AUTH,
} from '../constants/apiConstants/apiConstants';
import { PBBaseResponse, safeAny } from '../interfaces/global.interface';
import { MultiAuthOtpVerification } from '../interfaces/mutli-auth.interface';
import { resolvePBApi } from '../utils/common-utils';

export const postEnableMultiAuth = async (): Promise<
  [PBBaseResponse | null, safeAny]
> => {
  const [response, error] = await resolvePBApi<PBBaseResponse>(
    () => httpClient.post<PBBaseResponse>(`${ENABLE_MULTI_AUTH}`, {}),
    false,
    true,
    false,
  );
  return [response, error];
};

export const postVerifyMultiAuth = async (
  body: MultiAuthOtpVerification,
): Promise<[PBBaseResponse | null, safeAny]> => {
  const [response, error] = await resolvePBApi<PBBaseResponse>(
    () => httpClient.post<PBBaseResponse>(`${VERIFY_MULTI_AUTH}`, body),
    false,
    true,
    false,
  );
  return [response, error];
};
