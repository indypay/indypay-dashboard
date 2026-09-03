import { useMutation, type UseMutationResult } from '@tanstack/react-query';
import { broadcastNotification } from '@/lib/services/notification.service';
import type { BroadcastNotificationDto } from '@/lib/interfaces/notification.interface';
import type { safeAny } from '@/lib/interfaces/global.interface';

export function useBroadcastNotification(): UseMutationResult<
  [unknown | null, safeAny],
  Error,
  BroadcastNotificationDto
> {
  return useMutation({
    mutationFn: (body: BroadcastNotificationDto) => broadcastNotification(body),
  });
}
