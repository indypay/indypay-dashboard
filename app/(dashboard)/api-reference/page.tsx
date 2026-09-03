import ApiReferenceTabs from './ApiReferenceTabs';
import { renderIntegrationDocHtml } from '@/lib/utils/integration-docs';

export default async function ApiReferencePage() {
  const [payinHtml, payoutHtml] = await Promise.all([
    renderIntegrationDocHtml('payin'),
    renderIntegrationDocHtml('payout'),
  ]);

  return (
    <div className="w-full min-h-screen">
      <div
        style={{
          background: 'linear-gradient(to right, var(--border), var(--primary))',
          borderRadius: '12px',
          padding: '2px',
          margin: '24px 24px 0',
        }}
      >
        <div
          style={{
            background: '#FFFFFF',
            borderRadius: '10px',
            padding: '28px 32px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div>
            <h1
              style={{
                fontSize: '1.75rem',
                fontWeight: 700,
                margin: 0,
                background: 'linear-gradient(135deg, var(--secondary), var(--primary))',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                letterSpacing: '-0.02em',
              }}
            >
              API Reference
            </h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', margin: '8px 0 0' }}>
              Integration guides and an interactive sandbox to test endpoints
            </p>
          </div>
          <div
            style={{
              background: 'var(--background)',
              border: '1px solid var(--primary)',
              borderRadius: '8px',
              padding: '6px 14px',
              fontSize: '0.8rem',
              color: 'var(--secondary)',
              fontWeight: 600,
            }}
          >
            v1.0
          </div>
        </div>
      </div>

      <ApiReferenceTabs payinHtml={payinHtml} payoutHtml={payoutHtml} />
    </div>
  );
}
