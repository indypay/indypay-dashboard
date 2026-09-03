export interface ApiHitLog {
  category: 'backend_api_hit';
  userId: string;
  method: string;
  path: string;
  statusCode: number;
  durationMs: number;
  timestamp: string;
  integrationCode?: string;
  requestIp?: string;
  clientId?: string;
  traceId?: string;
}

export interface ApiHitLogsQueryParams {
  limit?: number;
  fromTime?: number;
  toTime?: number;
  userId?: string;
}
