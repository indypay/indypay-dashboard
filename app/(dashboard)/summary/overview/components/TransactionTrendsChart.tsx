'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  ResponsiveContainer, AreaChart, Area,
  XAxis, YAxis, CartesianGrid, Tooltip,
} from 'recharts';
import { formatAmount } from '@/lib/utils/utils';
import { useTenant } from '@/context/TenantContext';
import { TrendingUp } from 'lucide-react';

export interface TransactionDataPoint {
  title: string;
  value: number;
  category: string;
}

export interface TransactionTrendsChartProps {
  data: { title: string; value: number; category: string }[];
  title?: string;
}

const PERIODS = ['Daily', 'Weekly', 'Monthly'] as const;
type Period = typeof PERIODS[number];

const CHART_HEIGHT = 260;

const CustomTooltip = ({
  active, payload, label, primary, surface, text,
}: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div
      className="rounded-xl px-4 py-3"
      style={{
        background: surface,
        border: `1px solid ${primary}44`,
        boxShadow: `0 8px 24px ${primary}18`,
      }}
    >
      <p className="text-xs font-semibold mb-1" style={{ color: text }}>{label}</p>
      <p className="text-sm font-bold" style={{ color: primary }}>
        {formatAmount(payload[0].value)}
      </p>
    </div>
  );
};

const TransactionTrendsChart = ({
  data,
  title = 'Transaction Trends',
}: TransactionTrendsChartProps) => {
  const { tenantConfig } = useTenant();
  const { primary, border, text, textMuted, surface } = tenantConfig.colors;
  const [period, setPeriod] = useState<Period>('Daily');

  const safeData = (data || []).map((d) => ({ ...d, value: Number(d.value) || 0 }));
  const hasData = safeData.some((d) => d.value > 0);

  const gradientId = 'trend-area-gradient';

  return (
    <motion.div
      className="min-w-0 w-full"
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
      <div className="rounded-2xl flex flex-col flex-1" style={{ background: surface, borderRadius: '14px' }}>
        {/* Header */}
        <div
          className="flex items-center justify-between px-6 pt-5 pb-4"
          style={{ borderBottom: `1px solid ${border}` }}
        >
          <h2 className="text-base font-bold" style={{ color: text }}>
            {title}
          </h2>

          {/* Period selector */}
          <div
            className="flex items-center rounded-xl p-1 gap-1"
            style={{ background: `${primary}0F` }}
          >
            {PERIODS.map((p) => (
              <button
                key={p}
                onClick={() => setPeriod(p)}
                className="text-xs font-semibold px-3 py-1.5 rounded-lg transition-all duration-150"
                style={
                  period === p
                    ? { background: primary, color: '#fff', boxShadow: `0 2px 8px ${primary}44` }
                    : { background: 'transparent', color: textMuted }
                }
              >
                {p}
              </button>
            ))}
          </div>
        </div>

        {/* Chart */}
        <div className="px-4 pb-4 pt-2" style={{ height: CHART_HEIGHT + 40 }}>
          {!hasData ? (
            <div
              className="flex flex-col items-center justify-center rounded-xl h-full gap-3"
              style={{ background: `${primary}06` }}
            >
              <div
                className="relative flex items-center justify-center w-16 h-16 rounded-2xl"
              >
                <div className="absolute inset-0 rounded-2xl" style={{ background: primary, opacity: 0.1 }} />
                <TrendingUp size={30} color={primary} className="relative opacity-70" />
              </div>
              <p className="text-sm font-medium" style={{ color: textMuted }}>
                No trend data available
              </p>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={safeData} margin={{ top: 10, right: 8, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={primary} stopOpacity={0.25} />
                    <stop offset="100%" stopColor={primary} stopOpacity={0.01} />
                  </linearGradient>
                </defs>

                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke={border}
                  vertical={false}
                />
                <XAxis
                  dataKey="title"
                  stroke={textMuted}
                  tick={{ fontSize: 12, fill: textMuted }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  stroke={textMuted}
                  tick={{ fontSize: 12, fill: textMuted }}
                  tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`}
                  axisLine={false}
                  tickLine={false}
                  allowDecimals={false}
                  width={52}
                />
                <Tooltip
                  content={
                    <CustomTooltip
                      primary={primary}
                      surface={surface}
                      text={text}
                    />
                  }
                  cursor={{ stroke: primary, strokeWidth: 1, strokeDasharray: '4 4' }}
                />
                <Area
                  type="monotone"
                  dataKey="value"
                  stroke={primary}
                  strokeWidth={2.5}
                  fill={`url(#${gradientId})`}
                  dot={{ fill: surface, stroke: primary, strokeWidth: 2, r: 5 }}
                  activeDot={{ r: 7, fill: primary, stroke: surface, strokeWidth: 2 }}
                />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default TransactionTrendsChart;
