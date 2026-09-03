'use client';

import React from 'react';
import TabNavigation from './TabNavigation';
import { DateRangeProvider } from '../components/DateRangeContext';
import { DateRangeSelector } from '../components/DateRangeSelector';

export default function AnalyticsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <DateRangeProvider>
      <div className="px-8 py-8 space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-primary-mint">Analytics</h1>
          <DateRangeSelector />
        </div>
        <TabNavigation />
        {children}
      </div>
    </DateRangeProvider>
  );
}
