'use client';

import React from 'react';
import { useTenant } from '@/context/TenantContext';

interface PaymentFailureStatsProps {
  failedCount: number;
  failedPercentage: number;
}

const PaymentFailureStats: React.FC<PaymentFailureStatsProps> = ({
  failedCount,
  failedPercentage,
}) => {
  const { tenantConfig } = useTenant();
  const c = tenantConfig.colors;

  return (
    <div
      className="rounded-2xl bg-white h-full flex flex-col"
      style={{ border: `1.5px solid ${c.border}`, boxShadow: '0 1px 6px 0 rgba(0,0,0,0.05)' }}
    >
      {/* Header */}
      <div className="px-5 pt-5 pb-4 flex items-center gap-2">
        <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: '#FEE2E2' }}>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#EF4444" strokeWidth="2">
            <circle cx="12" cy="12" r="10" />
            <line x1="15" y1="9" x2="9" y2="15" />
            <line x1="9" y1="9" x2="15" y2="15" />
          </svg>
        </div>
        <h3 className="text-base font-bold" style={{ color: c.text }}>Average Failures</h3>
      </div>

      {/* Stat rows */}
      <div className="flex-1 divide-y px-5 pb-5 space-y-0" style={{ borderColor: c.border }}>
        <StatRow
          icon={
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#EF4444" strokeWidth="2">
              <line x1="18" y1="20" x2="18" y2="10" />
              <line x1="12" y1="20" x2="12" y2="4" />
              <line x1="6" y1="20" x2="6" y2="14" />
            </svg>
          }
          iconBg="#FEE2E2"
          label="Failed Transactions"
          value={String(failedCount)}
          valueColor="#EF4444"
          c={c}
        />
        <div style={{ height: 12 }} />
        <StatRow
          icon={
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#EF4444" strokeWidth="2">
              <polyline points="23 18 13.5 8.5 8.5 13.5 1 6" />
              <polyline points="17 18 23 18 23 12" />
            </svg>
          }
          iconBg="#FEE2E2"
          label="Current Week"
          value={`${failedPercentage}%`}
          valueColor="#EF4444"
          badge="▼ down"
          badgeBg="#FEF2F2"
          badgeColor="#DC2626"
          c={c}
        />
      </div>

      {/* Footer */}
      <div
        className="px-5 py-3 flex items-center gap-1.5 text-xs rounded-b-2xl border-t"
        style={{ borderColor: c.border, background: c.background, color: c.textMuted }}
      >
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="10" />
          <polyline points="12 6 12 12 16 14" />
        </svg>
        Data updated just now
      </div>
    </div>
  );
};

const StatRow = ({
  icon,
  iconBg,
  label,
  value,
  valueColor,
  badge,
  badgeBg,
  badgeColor,
  c,
}: {
  icon: React.ReactNode;
  iconBg: string;
  label: string;
  value: string;
  valueColor: string;
  badge?: string;
  badgeBg?: string;
  badgeColor?: string;
  c: any;
}) => (
  <div className="flex items-center gap-3 py-4">
    <div className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: iconBg }}>
      {icon}
    </div>
    <div className="flex-1 min-w-0">
      <p className="text-xs mb-0.5" style={{ color: c.textMuted }}>{label}</p>
      <p className="text-2xl font-bold" style={{ color: valueColor }}>{value}</p>
    </div>
    {badge && (
      <span
        className="text-xs font-medium px-2 py-0.5 rounded-full"
        style={{ background: badgeBg, color: badgeColor }}
      >
        {badge}
      </span>
    )}
  </div>
);

export default PaymentFailureStats;
