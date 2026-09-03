'use client';

import React from 'react';
import { useTenant } from '@/context/TenantContext';

interface InsightsProps {
  totalSuccessRate: number;
  totalTransactions: number;
  highestMethodRate: string;
  lowestMethodRate: string;
  comparisonPeriod: string;
}

export const BusinessTrendsInsights: React.FC<InsightsProps> = ({
  totalSuccessRate,
  totalTransactions,
  highestMethodRate,
  lowestMethodRate,
  comparisonPeriod,
}) => {
  const { tenantConfig } = useTenant();
  const c = tenantConfig.colors;

  return (
    <div
      className="rounded-2xl bg-white h-full flex flex-col"
      style={{ border: `1.5px solid ${c.border}`, boxShadow: '0 1px 6px 0 rgba(0,0,0,0.05)' }}
    >
      {/* Header */}
      <div className="px-5 pt-5 pb-4">
        <div className="flex items-center gap-2 mb-1">
          <SparkleIcon color={c.primary} />
          <span className="text-base font-bold" style={{ color: c.text }}>Insights</span>
        </div>
        <p className="text-xs" style={{ color: c.textMuted }}>{comparisonPeriod}</p>
      </div>

      {/* Metric rows */}
      <div className="flex-1 divide-y" style={{ borderColor: c.border }}>
        <InsightRow
          icon={<TargetIcon color={c.primary} />}
          iconBg={`${c.primary}15`}
          label="Total Success Rate"
          value={`${totalSuccessRate}%`}
          change={`— ${totalSuccessRate}%`}
          c={c}
        />
        <InsightRow
          icon={<DocIcon color={c.primary} />}
          iconBg={`${c.primary}15`}
          label="Total Number of Transactions"
          value={String(totalTransactions)}
          change={`— ${totalTransactions}`}
          c={c}
        />
        <InsightRow
          icon={<TrendUpIcon color={c.primary} />}
          iconBg={`${c.primary}15`}
          label="Highest Payment Method Success Rate"
          value={highestMethodRate || '—'}
          change="—"
          c={c}
        />
        <InsightRow
          icon={<TrendDownIcon />}
          iconBg="#FEE2E2"
          label="Lowest Payment Method Success Rate"
          value={lowestMethodRate || '—'}
          change="—"
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

const InsightRow = ({
  icon,
  iconBg,
  label,
  value,
  change,
  c,
}: {
  icon: React.ReactNode;
  iconBg: string;
  label: string;
  value: string;
  change: string;
  c: any;
}) => (
  <div className="flex items-center gap-3 px-5 py-4">
    <div
      className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0"
      style={{ background: iconBg }}
    >
      {icon}
    </div>
    <div className="flex-1 min-w-0">
      <p className="text-xs mb-0.5" style={{ color: c.textMuted }}>{label}</p>
      <p className="text-base font-bold" style={{ color: c.text }}>{value}</p>
    </div>
    <span className="text-xs font-medium whitespace-nowrap" style={{ color: c.textMuted }}>
      {change}
    </span>
  </div>
);

// ── Inline SVG icons ──────────────────────────────────────────────────────────

const SparkleIcon = ({ color }: { color: string }) => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill={color}>
    <path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6z" />
  </svg>
);

const TargetIcon = ({ color }: { color: string }) => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2">
    <circle cx="12" cy="12" r="10" />
    <circle cx="12" cy="12" r="6" />
    <circle cx="12" cy="12" r="2" />
  </svg>
);

const DocIcon = ({ color }: { color: string }) => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
    <polyline points="14 2 14 8 20 8" />
    <line x1="8" y1="13" x2="16" y2="13" />
    <line x1="8" y1="17" x2="16" y2="17" />
  </svg>
);

const TrendUpIcon = ({ color }: { color: string }) => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2">
    <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
    <polyline points="17 6 23 6 23 12" />
  </svg>
);

const TrendDownIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#EF4444" strokeWidth="2">
    <polyline points="23 18 13.5 8.5 8.5 13.5 1 6" />
    <polyline points="17 18 23 18 23 12" />
  </svg>
);
