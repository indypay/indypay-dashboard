import { resolvePBApi } from '@/lib/utils/common-utils';
import type { ApiResponse } from '@/lib/types/api.types';
import axios from '@/app/api/axios';
import type {
  AiCommissionRecommendation,
  AiCommissionListResponse,
  AiChurnRisk,
  AiVolumeTrend,
  TriggerAnalysisResponse,
} from '@/lib/interfaces/ai-commission.interface';

const baseUrl = process.env.NEXT_PUBLIC_DEV_PB_BASE_URL;
const BASE = 'api/v1/admin/ai/commission';

export async function getAiCommissionRecommendations(params?: {
  churnRisk?: AiChurnRisk;
  volumeTrend?: AiVolumeTrend;
  page?: number;
  limit?: number;
}): Promise<ApiResponse<AiCommissionListResponse>> {
  const query = new URLSearchParams();
  if (params?.churnRisk) query.set('churnRisk', params.churnRisk);
  if (params?.volumeTrend) query.set('volumeTrend', params.volumeTrend);
  if (params?.page) query.set('page', String(params.page));
  if (params?.limit) query.set('limit', String(params.limit));

  const url = `${baseUrl}/${BASE}/recommendations${query.size ? `?${query}` : ''}`;
  return resolvePBApi<AiCommissionListResponse>(
    () => axios.get<AiCommissionListResponse>(url),
    false, true, false,
  );
}

export async function getLatestAiRecommendation(
  merchantId: string,
): Promise<ApiResponse<AiCommissionRecommendation>> {
  return resolvePBApi<AiCommissionRecommendation>(
    () => axios.get<AiCommissionRecommendation>(
      `${baseUrl}/${BASE}/recommendations/merchant/${merchantId}`,
    ),
    false, false, false,
  );
}

export async function triggerAiAnalysis(
  merchantId: string,
): Promise<ApiResponse<TriggerAnalysisResponse>> {
  return resolvePBApi<TriggerAnalysisResponse>(
    () => axios.post<TriggerAnalysisResponse>(
      `${baseUrl}/${BASE}/analyze/${merchantId}`,
    ),
    false, true, false,
  );
}

export async function applyAiRecommendation(
  id: string,
): Promise<ApiResponse<{ message: string }>> {
  return resolvePBApi<{ message: string }>(
    () => axios.patch<{ message: string }>(
      `${baseUrl}/${BASE}/recommendations/${id}/apply`,
    ),
    false, true, false,
  );
}

export async function dismissAiRecommendation(
  id: string,
  reason?: string,
): Promise<ApiResponse<{ message: string }>> {
  return resolvePBApi<{ message: string }>(
    () => axios.patch<{ message: string }>(
      `${baseUrl}/${BASE}/recommendations/${id}/dismiss`,
      { reason },
    ),
    false, true, false,
  );
}
