'use client';

import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { useTenant } from '@/context/TenantContext';

interface BusinessTrendsGraphProps {
  title: string;
  value: number;
  unit?: string;
  icon: React.ReactNode;
  iconBg?: string;
  vsYesterday?: string;
  successful: number | string;
  failed: number | string;
  noData: number | string;
  successfulLabel?: string;
  failedLabel?: string;
  noDataLabel?: string;
  changeLabel?: string;
  changeValue?: string;
  // raw numeric slices for the donut
  successSlice?: number;
  failedSlice?: number;
  noDataSlice?: number;
}

export const BusinessTrendsGraph: React.FC<BusinessTrendsGraphProps> = ({
  title,
  value,
  unit = '',
  icon,
  iconBg,
  vsYesterday,
  successful,
  failed,
  noData,
  successfulLabel,
  failedLabel,
  noDataLabel,
  changeLabel = 'No change compared to yesterday',
  changeValue,
  successSlice,
  failedSlice,
  noDataSlice,
}) => {
  const { tenantConfig } = useTenant();

  const formattedValue =
    unit === '%'
      ? `${value.toFixed(2)}%`
      : unit === '₹'
        ? `₹${value.toLocaleString()}`
        : value.toLocaleString();

  const centerLabel =
    unit === '%'
      ? `${value.toFixed(2)}%`
      : unit === '₹'
        ? `₹${value.toLocaleString()}`
        : value.toLocaleString();

  const badgeValue = changeValue ?? formattedValue;

  // Donut slices — fallback so the circle is never empty
  const sSlice = successSlice ?? (unit === '%' ? value : value > 0 ? value : 0);
  const fSlice = failedSlice ?? 0;
  const nSlice = noDataSlice ?? 0;
  const total = sSlice + fSlice + nSlice;
  const chartData =
    total > 0
      ? [
          { name: 'Successful', value: sSlice, color: tenantConfig.colors.primary },
          { name: 'Failed', value: fSlice, color: '#EF4444' },
          { name: 'No Data', value: nSlice, color: '#D1D5DB' },
        ]
      : [{ name: 'No Data', value: 100, color: '#E5E7EB' }];

  const bg = iconBg ?? `${tenantConfig.colors.primary}18`;

  return (
    <div
      className="rounded-2xl bg-white overflow-hidden"
      style={{ border: `1.5px solid ${tenantConfig.colors.border}`, boxShadow: '0 1px 6px 0 rgba(0,0,0,0.05)' }}
    >
      {/* Header */}
      <div className="flex items-start justify-between px-5 pt-5 pb-3">
        <div className="flex items-center gap-3">
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ background: bg }}
          >
            {icon}
          </div>
          <div>
            <p className="text-sm font-semibold" style={{ color: tenantConfig.colors.text }}>
              {title}
            </p>
            {vsYesterday && (
              <p className="text-xs mt-0.5" style={{ color: tenantConfig.colors.textMuted }}>
                vs yesterday {vsYesterday}
              </p>
            )}
          </div>
        </div>
        <p className="text-2xl font-bold" style={{ color: tenantConfig.colors.primary }}>
          {formattedValue}
        </p>
      </div>

      {/* Chart + Legend */}
      <div className="flex items-center px-5 pb-4 gap-4">
        {/* Donut */}
        <div className="relative w-[140px] h-[140px] flex-shrink-0">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius={46}
                outerRadius={66}
                paddingAngle={1}
                dataKey="value"
                startAngle={90}
                endAngle={-270}
                stroke="none"
              >
                {chartData.map((entry, index) => (
                  <Cell key={index} fill={entry.color} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          {/* Center label */}
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <p className="text-sm font-bold leading-tight" style={{ color: tenantConfig.colors.primary }}>
              {centerLabel}
            </p>
            <p className="text-[10px] leading-tight text-center mt-0.5" style={{ color: tenantConfig.colors.textMuted }}>
              {title}
            </p>
          </div>
        </div>

        {/* Legend */}
        <div className="flex-1 space-y-2.5">
          <LegendRow dot={tenantConfig.colors.primary} label="Successful" value={successfulLabel ?? String(successful)} />
          <LegendRow dot="#EF4444" label="Failed" value={failedLabel ?? String(failed)} />
          <LegendRow dot="#D1D5DB" label="No Data" value={noDataLabel ?? String(noData)} />
        </div>
      </div>

      {/* Footer */}
      <div
        className="flex items-center justify-between px-5 py-3 border-t"
        style={{ borderColor: tenantConfig.colors.border, background: `${tenantConfig.colors.background}` }}
      >
        <div className="flex items-center gap-1.5 text-xs" style={{ color: tenantConfig.colors.textMuted }}>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
            <polyline points="17 6 23 6 23 12" />
          </svg>
          {changeLabel}
        </div>
        <span
          className="text-xs font-semibold px-2.5 py-1 rounded-lg"
          style={{ background: `${tenantConfig.colors.primary}15`, color: tenantConfig.colors.primary }}
        >
          {badgeValue}
        </span>
      </div>
    </div>
  );
};

const LegendRow = ({ dot, label, value }: { dot: string; label: string; value: string }) => (
  <div className="flex items-center justify-between gap-2">
    <div className="flex items-center gap-2">
      <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: dot }} />
      <span className="text-xs text-gray-500">{label}</span>
    </div>
    <span className="text-xs font-medium text-gray-700">{value}</span>
  </div>
);
