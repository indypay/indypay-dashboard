import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { UseQueryResult, UseMutationResult } from '@tanstack/react-query';
import { queryKeys } from '@/lib/config/query-client.config';
import type { ApiResponse } from '@/lib/types/api.types';
import {
  getLatestAiRecommendation,
  triggerAiAnalysis,
  applyAiRecommendation,
  dismissAiRecommendation,
} from '@/lib/services/ai-commission.service';
import type {
  AiCommissionRecommendation,
  TriggerAnalysisResponse,
} from '@/lib/interfaces/ai-commission.interface';

export function useLatestAiRecommendation(
  merchantId: string | null,
  enabled = true,
): UseQueryResult<ApiResponse<AiCommissionRecommendation>, Error> {
  return useQuery({
    queryKey: queryKeys.aiCommission.merchantLatest(merchantId ?? ''),
    queryFn: () => getLatestAiRecommendation(merchantId!),
    enabled: !!merchantId && enabled,
  });
}

export function useTriggerAiAnalysis(): UseMutationResult<
  ApiResponse<TriggerAnalysisResponse>,
  Error,
  string
> {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (merchantId: string) => triggerAiAnalysis(merchantId),
    onSuccess: (_, merchantId) => {
      setTimeout(() => {
        queryClient.invalidateQueries({
          queryKey: queryKeys.aiCommission.merchantLatest(merchantId),
        });
      }, 3000);
    },
  });
}

export function useApplyAiRecommendation(): UseMutationResult<
  ApiResponse<{ message: string }>,
  Error,
  { id: string; merchantId: string }
> {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id }: { id: string; merchantId: string }) =>
      applyAiRecommendation(id),
    onSuccess: (_, { merchantId }) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.aiCommission.merchantLatest(merchantId),
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.commissions.userMapping(merchantId),
      });
    },
  });
}

export function useDismissAiRecommendation(): UseMutationResult<
  ApiResponse<{ message: string }>,
  Error,
  { id: string; merchantId: string; reason?: string }
> {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, reason }: { id: string; merchantId: string; reason?: string }) =>
      dismissAiRecommendation(id, reason),
    onSuccess: (_, { merchantId }) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.aiCommission.merchantLatest(merchantId),
      });
    },
  });
}
