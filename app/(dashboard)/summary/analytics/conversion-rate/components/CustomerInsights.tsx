'use client';

import React from 'react';
import { useTenant } from '@/context/TenantContext';

const MetricCard = ({
  title,
  items,
  icon,
  iconBg,
  c,
}: {
  title: string;
  items: { label: string; value: string }[];
  icon: React.ReactNode;
  iconBg: string;
  c: any;
}) => (
  <div
    className="rounded-2xl bg-white p-5"
    style={{ border: `1.5px solid ${c.border}`, boxShadow: '0 1px 6px 0 rgba(0,0,0,0.05)' }}
  >
    <div className="flex items-center gap-2 mb-4">
      <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: iconBg }}>
        {icon}
      </div>
      <p className="text-sm font-semibold" style={{ color: c.text }}>{title}</p>
    </div>
    <div className="flex gap-6">
      {items.map((item, i) => (
        <div key={i} className="flex-1 text-center">
          <p className="text-2xl font-bold" style={{ color: c.primary }}>{item.value}</p>
          <p className="text-xs mt-1" style={{ color: c.textMuted }}>{item.label}</p>
        </div>
      ))}
    </div>
  </div>
);

const CustomerInsights = () => {
  const { tenantConfig } = useTenant();
  const c = tenantConfig.colors;

  const customerIcon = (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke={c.primary} strokeWidth="2">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  );

  const retryIcon = (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke={c.primary} strokeWidth="2">
      <polyline points="1 4 1 10 7 10" />
      <path d="M3.51 15a9 9 0 1 0 .49-3.18" />
    </svg>
  );

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: `${c.primary}18` }}>
          {customerIcon}
        </div>
        <h4 className="text-base font-bold" style={{ color: c.text }}>Customer Insights</h4>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <MetricCard
          title="Unique Customers"
          items={[
            { label: 'Last 7 Days', value: '0%' },
            { label: 'Last 30 Days', value: '0%' },
          ]}
          icon={customerIcon}
          iconBg={`${c.primary}18`}
          c={c}
        />
        <MetricCard
          title="Repeat Customers"
          items={[
            { label: 'Last 7 Days', value: '0%' },
            { label: 'Last 30 Days', value: '0%' },
          ]}
          icon={customerIcon}
          iconBg={`${c.primary}18`}
          c={c}
        />
      </div>

      <div className="flex items-center gap-2 pt-2">
        <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: `${c.primary}18` }}>
          {retryIcon}
        </div>
        <h4 className="text-base font-bold" style={{ color: c.text }}>Auto Retry</h4>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <MetricCard
          title="Auto Retry Transactions"
          items={[
            { label: 'Last 7 Days (GMV — 0)', value: '0%' },
            { label: 'Last 30 Days (GMV — 0)', value: '0%' },
          ]}
          icon={retryIcon}
          iconBg={`${c.primary}18`}
          c={c}
        />
        <MetricCard
          title="Successful after Auto Retry"
          items={[
            { label: 'Last 7 Days (GMV — 0)', value: '0%' },
            { label: 'Last 30 Days (GMV — 0)', value: '0%' },
          ]}
          icon={retryIcon}
          iconBg={`${c.primary}18`}
          c={c}
        />
      </div>
    </div>
  );
};

export default CustomerInsights;
