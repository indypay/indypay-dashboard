'use client';
import React from 'react';
import { Card } from 'antd';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { DashboardApiResponse } from '@/lib/interfaces/dashboard.interface';
import { formatAmount } from '@/lib/utils/utils';

interface TransactionGraphsProps {
  data: DashboardApiResponse[] | null;
  isLoading: boolean;
}

export const TransactionGraphs: React.FC<TransactionGraphsProps> = ({
  data,
  isLoading,
}) => {
  const sections = ['payin', 'payout', 'settlement'] as const;
  const sectionTitles = {
    payin: 'PayIn Transactions',
    payout: 'PayOut Transactions',
    settlement: 'Settlement Transactions',
  };

  type GraphDataType = Record<
    (typeof sections)[number],
    Array<{ name: string; count: number; amount: number }>
  >;

  const graphData = React.useMemo(() => {
    if (!data || !data[0]?.data)
      return sections.reduce((acc, section) => {
        acc[section] = [];
        return acc;
      }, {} as GraphDataType);

    return sections.reduce(
      (acc, section) => {
        const sectionData = data[0].data[section];
        acc[section] = [
          {
            name: 'Initiated',
            count: sectionData.totalCount || 0,
            amount: sectionData.totalAmount || 0,
          },
          {
            name: 'Success',
            count: sectionData.successCount || 0,
            amount: sectionData.successAmount || 0,
          },
          {
            name: 'Failed',
            count: sectionData.failedCount || 0,
            amount: sectionData.failedAmount || 0,
          },
        ];
        return acc;
      },
      {} as Record<
        (typeof sections)[number],
        Array<{ name: string; count: number; amount: number }>
      >,
    );
  }, [data]);

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div
          style={{
            background: '#FFFFFF',
            padding: '16px',
            border: '1px solid #83BFA7',
            borderRadius: '8px',
          }}
        >
          <p style={{ fontWeight: 600, color: 'var(--text)', marginBottom: '8px' }}>
            {label}
          </p>
          <p style={{ color: 'var(--secondary)', fontSize: '14px', margin: '4px 0' }}>
            Count: {payload[0].value}
          </p>
          <p style={{ color: '#0DD25F', fontSize: '14px', margin: '4px 0' }}>
            Amount: {formatAmount(payload[1].value)}
          </p>
        </div>
      );
    }
    return null;
  };

  if (isLoading) {
    return (
      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '16px' }}>
        {sections.map((section) => (
          <div
            key={section}
            style={{
              background: 'linear-gradient(to right, var(--border), var(--primary))',
              borderRadius: '12px',
              padding: '2px',
            }}
          >
            <Card
              style={{
                width: '100%',
                height: '400px',
                background: '#FFFFFF',
                borderRadius: '10px',
                border: 'none',
              }}
              loading
            />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '16px' }}>
      {sections.map((section) => (
        <div
          key={section}
          style={{
            background: 'linear-gradient(to right, var(--border), var(--primary))',
            borderRadius: '12px',
            padding: '2px',
          }}
        >
          <Card
            style={{
              background: '#FFFFFF',
              borderRadius: '10px',
              border: 'none',
            }}
            styles={{
              body: { padding: '24px' },
            }}
            title={
              <h3
                style={{
                  fontSize: '18px',
                  fontWeight: 600,
                  color: 'var(--secondary)',
                  margin: 0,
                }}
              >
                {sectionTitles[section]}
              </h3>
            }
          >
            <div style={{ width: '100%', height: '400px' }}>
              <ResponsiveContainer>
                <LineChart
                  data={graphData[section]}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#4E4E4E" />
                  <XAxis dataKey="name" stroke="#95A19D" />
                  <YAxis yAxisId="left" orientation="left" stroke="#30F3BC" />
                  <YAxis
                    yAxisId="right"
                    orientation="right"
                    stroke="#0DD25F"
                    tickFormatter={(value) => formatAmount(value)}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                  <Line
                    yAxisId="left"
                    type="monotone"
                    dataKey="count"
                    name="Count"
                    stroke="#30F3BC"
                    strokeWidth={2}
                    activeDot={{ r: 8 }}
                  />
                  <Line
                    yAxisId="right"
                    type="monotone"
                    dataKey="amount"
                    name="Amount"
                    stroke="#0DD25F"
                    strokeWidth={2}
                    activeDot={{ r: 8 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </div>
      ))}
    </div>
  );
};

export default TransactionGraphs;
