'use client';
import React from 'react';
import { motion } from 'framer-motion';
import { useTenant } from '@/context/TenantContext';

export interface MetricCardProps {
  title: string;
  amount: number | string | null;
  percentageChange?: number;
  changeLabel?: string;
  onRefresh?: () => void;
  onViewDetails?: () => void;
  borderColor?: 'green' | 'blue' | 'default';
  formatAmount?: (amount: number | string) => string;
  type?: string;
  icon?: React.ReactNode;
  subtitle?: string;
}

// Decorative upward-trending sparkline path (purely visual)
const SPARK_PTS = '0,22 8.9,18 17.8,20 26.7,12 35.6,16 44.4,10 53.3,14 62.2,4 71.1,8 80,0';

const MetricCard = ({
  title,
  amount,
  onViewDetails = () => {},
  borderColor = 'default',
  formatAmount = (amt) => amt.toString(),
  icon,
  subtitle,
}: MetricCardProps) => {
  const { tenantConfig } = useTenant();
  const { primary, border, accent } = tenantConfig.colors;

  const getBorderGradient = () => {
    if (borderColor === 'blue') return 'linear-gradient(135deg, #1E4763, #258BBD)';
    if (borderColor === 'green') return `linear-gradient(135deg, ${border}, ${primary})`;
    return `linear-gradient(135deg, ${border}, ${accent})`;
  };

  const displayAmount = typeof amount === 'number' ? formatAmount(amount) : amount;

  return (
    <motion.div
      className="relative rounded-2xl p-[2px] tenant-card-border"
      style={{ background: getBorderGradient() }}
      whileHover={{
        y: -4,
        boxShadow: `0 20px 48px ${primary}30`,
        transition: { duration: 0.22, ease: 'easeOut' },
      }}
    >
      <div
        className="relative w-full h-full bg-white rounded-2xl overflow-hidden"
        style={{ minHeight: '168px' }}
      >
        {/* Decorative soft circle — top-right */}
        <div
          className="absolute -right-6 -top-6 w-28 h-28 rounded-full pointer-events-none"
          style={{ background: primary, opacity: 0.06 }}
        />

        <div className="p-5 flex flex-col h-full relative">
          {/* Icon + Title row */}
          <div className="flex items-center gap-3 mb-5">
            <div
              className="relative flex items-center justify-center w-10 h-10 rounded-xl flex-shrink-0 overflow-hidden"
            >
              <div
                className="absolute inset-0 rounded-xl"
                style={{ background: primary, opacity: 0.12 }}
              />
              <span className="relative z-10" style={{ color: primary }}>
                {icon}
              </span>
            </div>
            <span
              className="text-sm font-semibold tracking-wide"
              style={{ color: tenantConfig.colors.textMuted }}
            >
              {title}
            </span>
          </div>

          {/* Amount */}
          <p
            className="text-3xl md:text-4xl font-bold leading-none mb-1"
            style={{ color: tenantConfig.colors.text, fontVariantNumeric: 'tabular-nums' }}
          >
            {displayAmount ?? '—'}
          </p>

          {/* Subtitle */}
          {subtitle && (
            <p className="text-xs mt-1" style={{ color: tenantConfig.colors.textMuted }}>
              {subtitle}
            </p>
          )}

          {/* Spacer */}
          <div className="flex-1" />

          {/* Footer: CTA + sparkline */}
          <div className="flex items-center justify-between mt-5">
            <motion.button
              onClick={() => onViewDetails()}
              className="text-xs font-semibold px-4 py-1.5 rounded-full"
              style={{
                background: primary,
                color: '#ffffff',
                border: 'none',
                cursor: 'pointer',
              }}
              whileHover={{ opacity: 0.85 }}
              whileTap={{ scale: 0.97 }}
            >
              View Details
            </motion.button>

            {/* Sparkline */}
            <svg
              width="80"
              height="28"
              aria-hidden="true"
              style={{ opacity: 0.35 }}
            >
              <polyline
                fill="none"
                stroke={primary}
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                points={SPARK_PTS}
              />
            </svg>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default MetricCard;
