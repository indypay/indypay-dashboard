'use client';
import { useState, useEffect } from 'react';
import { Spin } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
import { RefreshCw } from 'lucide-react';
import OverviewCards from './components/OverviewCards';
import { DateRangeProvider } from '../components/DateRangeContext';
import { DateRangeSelector } from '../components/DateRangeSelector';

import {
  getAdminDashboardData,
  getChannelPartnerDashboardData,
  getMerchantDashboardData,
} from '@/lib/hooks/useDashboardData';
import { useRole } from '@/lib/components/Role/RoleContext';
import { isAdmin, isChannelPartner, isMerchant, isOps, viewOnlyAdmin } from '@/lib/utils/utils';
import { useDateRange } from '../components/DateRangeContext';
import { analyzeOverview } from '@/lib/actions/ai-analytics';
import { FailureDiagnosisResult } from '@/lib/actions/ai-diagnose';
import { AIInsightCard } from '@/lib/components/AIInsightCard/AIInsightCard';

const OverviewContent = () => {
  const { role } = useRole();
  const { dateRange } = useDateRange();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [diagnosis, setDiagnosis] = useState<FailureDiagnosisResult | null>(null);
const [isDiagnosing, setIsDiagnosing] = useState(false);
  const startDate = dateRange.startDate
    ? new Date(dateRange.startDate.setHours(0, 0, 0, 0)).toISOString()
    : '';
  const endDate = dateRange.endDate
    ? new Date(dateRange.endDate.setHours(23, 59, 59, 999)).toISOString()
    : '';

  const useAdminApi = isAdmin(role) || isOps(role) || viewOnlyAdmin(role);
  const useCpApi = isChannelPartner(role);
  const useMerchantApi = isMerchant(role);

  const merchantDataQuery = getMerchantDashboardData({ startDate, endDate, enabled: useMerchantApi });
  const adminDataQuery = getAdminDashboardData({ startDate, endDate, enabled: useAdminApi });
  const channelPartnerDataQuery = getChannelPartnerDashboardData({ startDate, endDate, enabled: useCpApi });

  let activeQuery;
  if (useMerchantApi) activeQuery = merchantDataQuery;
  else if (useAdminApi) activeQuery = adminDataQuery;
  else activeQuery = channelPartnerDataQuery;

  const responseData = activeQuery?.data?.[0] || null;
  const isLoading = activeQuery?.isLoading || false;

  const startDateStr = dateRange.startDate ? new Date(dateRange.startDate).toISOString() : '';
  const endDateStr = dateRange.endDate ? new Date(dateRange.endDate).toISOString() : '';

  useEffect(() => {
    if (!responseData) return;
    const d = (responseData as any)?.data;
    if (!d) return;
setIsDiagnosing(true);
    analyzeOverview({
      totalPayinAmount: d.payin?.totalAmount ?? 0,
      totalPayinCount: d.payin?.totalCount ?? 0,
      successPayinAmount: d.payin?.successAmount ?? null,
      failedPayinAmount: d.payin?.failedAmount ?? null,
      totalPayoutAmount: d.payout?.totalAmount ?? 0,
      totalPayoutCount: d.payout?.totalCount ?? 0,
      startDate: startDateStr,
      endDate: endDateStr,
    })
      .then((result) => setDiagnosis(result))
      .catch((err) => {
        console.error('AI diagnosis failed:', err);
        setDiagnosis(null);
      })
      .finally(() => setIsDiagnosing(false));
  }, [responseData]);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await activeQuery.refetch();
    } finally {
      setIsRefreshing(false);
    }
  };

  const loadingIcon = (
    <LoadingOutlined style={{ fontSize: 48, color: 'var(--primary)' }} spin />
  );

  return (
    <div className="px-2 md:px-8 py-4 md:py-8 relative">
      {isRefreshing && (
        <div
          style={{
            position: 'fixed',
            top: 0, left: 0, right: 0, bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.7)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
          }}
        >
          <Spin indicator={loadingIcon} />
        </div>
      )}

      {(diagnosis || isDiagnosing) && (
        <div className="px-2 md:px-8 mb-4">
          <AIInsightCard
            result={diagnosis ?? { summary: '', severity: 'low', suggestions: [] }}
            isLoading={isDiagnosing}
          />
        </div>
      )}

      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6 gap-4">
        <div className="ml-2 md:ml-10">
          <h1 className="text-xl md:text-2xl font-bold mb-0.5" style={{ color: 'var(--text)' }}>
            Overview
          </h1>
          <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
            Track and monitor your business transactions
          </p>
        </div>
        <div className="flex flex-row items-center gap-3 w-full md:w-auto">
          <DateRangeSelector />
          <button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="flex items-center gap-2 px-4 h-10 rounded-full font-semibold text-sm flex-shrink-0 transition-opacity disabled:opacity-60"
            style={{
              border: '1px solid var(--primary)',
              color: 'var(--primary)',
              background: 'transparent',
              cursor: isRefreshing ? 'not-allowed' : 'pointer',
            }}
          >
            <RefreshCw
              size={15}
              className={isRefreshing ? 'animate-spin' : ''}
            />
            Refresh
          </button>
        </div>
      </div>
      <OverviewCards data={responseData} isLoading={isLoading} />
    </div>
  );
};

const OverViewPage = () => (
  <DateRangeProvider>
    <OverviewContent />
  </DateRangeProvider>
);

export default OverViewPage;
