'use client';

import React, { useEffect, useState } from 'react';
import { useDateRange } from '../../components/DateRangeContext';
import { usePaymentSuccess } from '@/lib/hooks/useAnalyticsData';
import { formatDateForAPI } from '@/lib/utils/date.utils';
import {
  SuccessAnalyticsResponse,
  SuccessAnalyticsState,
  SuccessSummaryAnalytics,
} from '@/lib/interfaces/analytics.interface';
import SuccessRateStats from './components/SuccessRateStats';
import SuccessRateChart from './components/SuccessRateChart';
import SuccessRateSummary from './components/SuccessRateSummary';
import SuccessRateShimmer from './components/SuccessRateShimmer';
import { analyzeSuccessRate } from '@/lib/actions/ai-analytics';
import { FailureDiagnosisResult } from '@/lib/actions/ai-diagnose';
import { AIInsightCard } from '@/lib/components/AIInsightCard/AIInsightCard';

const SuccessRatePage = () => {
  const { dateRange } = useDateRange();
  const [error, setError] = useState<string | null>(null);
  const [successData, setSuccessData] = useState<SuccessAnalyticsState | null>(
    null,
  );
  const [systemHealth, setSystemHealth] = useState<any>(null);
  const [summaryData, setSummaryData] = useState<SuccessSummaryAnalytics[]>([]);
  const [diagnosis, setDiagnosis] = useState<FailureDiagnosisResult | null>(null);
const [isDiagnosing, setIsDiagnosing] = useState(false);
  const startDate = formatDateForAPI(dateRange.startDate);
  const endDate = formatDateForAPI(dateRange.endDate);

  const { data, isLoading, refetch } = usePaymentSuccess(startDate, endDate);

  useEffect(() => {
    refetch();
  }, [dateRange, refetch]);

  useEffect(() => {
    if (data) {
      const [responseData, apiError] = data;

      if (apiError) {
        setError(apiError.message || 'Failed to fetch success rate data');
        return;
      }

      if (
        responseData &&
        typeof responseData === 'object' &&
        'data' in responseData
      ) {
        const analyticsData =
          responseData as unknown as SuccessAnalyticsResponse;

        if (analyticsData.success) {
          setSuccessData(analyticsData.data.successAnalytics);
          setSystemHealth(analyticsData.data.systemHealth);
          setSummaryData([analyticsData.data.summary]);
          setError(null);
          setIsDiagnosing(true);
          analyzeSuccessRate({
            orderSuccessRate: analyticsData.data.successAnalytics.orderSuccessRate,
            transactionSuccessRate: analyticsData.data.successAnalytics.transactionSuccessRate,
            declineRate: analyticsData.data.successAnalytics.declineRate,
            uptime: analyticsData.data.systemHealth?.uptime?.percentage ?? 100,
            startDate,
            endDate,
          })
            .then((result) => setDiagnosis(result))
            .catch((err) => {
              console.error('AI diagnosis failed:', err);
              setDiagnosis(null);
            })
            .finally(() => setIsDiagnosing(false));
        } else {
          setError(
            analyticsData.message || 'Failed to fetch success rate data',
          );
        }
      }
    }
  }, [data]);

  if (isLoading) {
    return <SuccessRateShimmer />;
  }

  if (error) {
    return (
      <div className="py-4">
        <h2 className="text-xl font-semibold mb-4 text-primary-dark-green">
          Success Rate Analysis
        </h2>
        <div className="text-error">{error}</div>
      </div>
    );
  }

  if (!successData) {
    return null;
  }

  const chartData = [
    {
      date: dateRange.startDate.toLocaleDateString(),
      successRate: successData.transactionSuccessRate,
    },
  ];

  return (
    <div className="space-y-6">
      {(diagnosis || isDiagnosing) && (
        <AIInsightCard result={diagnosis ?? { summary: '', severity: 'low', suggestions: [] }} isLoading={isDiagnosing} />
      )}

      <SuccessRateStats
        orderSuccessRate={successData.orderSuccessRate}
        totalOrders={successData.successCount}
        transactionSuccessRate={successData.transactionSuccessRate}
        totalTransactions={successData.successCount}
        RupeeFlowPaymentsUptime={systemHealth?.uptime?.percentage || 0}
        userDeclinesRate={successData.declineRate}
        totalUserDeclines={0} // This might need to be added to the API response
      />

      <SuccessRateChart data={chartData} />

      <SuccessRateSummary
        data={summaryData.map((summary) => ({
          paymentMode: summary.paymentMode,
          transactionCount: summary.transactionCount,
          successRate: summary.successPercentage,
          userDeclines: summary.declinePercentage,
          bankDeclines: summary.bankDeclinePercentage,
          RupeeFlowDeclines: summary.RupeeFlowDeclinePercentage,
        }))}
      />
    </div>
  );
};

export default SuccessRatePage;
