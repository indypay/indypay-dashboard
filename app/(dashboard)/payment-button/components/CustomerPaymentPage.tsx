'use client';

import { useState } from 'react';
import { Card, Button, Space, Divider, Tag, Spin } from 'antd';
import {
  SafetyCertificateOutlined,
  LockOutlined,
  CheckCircleOutlined,
  ArrowLeftOutlined,
  PhoneOutlined,
  MailOutlined,
  FileTextOutlined,
} from '@ant-design/icons';
import { createStyles } from 'antd-style';
import { formatAmount } from '@/lib/utils/utils';

const useStyles = createStyles(({ css }) => ({
  pageContainer: css`
    min-height: 100vh;
    background: linear-gradient(
      165deg,
      #ecfdf5 0%,
      #d1fae5 28%,
      #a7f3d0 55%,
      #d1fae5 78%,
      #f0fdf4 100%
    );
    padding: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
  `,
  paymentCard: css`
    background: #ffffff;
    border-radius: 20px;
    box-shadow:
      0 4px 6px -1px rgba(0, 0, 0, 0.06),
      0 12px 32px -4px rgba(5, 150, 105, 0.14);
    max-width: 480px;
    width: 100%;
    overflow: hidden;
  `,
  header: css`
    background: linear-gradient(to right, var(--border), var(--primary));
    padding: 24px;
    text-align: center;
    color: #ffffff;
  `,
  merchantLogo: css`
    width: 64px;
    height: 64px;
    border-radius: 12px;
    background: #ffffff;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 auto 12px;
    font-size: 28px;
    font-weight: 700;
    color: var(--primary);
  `,
  amountDisplay: css`
    text-align: center;
    padding: 32px 24px;
    background: var(--background);
  `,
  trustBadge: css`
    background: var(--sidebar-active-bg);
    border: 1px solid var(--primary);
    border-radius: 10px;
    padding: 12px 16px;
    display: flex;
    align-items: center;
    gap: 8px;
    margin: 16px 0;
  `,
  paymentButton: css`
    background: linear-gradient(to right, var(--secondary), var(--primary)) !important;
    border: none !important;
    color: #ffffff !important;
    font-weight: 600 !important;
    height: 52px !important;
    font-size: 16px !important;
    border-radius: 12px !important;
    box-shadow: 0 4px 12px rgba(0, 135, 90, 0.3) !important;

    &:hover {
      box-shadow: 0 6px 16px rgba(0, 135, 90, 0.4) !important;
      transform: translateY(-1px);
    }
  `,
  infoSection: css`
    padding: 16px;
    background: var(--background);
    border-radius: 10px;
    margin: 16px 0;
  `,
}));

interface CustomerPaymentPageProps {
  paymentLink: {
    id: string;
    amount: number;
    purpose: string;
    merchantName?: string;
    merchantLogo?: string;
    expiry?: string;
  };
  onPaymentInitiated?: () => void;
}

export default function CustomerPaymentPage({
  paymentLink,
  onPaymentInitiated,
}: CustomerPaymentPageProps) {
  const { styles } = useStyles();
  const [processing, setProcessing] = useState(false);

  const handlePayment = async () => {
    setProcessing(true);
    onPaymentInitiated?.();

    // Simulate payment processing
    setTimeout(() => {
      setProcessing(false);
    }, 2000);
  };

  const merchantInitials = paymentLink.merchantName
    ? paymentLink.merchantName
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)
    : 'RF';

  return (
    <div className={styles.pageContainer}>
      <div className={styles.paymentCard}>
        {/* Header with Merchant Info */}
        <div className={styles.header}>
          {paymentLink.merchantLogo ? (
            <img
              src={paymentLink.merchantLogo}
              alt="Merchant"
              className={styles.merchantLogo}
            />
          ) : (
            <div className={styles.merchantLogo}>{merchantInitials}</div>
          )}
          <h1 className="text-white text-xl font-bold mb-1">
            {paymentLink.merchantName || 'RupeeFlow Merchant'}
          </h1>
          <p className="text-white/90 text-sm">Requesting Payment</p>
        </div>

        {/* Amount Display */}
        <div className={styles.amountDisplay}>
          <div className="text-muted text-sm mb-2">Amount to Pay</div>
          <div className="text-4xl font-bold text-primary-green mb-1">
            {formatAmount(paymentLink.amount) || `₹${paymentLink.amount}`}
          </div>
          {paymentLink.purpose && (
            <div className="text-muted text-sm mt-2 flex items-center justify-center gap-1">
              <FileTextOutlined />
              {paymentLink.purpose}
            </div>
          )}
        </div>

        {/* Main Content */}
        <div style={{ padding: '24px' }}>
          {/* Trust Badge */}
          <div className={styles.trustBadge}>
            <SafetyCertificateOutlined
              style={{ color: 'var(--primary)', fontSize: '20px' }}
            />
            <div className="flex-1">
              <div className="text-sm font-semibold text-primary-dark-green">
                Secured by RupeeFlow
              </div>
              <div className="text-xs text-muted">
                Your payment is protected with bank-level encryption
              </div>
            </div>
            <LockOutlined style={{ color: 'var(--primary)', fontSize: '18px' }} />
          </div>

          {/* Payment Button */}
          <Button
            type="primary"
            block
            size="large"
            loading={processing}
            onClick={handlePayment}
            className={styles.paymentButton}
            icon={!processing && <CheckCircleOutlined />}
          >
            {processing ? 'Processing Payment...' : 'Proceed to Pay'}
          </Button>

          {/* Payment Methods Info */}
          <div className={styles.infoSection}>
            <div className="text-xs font-semibold text-primary-dark-green mb-2">
              Accepted Payment Methods
            </div>
            <div className="flex flex-wrap gap-2">
              <Tag color="var(--primary)" style={{ borderRadius: '6px' }}>
                UPI
              </Tag>
              <Tag color="var(--primary)" style={{ borderRadius: '6px' }}>
                Credit Card
              </Tag>
              <Tag color="var(--primary)" style={{ borderRadius: '6px' }}>
                Debit Card
              </Tag>
              <Tag color="var(--primary)" style={{ borderRadius: '6px' }}>
                Net Banking
              </Tag>
              <Tag color="var(--primary)" style={{ borderRadius: '6px' }}>
                Wallets
              </Tag>
            </div>
          </div>

          {/* Trust Information */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '12px',
              marginTop: '16px',
            }}
          >
            <div className="flex items-start gap-3 text-sm">
              <CheckCircleOutlined
                style={{ color: 'var(--primary)', marginTop: '2px' }}
              />
              <div>
                <div className="font-semibold text-primary-dark-green">
                  Secure Payment
                </div>
                <div className="text-muted text-xs">
                  All transactions are encrypted and secure
                </div>
              </div>
            </div>
            <div className="flex items-start gap-3 text-sm">
              <CheckCircleOutlined
                style={{ color: 'var(--primary)', marginTop: '2px' }}
              />
              <div>
                <div className="font-semibold text-primary-dark-green">
                  Refund Policy
                </div>
                <div className="text-muted text-xs">
                  <a
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      // Open refund policy modal/page
                    }}
                    style={{ color: 'var(--primary)' }}
                  >
                    View refund policy
                  </a>
                </div>
              </div>
            </div>
            <div className="flex items-start gap-3 text-sm">
              <CheckCircleOutlined
                style={{ color: 'var(--primary)', marginTop: '2px' }}
              />
              <div>
                <div className="font-semibold text-primary-dark-green">
                  Need Help?
                </div>
                <div
                  style={{
                    fontSize: '12px',
                    color: 'var(--text-muted)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '4px',
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                    }}
                  >
                    <PhoneOutlined />
                    <a href="tel:+911234567890" style={{ color: 'var(--primary)' }}>
                      +91 123 456 7890
                    </a>
                  </div>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                    }}
                  >
                    <MailOutlined />
                    <a
                      href="mailto:support@rupeeflow.com"
                      style={{ color: 'var(--primary)' }}
                    >
                      support@rupeeflow.com
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {paymentLink.expiry && (
            <div className="mt-4 text-center">
              <div className="text-xs text-muted">
                This link expires on{' '}
                {new Date(paymentLink.expiry).toLocaleString()}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <Divider style={{ margin: 0 }} />
        <div
          style={{
            padding: '16px 24px',
            textAlign: 'center',
            background: 'var(--background)',
          }}
        >
          <div className="flex items-center justify-center gap-2 text-sm">
            <SafetyCertificateOutlined style={{ color: 'var(--primary)' }} />
            <span className="font-semibold text-primary-green">RupeeFlow</span>
            <span className="text-muted">· Secure payments</span>
          </div>
        </div>
      </div>
    </div>
  );
}
