'use client';

import React, { useState, useEffect } from 'react';
import { useDateRange } from '../../components/DateRangeContext';
import {
  TransactionData,
  TableData,
  BusinessTrendsState,
} from '@/lib/interfaces/analytics.interface';
import { useBusinessTrends } from '@/lib/hooks/useAnalyticsData';
import { formatDateForAPI } from '@/lib/utils/date.utils';
import { BusinessTrendsGraph } from './components/BusinessTrendsGraph';
import { BusinessTrendsInsights } from './components/BusinessTrendsInsights';
import { BusinessTrendsTable } from './components/BusinessTrendsTable';
import BusinessTrendsSimmer from './components/BusinessTrendsSimmer';
import { analyzeBusinessTrends } from '@/lib/actions/ai-analytics';
import { FailureDiagnosisResult } from '@/lib/actions/ai-diagnose';
import { AIInsightCard } from '@/lib/components/AIInsightCard/AIInsightCard';

const initialState: BusinessTrendsState = {
  summary: {
    successfulTransactionsRate: 0,
    numberOfSuccessfulTransactions: 0,
    volumeOfTransactions: 0,
  },
  insights: {
    successRate: 0,
    numberOfTransactions: 0,
    highestPaymentMethodSuccessRate: '',
    lowestPaymentMethod: '',
    totalSuccessGrossVolume: 0,
  },
  tableData: [],
};

const BusinessTrendsPage = () => {
  const { dateRange } = useDateRange();
  const [error, setError] = useState<string | null>(null);
  const [businessTrends, setBusinessTrends] =
    useState<BusinessTrendsState>(initialState);
  const [diagnosis, setDiagnosis] = useState<FailureDiagnosisResult | null>(null);
const [isDiagnosing, setIsDiagnosing] = useState(false);
  const startDate = formatDateForAPI(dateRange.startDate);
  const endDate = formatDateForAPI(dateRange.endDate);

  const { data, isLoading, refetch } = useBusinessTrends(startDate, endDate);

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
        'data' in trendsData &&
        trendsData.data
      ) {
        const nestedData = trendsData.data;
        if (
          typeof nestedData === 'object' &&
          'data' in nestedData &&
          nestedData.data
        ) {
          const transactionData = nestedData.data as TransactionData;

          setBusinessTrends({
            summary: {
              successfulTransactionsRate:
                transactionData.summary.successfulTransactionsRate,
              numberOfSuccessfulTransactions:
                transactionData.summary.numberOfSuccessfulTransactions,
              volumeOfTransactions:
                transactionData.summary.volumeOfTransactions,
            },
            insights: {
              successRate: transactionData.insights.successRate,
              numberOfTransactions:
                transactionData.insights.numberOfTransactions,
              highestPaymentMethodSuccessRate:
                transactionData.insights.highestPaymentMethodSuccessRate,
              lowestPaymentMethod: transactionData.insights.lowestPaymentMethod,
              totalSuccessGrossVolume:
                transactionData.insights.totalSuccessGrossVolume,
            },
            tableData: transactionData.tableData,
          });
          setError(null);
          setIsDiagnosing(true);
          analyzeBusinessTrends({
            successRate: transactionData.insights.successRate,
            numberOfTransactions: transactionData.insights.numberOfTransactions,
            volumeOfTransactions: transactionData.summary.volumeOfTransactions,
            highestPaymentMethod: transactionData.insights.highestPaymentMethodSuccessRate,
            lowestPaymentMethod: transactionData.insights.lowestPaymentMethod,
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
    }
  }, [data]);

  if (isLoading) {
    return <BusinessTrendsSimmer />;
  }

  if (error) {
    return (
      <div className="py-4">
        <h2 className="text-xl font-semibold mb-4 text-primary-dark-green">
          Business Trends
        </h2>
        <div className="text-error">{error}</div>
      </div>
    );
  }

  const { summary, insights, tableData } = businessTrends;

  const vsTime = dateRange.startDate.toLocaleTimeString();
  const comparisonPeriod = `(in comparison to yesterday ${vsTime} to ${dateRange.endDate.toLocaleTimeString()})`;

  const rate = summary.successfulTransactionsRate;
  const txCount = summary.numberOfSuccessfulTransactions;
  const volume = summary.volumeOfTransactions;

  return (
    <div className="py-4">
      <h2 className="text-xl font-semibold mb-6 text-primary-dark-green">
        Business Trends
      </h2>

      {(diagnosis || isDiagnosing) && (
        <div className="mb-6">
          <AIInsightCard result={diagnosis ?? { summary: '', severity: 'low', suggestions: [] }} isLoading={isDiagnosing} />
        </div>
      )}

      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-8 space-y-5">
          <BusinessTrendsGraph
            title="Success Rate"
            value={rate}
            unit="%"
            icon={<TrendUpSVG />}
            vsYesterday={vsTime}
            successful={`${rate.toFixed(2)} (${rate.toFixed(2)}%)`}
            failed={`0 (0%)`}
            noData={`0 (0%)`}
            successSlice={rate}
            failedSlice={Math.max(0, 100 - rate)}
            noDataSlice={0}
            changeValue={`${rate.toFixed(2)}%`}
          />
          <BusinessTrendsGraph
            title="Number of Transactions"
            value={txCount}
            icon={<DocSVG />}
            vsYesterday={vsTime}
            successful={txCount}
            failed={0}
            noData={0}
            successSlice={txCount > 0 ? txCount : 0}
            failedSlice={0}
            noDataSlice={0}
            changeValue={String(txCount)}
          />
          <BusinessTrendsGraph
            title="Transaction Volume"
            value={volume}
            unit="₹"
            icon={<RupeeSVG />}
            vsYesterday={vsTime}
            successful={`₹${volume.toLocaleString()} (${volume > 0 ? '100' : '0'}%)`}
            failed={`₹0 (0%)`}
            noData={`₹0 (0%)`}
            successSlice={volume > 0 ? volume : 0}
            failedSlice={0}
            noDataSlice={0}
            changeValue={`₹${volume.toLocaleString()}`}
          />
        </div>

        <div className="col-span-4">
          <BusinessTrendsInsights
            totalSuccessRate={insights.successRate}
            totalTransactions={insights.numberOfTransactions}
            highestMethodRate={insights.highestPaymentMethodSuccessRate}
            lowestMethodRate={insights.lowestPaymentMethod}
            comparisonPeriod={comparisonPeriod}
          />
        </div>

        <div className="col-span-12">
          <BusinessTrendsTable data={tableData} />
        </div>
      </div>
    </div>
  );
};

const TrendUpSVG = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="2">
    <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
    <polyline points="17 6 23 6 23 12" />
  </svg>
);

const DocSVG = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="2">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
    <polyline points="14 2 14 8 20 8" />
    <line x1="8" y1="13" x2="16" y2="13" />
    <line x1="8" y1="17" x2="16" y2="17" />
  </svg>
);

const RupeeSVG = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="2">
    <path d="M6 3h12M6 8h12M6 13l8.5 8L18 8" />
  </svg>
);

export default BusinessTrendsPage;
