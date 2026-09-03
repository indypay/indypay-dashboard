'use client';

import { useState } from 'react';
import { Input, Tabs } from 'antd';
import { safeAny } from '@/lib/interfaces/global.interface';
import { formatAmount } from '@/lib/utils/utils';
import { QRPayment } from './QRPayment';
import { UPIPayment } from './UPIPayment';
import { CardPayment } from './CardPayment';
import { NetbankingPayment } from './NetbankingPayment';
import { useTenantPageTheme } from '@/lib/utils/tenant-page-theme';

interface PaymentMethodsProps {
  paymentLink: safeAny;
  onBack: () => void;
  /** UAT demo: when user initiates payment, show processing then success */
  onPaymentInitiated?: () => void;
}

type PaymentMethod = 'qr' | 'upi' | 'card' | 'netbanking';
type AmountMode = 'full' | 'custom';

export function PaymentMethods({
  paymentLink,
  onBack,
  onPaymentInitiated,
}: PaymentMethodsProps) {
  const theme = useTenantPageTheme();
  const [activeTab, setActiveTab] = useState<PaymentMethod>('qr');
  const [amountMode, setAmountMode] = useState<AmountMode>('full');
  const [customAmountStr, setCustomAmountStr] = useState('');
  const [amountError, setAmountError] = useState<string | null>(null);

  const totalAmount = Number(paymentLink?.amount) || 0;
  const minimumAmount = Number(paymentLink?.minimumAmount) || 1;
  const showPartialSelector = !!paymentLink?.allowPartialPayment;

  const customAmount = Number(customAmountStr) || 0;
  const effectiveAmount = amountMode === 'full' ? totalAmount : customAmount;
  const remainingAfterPartial =
    amountMode === 'custom' && customAmount > 0 && customAmount < totalAmount
      ? totalAmount - customAmount
      : 0;

  const validateCustomAmount = (val: string): string | null => {
    const num = Number(val);
    if (!val || isNaN(num) || num <= 0) return 'Please enter a valid amount';
    if (num < minimumAmount)
      return `Minimum amount is ${formatAmount(minimumAmount) || `₹${minimumAmount}`}`;
    if (num > totalAmount)
      return `Cannot exceed ${formatAmount(totalAmount) || `₹${totalAmount}`}`;
    return null;
  };

  const handleCustomAmountChange = (val: string) => {
    setCustomAmountStr(val);
    setAmountError(validateCustomAmount(val));
  };

  const isAmountReady =
    amountMode === 'full' ||
    (amountMode === 'custom' && !amountError && customAmount > 0);

  // Pass effective amount to payment method tabs
  const effectivePaymentLink = showPartialSelector
    ? { ...paymentLink, amount: effectiveAmount }
    : paymentLink;

  const tabItems = [
    {
      key: 'qr',
      label: 'QR',
      children: (
        <QRPayment
          paymentLink={effectivePaymentLink}
          onPaymentInitiated={onPaymentInitiated}
        />
      ),
    },
    {
      key: 'upi',
      label: 'UPI',
      children: (
        <UPIPayment
          paymentLink={effectivePaymentLink}
          onPaymentInitiated={onPaymentInitiated}
        />
      ),
    },
    {
      key: 'card',
      label: 'Card',
      children: (
        <CardPayment
          paymentLink={effectivePaymentLink}
          onPaymentInitiated={onPaymentInitiated}
        />
      ),
    },
    {
      key: 'netbanking',
      label: 'Net Banking',
      children: (
        <NetbankingPayment
          paymentLink={effectivePaymentLink}
          onPaymentInitiated={onPaymentInitiated}
        />
      ),
    },
  ];

  return (
    <div
      style={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        minHeight: 0,
      }}
    >
      {/* Partial payment amount selector */}
      {showPartialSelector && (
        <div
          style={{
            marginBottom: 14,
            background: theme.surfaceTint,
            border: `1px solid ${theme.borderStrong}`,
            borderRadius: 12,
            padding: '12px 14px',
            flexShrink: 0,
          }}
        >
          <p
            style={{
              fontSize: 12,
              fontWeight: 600,
              color: theme.secondary,
              margin: '0 0 10px',
              textTransform: 'uppercase',
              letterSpacing: '0.04em',
            }}
          >
            Choose payment amount
          </p>

          {/* Option cards */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: 8,
              marginBottom: amountMode === 'custom' ? 10 : 0,
            }}
          >
            {/* Full amount option */}
            <button
              onClick={() => {
                setAmountMode('full');
                setAmountError(null);
              }}
              style={{
                background:
                  amountMode === 'full' ? '#fff' : 'rgba(255,255,255,0.5)',
                border:
                  amountMode === 'full'
                    ? `2px solid ${theme.primary}`
                    : `1px solid ${theme.primaryAlpha(0.25)}`,
                borderRadius: 10,
                padding: '10px 12px',
                cursor: 'pointer',
                textAlign: 'left',
                transition: 'all 0.15s',
                boxShadow:
                  amountMode === 'full'
                    ? `0 2px 8px ${theme.primaryAlpha(0.15)}`
                    : 'none',
              }}
            >
              <div
                style={{
                  fontSize: 11,
                  color: '#6B7280',
                  fontWeight: 500,
                  marginBottom: 2,
                }}
              >
                Pay full
              </div>
              <div style={{ fontSize: 16, fontWeight: 700, color: theme.secondary }}>
                {formatAmount(totalAmount) || `₹${totalAmount}`}
              </div>
            </button>

            {/* Custom / partial option */}
            <button
              onClick={() => setAmountMode('custom')}
              style={{
                background:
                  amountMode === 'custom' ? '#fff' : 'rgba(255,255,255,0.5)',
                border:
                  amountMode === 'custom'
                    ? `2px solid ${theme.primary}`
                    : `1px solid ${theme.primaryAlpha(0.25)}`,
                borderRadius: 10,
                padding: '10px 12px',
                cursor: 'pointer',
                textAlign: 'left',
                transition: 'all 0.15s',
                boxShadow:
                  amountMode === 'custom'
                    ? `0 2px 8px ${theme.primaryAlpha(0.15)}`
                    : 'none',
              }}
            >
              <div
                style={{
                  fontSize: 11,
                  color: '#6B7280',
                  fontWeight: 500,
                  marginBottom: 2,
                }}
              >
                Pay partial
              </div>
              <div
                style={{
                  fontSize: 13,
                  fontWeight: 600,
                  color:
                    amountMode === 'custom' && customAmount > 0
                      ? theme.secondary
                      : '#9CA3AF',
                }}
              >
                {amountMode === 'custom' && customAmount > 0
                  ? formatAmount(customAmount) || `₹${customAmount}`
                  : `Min ${formatAmount(minimumAmount) || `₹${minimumAmount}`}`}
              </div>
            </button>
          </div>

          {/* Custom amount input */}
          {amountMode === 'custom' && (
            <div>
              <Input
                prefix={
                  <span style={{ color: theme.secondary, fontWeight: 600 }}>₹</span>
                }
                placeholder={`Enter amount (min ₹${minimumAmount})`}
                value={customAmountStr}
                onChange={(e) =>
                  handleCustomAmountChange(
                    e.target.value.replace(/[^0-9]/g, ''),
                  )
                }
                size="middle"
                style={{
                  borderColor: amountError ? '#EF4444' : theme.borderMedium,
                  background: '#fff',
                  borderRadius: 8,
                }}
              />
              {amountError && (
                <p
                  style={{ color: '#EF4444', fontSize: 12, margin: '4px 0 0' }}
                >
                  {amountError}
                </p>
              )}
              {!amountError && remainingAfterPartial > 0 && (
                <p
                  style={{ color: '#6B7280', fontSize: 12, margin: '4px 0 0' }}
                >
                  {formatAmount(remainingAfterPartial) ||
                    `₹${remainingAfterPartial}`}{' '}
                  remaining after this payment
                </p>
              )}
            </div>
          )}
        </div>
      )}

      {/* Payment method tabs — disabled until amount is ready */}
      <div
        style={{
          flex: 1,
          minHeight: 0,
          opacity: isAmountReady ? 1 : 0.4,
          pointerEvents: isAmountReady ? 'auto' : 'none',
          transition: 'opacity 0.2s',
        }}
      >
        <Tabs
          activeKey={activeTab}
          onChange={(k) => setActiveTab(k as PaymentMethod)}
          items={tabItems}
          size="small"
          style={{ flex: 1, minHeight: 0 }}
        />
      </div>
    </div>
  );
}
