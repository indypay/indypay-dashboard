'use client';
import { motion } from 'framer-motion';
import { Trophy } from 'lucide-react';
import { useTenant } from '@/context/TenantContext';

export interface MerchantData {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  totalAmount?: number;
  transactionCount?: number;
}

export interface TopMerchantsCardProps {
  merchants: MerchantData[];
  title?: string;
  buttonText?: string;
  onManageClick?: (merchantId: string) => void;
  maxDisplay?: number;
}

const RANK_COLORS = ['#F59E0B', '#94A3B8', '#CD7C3E'];


const TopMerchantsCard = ({
  merchants,
  title = 'Top Merchants',
  onManageClick,
  maxDisplay = 5,
}: TopMerchantsCardProps) => {
  const { tenantConfig } = useTenant();
  const { primary, secondary, border, surface, text, textMuted } = tenantConfig.colors;

  const displayMerchants = merchants.slice(0, maxDisplay);
  const hasData = displayMerchants.length > 0;

  const formatAmount = (n?: number) => {
    if (!n) return '—';
    if (n >= 100000) return `₹${(n / 100000).toFixed(1)}L`;
    if (n >= 1000) return `₹${(n / 1000).toFixed(0)}k`;
    return `₹${n}`;
  };

  const getInitials = (name: string) =>
    name.split(' ').slice(0, 2).map((w) => w[0]).join('').toUpperCase();

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
        {/* Header */}
        <div
          className="flex items-center justify-between px-6 pt-5 pb-4 flex-shrink-0"
          style={{ borderBottom: `1px solid ${border}` }}
        >
          <h2 className="text-base font-bold" style={{ color: text }}>
            {title}
          </h2>
          {hasData && (
            <button
              className="text-xs font-semibold flex items-center gap-1 transition-opacity hover:opacity-70"
              style={{ color: primary, background: 'none', border: 'none', cursor: 'pointer' }}
            >
              View all
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M3 7h8M8 4l3 3-3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          )}
        </div>

        {/* Body — fills remaining height */}
        <div className="flex flex-col flex-1 p-6">
          {!hasData ? (
            /* Empty state — stretches to fill card */
            <div className="relative overflow-hidden rounded-2xl flex flex-col items-center justify-center flex-1">

              {/* Large decorative blobs */}
              <div
                className="absolute -bottom-12 -right-12 w-56 h-56 rounded-full pointer-events-none"
                style={{ background: primary, opacity: 0.06 }}
              />
              <div
                className="absolute -top-10 -left-10 w-44 h-44 rounded-full pointer-events-none"
                style={{ background: primary, opacity: 0.04 }}
              />

              {/* Bottom soft gradient */}
              <div
                className="absolute bottom-0 left-0 right-0 h-1/3 pointer-events-none"
                style={{ background: `linear-gradient(to top, ${primary}0D, transparent)` }}
              />

              {/* Content */}
              <motion.div
                className="relative z-10 flex flex-col items-center text-center px-6"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, ease: 'easeOut' }}
              >
                <motion.div
                  className="relative flex items-center justify-center w-20 h-20 rounded-2xl"
                  whileHover={{ scale: 1.08, rotate: 3 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 18 }}
                >
                  <div className="absolute inset-0 rounded-2xl" style={{ background: primary, opacity: 0.1 }} />
                  <Trophy size={36} color={primary} className="relative opacity-80" />
                </motion.div>
                <p className="mt-5 text-sm font-bold" style={{ color: text }}>
                  No merchant data available
                </p>
                <p className="mt-1.5 text-xs leading-relaxed max-w-[200px]" style={{ color: textMuted }}>
                  Top performing merchants will appear here once transactions are processed.
                </p>
              </motion.div>
            </div>
          ) : (
            /* Merchant list */
            <div className="flex flex-col gap-1">
              {displayMerchants.map((merchant, index) => (
                <motion.div
                  key={merchant.id}
                  className="flex items-center gap-3 p-3 rounded-xl cursor-pointer"
                  whileHover={{
                    background: `${primary}0A`,
                    x: 3,
                    transition: { duration: 0.15 },
                  }}
                  onClick={() => onManageClick?.(merchant.id)}
                >
                  {/* Rank */}
                  <div
                    className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold"
                    style={{
                      background: index < 3 ? `${RANK_COLORS[index]}22` : `${primary}10`,
                      color: index < 3 ? RANK_COLORS[index] : textMuted,
                    }}
                  >
                    {index + 1}
                  </div>

                  {/* Avatar initials */}
                  <div
                    className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 text-xs font-bold text-white"
                    style={{ background: `linear-gradient(135deg, ${primary}, ${secondary})` }}
                  >
                    {getInitials(merchant.name)}
                  </div>

                  {/* Name + email */}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold truncate" style={{ color: text }}>
                      {merchant.name}
                    </p>
                    <p className="text-xs truncate" style={{ color: textMuted }}>
                      {merchant.email}
                    </p>
                  </div>

                  {/* Amount */}
                  <div className="text-right flex-shrink-0">
                    <p className="text-sm font-bold" style={{ color: primary }}>
                      {formatAmount(merchant.totalAmount)}
                    </p>
                    {merchant.transactionCount !== undefined && (
                      <p className="text-xs" style={{ color: textMuted }}>
                        {merchant.transactionCount} txns
                      </p>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default TopMerchantsCard;
