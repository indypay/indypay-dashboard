import { resolvePBApi } from '@/lib/utils/common-utils';
import { safeAny } from '@/lib/interfaces/global.interface';
import axios from '@/app/api/axios';
import { BROADCAST_NOTIFICATION } from '@/lib/constants/apiConstants/apiConstants';
import type { BroadcastNotificationDto } from '@/lib/interfaces/notification.interface';

const baseUrl = process.env.NEXT_PUBLIC_DEV_PB_BASE_URL;

export async function broadcastNotification(
  body: BroadcastNotificationDto,
): Promise<[unknown | null, safeAny]> {
  const [response, error] = await resolvePBApi<unknown>(
    () =>
      axios.post<unknown>(`${baseUrl}/${BROADCAST_NOTIFICATION}`, body, {
        withCredentials: true,
      }),
    false,
    true,
    false,
  );
  return [response, error];
}
