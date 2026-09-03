'use client';

import ApiHitLogsView from '@/lib/components/ApiHitLogs/ApiHitLogsView';

export default function ApiRequestsPage() {
  return (
    <ApiHitLogsView
      variant="api-requests"
      title="API Requests"
      subtitle="Server API calls authenticated with your API keys"
    />
  );
}
