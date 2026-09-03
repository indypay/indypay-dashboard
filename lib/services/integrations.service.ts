import axios from '@/app/api/axios';
import { API_HIT_LOGS } from '@/lib/constants/apiConstants/apiConstants';
import { API_CONFIG } from '@/lib/config/api.config';
import {
  ApiHitLog,
  ApiHitLogsQueryParams,
} from '@/lib/interfaces/api-hit-logs.interface';
import { safeAny } from '@/lib/interfaces/global.interface';
import { resolvePBApi } from '@/lib/utils/common-utils';

const base = API_CONFIG.baseURL;

export const callGetApiHitLogs = async (
  params: ApiHitLogsQueryParams,
): Promise<[ApiHitLog[] | null, safeAny]> => {
  const [res, err] = await resolvePBApi<{ data: ApiHitLog[] }>(
    () => axios.get(`${base}/${API_HIT_LOGS}`, { params }),
    false,
    true,
    false,
  );
  return [res?.data ?? null, err];
};
