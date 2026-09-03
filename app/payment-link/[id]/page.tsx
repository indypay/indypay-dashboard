'use client';

import { useEffect, useRef, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Spin, Button } from 'antd';
import {
  ArrowLeftOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  SafetyCertificateOutlined,
  WalletOutlined,
} from '@ant-design/icons';
import { safeAny } from '@/lib/interfaces/global.interface';
import { useToast } from '@/lib/components/Toast/ToastContext';
import { getPaymentLinkById } from '@/lib/services/paymentlink-service';
import { PaymentLinkDetails } from '@/app/checkout/components/PaymentLinkDetails';
import { PaymentMethods } from '@/app/checkout/components/PaymentMethods';
import { formatAmount } from '@/lib/utils/utils';
import { useTenantPageTheme } from '@/lib/utils/tenant-page-theme';

type PaymentStatus = 'idle' | 'processing' | 'success';
const DEMO_SUCCESS_DELAY_MS = 2500;

export default function PaymentLinkPage() {
  const theme = useTenantPageTheme();
  const params = useParams();
  const router = useRouter();
  const { showToast } = useToast();
  const [paymentLink, setPaymentLink] = useState<safeAny | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus>('idle');
  const fetchedRef = useRef(false);

  const linkId = params?.id as string;

  useEffect(() => {
    if (!linkId || fetchedRef.current) return;
    fetchedRef.current = true;
    loadPaymentLink();
  }, [linkId]);

  useEffect(() => {
    if (paymentStatus !== 'processing') return;
    const t = setTimeout(
      () => setPaymentStatus('success'),
      DEMO_SUCCESS_DELAY_MS,
    );
    return () => clearTimeout(t);
  }, [paymentStatus]);

  const loadPaymentLink = async () => {
    try {
      setLoading(true);
      setError(null);
      const [data, err] = await getPaymentLinkById(linkId);
      if (err) {
        setError((err as safeAny)?.message || 'Failed to load payment link');
        showToast((err as safeAny)?.message || 'Failed to load', 'error');
        return;
      }
      const details =
        data && typeof data === 'object' && 'data' in data && data.data != null
          ? (data as { data: safeAny }).data
          : data;
      setPaymentLink(details ?? null);
      if (!details) {
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

  const onPaymentInitiated = () => setPaymentStatus('processing');

  const isExpired = (link: safeAny): boolean => {
    const s = link?.status?.toLowerCase();
    if (s === 'expired') return true;
    if (link?.expiresAt && new Date(link.expiresAt) < new Date()) return true;
    return false;
  };

  const isPaid = (link: safeAny): boolean =>
    ['paid', 'success'].includes(link?.status?.toLowerCase());

  if (loading) {
    return (
      <div
        style={{
          height: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: theme.backgroundBase,
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            position: 'absolute',
            width: 320,
            height: 320,
            borderRadius: '50%',
            background: theme.radialGlow,
            top: '20%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
          }}
        />
        <div
          style={{
            background: 'rgba(255,255,255,0.9)',
            borderRadius: 20,
            padding: '32px 40px',
            boxShadow: theme.cardShadow,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 16,
            position: 'relative',
          }}
        >
          <Spin size="large" />
          <span
            style={{
              color: theme.secondary,
              fontWeight: 600,
              fontSize: 15,
              letterSpacing: '-0.01em',
            }}
          >
            Loading payment details...
          </span>
        </div>
      </div>
    );
  }

  if (error || !paymentLink) {
    return (
      <div
        style={{
          height: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: theme.backgroundBase,
          padding: 20,
          position: 'relative',
        }}
      >
        <div
          style={{
            background: 'rgba(255,255,255,0.92)',
            borderRadius: 20,
            padding: '36px 40px',
            boxShadow: theme.cardShadow,
            maxWidth: 400,
            textAlign: 'center',
          }}
        >
          <div
            style={{
              width: 56,
              height: 56,
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 16px',
              border: '2px solid rgba(220,38,38,0.2)',
            }}
          >
            <span style={{ fontSize: 26 }}>⚠️</span>
          </div>
          <h1
            style={{
              fontSize: 21,
              marginBottom: 10,
              color: '#991B1B',
              fontWeight: 700,
              letterSpacing: '-0.02em',
            }}
          >
            Payment Link Not Found
          </h1>
          <p
            style={{
              marginBottom: 24,
              textAlign: 'center',
              color: '#6B7280',
              fontSize: 15,
              lineHeight: 1.55,
            }}
          >
            {error || 'This link does not exist or has expired.'}
          </p>
          <Button
            type="primary"
            icon={<ArrowLeftOutlined />}
            onClick={() => router.push('/')}
            style={{
              background: theme.gradientButton,
              border: 'none',
              color: '#fff',
              fontWeight: 600,
              height: 44,
              paddingLeft: 24,
              paddingRight: 24,
              borderRadius: 12,
              boxShadow: theme.buttonShadow,
            }}
          >
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  if (isExpired(paymentLink)) {
    return (
      <div
        style={{
          height: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: theme.backgroundBase,
          padding: 20,
          position: 'relative',
        }}
      >
        <div
          style={{
            background: 'rgba(255,255,255,0.92)',
            borderRadius: 20,
            padding: '36px 40px',
            boxShadow: theme.cardShadow,
            maxWidth: 400,
            textAlign: 'center',
          }}
        >
          <div
            style={{
              width: 56,
              height: 56,
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 16px',
              border: '2px solid rgba(217,119,6,0.25)',
            }}
          >
            <ClockCircleOutlined style={{ fontSize: 26, color: '#D97706' }} />
          </div>
          <h1
            style={{
              fontSize: 21,
              marginBottom: 10,
              color: '#92400E',
              fontWeight: 700,
              letterSpacing: '-0.02em',
            }}
          >
            Link Expired
          </h1>
          <p
            style={{
              marginBottom: 24,
              textAlign: 'center',
              color: '#6B7280',
              fontSize: 15,
              lineHeight: 1.55,
            }}
          >
            This payment link is no longer active. Please contact the merchant
            for a new link.
          </p>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              background: '#FEF3C7',
              color: '#92400E',
              fontSize: 13,
              fontWeight: 600,
              padding: '8px 16px',
              borderRadius: 10,
              border: '1px solid rgba(217,119,6,0.2)',
            }}
          >
            <ClockCircleOutlined style={{ fontSize: 13 }} /> This link has
            expired
          </div>
        </div>
      </div>
    );
  }

  if (isPaid(paymentLink)) {
    const amountPaid =
      formatAmount(paymentLink.amount) || `₹${paymentLink.amount}`;
    return (
      <div
        style={{
          height: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: theme.backgroundBase,
          padding: 20,
          position: 'relative',
        }}
      >
        <div
          style={{
            background: 'rgba(255,255,255,0.92)',
            borderRadius: 20,
            padding: '36px 40px',
            boxShadow: theme.cardShadow,
            maxWidth: 400,
            textAlign: 'center',
          }}
        >
          <div
            style={{
              width: 64,
              height: 64,
              borderRadius: '50%',
              background:
                theme.gradientHero,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 16px',
              boxShadow: theme.buttonShadow,
            }}
          >
            <CheckCircleOutlined style={{ fontSize: 32, color: '#fff' }} />
          </div>
          <h1
            style={{
              fontSize: 21,
              marginBottom: 10,
              color: theme.secondary,
              fontWeight: 700,
              letterSpacing: '-0.02em',
            }}
          >
            Already Paid
          </h1>
          <p
            style={{
              marginBottom: 8,
              textAlign: 'center',
              color: '#6B7280',
              fontSize: 15,
              lineHeight: 1.55,
            }}
          >
            This payment link has already been completed.
          </p>
          <p
            style={{
              marginBottom: 24,
              textAlign: 'center',
              color: theme.secondary,
              fontSize: 18,
              fontWeight: 700,
              letterSpacing: '-0.02em',
            }}
          >
            {amountPaid}
          </p>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              color: theme.primary,
              fontSize: 13,
              fontWeight: 600,
            }}
          >
            <SafetyCertificateOutlined /> Transaction complete
          </div>
        </div>
      </div>
    );
  }

  const amountStr =
    formatAmount(paymentLink.amount) || `₹${paymentLink.amount}`;

  return (
    <div
      style={{
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        background: theme.backgroundBase,
        overflow: 'hidden',
        position: 'relative',
      }}
    >
      {/* Subtle background orbs */}
      <div
        style={{
          position: 'absolute',
          top: -80,
          right: -80,
          width: 280,
          height: 280,
          borderRadius: '50%',
          background:
            theme.radialGlowSoft,
          pointerEvents: 'none',
        }}
      />
      <div
        style={{
          position: 'absolute',
          bottom: '15%',
          left: -60,
          width: 200,
          height: 200,
          borderRadius: '50%',
          background:
            'radial-gradient(circle, rgba(16,185,129,0.06) 0%, transparent 70%)',
          pointerEvents: 'none',
        }}
      />

      <header
        style={{
          flexShrink: 0,
          padding: '14px 24px',
          borderBottom: `1px solid ${theme.borderSubtle}`,
          background: 'rgba(255,255,255,0.85)',
          backdropFilter: 'blur(12px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <Button
          type="text"
          icon={<ArrowLeftOutlined />}
          onClick={() => router.push('/')}
          style={{
            color: theme.secondary,
            padding: '4px 0',
            height: 'auto',
            fontSize: 14,
            fontWeight: 600,
            borderRadius: 8,
          }}
        >
          Back
        </Button>
        <span
          style={{
            color: theme.primaryAlpha(0.6),
            fontSize: 13,
            fontWeight: 500,
            letterSpacing: '0.02em',
          }}
        >
          Secure checkout
        </span>
      </header>

      <main
        style={{
          flex: 1,
          minHeight: 0,
          display: 'flex',
          flexWrap: 'wrap',
          gap: 20,
          padding: 20,
          maxWidth: 1000,
          margin: '0 auto',
          width: '100%',
          alignContent: 'flex-start',
          position: 'relative',
        }}
      >
        <section
          style={{
            flex: '1 1 280px',
            minWidth: 0,
            maxWidth: 420,
            background: '#fff',
            borderRadius: 18,
            padding: 24,
            boxShadow: theme.cardShadow,
            overflow: 'auto',
            border: `1px solid ${theme.borderLight}`,
          }}
        >
          <PaymentLinkDetails paymentLink={paymentLink} variant="summary" />
        </section>

        <section
          style={{
            flex: '1 1 320px',
            minWidth: 0,
            minHeight: 280,
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              background: '#fff',
              borderRadius: 18,
              padding: 20,
              boxShadow: theme.cardShadow,
              flex: 1,
              minHeight: 0,
              display: 'flex',
              flexDirection: 'column',
              border: `1px solid ${theme.borderLight}`,
              borderLeft: `4px solid ${theme.primary}`,
            }}
          >
            {paymentStatus === 'idle' && (
              <>
                <div
                  style={{
                    marginBottom: 14,
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: 10,
                  }}
                >
                  <div
                    style={{
                      width: 40,
                      height: 40,
                      borderRadius: 12,
                      background:
                        theme.surfaceTint,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}
                  >
                    <WalletOutlined
                      style={{ fontSize: 20, color: theme.secondary }}
                    />
                  </div>
                  <div>
                    <h2
                      style={{
                        fontSize: 19,
                        fontWeight: 700,
                        color: '#111827',
                        margin: 0,
                        letterSpacing: '-0.025em',
                      }}
                    >
                      Proceed to pay
                    </h2>
                    <p
                      style={{
                        color: '#6B7280',
                        fontSize: 13,
                        margin: '4px 0 0',
                        lineHeight: 1.45,
                      }}
                    >
                      Choose payment method (UAT: payment will auto-succeed)
                    </p>
                  </div>
                </div>
                <div style={{ flex: 1, minHeight: 0, overflow: 'hidden' }}>
                  <PaymentMethods
                    paymentLink={paymentLink}
                    onBack={() => {}}
                    onPaymentInitiated={onPaymentInitiated}
                  />
                </div>
              </>
            )}

            {paymentStatus === 'processing' && (
              <div
                style={{
                  flex: 1,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 20,
                  padding: 24,
                }}
              >
                <div
                  style={{
                    padding: 28,
                    borderRadius: 20,
                    background:
                      theme.surfaceTint,
                    border: `1px solid ${theme.borderMedium}`,
                  }}
                >
                  <Spin size="large" />
                </div>
                <p
                  style={{
                    margin: 0,
                    color: theme.secondary,
                    fontWeight: 700,
                    fontSize: 17,
                    letterSpacing: '-0.02em',
                  }}
                >
                  Processing payment...
                </p>
                <p
                  style={{
                    margin: 0,
                    fontSize: 14,
                    color: '#6B7280',
                    lineHeight: 1.5,
                  }}
                >
                  Please wait a moment. Do not close this page.
                </p>
              </div>
            )}

            {paymentStatus === 'success' && (
              <div
                style={{
                  flex: 1,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  overflowY: 'auto',
                  gap: 0,
                  padding: '20px 16px',
                }}
              >
                {/* Merchant avatar */}
                {paymentLink.user?.fullName && (
                  <div
                    style={{
                      width: 52,
                      height: 52,
                      borderRadius: '50%',
                      background:
                        theme.surfaceTint,
                      border: `2px solid ${theme.borderStrong}`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: 20,
                      fontWeight: 700,
                      color: theme.secondary,
                      marginBottom: 12,
                      flexShrink: 0,
                    }}
                  >
                    {paymentLink.user.fullName.charAt(0).toUpperCase()}
                  </div>
                )}

                {/* Checkmark */}
                <div
                  style={{
                    width: 64,
                    height: 64,
                    borderRadius: '50%',
                    background:
                      theme.gradientHero,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow:
                      theme.buttonShadowLg,
                    marginBottom: 14,
                    flexShrink: 0,
                  }}
                >
                  <CheckCircleOutlined
                    style={{ fontSize: 34, color: '#fff' }}
                  />
                </div>

                {/* Thank you message — custom or default */}
                <p
                  style={{
                    margin: '0 0 4px',
                    fontSize: 20,
                    fontWeight: 700,
                    color: theme.secondary,
                    letterSpacing: '-0.025em',
                    textAlign: 'center',
                  }}
                >
                  {paymentLink.thankYouMessage
                    ? paymentLink.thankYouMessage
                    : 'Payment successful!'}
                </p>
                <p
                  style={{
                    margin: '0 0 16px',
                    fontSize: 14,
                    color: '#6B7280',
                    textAlign: 'center',
                    lineHeight: 1.5,
                  }}
                >
                  {amountStr} received
                  {paymentLink.user?.fullName
                    ? ` by ${paymentLink.user.fullName}`
                    : ''}
                </p>

                {/* Order details card */}
                <div
                  style={{
                    width: '100%',
                    background: '#F0FDF4',
                    border: `1px solid ${theme.borderMedium}`,
                    borderRadius: 12,
                    padding: '12px 14px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 8,
                    marginBottom: 14,
                  }}
                >
                  <p
                    style={{
                      margin: 0,
                      fontSize: 11,
                      fontWeight: 600,
                      color: theme.primary,
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em',
                    }}
                  >
                    Order details
                  </p>
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}
                  >
                    <span style={{ fontSize: 13, color: '#6B7280' }}>
                      Amount paid
                    </span>
                    <span
                      style={{
                        fontSize: 15,
                        fontWeight: 700,
                        color: theme.secondary,
                      }}
                    >
                      {amountStr}
                    </span>
                  </div>
                  {paymentLink.description && (
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'flex-start',
                        gap: 8,
                      }}
                    >
                      <span
                        style={{
                          fontSize: 13,
                          color: '#6B7280',
                          flexShrink: 0,
                        }}
                      >
                        Note
                      </span>
                      <span
                        style={{
                          fontSize: 13,
                          color: '#374151',
                          fontWeight: 500,
                          textAlign: 'right',
                        }}
                      >
                        {paymentLink.description}
                      </span>
                    </div>
                  )}
                  {paymentLink.orderId && (
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                      }}
                    >
                      <span style={{ fontSize: 13, color: '#6B7280' }}>
                        Order ID
                      </span>
                      <span
                        style={{
                          fontSize: 12,
                          color: '#374151',
                          fontFamily: 'monospace',
                        }}
                      >
                        {paymentLink.orderId}
                      </span>
                    </div>
                  )}
                  {paymentLink.txnRefId && (
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                      }}
                    >
                      <span style={{ fontSize: 13, color: '#6B7280' }}>
                        Txn Ref
                      </span>
                      <span
                        style={{
                          fontSize: 12,
                          color: '#374151',
                          fontFamily: 'monospace',
                        }}
                      >
                        {paymentLink.txnRefId}
                      </span>
                    </div>
                  )}
                </div>

                {/* Secured badge */}
                <div
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 6,
                    color: theme.primary,
                    fontSize: 12,
                    fontWeight: 600,
                  }}
                >
                  <SafetyCertificateOutlined /> Secured by RupeeFlow
                </div>
              </div>
            )}
          </div>
        </section>
      </main>

      <footer
        style={{
          flexShrink: 0,
          padding: '12px 24px',
          borderTop: `1px solid ${theme.primaryAlpha(0.1)}`,
          background: 'rgba(255,255,255,0.8)',
          backdropFilter: 'blur(8px)',
          textAlign: 'center',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 8,
        }}
      >
        <SafetyCertificateOutlined style={{ color: theme.primary, fontSize: 14 }} />
        <span
          style={{
            color: theme.secondary,
            fontSize: 14,
            fontWeight: 700,
            letterSpacing: '-0.02em',
          }}
        >
          ₹ RupeeFlow
        </span>
        <span style={{ color: '#6B7280', fontSize: 13, marginLeft: 4 }}>
          · Secure payments
        </span>
      </footer>
    </div>
  );
}
