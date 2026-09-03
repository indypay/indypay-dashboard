'use client';

import React, { useState } from 'react';
import { useTenant } from '@/context/TenantContext';

const PaymentFailureTable = () => {
  const { tenantConfig } = useTenant();
  const c = tenantConfig.colors;
  const [period, setPeriod] = useState('7');

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
            style={{ background: '#FEE2E2' }}
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#EF4444" strokeWidth="2">
              <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
              <line x1="12" y1="9" x2="12" y2="13" />
              <line x1="12" y1="17" x2="12.01" y2="17" />
            </svg>
          </div>
          <h3 className="text-base font-bold" style={{ color: c.text }}>Top Failure Reasons</h3>
        </div>
        <select
          value={period}
          onChange={(e) => setPeriod(e.target.value)}
          className="text-xs rounded-lg px-3 py-1.5 outline-none cursor-pointer"
          style={{ border: `1px solid ${c.border}`, color: c.textMuted, background: c.background }}
        >
          <option value="7">Last 7 days</option>
          <option value="30">Last 30 days</option>
          <option value="90">Last 90 days</option>
        </select>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr style={{ borderBottom: `1px solid ${c.border}`, background: c.background }}>
              {['Failure Description', 'Failure Source', 'Failure Rate', 'No. of Failures', 'Gateway', 'Payment Mode'].map((h) => (
                <th key={h} className="text-left px-5 py-3 text-xs font-semibold uppercase tracking-wide" style={{ color: c.textMuted }}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr>
              <td colSpan={6} className="py-14 text-center">
                <div className="flex flex-col items-center gap-2" style={{ color: c.textMuted }}>
                  <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" opacity="0.35">
                    <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                    <line x1="12" y1="9" x2="12" y2="13" />
                    <line x1="12" y1="17" x2="12.01" y2="17" />
                  </svg>
                  <span className="text-sm font-medium">No failure data found</span>
                  <span className="text-xs opacity-60">Try adjusting the date range</span>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div
        className="px-5 py-3 flex items-center gap-1.5 text-xs border-t"
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

export default PaymentFailureTable;
