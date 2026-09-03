'use client';

import React, { useEffect, useState} from 'react';
import { useDateRange } from '../../components/DateRangeContext';
import PaymentFunnelReport from './components/PaymentFunnelReport';
import ConversionRateChart from './components/ConversionRateChart';
import CustomerInsights from './components/CustomerInsights';
import { ConversionRateState } from '@/lib/interfaces/analytics.interface';
import ConversionRateShimmer from './components/ConversionRateShimmer';
import { useConversionRate } from '@/lib/hooks/useAnalyticsData';
import { formatDateForAPI } from '@/lib/utils/date.utils';
import { analyzeConversionRate } from '@/lib/actions/ai-analytics';
import { FailureDiagnosisResult } from '@/lib/actions/ai-diagnose';
import { AIInsightCard } from '@/lib/components/AIInsightCard/AIInsightCard';

interface ConversionRateResponse {
  conversionRate: {
    numberOfOrdersCreated: number;
    numberOfOrdersAttempted: number;
    numberOfOrdersPaid: number;
    ordersConversionRate: number;
    successPayinAmount: number;
    failedPayinAmount: number;
  };
}

const initialState: ConversionRateState = {
  data: {
    numberOfOrdersCreated: 0,
    numberOfOrdersAttempted: 0,
    numberOfOrdersPaid: 0,
    ordersConversionRate: 0,
    successPayinAmount: 0,
    failedPayinAmount: 0,
  },
};

const ConversionRatePage = () => {
  const { dateRange } = useDateRange();
  const [error, setError] = useState<string | null>(null);
  const [conversionRate, setConversionRate] =
    useState<ConversionRateState>(initialState);
  const [diagnosis, setDiagnosis] = useState<FailureDiagnosisResult | null>(null);
const [isDiagnosing, setIsDiagnosing] = useState(false);
  const startDate = formatDateForAPI(dateRange.startDate);
  const endDate = formatDateForAPI(dateRange.endDate);

  const { data, isLoading, refetch } = useConversionRate(startDate, endDate);

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
        const responseData =
          trendsData.data as unknown as ConversionRateResponse;

        const parsed = {
          numberOfOrdersCreated: Number(responseData.conversionRate.numberOfOrdersCreated || 0),
          numberOfOrdersAttempted: Number(responseData.conversionRate.numberOfOrdersAttempted || 0),
          numberOfOrdersPaid: Number(responseData.conversionRate.numberOfOrdersPaid || 0),
          ordersConversionRate: Number(responseData.conversionRate.ordersConversionRate || 0),
          successPayinAmount: Number(responseData.conversionRate.successPayinAmount || 0),
          failedPayinAmount: Number(responseData.conversionRate.failedPayinAmount || 0),
        };
        setConversionRate({ data: parsed });
        setError(null);
        setIsDiagnosing(true);
        analyzeConversionRate({ ...parsed, startDate, endDate })
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
    return <ConversionRateShimmer />;
  }

  if (error) {
    return (
      <div className="py-4">
        <h2 className="text-xl font-semibold mb-4 text-primary-dark-green">
          Conversion Rate
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
          <PaymentFunnelReport
            numberOfOrdersCreated={conversionRate.data.numberOfOrdersCreated}
            numberOfOrdersAttempted={
              conversionRate.data.numberOfOrdersAttempted
            }
            numberOfOrdersPaid={conversionRate.data.numberOfOrdersPaid}
            successPayinAmount={conversionRate.data.successPayinAmount}
            failedPayinAmount={conversionRate.data.failedPayinAmount}
          />
        </div>
        <div className="col-span-12 lg:col-span-4">
          <ConversionRateChart
            ordersConversionRate={conversionRate.data.ordersConversionRate}
          />
        </div>
        <div className="col-span-12">
          <CustomerInsights />
        </div>
      </div>
    </div>
  );
};

export default ConversionRatePage;
