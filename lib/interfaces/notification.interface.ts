/** Matches backend BroadcastNotificationDto */
export interface BroadcastNotificationDto {
  title: string;
  message: string;
  data?: Record<string, unknown>;
}
