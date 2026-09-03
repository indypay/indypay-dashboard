'use client';

import React, { useEffect, useState } from 'react';
import { useDateRange } from '../../components/DateRangeContext';
import PaymentFailureShimmer from './components/PaymentFailureShimmer';
import PaymentFailureChart from './components/PaymentFailureChart';
import PaymentFailureStats from './components/PaymentFailureStats';
import PaymentFailureTable from './components/PaymentFailureTable';
import { usePaymentFailure } from '@/lib/hooks/useAnalyticsData';
import { formatDateForAPI } from '@/lib/utils/date.utils';
import { FailedOrdersState } from '@/lib/interfaces/analytics.interface';
import { diagnosePaymentFailures, FailureDiagnosisResult } from '@/lib/actions/ai-diagnose';
import { AIInsightCard } from '@/lib/components/AIInsightCard/AIInsightCard';

interface FailedOrdersResponse {
  failedAnalytics: {
    failedVolume: number;
    failedCount: number;
    failedPercentage: number;
  };
}

const initialState: FailedOrdersState = {
  data: {
    failedVolume: 0,
    failedCount: 0,
    failedPercentage: 0,
  },
};

const PaymentFailurePage = () => {
  const { dateRange } = useDateRange();
  const [error, setError] = useState<string | null>(null);
  const [failedOrders, setFailedOrders] = useState<FailedOrdersState>(initialState);
  const [diagnosis, setDiagnosis] = useState<FailureDiagnosisResult | null>(null);
const [isDiagnosing, setIsDiagnosing] = useState(false);
  const startDate = formatDateForAPI(dateRange.startDate);
  const endDate = formatDateForAPI(dateRange.endDate);

  const { data, isLoading, refetch } = usePaymentFailure(startDate, endDate);

  useEffect(() => {
    refetch();
  }, [dateRange, refetch]);

  useEffect(() => {
    if (data) {
      const [trendsData, apiError] = data;

      if (apiError) {
        setError(apiError.message || 'Failed to fetch business trends data');
        return;
      }

      if (
        trendsData &&
        typeof trendsData === 'object' &&
        'data' in trendsData
      ) {
        const responseData = trendsData.data as unknown as FailedOrdersResponse;

        const formattedData = {
          failedVolume: Number(
            responseData.failedAnalytics.failedVolume || 0,
          ).toFixed(2),
          failedCount: Number(
            responseData.failedAnalytics.failedCount || 0,
          ).toFixed(0),
          failedPercentage: Number(
            responseData.failedAnalytics.failedPercentage || 0,
          ).toFixed(2),
        };

        const parsed = {
          failedVolume: parseFloat(formattedData.failedVolume),
          failedCount: parseInt(formattedData.failedCount),
          failedPercentage: parseFloat(formattedData.failedPercentage),
        };
        setFailedOrders({ data: parsed });
        setError(null);

        setIsDiagnosing(true);
        diagnosePaymentFailures({
          ...parsed,
          startDate,
          endDate,
        })
          .then((result) => setDiagnosis(result))
          .catch((err) => {
            console.error('AI diagnosis failed:', err);
            setDiagnosis(null);
          })
          .finally(() => setIsDiagnosing(false));
      }
    }
  }, [data]);

  if (isLoading) {
    return <PaymentFailureShimmer />;
  }

  if (error) {
    return (
      <div className="py-4">
        <h2 className="text-xl font-semibold mb-4 text-primary-dark-green">
          Payment Failure Analysis
        </h2>
        <div className="text-error">{error}</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {(diagnosis || isDiagnosing) && (
        <AIInsightCard result={diagnosis ?? { summary: '', severity: 'low', suggestions: [] }} isLoading={isDiagnosing} />
      )}

      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-12 lg:col-span-8">
          <PaymentFailureChart
            failedPercentage={failedOrders.data.failedPercentage}
          />
        </div>

        <div className="col-span-12 lg:col-span-4">
          <PaymentFailureStats
            failedCount={failedOrders.data.failedCount}
            failedPercentage={failedOrders.data.failedPercentage}
          />
        </div>

        <div className="col-span-12">
          <PaymentFailureTable />
        </div>
      </div>
    </div>
  );
};

export default PaymentFailurePage;
