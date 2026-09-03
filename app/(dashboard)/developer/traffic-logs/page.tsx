'use client';

import ApiHitLogsView from '@/lib/components/ApiHitLogs/ApiHitLogsView';

export default function TrafficLogsPage() {
  return (
    <ApiHitLogsView
      variant="traffic-logs"
      title="Traffic & Logs"
      subtitle="Request traffic with trace IDs for support and debugging"
    />
  );
}
