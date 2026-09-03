'use client';
import { motion } from 'framer-motion';
import { formatAmount } from '@/lib/utils/utils';
import { useTenant } from '@/context/TenantContext';
import { FileSearch } from 'lucide-react';

export interface TransactionData {
  id: string;
  date: string;
  transactionId: string;
  method: string;
  amount: number;
  status: 'Success' | 'Failed' | 'Pending';
}

export interface RecentTransactionsTableProps {
  transactions: TransactionData[];
  title?: string;
  maxDisplay?: number;
  onViewAll?: () => void;
}

const STATUS_CONFIG = {
  Success: { bg: '#10B98118', color: '#059669', border: '#10B98144', dot: '#10B981' },
  Failed:  { bg: '#EF444418', color: '#DC2626', border: '#EF444444', dot: '#EF4444' },
  Pending: { bg: '#F59E0B18', color: '#D97706', border: '#F59E0B44', dot: '#F59E0B' },
} as const;

const EmptyState = ({ primary, textMuted }: { primary: string; textMuted: string }) => (
  <div className="flex flex-col items-center justify-center py-12">
    <div className="relative flex items-center justify-center w-16 h-16 rounded-2xl mb-4">
      <div className="absolute inset-0 rounded-2xl" style={{ background: primary, opacity: 0.08 }} />
      <FileSearch size={30} color={primary} className="relative opacity-70" />
    </div>
    <p className="text-sm font-semibold mb-1" style={{ color: '#111827' }}>
      No transactions found
    </p>
    <p className="text-xs text-center max-w-[180px]" style={{ color: textMuted }}>
      Your recent transactions will appear here once payments are processed.
    </p>
  </div>
);

const RecentTransactionsTable = ({
  transactions,
  title = 'Recent Transactions',
  maxDisplay,
  onViewAll,
}: RecentTransactionsTableProps) => {
  const { tenantConfig } = useTenant();
  const { primary, border, surface, text, textMuted } = tenantConfig.colors;

  const displayTxns = maxDisplay ? transactions.slice(0, maxDisplay) : transactions;

  const shortId = (id: string) =>
    id.length > 12 ? `…${id.slice(-10)}` : id;

  return (
    <motion.div
      className="recent-transactions-table-wrap"
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
          {onViewAll && (
            <button
              onClick={onViewAll}
              className="text-xs font-semibold flex items-center gap-1 transition-opacity hover:opacity-70"
              style={{ color: primary, background: 'none', border: 'none', cursor: 'pointer' }}
            >
              View All
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M3 7h8M8 4l3 3-3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          )}
        </div>

        {/* Body */}
        <div className="px-6 pb-4">
          {displayTxns.length === 0 ? (
            <EmptyState primary={primary} textMuted={textMuted} />
          ) : (
            <>
              {/* Column headers */}
              <div
                className="grid gap-3 px-3 py-2 mt-2 rounded-lg mb-1"
                style={{
                  gridTemplateColumns: '2fr 1fr 1fr 1fr',
                  background: `${primary}08`,
                }}
              >
                {['Transaction ID', 'Method', 'Amount', 'Status'].map((h) => (
                  <span key={h} className="text-xs font-semibold uppercase tracking-wide" style={{ color: textMuted }}>
                    {h}
                  </span>
                ))}
              </div>

              {/* Rows */}
              {displayTxns.map((tx, i) => {
                const s = STATUS_CONFIG[tx.status] ?? STATUS_CONFIG.Pending;
                return (
                  <motion.div
                    key={tx.id}
                    className="grid gap-3 px-3 py-3 rounded-lg items-center"
                    style={{
                      gridTemplateColumns: '2fr 1fr 1fr 1fr',
                      borderBottom: i < displayTxns.length - 1 ? `1px solid ${border}` : 'none',
                    }}
                    whileHover={{ background: `${primary}06` }}
                  >
                    <span
                      className="text-xs font-mono font-medium truncate"
                      style={{ color: text }}
                      title={tx.transactionId}
                    >
                      {shortId(tx.transactionId)}
                    </span>
                    <span className="text-xs" style={{ color: textMuted }}>{tx.method}</span>
                    <span className="text-xs font-semibold" style={{ color: text }}>
                      {formatAmount(tx.amount)}
                    </span>
                    <span>
                      <span
                        className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full"
                        style={{
                          background: s.bg,
                          color: s.color,
                          border: `1px solid ${s.border}`,
                        }}
                      >
                        <span
                          className="w-1.5 h-1.5 rounded-full"
                          style={{ background: s.dot }}
                        />
                        {tx.status}
                      </span>
                    </span>
                  </motion.div>
                );
              })}
            </>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default RecentTransactionsTable;
