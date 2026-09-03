import httpClient from '@/app/api/axios';
import { REFRESH_TOKEN } from '../constants/apiConstants/apiConstants';
import { PBBaseResponse, safeAny } from '../interfaces/global.interface';
import { resolvePBApi } from '../utils/common-utils';
import Cookies from 'js-cookie';

export const refreshAccessToken = async (): Promise<
  [PBBaseResponse | null, safeAny]
> => {
  const [response, error] = await resolvePBApi<PBBaseResponse>(
    () => httpClient.post<PBBaseResponse>(`${REFRESH_TOKEN}`),
    false,
    true,
    false,
  );

  // @ts-ignore
  if (response?.data?.token) {
    // Update the access token
    // @ts-ignore
    Cookies.set('rtk', response.data.token, { secure: true });
  }

  return [response, error];
};
