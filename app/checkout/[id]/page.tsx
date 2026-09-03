'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Spin, Button } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
import { PaymentLinkDetails } from '@/app/checkout/components/PaymentLinkDetails';
import { PaymentMethods } from '@/app/checkout/components/PaymentMethods';
import { safeAny } from '@/lib/interfaces/global.interface';
import { useToast } from '@/lib/components/Toast/ToastContext';
import { getPaymentLinkById } from '@/lib/services/paymentlink-service';

export default function CheckoutPage() {
  const params = useParams();
  const router = useRouter();
  const { showToast } = useToast();
  const [paymentLink, setPaymentLink] = useState<safeAny | null>(null);
  const [loading, setLoading] = useState(true);
  const [showPaymentMethods, setShowPaymentMethods] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const paymentLinkId = params?.id as string;

  useEffect(() => {
    if (paymentLinkId) {
      loadPaymentLink();
    }
  }, [paymentLinkId]);

  const loadPaymentLink = async () => {
    try {
      setLoading(true);
      setError(null);
      const [data, error] = await getPaymentLinkById(paymentLinkId);

      if (error) {
        setError(error?.message || 'Failed to load payment link');
        showToast(error?.message || 'Failed to load payment link', 'error');
        return;
      }

      if (data) {
        setPaymentLink(data);
      } else {
        setError('Payment link not found');
        showToast('Payment link not found', 'error');
      }
    } catch (err: safeAny) {
      setError(err?.message || 'Failed to load payment link');
      showToast('Failed to load payment link', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handlePayClick = () => {
    setShowPaymentMethods(true);
  };

  const handleBack = () => {
    if (showPaymentMethods) {
      setShowPaymentMethods(false);
    } else {
      router.back();
    }
  };

  if (loading) {
    return (
      <div
        style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #01261D 0%, #0C0C0C 100%)',
        }}
      >
        <Spin size="large" tip="Loading payment details..." />
      </div>
    );
  }

  if (error || !paymentLink) {
    return (
      <div
        style={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #01261D 0%, #0C0C0C 100%)',
          color: '#B1C4C1',
          padding: '20px',
        }}
      >
        <h1
          style={{ fontSize: '24px', marginBottom: '16px', color: '#D51C44' }}
        >
          Payment Link Not Found
        </h1>
        <p style={{ marginBottom: '24px', textAlign: 'center' }}>
          {error ||
            'The payment link you are looking for does not exist or has expired.'}
        </p>
        <Button
          type="primary"
          icon={<ArrowLeftOutlined />}
          onClick={() => router.push('/')}
          style={{
            background: 'linear-gradient(to right, #53BEC2, #00EF64)',
            border: 'none',
            color: '#0C0C0C',
            fontWeight: 600,
          }}
        >
          Go Back
        </Button>
      </div>
    );
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #01261D 0%, #0C0C0C 100%)',
        padding: '20px',
      }}
    >
      <div
        style={{
          maxWidth: '600px',
          margin: '0 auto',
        }}
      >
        {/* Back Button */}
        <Button
          type="text"
          icon={<ArrowLeftOutlined />}
          onClick={handleBack}
          style={{
            color: '#B1C4C1',
            marginBottom: '24px',
            padding: '8px 0',
          }}
        >
          {showPaymentMethods ? 'Back to Details' : 'Back'}
        </Button>

        {!showPaymentMethods ? (
          <PaymentLinkDetails
            paymentLink={paymentLink}
            onPayClick={handlePayClick}
          />
        ) : (
          <PaymentMethods
            paymentLink={paymentLink}
            onBack={() => setShowPaymentMethods(false)}
          />
        )}
      </div>
    </div>
  );
}
