'use client';

import dynamic from 'next/dynamic';
import { useMemo } from 'react';
import { Tabs } from 'antd';
import { useRole } from '@/lib/components/Role/RoleContext';
import { isAdmin } from '@/lib/utils/utils';
import 'swagger-ui-react/swagger-ui.css';

import '@/styles/md-styles.scss';

const SwaggerUI = dynamic(() => import('swagger-ui-react'), { ssr: false });

type ApiReferenceTabsProps = {
  payinHtml: string;
  payoutHtml: string;
};

const getSandboxSpecUrl = (role: string): string => {
  const base = process.env.NEXT_PUBLIC_DEV_PB_BASE_URL ?? '';
  if (isAdmin(role)) {
    return `${base}/admin-docs-json`;
  }
  return `${base}/merchant-docs-json`;
};

function DocsPanel({ html }: { html: string }) {
  return (
    <div
      style={{
        background: '#FFFFFF',
        borderRadius: '10px',
        overflow: 'hidden',
      }}
    >
      <div className="md-content">
        <article dangerouslySetInnerHTML={{ __html: html }} />
      </div>
    </div>
  );
}

export default function ApiReferenceTabs({
  payinHtml,
  payoutHtml,
}: ApiReferenceTabsProps) {
  const { role, isLoading } = useRole();
  const sandboxSpecUrl = useMemo(() => getSandboxSpecUrl(role), [role]);

  const docItems = [
    {
      key: 'payin',
      label: 'Payments',
      children: <DocsPanel html={payinHtml} />,
    },
    {
      key: 'payout',
      label: 'Disbursements',
      children: <DocsPanel html={payoutHtml} />,
    },
  ];

  const mainItems = [
    {
      key: 'docs',
      label: 'API Documentation',
      children: (
        <Tabs
          items={docItems}
          defaultActiveKey="payin"
          className="api-reference-doc-tabs"
        />
      ),
    },
    {
      key: 'sandbox',
      label: 'Sandbox',
      children: isLoading ? (
        <div className="flex items-center justify-center h-64 text-gray-400">
          Loading sandbox...
        </div>
      ) : (
        <SwaggerUI
          url={sandboxSpecUrl}
          docExpansion="list"
          defaultModelsExpandDepth={-1}
          displayRequestDuration
          filter
          tryItOutEnabled
        />
      ),
    },
  ];

  return (
    <>
      <Tabs
        items={mainItems}
        defaultActiveKey="docs"
        size="large"
        className="api-reference-main-tabs px-6 pt-4"
      />

      <style jsx global>{`
        .api-reference-main-tabs .ant-tabs-nav {
          margin-bottom: 16px;
        }
        .api-reference-doc-tabs .ant-tabs-nav {
          margin-bottom: 12px;
        }
        .swagger-ui .topbar {
          display: none;
        }
        .swagger-ui .info {
          margin: 16px 0;
        }
        .swagger-ui .scheme-container {
          background: var(--background);
          box-shadow: none;
          border: 1px solid var(--border);
          border-radius: 8px;
          padding: 12px 16px;
        }
        .swagger-ui .opblock-tag {
          font-size: 1rem;
          border-bottom: 1px solid var(--border);
        }
        .swagger-ui .opblock.opblock-post .opblock-summary {
          border-color: var(--primary);
        }
        .swagger-ui .opblock.opblock-get .opblock-summary {
          border-color: var(--secondary);
        }
        .swagger-ui .btn.authorize {
          color: var(--secondary);
          border-color: var(--primary);
        }
        .swagger-ui .btn.authorize svg {
          fill: var(--secondary);
        }
      `}</style>
    </>
  );
}
