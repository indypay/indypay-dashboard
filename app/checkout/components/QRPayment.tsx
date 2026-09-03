'use client';

import { useState, useEffect } from 'react';
import { Button, Spin, message } from 'antd';
import { QrcodeOutlined, ReloadOutlined } from '@ant-design/icons';
import QRCode from 'qrcode';
import { safeAny } from '@/lib/interfaces/global.interface';
import { formatAmount } from '@/lib/utils/utils';
import { useTenantPageTheme } from '@/lib/utils/tenant-page-theme';

interface QRPaymentProps {
  paymentLink: safeAny;
  onPaymentInitiated?: () => void;
}

const QR_SIZE_PX = 160;

export function QRPayment({ paymentLink, onPaymentInitiated }: QRPaymentProps) {
  const theme = useTenantPageTheme();
  const [qrDataUrl, setQrDataUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    generateQRCode();
  }, [paymentLink, theme.secondary]);

  const getQRPayload = (): string => {
    // Use payment link URL so scanning opens this checkout (or replace with UPI intent from backend)
    if (typeof window !== 'undefined') {
      return window.location.href;
    }
    return JSON.stringify({
      amount: paymentLink?.amount,
      orderId: paymentLink?.orderId,
      paymentLinkId: paymentLink?.id,
    });
  };

  const generateQRCode = async () => {
    try {
      setLoading(true);
      setError(null);
      const payload = getQRPayload();
      const dataUrl = await QRCode.toDataURL(payload, {
        width: QR_SIZE_PX,
        margin: 2,
        color: { dark: theme.secondary, light: '#FFFFFF' },
        errorCorrectionLevel: 'M',
      });
      setQrDataUrl(dataUrl);
    } catch (err: safeAny) {
      setError(err?.message || 'Failed to generate QR code');
      message.error('Failed to generate QR code');
    } finally {
      setLoading(false);
    }
  };

  const handleScanQR = () => {
    // Open camera for QR scanning
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices
        .getUserMedia({ video: { facingMode: 'environment' } })
        .then((stream) => {
          // Handle camera stream for QR scanning
          // You would integrate a QR scanner library here
          message.info('Camera access granted. Point at QR code to scan.');
        })
        .catch((err) => {
          message.error('Camera access denied or not available');
          console.error('Camera error:', err);
        });
    } else {
      message.warning('Camera not available on this device');
    }
  };

  return (
    <div style={{ padding: '4px 0' }}>
      <div style={{ textAlign: 'center', marginBottom: 8 }}>
        <p
          style={{ fontSize: 13, fontWeight: 600, color: '#111827', margin: 0 }}
        >
          Scan or pay (UAT demo)
        </p>
      </div>

      {/* QR Code Display - centered */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          marginBottom: '12px',
          width: '100%',
        }}
      >
        {loading ? (
          <div
            style={{
              width: `${QR_SIZE_PX}px`,
              height: `${QR_SIZE_PX}px`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: '#F3F4F6',
              borderRadius: '12px',
              border: '1px solid #E5E7EB',
            }}
          >
            <Spin size="large" />
          </div>
        ) : error ? (
          <div
            style={{
              width: `${QR_SIZE_PX}px`,
              height: `${QR_SIZE_PX}px`,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              background: '#FEF2F2',
              borderRadius: '12px',
              border: '1px solid #FCA5A5',
              padding: '20px',
            }}
          >
            <p
              style={{
                color: '#DC2626',
                marginBottom: '16px',
                textAlign: 'center',
              }}
            >
              {error}
            </p>
            <Button
              icon={<ReloadOutlined />}
              onClick={generateQRCode}
              style={{
                background: '#FFFFFF',
                borderColor: '#E5E7EB',
                color: theme.primary,
              }}
            >
              Retry
            </Button>
          </div>
        ) : (
          <div
            style={{
              width: QR_SIZE_PX,
              height: QR_SIZE_PX,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: '#fff',
              borderRadius: 10,
              border: '2px solid #E5E7EB',
              padding: 8,
              boxSizing: 'border-box',
            }}
          >
            {qrDataUrl ? (
              <img
                src={qrDataUrl}
                alt="Scan to pay"
                width={QR_SIZE_PX - 16}
                height={QR_SIZE_PX - 16}
                style={{ display: 'block', objectFit: 'contain' }}
              />
            ) : null}
          </div>
        )}
      </div>

      <div
        style={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          gap: 6,
        }}
      >
        <Button
          type="primary"
          size="middle"
          block
          onClick={() => onPaymentInitiated?.()}
          style={{
            background: theme.primary,
            border: 'none',
            color: '#fff',
            fontWeight: 600,
            height: 40,
          }}
        >
          Pay {formatAmount(paymentLink.amount) || `₹${paymentLink.amount}`}{' '}
          (UAT demo)
        </Button>
        {/* <Button type="default" size="small" icon={<QrcodeOutlined />} onClick={handleScanQR} block>
          Scan QR in UPI app
        </Button> */}
      </div>
    </div>
  );
}
