'use client';

import React from 'react';
import { useTenant } from '@/context/TenantContext';

interface SuccessRateStatsProps {
  orderSuccessRate: number;
  totalOrders: number;
  transactionSuccessRate: number;
  totalTransactions: number;
  RupeeFlowPaymentsUptime: number;
  userDeclinesRate: number;
  totalUserDeclines: number;
}

const StatCard = ({
  icon,
  title,
  value,
  subtitle,
  iconBg,
  valueColor,
}: {
  icon: React.ReactNode;
  title: string;
  value: string;
  subtitle?: string;
  iconBg: string;
  valueColor: string;
}) => {
  const { tenantConfig } = useTenant();
  const c = tenantConfig.colors;
  return (
    <div
      className="rounded-2xl bg-white p-5 flex flex-col gap-3"
      style={{ border: `1.5px solid ${c.border}`, boxShadow: '0 1px 6px 0 rgba(0,0,0,0.05)' }}
    >
      <div className="flex items-center justify-between">
        <div
          className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{ background: iconBg }}
        >
          {icon}
        </div>
        <p className="text-2xl font-bold" style={{ color: valueColor }}>{value}</p>
      </div>
      <div>
        <p className="text-sm font-medium" style={{ color: c.text }}>{title}</p>
        {subtitle && <p className="text-xs mt-0.5" style={{ color: c.textMuted }}>{subtitle}</p>}
      </div>
    </div>
  );
};

const SuccessRateStats: React.FC<SuccessRateStatsProps> = ({
  orderSuccessRate,
  totalOrders,
  transactionSuccessRate,
  totalTransactions,
  RupeeFlowPaymentsUptime,
  userDeclinesRate,
  totalUserDeclines,
}) => {
  const { tenantConfig } = useTenant();
  const c = tenantConfig.colors;

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <StatCard
        icon={<TargetIcon color={c.primary} />}
        iconBg={`${c.primary}18`}
        title="Order Success Rate"
        value={`${orderSuccessRate.toFixed(2)}%`}
        subtitle={`Total Orders: ${totalOrders}`}
        valueColor={c.primary}
      />
      <StatCard
        icon={<TrendUpIcon color={c.primary} />}
        iconBg={`${c.primary}18`}
        title="Transaction Success Rate"
        value={transactionSuccessRate ? `${transactionSuccessRate.toFixed(2)}%` : 'N/A'}
        subtitle={`Total Transactions: ${totalTransactions}`}
        valueColor={c.primary}
      />
      <StatCard
        icon={<UptimeIcon color="#10B981" />}
        iconBg="#D1FAE5"
        title="Payments Uptime"
        value={RupeeFlowPaymentsUptime ? `${RupeeFlowPaymentsUptime.toFixed(2)}%` : 'N/A'}
        valueColor="#10B981"
      />
      <StatCard
        icon={<DeclineIcon />}
        iconBg="#FEE2E2"
        title="User Declines Rate"
        value={userDeclinesRate ? `${userDeclinesRate.toFixed(2)}%` : 'N/A'}
        subtitle={`Total Declines: ${totalUserDeclines}`}
        valueColor="#EF4444"
      />
    </div>
  );
};

const TargetIcon = ({ color }: { color: string }) => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2">
    <circle cx="12" cy="12" r="10" /><circle cx="12" cy="12" r="6" /><circle cx="12" cy="12" r="2" />
  </svg>
);

const TrendUpIcon = ({ color }: { color: string }) => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2">
    <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
    <polyline points="17 6 23 6 23 12" />
  </svg>
);

const UptimeIcon = ({ color }: { color: string }) => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2">
    <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
  </svg>
);

const DeclineIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#EF4444" strokeWidth="2">
    <polyline points="23 18 13.5 8.5 8.5 13.5 1 6" />
    <polyline points="17 18 23 18 23 12" />
  </svg>
);

export default SuccessRateStats;
