'use client';
import { motion } from 'framer-motion';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import { useTenant } from '@/context/TenantContext';

export interface PaymentMethodData {
  method: string;
  amount: number;
}

export interface PaymentMethodChartProps {
  data: PaymentMethodData[];
  title?: string;
}

// Distinct segment colors — semantic, not brand-tied
const SEGMENT_COLORS = ['#6366F1', '#06B6D4', '#10B981', '#F59E0B', '#94A3B8'];

const CustomTooltip = ({ active, payload }: any) => {
  if (!active || !payload?.length) return null;
  const { method, amount, pct } = payload[0].payload;
  return (
    <div
      className="rounded-xl px-4 py-3 shadow-lg"
      style={{
        background: '#fff',
        border: '1px solid #E7D9FF',
        boxShadow: '0 8px 24px rgba(99,102,241,0.12)',
      }}
    >
      <p className="text-xs font-semibold mb-1" style={{ color: '#111827' }}>{method}</p>
      <p className="text-sm font-bold" style={{ color: '#6366F1' }}>
        ₹{amount.toLocaleString()}
      </p>
      <p className="text-xs" style={{ color: '#6B7280' }}>{pct}% of total</p>
    </div>
  );
};

const PaymentMethodChart = ({
  data,
  title = 'Collections by Payment Method',
}: PaymentMethodChartProps) => {
  const { tenantConfig } = useTenant();
  const { primary, border, surface, text, textMuted } = tenantConfig.colors;

  const total = data.reduce((s, d) => s + d.amount, 0);
  const pieData = data.map((d) => ({
    ...d,
    pct: total > 0 ? Math.round((d.amount / total) * 100) : 0,
  }));

  const hasData = total > 0;

  const formatTotal = (n: number) => {
    if (n >= 100000) return `₹${(n / 100000).toFixed(2)}L`;
    if (n >= 1000) return `₹${(n / 1000).toFixed(1)}k`;
    return `₹${n}`;
  };

  return (
    <motion.div
      style={{
        background: `linear-gradient(135deg, ${border}, ${primary})`,
        borderRadius: '16px',
        padding: '2px',
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
      }}
      whileHover={{
        y: -4,
        boxShadow: `0 20px 48px ${primary}30`,
        transition: { duration: 0.22, ease: 'easeOut' },
      }}
    >
      <div
        className="rounded-2xl flex flex-col flex-1"
        style={{ background: surface, borderRadius: '14px' }}
      >
        {/* Card header */}
        <div
          className="flex items-center justify-between px-6 pt-5 pb-1"
          style={{ borderBottom: `1px solid ${border}` }}
        >
          <h2 className="text-base font-bold" style={{ color: text }}>
            {title}
          </h2>
        </div>

        <div className="p-6">
          {!hasData ? (
            /* Empty state */
            <div
              className="flex flex-col items-center justify-center rounded-xl py-10"
              style={{ background: `${primary}08` }}
            >
              <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
                <circle cx="24" cy="24" r="24" fill={`${primary}18`} />
                <path
                  d="M24 14a10 10 0 100 20 10 10 0 000-20zm0 18a8 8 0 110-16 8 8 0 010 16z"
                  fill={primary}
                  opacity="0.5"
                />
                <path d="M24 18v6l4 2" stroke={primary} strokeWidth="2" strokeLinecap="round" />
              </svg>
              <p className="mt-3 text-sm font-medium" style={{ color: textMuted }}>
                No payment data available
              </p>
            </div>
          ) : (
            <div className="flex items-center gap-4">
              {/* Donut chart */}
              <div className="relative flex-shrink-0" style={{ width: 180, height: 180 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={55}
                      outerRadius={80}
                      paddingAngle={3}
                      dataKey="amount"
                      strokeWidth={0}
                    >
                      {pieData.map((_, i) => (
                        <Cell
                          key={i}
                          fill={SEGMENT_COLORS[i % SEGMENT_COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                  </PieChart>
                </ResponsiveContainer>

                {/* Center label */}
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                  <p className="text-lg font-bold leading-tight" style={{ color: text }}>
                    {formatTotal(total)}
                  </p>
                  <p className="text-xs" style={{ color: textMuted }}>Total</p>
                </div>
              </div>

              {/* Legend */}
              <div className="flex-1 flex flex-col gap-3">
                {pieData.map((d, i) => (
                  <div key={d.method} className="flex items-center gap-3">
                    <span
                      className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                      style={{ background: SEGMENT_COLORS[i % SEGMENT_COLORS.length] }}
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-xs font-medium truncate" style={{ color: text }}>
                          {d.method}
                        </span>
                        <span
                          className="text-xs font-semibold flex-shrink-0"
                          style={{ color: SEGMENT_COLORS[i % SEGMENT_COLORS.length] }}
                        >
                          {d.pct}%
                        </span>
                      </div>
                      {/* Mini progress bar */}
                      <div
                        className="mt-1 h-1 rounded-full overflow-hidden"
                        style={{ background: `${SEGMENT_COLORS[i % SEGMENT_COLORS.length]}22` }}
                      >
                        <div
                          className="h-full rounded-full"
                          style={{
                            width: `${d.pct}%`,
                            background: SEGMENT_COLORS[i % SEGMENT_COLORS.length],
                          }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default PaymentMethodChart;
