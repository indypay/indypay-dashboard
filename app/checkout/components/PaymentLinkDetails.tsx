'use client';

import { Button, Card } from 'antd';
import { safeAny } from '@/lib/interfaces/global.interface';
import { formatAmount } from '@/lib/utils/utils';
import { useTenantPageTheme } from '@/lib/utils/tenant-page-theme';

interface PaymentLinkDetailsProps {
  paymentLink: safeAny;
  onPayClick?: () => void;
  /** When true, only show summary (for left panel in split layout) */
  variant?: 'full' | 'summary';
}

export function PaymentLinkDetails({
  paymentLink,
  onPayClick,
  variant = 'full',
}: PaymentLinkDetailsProps) {
  const theme = useTenantPageTheme();
  const isSummary = variant === 'summary';

  const content = (
    <>
      {/* Header + Amount */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: isSummary ? 14 : 20,
          marginBottom: isSummary ? 14 : 12,
          flexWrap: 'wrap',
        }}
      >
        <div style={{ flex: '1 1 160px', minWidth: 0 }}>
          <h1
            style={{
              fontSize: isSummary ? 18 : 18,
              fontWeight: 700,
              color: '#111827',
              margin: 0,
              marginBottom: 2,
            }}
          >
            Payment Request
          </h1>
          <p style={{ color: '#6B7280', fontSize: 12, margin: 0 }}>
            {isSummary
              ? 'Review details below'
              : 'Review details and proceed to pay'}
          </p>
        </div>
        <div
          style={{
            background: theme.gradientButton,
            borderRadius: 10,
            padding: isSummary ? '12px 20px' : '12px 20px',
            textAlign: 'center',
            boxShadow: `0 3px 12px ${theme.primaryAlpha(0.25)}`,
            flexShrink: 0,
          }}
        >
          <p
            style={{
              color: 'rgba(255,255,255,0.9)',
              fontSize: 10,
              fontWeight: 600,
              margin: 0,
              textTransform: 'uppercase',
              letterSpacing: 0.5,
            }}
          >
            Amount to pay
          </p>
          <span
            style={{
              fontSize: isSummary ? 28 : 28,
              fontWeight: 800,
              color: '#fff',
              lineHeight: 1.2,
              display: 'block',
            }}
          >
            {formatAmount(paymentLink.amount) || `₹${paymentLink.amount}`}
          </span>
        </div>
      </div>

      {/* Note / Description */}
      {paymentLink.description != null && paymentLink.description !== '' && (
        <div
          style={{
            background: theme.surfaceTint,
            border: `1px solid ${theme.primaryAlpha(0.18)}`,
            borderRadius: 10,
            padding: '10px 14px',
            marginBottom: isSummary ? 12 : 12,
            display: 'flex',
            gap: 8,
            alignItems: 'flex-start',
          }}
        >
          <span style={{ fontSize: 14, lineHeight: 1, marginTop: 2 }}>📋</span>
          <span
            style={{
              color: theme.secondary,
              fontSize: 13,
              lineHeight: 1.5,
              fontWeight: 500,
            }}
          >
            {paymentLink.description}
          </span>
        </div>
      )}

      {/* Payment Details */}
      <div
        style={{
          borderTop: '1px solid #E5E7EB',
          paddingTop: isSummary ? 12 : 10,
          marginBottom: isSummary ? 0 : 12,
        }}
      >
        <h3
          style={{
            fontSize: 11,
            fontWeight: 600,
            color: theme.primary,
            margin: 0,
            marginBottom: 8,
            textTransform: 'uppercase',
            letterSpacing: 0.5,
          }}
        >
          Payment details
        </h3>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: isSummary
              ? '1fr'
              : 'repeat(auto-fill, minmax(180px, 1fr))',
            gap: isSummary ? 8 : '8px 16px',
          }}
        >
          {paymentLink.email != null && paymentLink.email !== '' && (
            <DetailRow label="Email" value={paymentLink.email} />
          )}
          {paymentLink.mobile != null && paymentLink.mobile !== '' && (
            <DetailRow label="Number" value={paymentLink.mobile} />
          )}
          {paymentLink.orderId != null && paymentLink.orderId !== '' && (
            <DetailRow label="Order ID" value={paymentLink.orderId} />
          )}
          {paymentLink.name != null && paymentLink.name !== '' && (
            <DetailRow label="Customer Name" value={paymentLink.name} />
          )}
        </div>
      </div>

      {!isSummary && onPayClick && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            flexWrap: 'wrap',
          }}
        >
          <Button
            type="primary"
            size="large"
            onClick={onPayClick}
            style={{
              background: theme.primary,
              border: 'none',
              color: '#FFFFFF',
              fontWeight: 700,
              fontSize: 15,
              height: 44,
              borderRadius: 10,
              paddingLeft: 24,
              paddingRight: 24,
            }}
          >
            Pay {formatAmount(paymentLink.amount) || `₹${paymentLink.amount}`}
          </Button>
          <span style={{ color: '#6B7280', fontSize: 11 }}>
            🔒 Secured & encrypted
          </span>
        </div>
      )}
    </>
  );

  if (isSummary) {
    return <div style={{ padding: 0 }}>{content}</div>;
  }

  return (
    <Card
      style={{
        background: '#FFFFFF',
        border: '1px solid #E5E7EB',
        borderRadius: 12,
        padding: '16px 20px',
        boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
      }}
      styles={{ body: { padding: 0 } }}
    >
      {content}
    </Card>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '2px',
        minWidth: 0,
      }}
    >
      <span style={{ color: '#6B7280', fontSize: '11px' }}>{label}</span>
      <span
        style={{
          color: '#111827',
          fontSize: '13px',
          fontWeight: 500,
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
        }}
      >
        {value}
      </span>
    </div>
  );
}
