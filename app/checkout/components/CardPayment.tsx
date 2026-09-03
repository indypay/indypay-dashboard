'use client';

import { useState } from 'react';
import { Button, Input, Select, message } from 'antd';
import { CreditCardOutlined, LockOutlined } from '@ant-design/icons';
import { safeAny } from '@/lib/interfaces/global.interface';
import { formatAmount } from '@/lib/utils/utils';
import { useTenantPageTheme } from '@/lib/utils/tenant-page-theme';

interface CardPaymentProps {
  paymentLink: safeAny;
  onPaymentInitiated?: () => void;
}

const CARD_TYPES = [
  { value: 'visa', label: 'Visa', icon: '💳' },
  { value: 'mastercard', label: 'Mastercard', icon: '💳' },
  { value: 'rupay', label: 'RuPay', icon: '💳' },
  { value: 'amex', label: 'American Express', icon: '💳' },
];

export function CardPayment({
  paymentLink,
  onPaymentInitiated,
}: CardPaymentProps) {
  const theme = useTenantPageTheme();
  const [cardNumber, setCardNumber] = useState('');
  const [cardName, setCardName] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');
  const [cardType, setCardType] = useState<string>('');
  const [processing, setProcessing] = useState(false);

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = (matches && matches[0]) || '';
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    if (parts.length) {
      return parts.join(' ');
    } else {
      return v;
    }
  };

  const formatExpiry = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    if (v.length >= 2) {
      return v.substring(0, 2) + '/' + v.substring(2, 4);
    }
    return v;
  };

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCardNumber(e.target.value);
    setCardNumber(formatted);

    // Detect card type
    const number = formatted.replace(/\s/g, '');
    if (number.startsWith('4')) {
      setCardType('visa');
    } else if (number.startsWith('5')) {
      setCardType('mastercard');
    } else if (number.startsWith('6')) {
      setCardType('rupay');
    } else if (number.startsWith('3')) {
      setCardType('amex');
    }
  };

  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatExpiry(e.target.value);
    setExpiry(formatted);
  };

  const handleCvvChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 4);
    setCvv(value);
  };

  const validateForm = () => {
    if (!cardNumber || cardNumber.replace(/\s/g, '').length < 16) {
      message.error('Please enter a valid card number');
      return false;
    }
    if (!cardName.trim()) {
      message.error('Please enter cardholder name');
      return false;
    }
    if (!expiry || expiry.length !== 5) {
      message.error('Please enter a valid expiry date (MM/YY)');
      return false;
    }
    if (!cvv || cvv.length < 3) {
      message.error('Please enter a valid CVV');
      return false;
    }
    return true;
  };

  const handlePay = async () => {
    if (!validateForm()) {
      return;
    }

    try {
      setProcessing(true);
      onPaymentInitiated?.(); // UAT: triggers processing -> success on page
      message.success('Processing... (UAT: will auto-succeed)');
    } catch (error: safeAny) {
      message.error(error?.message || 'Payment failed.');
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
          Pay with Card
        </h3>
        <p style={{ color: '#6B7280', fontSize: '14px' }}>
          Enter your card details to complete payment
        </p>
      </div>

      {/* Card Number */}
      <div style={{ marginBottom: '20px' }}>
        <label
          style={{
            display: 'block',
            color: '#374151',
            fontSize: '14px',
            fontWeight: 500,
            marginBottom: '8px',
          }}
        >
          Card Number
        </label>
        <Input
          placeholder="1234 5678 9012 3456"
          value={cardNumber}
          onChange={handleCardNumberChange}
          maxLength={19}
          prefix={<CreditCardOutlined style={{ color: '#9CA3AF' }} />}
          size="large"
          style={{
            background: '#fff',
            borderColor: '#E5E7EB',
            color: '#111827',
            height: '48px',
            borderRadius: '10px',
          }}
        />
      </div>

      {/* Cardholder Name */}
      <div style={{ marginBottom: '20px' }}>
        <label
          style={{
            display: 'block',
            color: '#374151',
            fontSize: '14px',
            fontWeight: 500,
            marginBottom: '8px',
          }}
        >
          Cardholder Name
        </label>
        <Input
          placeholder="John Doe"
          value={cardName}
          onChange={(e) => setCardName(e.target.value)}
          size="large"
          style={{
            background: '#fff',
            borderColor: '#E5E7EB',
            color: '#111827',
            height: '48px',
            borderRadius: '10px',
          }}
        />
      </div>

      {/* Expiry and CVV */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '16px',
          marginBottom: '24px',
        }}
      >
        <div>
          <label
            style={{
              display: 'block',
              color: '#374151',
              fontSize: '14px',
              fontWeight: 500,
              marginBottom: '8px',
            }}
          >
            Expiry Date
          </label>
          <Input
            placeholder="MM/YY"
            value={expiry}
            onChange={handleExpiryChange}
            maxLength={5}
            size="large"
            style={{
              background: '#fff',
              borderColor: '#E5E7EB',
              color: '#111827',
              height: '48px',
              borderRadius: '10px',
            }}
          />
        </div>
        <div>
          <label
            style={{
              display: 'block',
              color: '#374151',
              fontSize: '14px',
              fontWeight: 500,
              marginBottom: '8px',
            }}
          >
            CVV
          </label>
          <Input
            placeholder="123"
            value={cvv}
            onChange={handleCvvChange}
            maxLength={4}
            type="password"
            size="large"
            style={{
              background: '#fff',
              borderColor: '#E5E7EB',
              color: '#111827',
              height: '48px',
              borderRadius: '10px',
            }}
          />
        </div>
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

      {/* Security Note */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          marginBottom: '24px',
          padding: '12px 14px',
          background: '#F9FAFB',
          borderRadius: '10px',
          border: '1px solid #E5E7EB',
        }}
      >
        <LockOutlined style={{ color: theme.primary, fontSize: '16px' }} />
        <span style={{ color: '#6B7280', fontSize: '13px' }}>
          Your card details are encrypted and secure
        </span>
      </div>

      {/* Pay Button */}
      <Button
        type="primary"
        size="large"
        block
        loading={processing}
        onClick={handlePay}
        style={{
          background: theme.gradientButton,
          border: 'none',
          color: '#fff',
          fontWeight: 600,
          height: '48px',
          borderRadius: '12px',
          boxShadow: theme.buttonShadow,
        }}
      >
        Pay {formatAmount(paymentLink.amount) || `₹${paymentLink.amount}`}
      </Button>
    </div>
  );
}
