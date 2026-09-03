'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import {
  Spin,
  Button,
  Input,
  InputNumber,
  Divider,
  Select,
  message,
} from 'antd';
import {
  MailOutlined,
  PhoneOutlined,
  UserOutlined,
  HomeOutlined,
  CheckCircleFilled,
} from '@ant-design/icons';
import {
  getPublicCheckoutPage,
  payCheckoutPage,
} from '@/lib/services/checkout-page.service';
import type { CheckoutPageRecord } from '@/lib/interfaces/checkout-page.interface';
import { safeAny } from '@/lib/interfaces/global.interface';
import { decodeHtmlEntities } from '@/lib/utils/utils';
import { useTenant } from '@/context/TenantContext';

function UpiIcon() {
  return (
    <svg width="32" height="20" viewBox="0 0 32 20" fill="none">
      <rect width="32" height="20" rx="3" fill="#F4F4F4" />
      <text
        x="50%"
        y="50%"
        dominantBaseline="middle"
        textAnchor="middle"
        fontSize="7"
        fontWeight="bold"
        fill="#6739B7"
      >
        UPI
      </text>
    </svg>
  );
}
function VisaIcon() {
  return (
    <svg width="32" height="20" viewBox="0 0 32 20" fill="none">
      <rect width="32" height="20" rx="3" fill="#1A1F71" />
      <text
        x="50%"
        y="55%"
        dominantBaseline="middle"
        textAnchor="middle"
        fontSize="8"
        fontWeight="bold"
        fill="#FFFFFF"
        fontStyle="italic"
      >
        VISA
      </text>
    </svg>
  );
}
function MastercardIcon() {
  return (
    <svg width="32" height="20" viewBox="0 0 32 20" fill="none">
      <rect width="32" height="20" rx="3" fill="#F4F4F4" />
      <circle cx="12" cy="10" r="6" fill="#EB001B" />
      <circle cx="20" cy="10" r="6" fill="#F79E1B" />
      <path
        d="M16 5.8A6 6 0 0 1 20 10a6 6 0 0 1-4 4.2A6 6 0 0 1 12 10a6 6 0 0 1 4-4.2z"
        fill="#FF5F00"
      />
    </svg>
  );
}
function RupayIcon() {
  return (
    <svg width="32" height="20" viewBox="0 0 32 20" fill="none">
      <rect width="32" height="20" rx="3" fill="#F4F4F4" />
      <text
        x="50%"
        y="55%"
        dominantBaseline="middle"
        textAnchor="middle"
        fontSize="6"
        fontWeight="bold"
        fill="#006B3F"
      >
        RuPay
      </text>
    </svg>
  );
}

interface FormState {
  name: string;
  email: string;
  mobile: string;
  amount: number | null;
  address: string;
  customFieldValues: Record<string, string>;
}

export default function PublicCheckoutPageView() {
  const { tenantConfig } = useTenant();
  const c = tenantConfig.colors;
  const params = useParams();
  const id = params?.id as string;
  const [page, setPage] = useState<CheckoutPageRecord | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [paid, setPaid] = useState(false);

  const [form, setForm] = useState<FormState>({
    name: '',
    email: '',
    mobile: '',
    amount: null,
    address: '',
    customFieldValues: {},
  });

  useEffect(() => {
    if (!id) return;
    (async () => {
      setLoading(true);
      setError(null);
      const [data, err] = await getPublicCheckoutPage(id);
      if (err) {
        setError((err as safeAny)?.message ?? 'Page not found');
        setPage(null);
      } else {
        setPage(data ?? null);
      }
      setLoading(false);
    })();
  }, [id]);

  const updateField = (key: keyof FormState, value: string | number | null) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const updateCustomField = (key: string, value: string) => {
    setForm((prev) => ({
      ...prev,
      customFieldValues: { ...prev.customFieldValues, [key]: value },
    }));
  };

  const handlePay = async () => {
    if (!page) return;

    // Basic validation
    if (!form.name.trim()) {
      message.error('Please enter your name');
      return;
    }
    if (!form.email.trim()) {
      message.error('Please enter your email');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      message.error('Please enter a valid email');
      return;
    }
    if (!form.mobile.trim() || form.mobile.replace(/\D/g, '').length !== 10) {
      message.error('Please enter a valid 10-digit mobile number');
      return;
    }
    if (page.amountType === 'USER_ENTERED') {
      const min = page.minimumAmount ?? 1;
      if (!form.amount || form.amount < min) {
        message.error(`Please enter a valid amount (minimum ₹${min})`);
        return;
      }
    }
    if (page.collectAddress && !form.address.trim()) {
      message.error('Please enter your address');
      return;
    }

    // Validate required custom fields
    for (const f of page.customFields ?? []) {
      if (f.required && !form.customFieldValues[f.key]?.trim()) {
        message.error(`Please fill in: ${f.label}`);
        return;
      }
    }

    setSubmitting(true);
    try {
      const { checkoutUrl } = await payCheckoutPage(id, {
        name: form.name.trim(),
        email: form.email.trim(),
        mobile: form.mobile.replace(/\D/g, ''),
        ...(page.amountType === 'USER_ENTERED' && form.amount
          ? { amount: form.amount }
          : {}),
        ...(page.collectAddress ? { address: form.address.trim() } : {}),
        ...(Object.keys(form.customFieldValues).length
          ? { customFieldValues: form.customFieldValues }
          : {}),
      });
      window.location.href = checkoutUrl;
    } catch (e) {
      const msg =
        (e as safeAny)?.response?.data?.message ??
        (e as safeAny)?.message ??
        'Payment failed. Please try again.';
      message.error(msg);
    } finally {
      setSubmitting(false);
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
          background: c.background,
        }}
      >
        <Spin size="large" />
      </div>
    );
  }

  if (error || !page) {
    return (
      <div
        style={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: c.background,
          padding: 24,
        }}
      >
        <h1 style={{ color: c.text, marginBottom: 8 }}>Page not found</h1>
        <p style={{ color: c.textMuted }}>
          {error ?? 'This checkout page does not exist.'}
        </p>
      </div>
    );
  }

  if (paid) {
    return (
      <div
        style={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: c.background,
          padding: 24,
        }}
      >
        <CheckCircleFilled
          style={{ fontSize: 64, color: c.primary, marginBottom: 16 }}
        />
        <h1 style={{ color: c.text, marginBottom: 8 }}>
          Payment Successful!
        </h1>
        <p
          style={{
            color: c.textMuted,
            fontSize: 16,
            textAlign: 'center',
            maxWidth: 400,
          }}
        >
          {page.successMessage ||
            'Thank you for your payment. We will get in touch with you soon.'}
        </p>
      </div>
    );
  }

  const primaryColor = page.primaryColor || c.primary;
  const buttonText = page.buttonText || 'Pay Now';
  const isFixedAmount = page.amountType === 'FIXED' && page.fixedAmount != null;
  const displayAmount = isFixedAmount
    ? Number(page.fixedAmount).toLocaleString('en-IN', {
        minimumFractionDigits: 2,
      })
    : null;

  return (
    <div style={{ minHeight: '100vh', background: c.background }}>
      <div
        style={{
          display: 'flex',
          gap: 24,
          padding: 24,
          maxWidth: 1280,
          margin: '0 auto',
          alignItems: 'flex-start',
          flexWrap: 'wrap',
        }}
      >
        {/* Left: Page info */}
        <div style={{ flex: '1 1 480px', minWidth: 0 }}>
          <div
            style={{
              background: '#ffffff',
              border: '1px solid #e5e7eb',
              borderRadius: 12,
              boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
              padding: 32,
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                justifyContent: 'space-between',
                marginBottom: 28,
                flexWrap: 'wrap',
                gap: 16,
              }}
            >
              <div>
                {page.logoUrl && (
                  <div style={{ marginBottom: 12 }}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={page.logoUrl}
                      alt={page.name}
                      style={{
                        maxHeight: 56,
                        maxWidth: 160,
                        objectFit: 'contain',
                      }}
                    />
                  </div>
                )}
                <div style={{ fontSize: 20, fontWeight: 700, color: '#111' }}>
                  {page.name}
                </div>
                <div style={{ color: '#999', fontSize: 12, marginTop: 2 }}>
                  powered by RupeeFlow
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div
                  style={{
                    fontSize: 24,
                    fontWeight: 800,
                    color: '#1a1a1a',
                    letterSpacing: '2px',
                    textTransform: 'uppercase',
                  }}
                >
                  PAYMENT PAGE
                </div>
              </div>
            </div>

            <Divider style={{ margin: '0 0 24px 0' }} />

            <div
              style={{
                fontSize: 22,
                fontWeight: 700,
                color: '#111',
                paddingBottom: 8,
                borderBottom: `2px solid ${primaryColor}`,
                marginBottom: 24,
              }}
            >
              {page.title}
            </div>

            {page.pageDescription && (
              <div style={{ marginBottom: 24 }}>
                <div
                  style={{
                    color: '#374151',
                    fontSize: 12,
                    fontWeight: 600,
                    marginBottom: 8,
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px',
                  }}
                >
                  Page Description
                </div>
                <div
                  className="checkout-page-description"
                  style={{
                    fontSize: 15,
                    lineHeight: 1.7,
                    color: '#111',
                    padding: '12px 14px',
                    border: '1px solid #e5e7eb',
                    borderRadius: 6,
                    background: '#fff',
                  }}
                  dangerouslySetInnerHTML={{
                    __html: decodeHtmlEntities(page.pageDescription),
                  }}
                />
              </div>
            )}

            {(page.contactEmail || page.contactMobile) && (
              <div style={{ marginBottom: 24 }}>
                <div
                  style={{
                    color: '#374151',
                    fontSize: 13,
                    fontWeight: 700,
                    marginBottom: 10,
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px',
                  }}
                >
                  Contact Us
                </div>
                <div
                  style={{ display: 'flex', flexDirection: 'column', gap: 8 }}
                >
                  {page.contactEmail && (
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 8,
                        borderBottom: '1px solid #e5e7eb',
                        paddingBottom: 8,
                      }}
                    >
                      <MailOutlined style={{ color: '#999', fontSize: 16 }} />
                      <span style={{ color: '#111', fontSize: 14 }}>
                        {page.contactEmail}
                      </span>
                    </div>
                  )}
                  {page.contactMobile && (
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 8,
                        borderBottom: '1px solid #e5e7eb',
                        paddingBottom: 8,
                      }}
                    >
                      <PhoneOutlined style={{ color: '#999', fontSize: 16 }} />
                      <span style={{ color: '#111', fontSize: 14 }}>
                        {page.contactMobile}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {page.termsAndConditions && (
              <div style={{ marginBottom: 20 }}>
                <div
                  style={{
                    color: '#374151',
                    fontSize: 12,
                    fontWeight: 700,
                    marginBottom: 8,
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px',
                  }}
                >
                  Terms and Conditions
                </div>
                <div
                  style={{
                    padding: 16,
                    background: '#f9fafb',
                    border: '1px solid #e5e7eb',
                    borderRadius: 8,
                    fontSize: 13,
                    color: '#374151',
                    lineHeight: 1.6,
                    whiteSpace: 'pre-wrap',
                  }}
                >
                  {page.termsAndConditions}
                </div>
              </div>
            )}

            <div style={{ color: '#9ca3af', fontSize: 11, lineHeight: 1.5 }}>
              You agree to share information entered on this page with{' '}
              <strong style={{ color: '#6b7280' }}>
                {page.name || 'the merchant'}
              </strong>{' '}
              and RupeeFlow, adhering to applicable laws.
            </div>
          </div>
        </div>

        {/* Right: Payment form */}
        <div style={{ width: 380, flexShrink: 0 }}>
          <div
            style={{
              background: '#ffffff',
              border: '1px solid #e5e7eb',
              borderRadius: 12,
              boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
              padding: 24,
              position: 'sticky',
              top: 24,
            }}
          >
            <div style={{ marginBottom: 20 }}>
              <h3
                style={{
                  color: '#111',
                  fontSize: 18,
                  fontWeight: 700,
                  margin: '0 0 6px 0',
                }}
              >
                Payment Details
              </h3>
              <div
                style={{
                  height: 3,
                  width: 48,
                  background: primaryColor,
                  borderRadius: 2,
                }}
              />
            </div>

            {/* Amount */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: 16,
                minHeight: 36,
              }}
            >
              <span
                style={{
                  color: '#374151',
                  fontSize: 13,
                  fontWeight: 600,
                  minWidth: 80,
                }}
              >
                Amount
              </span>
              {isFixedAmount ? (
                <span style={{ fontSize: 18, fontWeight: 700, color: '#111' }}>
                  ₹ {displayAmount}
                </span>
              ) : (
                <InputNumber
                  placeholder={`Min ₹${page.minimumAmount ?? 1}`}
                  prefix="₹"
                  min={page.minimumAmount ?? 1}
                  value={form.amount}
                  onChange={(v) => updateField('amount', v)}
                  style={{ width: 180 }}
                  size="middle"
                  controls={false}
                />
              )}
            </div>

            {/* Name */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: 12,
              }}
            >
              <span
                style={{
                  color: '#374151',
                  fontSize: 13,
                  fontWeight: 600,
                  minWidth: 80,
                }}
              >
                Name <span style={{ color: '#ef4444' }}>*</span>
              </span>
              <Input
                placeholder="Your full name"
                prefix={<UserOutlined style={{ color: '#ccc' }} />}
                value={form.name}
                onChange={(e) => updateField('name', e.target.value)}
                size="middle"
                style={{ flex: 1, maxWidth: 200 }}
              />
            </div>

            {/* Email */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: 12,
              }}
            >
              <span
                style={{
                  color: '#374151',
                  fontSize: 13,
                  fontWeight: 600,
                  minWidth: 80,
                }}
              >
                Email <span style={{ color: '#ef4444' }}>*</span>
              </span>
              <Input
                placeholder="you@email.com"
                prefix={<MailOutlined style={{ color: '#ccc' }} />}
                value={form.email}
                onChange={(e) => updateField('email', e.target.value)}
                size="middle"
                style={{ flex: 1, maxWidth: 200 }}
              />
            </div>

            {/* Phone */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: 16,
              }}
            >
              <span
                style={{
                  color: '#374151',
                  fontSize: 13,
                  fontWeight: 600,
                  minWidth: 80,
                }}
              >
                Phone <span style={{ color: '#ef4444' }}>*</span>
              </span>
              <Input
                placeholder="10-digit mobile"
                prefix={<PhoneOutlined style={{ color: '#ccc' }} />}
                value={form.mobile}
                onChange={(e) =>
                  updateField(
                    'mobile',
                    e.target.value.replace(/\D/g, '').slice(0, 10),
                  )
                }
                size="middle"
                style={{ flex: 1, maxWidth: 200 }}
              />
            </div>

            {/* Address (conditional) */}
            {page.collectAddress && (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  justifyContent: 'space-between',
                  marginBottom: 16,
                }}
              >
                <span
                  style={{
                    color: '#374151',
                    fontSize: 13,
                    fontWeight: 600,
                    minWidth: 80,
                    paddingTop: 4,
                  }}
                >
                  Address <span style={{ color: '#ef4444' }}>*</span>
                </span>
                <Input.TextArea
                  placeholder="Full delivery address"
                  value={form.address}
                  onChange={(e) => updateField('address', e.target.value)}
                  size="middle"
                  style={{ flex: 1, maxWidth: 200 }}
                  rows={2}
                  autoSize={{ minRows: 2, maxRows: 4 }}
                />
              </div>
            )}

            {/* Custom fields */}
            {page.customFields?.map((f) => (
              <div
                key={f.key}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: 12,
                }}
              >
                <span
                  style={{
                    color: '#374151',
                    fontSize: 13,
                    fontWeight: 600,
                    minWidth: 80,
                  }}
                >
                  {f.label}
                  {f.required && <span style={{ color: '#ef4444' }}> *</span>}
                </span>
                {f.type === 'select' && f.options?.length ? (
                  <Select
                    placeholder="Select"
                    value={form.customFieldValues[f.key] || undefined}
                    onChange={(v) => updateCustomField(f.key, v)}
                    style={{ flex: 1, maxWidth: 200 }}
                    size="middle"
                    options={f.options.map((o) => ({ label: o, value: o }))}
                  />
                ) : f.type === 'number' ? (
                  <InputNumber
                    placeholder="0"
                    value={
                      form.customFieldValues[f.key]
                        ? Number(form.customFieldValues[f.key])
                        : undefined
                    }
                    onChange={(v) => updateCustomField(f.key, String(v ?? ''))}
                    size="middle"
                    style={{ flex: 1, maxWidth: 200 }}
                    controls={false}
                  />
                ) : (
                  <Input
                    placeholder="Enter"
                    type={f.type === 'email' ? 'email' : 'text'}
                    value={form.customFieldValues[f.key] || ''}
                    onChange={(e) => updateCustomField(f.key, e.target.value)}
                    size="middle"
                    style={{ flex: 1, maxWidth: 200 }}
                  />
                )}
              </div>
            ))}

            <Divider style={{ margin: '16px 0' }} />

            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8,
                marginBottom: 16,
              }}
            >
              <UpiIcon />
              <VisaIcon />
              <MastercardIcon />
              <RupayIcon />
            </div>

            <Button
              type="primary"
              size="large"
              block
              loading={submitting}
              onClick={handlePay}
              style={{
                background: `linear-gradient(135deg, ${primaryColor}cc, ${primaryColor})`,
                border: 'none',
                color: '#fff',
                fontWeight: 700,
                fontSize: 16,
                height: 48,
                borderRadius: 8,
              }}
            >
              {isFixedAmount ? `${buttonText} ₹ ${displayAmount}` : buttonText}
            </Button>

            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 4,
                marginTop: 12,
                color: '#9ca3af',
                fontSize: 11,
              }}
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="#9ca3af">
                <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z" />
              </svg>
              Secured by RupeeFlow
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
