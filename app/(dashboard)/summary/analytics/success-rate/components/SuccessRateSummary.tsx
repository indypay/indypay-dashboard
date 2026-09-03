'use client';

import React from 'react';
import { useTenant } from '@/context/TenantContext';

interface SummaryData {
  paymentMode: string;
  transactionCount: number;
  successRate: number;
  userDeclines: number;
  bankDeclines: number;
  RupeeFlowDeclines: number;
}

interface SuccessRateSummaryProps {
  data: SummaryData[];
}

const SuccessRateSummary: React.FC<SuccessRateSummaryProps> = ({ data }) => {
  const { tenantConfig } = useTenant();
  const c = tenantConfig.colors;

  return (
    <div
      className="rounded-2xl bg-white overflow-hidden"
      style={{ border: `1.5px solid ${c.border}`, boxShadow: '0 1px 6px 0 rgba(0,0,0,0.05)' }}
    >
      <div className="px-6 pt-5 pb-4 flex items-center gap-2">
        <div
          className="w-8 h-8 rounded-lg flex items-center justify-center"
          style={{ background: `${c.primary}18` }}
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke={c.primary} strokeWidth="2">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
            <polyline points="14 2 14 8 20 8" />
            <line x1="8" y1="13" x2="16" y2="13" />
            <line x1="8" y1="17" x2="16" y2="17" />
          </svg>
        </div>
        <h2 className="text-base font-bold" style={{ color: c.text }}>Summary</h2>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead>
            <tr style={{ borderBottom: `1px solid ${c.border}`, background: c.background }}>
              {['Payment Mode', 'Transaction Count', 'Success Rate', 'User Declines', 'Bank Declines'].map((h) => (
                <th key={h} className="text-left px-5 py-3 text-xs font-semibold uppercase tracking-wide" style={{ color: c.textMuted }}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data && data.length > 0 ? (
              data.map((row, index) => (
                <tr
                  key={index}
                  style={{ borderBottom: `1px solid ${c.border}` }}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="px-5 py-3.5 text-sm font-medium" style={{ color: c.text }}>{row.paymentMode}</td>
                  <td className="px-5 py-3.5 text-sm" style={{ color: c.text }}>{row.transactionCount}</td>
                  <td className="px-5 py-3.5 text-sm">
                    <span
                      className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold"
                      style={{ background: `${c.primary}15`, color: c.primary }}
                    >
                      {row.successRate.toFixed(2)}%
                    </span>
                  </td>
                  <td className="px-5 py-3.5 text-sm">
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-700">
                      {row.userDeclines.toFixed(2)}%
                    </span>
                  </td>
                  <td className="px-5 py-3.5 text-sm">
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-red-50 text-red-600">
                      {row.bankDeclines.toFixed(2)}%
                    </span>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="text-center py-12">
                  <div className="flex flex-col items-center gap-2" style={{ color: c.textMuted }}>
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" opacity="0.4">
                      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                    </svg>
                    <span className="text-sm">No results found</span>
                  </div>
                </td>
              </tr>
            )}
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

export default SuccessRateSummary;
