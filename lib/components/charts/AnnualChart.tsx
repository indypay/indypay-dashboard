'use client';
import React from 'react';
import {
  LineChart,
  ResponsiveContainer,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  Line,
} from 'recharts';
import { useTheme } from 'next-themes';
import { safeAny } from '@/lib/interfaces/global.interface';

export default function AnnualChart({
  data,
  name,
}: {
  data: safeAny;
  name: string;
}) {
  const { theme } = useTheme();

  // Prepare the data for the chart
  const chartData = [
    {
      name: name === 'PayIn' ? 'Total Amount' : 'Total Amount',
      payin: data?.payin?.totalAmount ?? 0,
      payout: data?.payout?.totalAmount ?? 0,
    },
    {
      name: name === 'PayIn' ? 'Total Count' : 'Total Count',
      payin: data?.payin?.totalCount ?? 0,
      payout: data?.payout?.totalCount ?? 0,
    },
    {
      name: name === 'PayIn' ? 'Success Amount' : 'Success Amount',
      payin: data?.payin?.successAmount ?? 0,
      payout: data?.payout?.successAmount ?? 0,
    },
    {
      name: name === 'PayIn' ? 'Success Count' : 'Success Count',
      payin: data?.payin?.successCount ?? 0,
      payout: data?.payout?.successCount ?? 0,
    },
    {
      name: name === 'PayIn' ? 'Failed Amount' : 'Failed Amount',
      payin: data?.payin?.failedAmount ?? 0,
      payout: data?.payout?.failedAmount ?? 0,
    },
    {
      name: name === 'PayIn' ? 'Failed Count' : 'Failed Count',
      payin: data?.payin?.failedCount ?? 0,
      payout: data?.payout?.failedCount ?? 0,
    },
  ];

  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart
        data={chartData}
        margin={{
          top: 5,
          right: 30,
          left: 20,
          bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis
          dataKey="name"
          stroke={
            theme === 'light'
              ? 'hsl(270 66.67% 47.06%)'
              : 'hsl(212.02 100% 46.67%)'
          }
        />
        <YAxis
          stroke={
            theme === 'light'
              ? 'hsl(270 66.67% 47.06%)'
              : 'hsl(212.02 100% 46.67%)'
          }
        />
        <Tooltip />
        <Legend />
        <Line
          type="monotone"
          dataKey={name === 'PayIn' ? 'payin' : 'payout'}
          stroke="#8884d8"
          activeDot={{ r: 8 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
