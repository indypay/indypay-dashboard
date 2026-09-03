'use client';

import { Card, Empty, Button, Tag, Space, Tooltip } from 'antd';
import {
  LinkOutlined,
  CopyOutlined,
  EyeOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  CloseCircleOutlined,
  PlusOutlined,
} from '@ant-design/icons';
import { createStyles } from 'antd-style';
import { formatAmount } from '@/lib/utils/utils';

const useStyles = createStyles(({ css }) => ({
  card: css`
    background: linear-gradient(to right, var(--border), var(--primary));
    border-radius: 12px;
    padding: 2px;
    margin-bottom: 16px;

    .inner {
      background: #ffffff;
      border-radius: 10px;
      padding: 20px;
    }
  `,
  linkItem: css`
    padding: 16px;
    border: 1px solid var(--border);
    border-radius: 10px;
    margin-bottom: 12px;
    transition: all 0.2s ease;

    &:hover {
      border-color: var(--primary);
      box-shadow: 0 4px 12px rgba(0, 135, 90, 0.1);
    }

    &:last-child {
      margin-bottom: 0;
    }
  `,
  statusTag: css`
    border-radius: 6px;
    font-weight: 600;
    font-size: 12px;
    padding: 4px 12px;
  `,
}));

interface RecentLinksListProps {
  links: any[];
  onCopyLink: (url: string) => void;
  onCreateNew: () => void;
}

export default function RecentLinksList({
  links,
  onCopyLink,
  onCreateNew,
}: RecentLinksListProps) {
  const { styles } = useStyles();

  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'active':
        return {
          color: 'var(--primary)',
          bg: 'var(--sidebar-active-bg)',
          icon: <ClockCircleOutlined />,
          text: 'Active',
        };
      case 'paid':
        return {
          color: '#0DD25F',
          bg: '#E8F9F0',
          icon: <CheckCircleOutlined />,
          text: 'Paid',
        };
      case 'expired':
        return {
          color: '#D51C44',
          bg: '#FEE7EF',
          icon: <CloseCircleOutlined />,
          text: 'Expired',
        };
      default:
        return {
          color: 'var(--text-muted)',
          bg: 'var(--background)',
          icon: <ClockCircleOutlined />,
          text: status,
        };
    }
  };

  if (links.length === 0) {
    return (
      <div className={styles.card}>
        <div className="inner">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-primary-dark-green">
              Recent Links
            </h2>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={onCreateNew}
              style={{
                background: 'linear-gradient(to right, var(--secondary), var(--primary))',
                border: 'none',
                color: '#FFFFFF',
                fontWeight: 600,
              }}
            >
              Create New
            </Button>
          </div>
          <Empty
            description={
              <span className="text-muted">No payment links created yet</span>
            }
            image={Empty.PRESENTED_IMAGE_SIMPLE}
          >
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={onCreateNew}
              style={{
                background: 'linear-gradient(to right, var(--secondary), var(--primary))',
                border: 'none',
                color: '#FFFFFF',
                fontWeight: 600,
              }}
            >
              Create Your First Link
            </Button>
          </Empty>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.card}>
      <div className="inner">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-primary-dark-green">
            Recent Links
          </h2>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={onCreateNew}
            style={{
              background: 'linear-gradient(to right, var(--secondary), var(--primary))',
              border: 'none',
              color: '#FFFFFF',
              fontWeight: 600,
            }}
          >
            Create New
          </Button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {links.map((link) => {
            const statusConfig = getStatusConfig(link.status);
            return (
              <div key={link.id} className={styles.linkItem}>
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-2">
                      <LinkOutlined
                        style={{ color: 'var(--primary)', fontSize: '18px' }}
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-semibold text-primary-dark-green truncate">
                            {link.purpose || 'Payment Link'}
                          </span>
                          <Tag
                            className={styles.statusTag}
                            style={{
                              color: statusConfig.color,
                              background: statusConfig.bg,
                              border: 'none',
                            }}
                            icon={statusConfig.icon}
                          >
                            {statusConfig.text}
                          </Tag>
                        </div>
                        <div className="text-lg font-bold text-primary-green mb-1">
                          {formatAmount(link.amount) || `₹${link.amount}`}
                        </div>
                        <div className="flex items-center gap-4 text-xs text-muted">
                          <span className="flex items-center gap-1">
                            <EyeOutlined />
                            {link.views || 0} views
                          </span>
                          <span>
                            Created{' '}
                            {new Date(link.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="mt-2">
                      <code className="text-xs text-muted bg-surface-dark-deep px-2 py-1 rounded font-mono">
                        {link.linkUrl}
                      </code>
                    </div>
                  </div>
                  <div className="flex flex-col gap-2">
                    <Tooltip title="Copy link">
                      <Button
                        icon={<CopyOutlined />}
                        onClick={() => onCopyLink(link.linkUrl)}
                        style={{
                          borderColor: 'var(--border)',
                          color: 'var(--text)',
                        }}
                      >
                        Copy
                      </Button>
                    </Tooltip>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
