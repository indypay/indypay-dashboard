'use client';

import { useState } from 'react';
import { Button, Select, message } from 'antd';
import { BankOutlined } from '@ant-design/icons';
import { safeAny } from '@/lib/interfaces/global.interface';
import { formatAmount } from '@/lib/utils/utils';
import { useTenantPageTheme } from '@/lib/utils/tenant-page-theme';

interface NetbankingPaymentProps {
  paymentLink: safeAny;
  onPaymentInitiated?: () => void;
}

const BANKS = [
  { value: 'hdfc', label: 'HDFC Bank', icon: '🏦' },
  { value: 'icici', label: 'ICICI Bank', icon: '🏦' },
  { value: 'sbi', label: 'State Bank of India', icon: '🏦' },
  { value: 'axis', label: 'Axis Bank', icon: '🏦' },
  { value: 'kotak', label: 'Kotak Mahindra Bank', icon: '🏦' },
  { value: 'pnb', label: 'Punjab National Bank', icon: '🏦' },
  { value: 'bob', label: 'Bank of Baroda', icon: '🏦' },
  { value: 'canara', label: 'Canara Bank', icon: '🏦' },
  { value: 'union', label: 'Union Bank of India', icon: '🏦' },
  { value: 'indian', label: 'Indian Bank', icon: '🏦' },
  { value: 'iob', label: 'Indian Overseas Bank', icon: '🏦' },
  { value: 'ubi', label: 'United Bank of India', icon: '🏦' },
];

export function NetbankingPayment({
  paymentLink,
  onPaymentInitiated,
}: NetbankingPaymentProps) {
  const theme = useTenantPageTheme();
  const [selectedBank, setSelectedBank] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);

  const handleBankSelect = (bankId: string) => {
    setSelectedBank(bankId);
  };

  const handlePay = async () => {
    if (!selectedBank) {
      message.error('Please select a bank');
      return;
    }

    try {
      setProcessing(true);
      onPaymentInitiated?.(); // UAT: triggers processing -> success on page
      const bankName = BANKS.find((b) => b.value === selectedBank)?.label;
      message.success(`${bankName} (UAT: will auto-succeed)`);
    } catch (error: safeAny) {
      message.error(error?.message || 'Failed to initiate payment');
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="checkout-light-inputs" style={{ padding: '24px 0' }}>
      <div style={{ marginBottom: '24px' }}>
        <h3
          style={{
            fontSize: '18px',
            fontWeight: 600,
            color: '#111827',
            marginBottom: '8px',
          }}
        >
          Pay with Net Banking
        </h3>
        <p style={{ color: '#6B7280', fontSize: '14px' }}>
          Select your bank to complete the payment
        </p>
      </div>

      {/* Bank Selection */}
      <div style={{ marginBottom: '24px' }}>
        <label
          style={{
            display: 'block',
            color: '#374151',
            fontSize: '14px',
            fontWeight: 500,
            marginBottom: '8px',
          }}
        >
          Select Bank
        </label>
        <Select
          placeholder="Choose your bank"
          value={selectedBank}
          onChange={handleBankSelect}
          size="large"
          style={{
            width: '100%',
            minHeight: '48px',
          }}
          options={BANKS.map((bank) => ({
            value: bank.value,
            label: (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                }}
              >
                <span style={{ fontSize: '20px' }}>{bank.icon}</span>
                <span style={{ color: '#111827' }}>{bank.label}</span>
              </div>
            ),
          }))}
        />
      </div>

      {/* Amount Display */}
      <div
        style={{
          background: theme.background,
          borderRadius: '10px',
          padding: '16px',
          marginBottom: '24px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          border: `1px solid ${theme.borderMedium}`,
        }}
      >
        <span style={{ color: '#6B7280', fontSize: '14px' }}>Amount</span>
        <span
          style={{
            color: theme.secondary,
            fontSize: '20px',
            fontWeight: 700,
          }}
        >
          {formatAmount(paymentLink.amount) || `₹${paymentLink.amount}`}
        </span>
      </div>

      {/* Info Note */}
      <div
        style={{
          marginBottom: '24px',
          padding: '16px',
          background: '#F9FAFB',
          borderRadius: '10px',
          border: '1px solid #E5E7EB',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'flex-start',
            gap: '12px',
          }}
        >
          <BankOutlined
            style={{ color: theme.primary, fontSize: '16px', marginTop: '2px' }}
          />
          <div>
            <p
              style={{
                color: '#6B7280',
                fontSize: '13px',
                margin: 0,
                lineHeight: 1.6,
              }}
            >
              You will be redirected to your bank's secure payment page to
              complete the transaction. Make sure you have net banking enabled
              for your account.
            </p>
          </div>
        </div>
      </div>

      {/* Pay Button */}
      <Button
        type="primary"
        size="large"
        block
        loading={processing}
        onClick={handlePay}
        disabled={!selectedBank}
        style={{
          background: selectedBank ? theme.gradientButton : '#E5E7EB',
          border: 'none',
          color: selectedBank ? '#fff' : '#9CA3AF',
          fontWeight: 600,
          height: '48px',
          borderRadius: '12px',
          cursor: selectedBank ? 'pointer' : 'not-allowed',
          boxShadow: selectedBank ? theme.buttonShadow : 'none',
        }}
      >
        Continue to Bank
      </Button>
    </div>
  );
}
