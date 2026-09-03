'use client';

import React from 'react';
import { useTenant } from '@/context/TenantContext';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
} from 'recharts';

interface PaymentFunnelReportProps {
  numberOfOrdersCreated: number;
  numberOfOrdersAttempted: number;
  numberOfOrdersPaid: number;
  successPayinAmount: number;
  failedPayinAmount: number;
}

const PaymentFunnelReport: React.FC<PaymentFunnelReportProps> = ({
  numberOfOrdersCreated,
  numberOfOrdersAttempted,
  numberOfOrdersPaid,
  successPayinAmount,
  failedPayinAmount,
}) => {
  const { tenantConfig } = useTenant();
  const c = tenantConfig.colors;

  const funnelData = [
    {
      name: 'Created',
      count: numberOfOrdersCreated,
      percentage: 100,
    },
    {
      name: 'Attempted',
      count: Math.round((numberOfOrdersAttempted * numberOfOrdersCreated) / 100),
      percentage: numberOfOrdersAttempted,
    },
    {
      name: 'Paid',
      count: Math.round((numberOfOrdersPaid * numberOfOrdersCreated) / 100),
      percentage: numberOfOrdersPaid,
    },
  ];

  const paymentData = [
    { name: 'Successful', amount: Number(successPayinAmount) || 0 },
    { name: 'Failed', amount: Number(failedPayinAmount) || 0 },
  ];

  const stats = [
    { label: 'Orders Created', value: numberOfOrdersCreated, format: 'count' as const },
    { label: 'Attempt Rate', value: numberOfOrdersAttempted, format: 'pct' as const },
    { label: 'Success Rate', value: numberOfOrdersPaid, format: 'pct' as const },
  ];

  return (
    <div
      className="rounded-2xl bg-white overflow-hidden"
      style={{ border: `1.5px solid ${c.border}`, boxShadow: '0 1px 6px 0 rgba(0,0,0,0.05)' }}
    >
      {/* Header */}
      <div className="px-6 pt-5 pb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center"
            style={{ background: `${c.primary}18` }}
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke={c.primary} strokeWidth="2">
              <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
            </svg>
          </div>
          <div>
            <h4 className="text-base font-bold" style={{ color: c.text }}>Payment Funnel Report</h4>
            <p className="text-xs mt-0.5" style={{ color: c.textMuted }}>All Payments · Updated just now</p>
          </div>
        </div>
      </div>

      <div className="px-6 pb-6 space-y-6">
        {/* Order Funnel Chart */}
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide mb-3" style={{ color: c.textMuted }}>Order Funnel</p>
          <div className="h-[180px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={funnelData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={c.border} />
                <XAxis dataKey="name" tick={{ fontSize: 12, fill: c.textMuted }} axisLine={false} tickLine={false} />
                <YAxis yAxisId="count" orientation="left" tick={{ fontSize: 11, fill: c.textMuted }} axisLine={false} tickLine={false} />
                <YAxis yAxisId="pct" orientation="right" unit="%" tick={{ fontSize: 11, fill: c.textMuted }} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{ borderRadius: 10, border: `1px solid ${c.border}`, fontSize: 12 }}
                  formatter={(value, name) => name === 'count' ? [`${value} orders`, 'Count'] : [`${value}%`, 'Rate']}
                />
                <Bar yAxisId="count" dataKey="count" fill={c.primary} radius={[6, 6, 0, 0]} maxBarSize={48} />
                <Bar yAxisId="pct" dataKey="percentage" fill={`${c.primary}50`} radius={[6, 6, 0, 0]} maxBarSize={48} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Payment Amount Chart */}
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide mb-3" style={{ color: c.textMuted }}>Payment Amounts</p>
          <div className="h-[160px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={paymentData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={c.border} />
                <XAxis dataKey="name" tick={{ fontSize: 12, fill: c.textMuted }} axisLine={false} tickLine={false} />
                <YAxis tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}K`} tick={{ fontSize: 11, fill: c.textMuted }} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{ borderRadius: 10, border: `1px solid ${c.border}`, fontSize: 12 }}
                  formatter={(v) => [`₹${Number(v).toLocaleString()}`, 'Amount']}
                />
                <Bar dataKey="amount" radius={[6, 6, 0, 0]} maxBarSize={64}
                  fill="url(#amountGradient)"
                />
                <defs>
                  <linearGradient id="amountGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={c.primary} />
                    <stop offset="100%" stopColor={`${c.primary}80`} />
                  </linearGradient>
                </defs>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Bottom stats grid */}
        <div className="grid grid-cols-2 gap-4">
          {/* Order Statistics */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide mb-2" style={{ color: c.textMuted }}>Order Statistics</p>
            <div className="grid grid-cols-3 gap-2">
              {stats.map((item) => (
                <div
                  key={item.label}
                  className="rounded-xl p-3 text-center"
                  style={{ background: `${c.primary}08`, border: `1px solid ${c.border}` }}
                >
                  <p className="text-xs mb-1" style={{ color: c.textMuted }}>{item.label}</p>
                  <p className="text-base font-bold" style={{ color: c.text }}>
                    {item.format === 'pct' ? `${item.value.toFixed(1)}%` : item.value}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Payment Statistics */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide mb-2" style={{ color: c.textMuted }}>Payment Statistics</p>
            <div className="grid grid-cols-2 gap-2">
              <div className="rounded-xl p-3 text-center" style={{ background: '#F0FDF4', border: '1px solid #BBF7D0' }}>
                <p className="text-xs mb-1 text-green-600">Successful</p>
                <p className="text-base font-bold text-green-700">
                  ₹{(Number(successPayinAmount) || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </p>
              </div>
              <div className="rounded-xl p-3 text-center" style={{ background: '#FFF5F5', border: '1px solid #FECACA' }}>
                <p className="text-xs mb-1 text-red-500">Failed</p>
                <p className="text-base font-bold text-red-600">
                  ₹{(Number(failedPayinAmount) || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentFunnelReport;
