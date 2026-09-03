import { useQuery } from '@tanstack/react-query';
import { callGetApiHitLogs } from '@/lib/services/integrations.service';
import { ApiHitLogsQueryParams } from '@/lib/interfaces/api-hit-logs.interface';

export const useApiHitLogs = (params: ApiHitLogsQueryParams) =>
  useQuery({
    queryKey: ['api-hit-logs', params],
    queryFn: async () => {
      const [data, error] = await callGetApiHitLogs(params);
      if (error) throw error;
      const logs = data ?? [];
      return [...logs].sort(
        (a, b) =>
          new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime(),
      );
    },
    staleTime: 30_000,
    refetchOnWindowFocus: false,
  });
