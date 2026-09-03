'use client';
import React, { createContext, useContext, useState } from 'react';

export type DateRangeType =
  | 'today'
  | 'last7days'
  | 'thisMonth'
  | 'lastMonth'
  | 'custom';

interface DateRange {
  startDate: Date;
  endDate: Date;
  type: DateRangeType;
  label: string;
}

interface DateRangeContextType {
  dateRange: DateRange;
  setDateRange: (range: DateRange) => void;
}

const DateRangeContext = createContext<DateRangeContextType | undefined>(
  undefined,
);

export const useDateRange = () => {
  const context = useContext(DateRangeContext);
  if (!context) {
    throw new Error('useDateRange must be used within a DateRangeProvider');
  }
  return context;
};

export const DateRangeProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [dateRange, setDateRange] = useState<DateRange>({
    startDate: new Date(),
    endDate: new Date(),
    type: 'today',
    label: 'Today',
  });

  return (
    <DateRangeContext.Provider value={{ dateRange, setDateRange }}>
      {children}
    </DateRangeContext.Provider>
  );
};
