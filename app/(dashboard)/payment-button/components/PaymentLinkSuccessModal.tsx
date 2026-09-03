'use client';

import { useState } from 'react';
import { Modal, Button, Input, QRCode, Space, Divider } from 'antd';
import {
  CheckCircleOutlined,
  CopyOutlined,
  ShareAltOutlined,
  QrcodeOutlined,
  CodeOutlined,
  BarChartOutlined,
  WhatsAppOutlined,
} from '@ant-design/icons';
import { createStyles } from 'antd-style';
import { useToast } from '@/lib/components/Toast/ToastContext';
import { getUserProfiles } from '@/lib/hooks/user-profile';

const useStyles = createStyles(({ css }) => ({
  modalContent: css`
    .ant-modal-content {
      background: #ffffff;
      border-radius: 16px;
    }
    .ant-modal-header {
      background: linear-gradient(to right, var(--border), var(--primary));
      border: none;
      padding: 24px;
      border-radius: 16px 16px 0 0;
    }
    .ant-modal-title {
      color: #ffffff;
      font-size: 20px;
      font-weight: 700;
    }
    .ant-modal-body {
      padding: 24px;
      background: #ffffff;
    }
  `,
  successIcon: css`
    width: 64px;
    height: 64px;
    border-radius: 50%;
    background: linear-gradient(135deg, #0dd25f 0%, var(--primary) 100%);
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 auto 16px;
    box-shadow: 0 8px 24px rgba(13, 210, 95, 0.3);
  `,
  linkInput: css`
    background: var(--background) !important;
    border-color: var(--border) !important;
    color: var(--text) !important;
    border-radius: 8px !important;
    font-family: monospace !important;

    &:focus,
    &.ant-input-focused {
      border-color: var(--primary) !important;
      box-shadow: 0 0 0 2px rgba(0, 135, 90, 0.1) !important;
    }
  `,
  actionButton: css`
    height: 44px !important;
    border-radius: 10px !important;
    font-weight: 600 !important;
    display: flex !important;
    align-items: center !important;
    gap: 8px !important;
  `,
  primaryButton: css`
    background: linear-gradient(to right, var(--secondary), var(--primary)) !important;
    border: none !important;
    color: #ffffff !important;

    &:hover {
      box-shadow: 0 4px 12px rgba(0, 135, 90, 0.3) !important;
    }
  `,
  secondaryButton: css`
    background: #ffffff !important;
    border: 1px solid var(--border) !important;
    color: var(--text) !important;

    &:hover {
      border-color: var(--primary) !important;
      color: var(--primary) !important;
    }
  `,
}));

interface PaymentLinkSuccessModalProps {
  open: boolean;
  onClose: () => void;
  paymentLink: any;
  onCopyLink: (url: string) => void;
}

export default function PaymentLinkSuccessModal({
  open,
  onClose,
  paymentLink,
  onCopyLink,
}: PaymentLinkSuccessModalProps) {
  const { styles } = useStyles();
  const { showToast } = useToast();
  const [showQR, setShowQR] = useState(false);
  const [showEmbed, setShowEmbed] = useState(false);

  const { data: profileData } = getUserProfiles();
  const merchantName = profileData?.[0]?.data?.fullName || 'RupeeFlow Merchant';

  if (!paymentLink) return null;

  const handleCopyLink = () => {
    onCopyLink(paymentLink.linkUrl);
  };

  const handleShareWhatsApp = () => {
    const amount = paymentLink.amount ? `₹${paymentLink.amount}` : '';
    const note = paymentLink.purpose || paymentLink.description || '';
    const text = note
      ? `Hi, please pay ${amount} for ${note} here: ${paymentLink.linkUrl} — ${merchantName}`
      : `Hi, please pay ${amount} here: ${paymentLink.linkUrl} — ${merchantName}`;
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(text)}`;
    window.open(whatsappUrl, '_blank');
    showToast('Opening WhatsApp...', 'success');
  };

  const handleCopyEmbedCode = () => {
    const embedCode = `<iframe src="${paymentLink.linkUrl}" width="100%" height="600" frameborder="0"></iframe>`;
    navigator.clipboard.writeText(embedCode);
    showToast('Embed code copied to clipboard', 'success');
  };

  const embedCode = `<iframe src="${paymentLink.linkUrl}" width="100%" height="600" frameborder="0"></iframe>`;

  return (
    <Modal
      title={
        <div className="flex items-center gap-2">
          <CheckCircleOutlined style={{ fontSize: '24px' }} />
          <span>Payment Link Created Successfully!</span>
        </div>
      }
      open={open}
      onCancel={onClose}
      footer={null}
      width={600}
      className={styles.modalContent}
      destroyOnClose
    >
      <div style={{ textAlign: 'center', marginBottom: '24px' }}>
        <div className={styles.successIcon}>
          <CheckCircleOutlined style={{ fontSize: '32px', color: '#FFFFFF' }} />
        </div>
        <h3
          style={{
            fontSize: '20px',
            fontWeight: 700,
            color: 'var(--text)',
            marginBottom: '8px',
          }}
        >
          Your payment link is ready!
        </h3>
        <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>
          Share this link with your customer to collect payment securely.
        </p>
      </div>

      {/* Link Display */}
      <div style={{ marginBottom: '16px' }}>
        <label
          style={{
            display: 'block',
            fontSize: '14px',
            fontWeight: 600,
            color: 'var(--text)',
            marginBottom: '8px',
          }}
        >
          Payment Link URL
        </label>
        <div className="flex gap-2">
          <Input
            value={paymentLink.linkUrl}
            readOnly
            className={styles.linkInput}
            size="large"
          />
          <Button
            type="primary"
            icon={<CopyOutlined />}
            onClick={handleCopyLink}
            className={`${styles.actionButton} ${styles.primaryButton}`}
          >
            Copy
          </Button>
        </div>
      </div>

      {/* Quick Actions */}
      <div style={{ marginBottom: '16px' }}>
        <Space wrap style={{ width: '100%', justifyContent: 'center' }}>
          <Button
            icon={<WhatsAppOutlined />}
            onClick={handleShareWhatsApp}
            className={`${styles.actionButton} ${styles.primaryButton}`}
          >
            Share on WhatsApp
          </Button>
          <Button
            icon={<QrcodeOutlined />}
            onClick={() => setShowQR(!showQR)}
            className={`${styles.actionButton} ${styles.secondaryButton}`}
          >
            Generate QR
          </Button>
          <Button
            icon={<CodeOutlined />}
            onClick={() => setShowEmbed(!showEmbed)}
            className={`${styles.actionButton} ${styles.secondaryButton}`}
          >
            Embed Code
          </Button>
          <Button
            icon={<BarChartOutlined />}
            onClick={() => {
              showToast('Analytics coming soon!', 'hint');
            }}
            className={`${styles.actionButton} ${styles.secondaryButton}`}
          >
            View Analytics
          </Button>
        </Space>
      </div>

      {/* QR Code Section */}
      {showQR && (
        <div
          style={{
            marginBottom: '16px',
            padding: '16px',
            background: 'var(--background)',
            borderRadius: '8px',
            border: '1px solid var(--border)',
          }}
        >
          <div style={{ textAlign: 'center' }}>
            <p
              style={{
                fontSize: '14px',
                fontWeight: 600,
                color: 'var(--text)',
                marginBottom: '12px',
              }}
            >
              Scan QR Code to Pay
            </p>
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                padding: '16px',
                background: '#FFFFFF',
                borderRadius: '8px',
              }}
            >
              <QRCode
                value={paymentLink.linkUrl}
                size={200}
                errorLevel="M"
                iconSize={40}
              />
            </div>
            <p
              style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '12px' }}
            >
              Customer can scan this QR code to open the payment page
            </p>
          </div>
        </div>
      )}

      {/* Embed Code Section */}
      {showEmbed && (
        <div
          style={{
            marginBottom: '16px',
            padding: '16px',
            background: 'var(--background)',
            borderRadius: '8px',
            border: '1px solid var(--border)',
          }}
        >
          <div style={{ marginBottom: '8px' }}>
            <p
              style={{
                fontSize: '14px',
                fontWeight: 600,
                color: 'var(--text)',
                marginBottom: '8px',
              }}
            >
              Embed Code
            </p>
            <p
              style={{
                fontSize: '12px',
                color: 'var(--text-muted)',
                marginBottom: '12px',
              }}
            >
              Copy and paste this code into your website HTML
            </p>
          </div>
          <div className="flex gap-2">
            <Input.TextArea
              value={embedCode}
              readOnly
              rows={3}
              className={styles.linkInput}
              style={{ fontFamily: 'monospace', fontSize: '12px' }}
            />
            <Button
              type="primary"
              icon={<CopyOutlined />}
              onClick={handleCopyEmbedCode}
              className={`${styles.actionButton} ${styles.primaryButton}`}
            >
              Copy
            </Button>
          </div>
        </div>
      )}

      <Divider style={{ margin: '16px 0' }} />

      {/* Trust Building Info */}
      <div
        style={{
          background: 'var(--background)',
          padding: '16px',
          borderRadius: '8px',
          border: '1px solid var(--border)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
          <CheckCircleOutlined
            style={{ color: 'var(--primary)', fontSize: '18px', marginTop: '2px' }}
          />
          <div>
            <p
              style={{
                fontSize: '14px',
                fontWeight: 600,
                color: 'var(--text)',
                marginBottom: '4px',
              }}
            >
              What happens next?
            </p>
            <ul
              style={{
                fontSize: '12px',
                color: 'var(--text-muted)',
                listStyle: 'disc',
                paddingLeft: '20px',
                margin: 0,
              }}
            >
              <li>Customer receives the payment link</li>
              <li>They complete payment securely</li>
              <li>You get notified instantly</li>
              <li>Funds are settled to your account</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Close Button */}
      <div
        style={{
          marginTop: '24px',
          display: 'flex',
          justifyContent: 'flex-end',
        }}
      >
        <Button
          type="primary"
          size="large"
          onClick={onClose}
          className={`${styles.actionButton} ${styles.primaryButton}`}
          style={{ padding: '0 32px' }}
        >
          Done
        </Button>
      </div>
    </Modal>
  );
}
