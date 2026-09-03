import Link from 'next/link';
import { renderIntegrationDocHtml } from '@/lib/utils/integration-docs';
import '@/styles/md-styles.scss';

const PayoutDocs = async () => {
  const htmlContent = await renderIntegrationDocHtml('payout');

  return (
    <div style={{ padding: '24px', maxWidth: '1400px', margin: '0 auto' }}>
      <div
        style={{
          background: 'linear-gradient(to right, var(--border), var(--primary))',
          borderRadius: '12px',
          padding: '2px',
          marginBottom: '24px',
        }}
      >
        <div
          style={{
            background: '#FFFFFF',
            borderRadius: '10px',
            padding: '32px',
            textAlign: 'center',
          }}
        >
          <h1
            style={{
              fontSize: '2.5rem',
              fontWeight: 700,
              margin: 0,
              background: 'linear-gradient(135deg, var(--secondary), var(--primary))',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              letterSpacing: '-0.02em',
            }}
          >
            Disbursements API Documentation
          </h1>
          <p
            style={{
              color: 'var(--text-muted)',
              fontSize: '1.125rem',
              marginTop: '12px',
              marginBottom: 0,
            }}
          >
            Version 1.0 • Comprehensive Integration Guide
          </p>
        </div>
      </div>

      <div
        style={{
          background: 'linear-gradient(to right, var(--border), var(--primary))',
          borderRadius: '12px',
          padding: '2px',
        }}
      >
        <div
          style={{
            background: '#FFFFFF',
            borderRadius: '10px',
            overflow: 'hidden',
          }}
        >
          <div className="md-content">
            <article dangerouslySetInnerHTML={{ __html: htmlContent }} />
          </div>
        </div>
      </div>

      <div
        style={{
          marginTop: '24px',
          padding: '20px',
          background: 'var(--background)',
          borderRadius: '8px',
          border: '1px solid #4E4E4E',
          textAlign: 'center',
        }}
      >
        <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', margin: 0 }}>
          Need help? Contact our support team or refer to our{' '}
          <Link
            href="/docs/payin"
            style={{
              color: 'var(--secondary)',
              textDecoration: 'none',
              fontWeight: 500,
            }}
          >
            Payments API Documentation
          </Link>
        </p>
      </div>
    </div>
  );
};

export default PayoutDocs;
