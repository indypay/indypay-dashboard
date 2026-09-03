'use client';

import Link from 'next/link';
import { CheckCircleFilled, QuestionCircleOutlined } from '@ant-design/icons';
import { Popover } from 'antd';

import { Logo } from '@/lib/components/Logo';
import { useKycStore } from '../store/useKycStore';
import KycForm from './KycForm';

interface Step {
  id: number;
  title: string;
}

const steps: Step[] = [
  { id: 1, title: 'Personal Info' },
  { id: 2, title: 'Business' },
  { id: 3, title: 'KYB Info' },
  { id: 4, title: 'Bank Verify' },
  { id: 5, title: 'Documents' },
];

// ─── Right Panel Per Step ──────────────────────────────────────────────────────

function PersonalVerificationPanel() {
  const { personalInfo, panVerification, aadhaarVerification } = useKycStore();

  const fields = [
    {
      label: 'Full Name (as per Aadhaar)',
      value:
        aadhaarVerification.verifiedName ||
        panVerification.verifiedName ||
        personalInfo.fullName ||
        null,
      verified:
        aadhaarVerification.status === 'verified' ||
        panVerification.status === 'verified',
    },
    {
      label: 'PAN Number',
      value:
        panVerification.status === 'verified' ? personalInfo.panNumber : null,
      sub: panVerification.status === 'verified' ? 'Active & Valid' : null,
      verified: panVerification.status === 'verified',
      pending:
        panVerification.status === 'idle' ||
        panVerification.status === 'verifying',
    },
    {
      label: 'Aadhaar',
      value: aadhaarVerification.maskedNumber || null,
      verified: aadhaarVerification.status === 'verified',
      pending:
        aadhaarVerification.status === 'idle' ||
        aadhaarVerification.status === 'failed' ||
        aadhaarVerification.status === 'verifying',
    },
    {
      label: 'Aadhaar link',
      value:
        aadhaarVerification.status === 'verified'
          ? aadhaarVerification.linkMessage || 'Linked to profile mobile'
          : aadhaarVerification.mobileMismatch
            ? 'Update account mobile to match Aadhaar'
            : aadhaarVerification.status === 'verifying'
              ? 'Checking…'
              : 'Pending verification',
      verified: aadhaarVerification.status === 'verified',
    },
    {
      label: 'Address',
      value:
        aadhaarVerification.address ||
        'Full address may be collected in a later step',
      verified: !!aadhaarVerification.address,
    },
  ];

  return (
    <VerificationCard
      title="Verification Card"
      subtitle="All fields are verified in real-time using Karza API"
      fields={fields}
      badge="Powered by KARZA · RBI-compliant verification"
    />
  );
}

function BusinessVerificationPanel() {
  const { businessStructure, gstVerification, cinVerification } = useKycStore();

  const fields = [
    {
      label: 'Business Name (from GST)',
      value: gstVerification.businessName || null,
      verified: gstVerification.status === 'verified',
    },
    {
      label: 'GST Status',
      value: gstVerification.gstStatus || null,
      sub: gstVerification.filingStatus || null,
      verified: gstVerification.status === 'verified',
    },
    {
      label: 'GST Number',
      value:
        gstVerification.status === 'verified'
          ? businessStructure.gstNumber
          : null,
      verified: gstVerification.status === 'verified',
    },
    {
      label: 'CIN',
      value: cinVerification.companyName || null,
      sub: cinVerification.mcaStatus || null,
      verified: cinVerification.status === 'verified',
    },
    {
      label: 'Industry / Turnover',
      value:
        businessStructure.industryName && businessStructure.turnover
          ? `${businessStructure.industryName} / ${businessStructure.turnover}`
          : null,
      verified: !!(
        businessStructure.industryName && businessStructure.turnover
      ),
    },
    {
      label: 'Year Established',
      value: businessStructure.yearEstablished || null,
      verified: !!businessStructure.yearEstablished,
    },
  ];

  return (
    <VerificationCard
      title="Verification Card"
      subtitle="GST and CIN verified via government APIs at no extra cost"
      fields={fields}
      badge="GST Portal (Free) · MCA21 (Free)"
    />
  );
}

function KYBInfoPanel() {
  return (
    <div
      className="rounded-2xl p-6 h-full"
      style={{
        background: 'var(--surface)',
        border: '1px solid var(--border)',
        boxShadow: 'var(--primary-shadow-card)',
      }}
    >
      <div className="flex items-center gap-3 mb-4">
        <div
          style={{
            width: 40,
            height: 40,
            borderRadius: '50%',
            background: 'linear-gradient(135deg, var(--primary-soft-bg), var(--border))',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="var(--primary)"
            strokeWidth="2"
          >
            <path d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
          </svg>
        </div>
        <div>
          <p className="font-bold text-base" style={{ color: 'var(--text)' }}>
            Why We Need This
          </p>
          <p className="text-sm" style={{ color: '#4B6358' }}>
            Know Your Business
          </p>
        </div>
      </div>
      <p className="text-sm mb-4" style={{ color: '#1F2937', lineHeight: 1.7 }}>
        KYB verifies your business is legally registered & compliant with RBI PA
        guidelines.
      </p>
      <div className="space-y-2.5">
        {[
          'Higher payout limits',
          'Credit eligibility check',
          'Bank partner access',
          'Faster dispute resolution',
        ].map((item) => (
          <div
            key={item}
            className="flex items-center gap-2 text-sm font-medium"
            style={{ color: '#1F2937' }}
          >
            <CheckCircleFilled style={{ color: 'var(--primary)', fontSize: 14 }} />
            {item}
          </div>
        ))}
      </div>
    </div>
  );
}

function BankVerificationPanel() {
  const { personalInfo, bankVerification } = useKycStore();

  return (
    <div
      className="rounded-2xl p-6 h-full"
      style={{
        background: 'var(--surface)',
        border: '1px solid var(--border)',
        boxShadow: 'var(--primary-shadow-card)',
      }}
    >
      <div className="flex items-center gap-3 mb-4">
        <div
          style={{
            width: 40,
            height: 40,
            borderRadius: '50%',
            background: 'linear-gradient(135deg, var(--primary-soft-bg), var(--border))',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="var(--primary)"
            strokeWidth="2"
          >
            <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
            <polyline points="9 22 9 12 15 12 15 22" />
          </svg>
        </div>
        <div>
          <p className="font-bold text-base" style={{ color: 'var(--text)' }}>
            How Penny Drop Works
          </p>
          <p className="text-sm" style={{ color: '#4B6358' }}>
            Powered by Razorpay
          </p>
        </div>
      </div>
      <div className="space-y-3 mb-5">
        {[
          'You click "Send ₹1 Penny Drop"',
          'We transfer ₹1 to your account',
          'We verify beneficiary name matches KYC',
          'Account marked as verified instantly',
          '₹1 stays in your account permanently',
        ].map((step, i) => (
          <div
            key={i}
            className="flex items-start gap-3 text-sm font-medium"
            style={{ color: '#1F2937' }}
          >
            <span
              className="flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold"
              style={{ background: 'var(--primary-soft-bg)', color: 'var(--secondary)' }}
            >
              {i + 1}
            </span>
            {step}
          </div>
        ))}
      </div>
      {bankVerification.status === 'verified' && (
        <div
          className="rounded-xl p-3 space-y-2"
          style={{ background: 'var(--primary-soft-bg)', border: '1px solid var(--primary)' }}
        >
          <FieldRow
            label="Account Holder"
            value={bankVerification.accountHolderName || personalInfo.fullName}
            verified
          />
          <FieldRow
            label="Bank"
            value={
              bankVerification.bankName
                ? `${bankVerification.bankName} — ${bankVerification.branch}`
                : null
            }
            verified
          />
        </div>
      )}
    </div>
  );
}

// Matches BUSINESS_TYPES enum: PUBLIC_PRIVATE_LTD=4, LLP=6, PARTNERSHIP=3, SOLE_PROPRIETORSHIP=2, INDIVIDUAL=1
const BIZ_TYPE_LABELS: Record<number, string> = {
  1: 'Individual / Freelancer',
  2: 'Sole Proprietorship',
  3: 'Partnership',
  4: 'Public / Private Limited',
  5: 'Trust / NGO / Societies',
  6: 'LLP',
  7: 'Others',
  8: 'Unregistered',
};

const BIZ_TYPE_DOCS: Record<number, string[]> = {
  4: [
    'Bank Statement',
    'Address Proof',
    'MOA',
    'AOA',
    'Certificate of Incorporation',
    'GSTIN Certificate',
    'Company PAN',
    'Cancelled Cheque',
  ],
  6: [
    'Bank Statement',
    'Address Proof',
    'Certificate of Incorporation',
    'GSTIN Certificate',
    'Company PAN',
    'Cancelled Cheque',
  ],
  3: [
    'Bank Statement',
    'Address Proof',
    'Partnership Deed',
    'GSTIN Certificate',
    'Cancelled Cheque',
  ],
  2: ['Bank Statement', 'Address Proof', 'GSTIN Certificate'],
  1: ['Bank Statement', 'Address Proof', 'GSTIN Certificate'],
};

const DEFAULT_DOCS = [
  'Bank Statement',
  'Address Proof',
  'GSTIN Certificate',
  'Company PAN',
  'Cancelled Cheque',
];

function DocumentsPanel() {
  const { businessStructure } = useKycStore();
  const typeKey = Number(businessStructure.typeOfBusiness) || 0;
  const typeLabel = BIZ_TYPE_LABELS[typeKey] || 'your business type';
  const docs = BIZ_TYPE_DOCS[typeKey] ?? DEFAULT_DOCS;

  return (
    <div
      className="rounded-2xl p-6 h-full"
      style={{
        background: 'var(--surface)',
        border: '1px solid var(--border)',
        boxShadow: 'var(--primary-shadow-card)',
      }}
    >
      <p className="font-bold text-base mb-1" style={{ color: 'var(--text)' }}>
        Documents Required
      </p>
      <p className="text-sm mb-4" style={{ color: '#4B6358' }}>
        For {typeLabel} — {docs.length} documents
      </p>
      <div className="space-y-2">
        {docs.map((doc) => (
          <div
            key={doc}
            className="flex items-center gap-2 text-sm font-medium py-2 px-3 rounded-lg"
            style={{ background: 'var(--background)', color: '#1F2937' }}
          >
            <span
              className="w-1.5 h-1.5 rounded-full flex-shrink-0"
              style={{ background: 'var(--primary)' }}
            />
            {doc}
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Shared Components ─────────────────────────────────────────────────────────

interface FieldRowProps {
  label: string;
  value?: string | null;
  sub?: string | null;
  verified?: boolean;
  pending?: boolean;
}

/**
 * Renders as an underline-style input field.
 * - Empty: light gray bottom border + muted placeholder
 * - Populated: green bottom border + dark text + check icon
 */
function FieldRow({ label, value, sub, verified, pending }: FieldRowProps) {
  const hasValue = !!value;
  return (
    <div className="pt-3 pb-1 mb-1">
      {/* Label */}
      <p
        className="text-xs font-semibold uppercase tracking-wide mb-1"
        style={{ color: '#4B5563', letterSpacing: '0.06em' }}
      >
        {label}
      </p>

      {/* Underline input field */}
      <div
        className="flex items-center justify-between pb-2 transition-all duration-300"
        style={{
          borderBottom: `2px solid ${hasValue && verified ? 'var(--primary)' : hasValue ? '#94A3B8' : 'var(--border)'}`,
        }}
      >
        <p
          className="text-base font-medium leading-snug"
          style={{
            color: hasValue ? '#111827' : '#CBD5E1',
            fontStyle: hasValue ? 'normal' : 'italic',
            fontSize: 15,
          }}
        >
          {hasValue
            ? value
            : pending
              ? 'Awaiting input...'
              : 'Will auto-populate after verification'}
        </p>
        {verified && hasValue && (
          <CheckCircleFilled
            style={{ color: 'var(--primary)', fontSize: 16, flexShrink: 0 }}
          />
        )}
        {!hasValue && (
          <span
            className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0"
            style={{ background: '#F1F5F9', border: '1.5px dashed #CBD5E1' }}
          />
        )}
      </div>

      {sub && (
        <p className="text-xs mt-1 font-medium" style={{ color: 'var(--primary)' }}>
          {sub}
        </p>
      )}
    </div>
  );
}

interface VerificationCardProps {
  title: string;
  subtitle: string;
  fields: FieldRowProps[];
  badge?: string;
}

function VerificationCard({
  title,
  subtitle,
  fields,
  badge,
}: VerificationCardProps) {
  return (
    <div
      className="rounded-2xl px-6 pt-5 pb-6 h-full"
      style={{
        background: 'var(--surface)',
        border: '1px solid var(--border)',
        boxShadow: 'var(--primary-shadow-card)',
      }}
    >
      {/* Card header */}
      <p className="font-bold text-base mb-0.5" style={{ color: 'var(--text)' }}>
        {title}
      </p>
      <p className="text-sm mb-5" style={{ color: '#4B6358' }}>
        {subtitle}
      </p>

      {/* Fields */}
      <div className="space-y-1">
        {fields.map((f, i) => (
          <FieldRow key={i} {...f} />
        ))}
      </div>

      {badge && (
        <div
          className="flex items-center gap-2 mt-5 pt-4"
          style={{ borderTop: '1px solid var(--border)' }}
        >
          <span
            className="w-2 h-2 rounded-full flex-shrink-0"
            style={{ background: 'var(--primary)' }}
          />
          <p className="text-xs font-medium" style={{ color: 'var(--text-muted)' }}>
            {badge}
          </p>
        </div>
      )}
    </div>
  );
}

// ─── KYC Help Popover ──────────────────────────────────────────────────────────

const KYC_HELP_STEPS = [
  {
    step: 1,
    title: 'Personal Identity',
    desc: 'Enter your PAN for instant verification, then verify Aadhaar via OTP sent to your registered mobile.',
    time: '~2 min',
    icon: (
      <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      >
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
        <circle cx="12" cy="7" r="4" />
      </svg>
    ),
  },
  {
    step: 2,
    title: 'Business Details',
    desc: 'Enter your GSTIN — business name, address and status auto-fill instantly from government records.',
    time: '~1 min',
    icon: (
      <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      >
        <rect x="2" y="3" width="20" height="14" rx="2" />
        <path d="M8 21h8M12 17v4" />
      </svg>
    ),
  },
  {
    step: 3,
    title: 'KYB Information',
    desc: 'Confirm your pre-filled registered address and add a brief business description.',
    time: '~1 min',
    icon: (
      <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      >
        <path d="M9 11l3 3L22 4" />
        <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
      </svg>
    ),
  },
  {
    step: 4,
    title: 'Bank Account Verification',
    desc: "We send ₹1 to your account to verify it's real and active. The ₹1 stays in your account.",
    time: '~2 min',
    icon: (
      <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      >
        <rect x="1" y="4" width="22" height="16" rx="2" />
        <line x1="1" y1="10" x2="23" y2="10" />
      </svg>
    ),
  },
  {
    step: 5,
    title: 'Upload Documents',
    desc: 'Upload required documents based on your business type. Clear, readable scans only.',
    time: '~5 min',
    icon: (
      <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      >
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
        <polyline points="17 8 12 3 7 8" />
        <line x1="12" y1="3" x2="12" y2="15" />
      </svg>
    ),
  },
];

function KycHelpContent() {
  return (
    <div style={{ width: 320 }}>
      {/* Header */}
      <div
        className="rounded-xl px-4 py-3 mb-4 flex items-center gap-3"
        style={{ background: 'var(--cta-gradient-135)' }}
      >
        <div
          className="flex-shrink-0 flex items-center justify-center rounded-full"
          style={{ width: 36, height: 36, background: 'rgba(255,255,255,0.2)' }}
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#FFFFFF"
            strokeWidth="2"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
            />
          </svg>
        </div>
        <div>
          <p
            className="font-bold text-sm"
            style={{ color: '#FFFFFF', margin: 0 }}
          >
            Complete KYC Guide
          </p>
          <p
            className="text-xs"
            style={{ color: 'rgba(255,255,255,0.8)', margin: 0 }}
          >
            5 steps · ~11 minutes total
          </p>
        </div>
      </div>

      {/* Steps */}
      <div className="space-y-1">
        {KYC_HELP_STEPS.map((item, index) => (
          <div key={item.step} className="relative">
            {/* Connector line */}
            {index < KYC_HELP_STEPS.length - 1 && (
              <div
                className="absolute left-4 top-9 w-0.5"
                style={{
                  height: 'calc(100% - 4px)',
                  background: 'var(--border)',
                  zIndex: 0,
                }}
              />
            )}
            <div className="flex items-start gap-3 py-2 relative z-10">
              {/* Step circle */}
              <div
                className="flex-shrink-0 flex items-center justify-center rounded-full font-bold text-xs"
                style={{
                  width: 32,
                  height: 32,
                  background: 'var(--primary-soft-bg)',
                  border: '1.5px solid var(--primary)',
                  color: 'var(--secondary)',
                }}
              >
                {item.step}
              </div>
              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2 mb-0.5">
                  <p
                    className="text-sm font-semibold"
                    style={{ color: 'var(--text)' }}
                  >
                    {item.title}
                  </p>
                  <span
                    className="text-xs font-medium px-2 py-0.5 rounded-full flex-shrink-0"
                    style={{
                      background: 'var(--primary-soft-bg)',
                      color: 'var(--primary)',
                      border: '1px solid var(--border)',
                    }}
                  >
                    {item.time}
                  </span>
                </div>
                <p
                  className="text-xs leading-relaxed"
                  style={{ color: '#4B5563' }}
                >
                  {item.desc}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div
        className="mt-4 pt-3 flex items-center justify-between"
        style={{ borderTop: '1px solid var(--border)' }}
      >
        <div className="flex items-center gap-1.5">
          <span
            className="w-1.5 h-1.5 rounded-full"
            style={{ background: 'var(--primary)', display: 'inline-block' }}
          />
          <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
            Karza · GST Portal · Razorpay
          </p>
        </div>
        <p className="text-xs font-semibold" style={{ color: 'var(--primary)' }}>
          RBI Compliant
        </p>
      </div>
    </div>
  );
}

function KycHelpButton() {
  return (
    <Popover
      content={<KycHelpContent />}
      trigger="hover"
      placement="bottomRight"
      overlayInnerStyle={{
        padding: '16px',
        borderRadius: '16px',
        boxShadow: 'var(--primary-shadow-card)',
        border: '1px solid var(--border)',
      }}
      mouseEnterDelay={0.1}
      mouseLeaveDelay={0.2}
    >
      <button
        className="flex items-center gap-1.5 text-sm font-medium transition-all rounded-lg px-3 py-1.5"
        style={{
          color: 'var(--primary)',
          background: 'var(--primary-soft-bg)',
          border: '1px solid var(--border)',
          cursor: 'pointer',
        }}
        onMouseEnter={(e) => {
          (e.currentTarget as HTMLButtonElement).style.background = 'var(--sidebar-hover-bg)';
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLButtonElement).style.background = 'var(--primary-soft-bg)';
        }}
      >
        <QuestionCircleOutlined style={{ fontSize: 15 }} />
        Help in KYC?
      </button>
    </Popover>
  );
}

function RightPanel({ step }: { step: number }) {
  switch (step) {
    case 1:
      return <PersonalVerificationPanel />;
    case 2:
      return <BusinessVerificationPanel />;
    case 3:
      return <KYBInfoPanel />;
    case 4:
      return <BankVerificationPanel />;
    case 5:
      return <DocumentsPanel />;
    default:
      return null;
  }
}

// ─── Layout ────────────────────────────────────────────────────────────────────

export default function KycLayout() {
  const currentStep = useKycStore((state) => state.currentStep);

  return (
    <div
      className="min-h-screen w-full"
      style={{ background: 'var(--background)' }}
    >
      {/* Header */}
      <div
        className="sticky top-0 z-30 flex justify-between items-center px-8 md:px-16 py-4"
        style={{
          background: 'var(--surface)',
          borderBottom: '1px solid var(--border)',
          boxShadow: 'var(--primary-shadow-soft)',
        }}
      >
        <Logo isCollapsed={false} className="max-w-[150px]" />
        <div className="flex items-center gap-6">
          <Link
            href="/summary/overview"
            className="flex items-center gap-2 transition-opacity hover:opacity-80 text-sm font-semibold"
            style={{ color: 'var(--primary)' }}
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="var(--primary)"
              stroke="var(--primary)"
              strokeWidth="2"
            >
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
              <polyline points="9 22 9 12 15 12 15 22" />
            </svg>
            Go Back to Home
          </Link>
          <KycHelpButton />
        </div>
      </div>

      {/* Progress Steps */}
      <div className="px-8 md:px-24 pt-8 pb-6">
        <div className="relative flex items-center max-w-3xl mx-auto">
          {steps.map((step, index) => (
            <div
              key={step.id}
              className="flex flex-col items-center relative"
              style={{ flex: 1 }}
            >
              {index !== steps.length - 1 && (
                <div
                  className="absolute top-4 left-1/2 h-0.5 w-full"
                  style={{ marginLeft: '16px', background: 'var(--border)' }}
                >
                  <div
                    className="h-full transition-all duration-300"
                    style={{
                      width: '100%',
                      background:
                        currentStep > step.id ? 'var(--primary)' : 'transparent',
                    }}
                  />
                </div>
              )}
              <div
                className="relative z-10 flex h-8 w-8 items-center justify-center rounded-full transition-all duration-300"
                style={{
                  background: currentStep >= step.id ? 'var(--primary)' : 'var(--border)',
                }}
              >
                {currentStep > step.id ? (
                  <svg
                    className="h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="#FFFFFF"
                    strokeWidth={3}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                ) : (
                  <span
                    style={{
                      fontSize: 12,
                      fontWeight: 700,
                      color: currentStep >= step.id ? '#FFFFFF' : 'var(--text-muted)',
                    }}
                  >
                    {step.id}
                  </span>
                )}
              </div>
              <span
                className="mt-2 text-xs font-semibold whitespace-nowrap"
                style={{
                  color:
                    currentStep === step.id
                      ? 'var(--primary)'
                      : currentStep > step.id
                        ? 'var(--text)'
                        : '#9CA3AF',
                }}
              >
                {step.title}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="pb-16">
        <div className="w-full max-w-7xl mx-auto px-8 md:px-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start py-8">
            {/* Left — Form */}
            <div>
              <h1
                className="text-2xl md:text-3xl font-bold mb-1"
                style={{ color: 'var(--text)', letterSpacing: '-0.02em' }}
              >
                Complete KYC in just a few steps
              </h1>
              <p className="text-sm mb-8" style={{ color: 'var(--text-muted)' }}>
                Your information is encrypted and secure.
              </p>
              <KycForm />
            </div>

            {/* Right — Dynamic Verification Panel */}
            <div className="hidden lg:block">
              <RightPanel step={currentStep} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
