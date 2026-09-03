'use client';

import { useState } from 'react';
import { Button, Input, message } from 'antd';
import { PhoneOutlined, WalletOutlined, BankOutlined } from '@ant-design/icons';
import { safeAny } from '@/lib/interfaces/global.interface';
import { formatAmount } from '@/lib/utils/utils';
import { useTenantPageTheme } from '@/lib/utils/tenant-page-theme';

interface UPIPaymentProps {
  paymentLink: safeAny;
  onPaymentInitiated?: () => void;
}

const UPI_APPS = [
  { id: 'phonepe', name: 'PhonePe', icon: '📱', color: '#5F259F' },
  { id: 'gpay', name: 'Google Pay', icon: '💳', color: '#4285F4' },
  { id: 'paytm', name: 'Paytm', icon: '💰', color: '#00BAF2' },
  { id: 'bhim', name: 'BHIM UPI', icon: '🏦', color: '#00A651' },
  { id: 'amazonpay', name: 'Amazon Pay', icon: '🛒', color: '#FF9900' },
  { id: 'cred', name: 'CRED', icon: '💎', color: '#00D9FF' },
];

export function UPIPayment({
  paymentLink,
  onPaymentInitiated,
}: UPIPaymentProps) {
  const theme = useTenantPageTheme();
  const [selectedUPI, setSelectedUPI] = useState<string | null>(null);
  const [upiId, setUpiId] = useState('');
  const [processing, setProcessing] = useState(false);

  const handleUPISelection = (upiAppId: string) => {
    setSelectedUPI(upiAppId);
    message.info(
      `Opening ${UPI_APPS.find((app) => app.id === upiAppId)?.name}...`,
    );

    // TODO: Integrate with actual UPI payment gateway
    // This would typically redirect to the UPI app or open a payment URL
  };

  const handlePayWithUPI = async () => {
    if (!upiId.trim()) {
      message.error('Please enter your UPI ID');
      return;
    }

    // Validate UPI ID format
    const upiRegex = /^[a-zA-Z0-9.\-_]{2,256}@[a-zA-Z]{2,64}$/;
    if (!upiRegex.test(upiId)) {
      message.error('Please enter a valid UPI ID (e.g., yourname@paytm)');
      return;
    }

    try {
      setProcessing(true);
      onPaymentInitiated?.(); // UAT: triggers processing -> success on page
      message.success('Payment request sent! (UAT: will auto-succeed)');
    } catch (error: safeAny) {
      message.error(error?.message || 'Failed to initiate payment');
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div style={{ padding: '8px 0' }}>
      <div style={{ marginBottom: '12px' }}>
        <h3
          style={{
            fontSize: '14px',
            fontWeight: 600,
            color: '#111827',
            margin: 0,
            marginBottom: '2px',
          }}
        >
          Pay with UPI
        </h3>
        <p style={{ color: '#6B7280', fontSize: '12px', margin: 0 }}>
          Choose app or enter UPI ID
        </p>
      </div>

      {/* UPI Apps Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '8px',
          marginBottom: '16px',
        }}
      >
        {UPI_APPS.map((app) => (
          <button
            key={app.id}
            onClick={() => handleUPISelection(app.id)}
            style={{
              background: selectedUPI === app.id ? '#D1FAE5' : '#FFFFFF',
              border:
                selectedUPI === app.id
                  ? `2px solid ${app.color}`
                  : '1px solid #E5E7EB',
              borderRadius: '12px',
              padding: '12px',
              cursor: 'pointer',
              transition: 'all 0.2s',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '8px',
            }}
            onMouseEnter={(e) => {
              if (selectedUPI !== app.id) {
                e.currentTarget.style.borderColor = app.color;
                e.currentTarget.style.background = theme.background;
              }
            }}
            onMouseLeave={(e) => {
              if (selectedUPI !== app.id) {
                e.currentTarget.style.borderColor = '#E5E7EB';
                e.currentTarget.style.background = '#FFFFFF';
              }
            }}
          >
            <span style={{ fontSize: '32px' }}>{app.icon}</span>
            <span
              style={{
                color: '#111827',
                fontSize: '12px',
                fontWeight: 500,
              }}
            >
              {app.name}
            </span>
          </button>
        ))}
      </div>

      {/* Or Divider */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          marginBottom: '16px',
        }}
      >
        <div
          style={{
            flex: 1,
            height: '1px',
            background: '#E5E7EB',
          }}
        />
        <span style={{ color: '#6B7280', fontSize: '12px' }}>OR</span>
        <div
          style={{
            flex: 1,
            height: '1px',
            background: '#E5E7EB',
          }}
        />
      </div>

      {/* UPI ID Input */}
      <div style={{ marginBottom: '12px' }}>
        <label
          style={{
            display: 'block',
            color: '#374151',
            fontSize: '14px',
            fontWeight: 500,
            marginBottom: '8px',
          }}
        >
          Enter UPI ID
        </label>
        <Input
          placeholder="yourname@paytm"
          value={upiId}
          onChange={(e) => setUpiId(e.target.value)}
          size="large"
          style={{
            background: '#FFFFFF',
            borderColor: '#E5E7EB',
            color: '#111827',
            height: '48px',
          }}
        />
        <p
          style={{
            color: '#6B7280',
            fontSize: '12px',
            marginTop: '8px',
          }}
        >
          Example: yourname@paytm, yourname@ybl, yourname@okaxis
        </p>
      </div>

      {/* Amount Display */}
      <div
        style={{
          background: '#D1FAE5',
          borderRadius: '8px',
          padding: '10px 12px',
          marginBottom: '12px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          border: `1px solid ${theme.borderMedium}`,
        }}
      >
        <span style={{ color: theme.secondary, fontSize: '14px' }}>Amount</span>
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

      {/* Pay Button */}
      <Button
        type="primary"
        size="large"
        block
        loading={processing}
        onClick={handlePayWithUPI}
        style={{
          background: theme.primary,
          border: 'none',
          color: '#FFFFFF',
          fontWeight: 600,
          height: '48px',
        }}
      >
        Pay with UPI
      </Button>
    </div>
  );
}
