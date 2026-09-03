'use client';

import { useState } from 'react';
import { Button, Card, Statistic, Row, Col, Empty } from 'antd';
import {
  PlusOutlined,
  LinkOutlined,
  QrcodeOutlined,
  CopyOutlined,
  ShareAltOutlined,
  BarChartOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
} from '@ant-design/icons';
import { createStyles } from 'antd-style';
import { useToast } from '@/lib/components/Toast/ToastContext';
import PaymentLinkCreateModal from './components/PaymentLinkCreateModal';
import PaymentLinkSuccessModal from './components/PaymentLinkSuccessModal';
import RecentLinksList from './components/RecentLinksList';
import AnalyticsSection from './components/AnalyticsSection';
import SubscriptionSection from './components/SubscriptionSection';

const useStyles = createStyles(({ css }) => ({
  heroCard: css`
    background: linear-gradient(to right, var(--border), var(--primary));
    border-radius: 16px;
    padding: 2px;
    margin-bottom: 24px;

    .inner {
      background: #ffffff;
      border-radius: 14px;
      padding: 32px;
    }
  `,
  statsCard: css`
    background: #ffffff;
    border: 1px solid var(--border);
    border-radius: 12px;
    padding: 20px;
    transition: all 0.2s ease;

    &:hover {
      border-color: var(--primary);
      box-shadow: 0 4px 12px rgba(0, 135, 90, 0.1);
    }
  `,
  primaryButton: css`
    background: linear-gradient(to right, var(--secondary), var(--primary)) !important;
    border: none !important;
    color: #ffffff !important;
    font-weight: 600 !important;
    height: 48px !important;
    padding: 0 32px !important;
    border-radius: 12px !important;
    font-size: 16px !important;
    box-shadow: 0 4px 12px rgba(0, 135, 90, 0.2) !important;

    &:hover {
      box-shadow: 0 6px 16px rgba(0, 135, 90, 0.3) !important;
      transform: translateY(-1px);
    }
  `,
}));

interface PaymentLink {
  id: string;
  amount: number;
  purpose: string;
  status: 'active' | 'paid' | 'expired';
  createdAt: string;
  linkUrl: string;
  views: number;
  conversions: number;
}

export default function PaymentButtonPage() {
  const { styles } = useStyles();
  const { showToast } = useToast();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [createdLink, setCreatedLink] = useState<PaymentLink | null>(null);
  const [recentLinks, setRecentLinks] = useState<PaymentLink[]>([]);

  // Mock analytics data - replace with real API calls
  const analytics = {
    totalLinks: 24,
    activeLinks: 8,
    totalAmount: 245000,
    paidAmount: 180000,
    conversionRate: 68.5,
    totalViews: 342,
  };

  const handleCreateSuccess = (link: PaymentLink) => {
    setCreatedLink(link);
    setRecentLinks((prev) => [link, ...prev].slice(0, 5));
    setIsCreateModalOpen(false);
    setIsSuccessModalOpen(true);
    showToast('Payment link created successfully!', 'success');
  };

  const handleCopyLink = (linkUrl: string) => {
    navigator.clipboard.writeText(linkUrl);
    showToast('Link copied to clipboard', 'success');
  };

  return (
    <div
      className="w-full p-6 min-h-screen"
      style={{ background: 'linear-gradient(to bottom, var(--background), #FFFFFF)' }}
    >
      {/* Hero Section - Primary CTA */}
      <div className={styles.heroCard}>
        <div className="inner">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-primary-dark-green mb-2">
                Request Money
              </h1>
              <p className="text-muted text-base leading-relaxed max-w-2xl">
                Create payment links instantly. Share via WhatsApp, email, or
                embed on your website. Get paid faster with our simple, secure
                payment collection system.
              </p>
            </div>
            <Button
              type="primary"
              size="large"
              icon={<PlusOutlined />}
              className={styles.primaryButton}
              onClick={() => setIsCreateModalOpen(true)}
            >
              Request Money
            </Button>
          </div>
        </div>
      </div>

      {/* Analytics Cards */}
      <div className="mb-6">
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={12} lg={6}>
            <Card className={styles.statsCard}>
              <Statistic
                title={
                  <span style={{ color: 'var(--text-muted)', fontSize: '14px' }}>
                    Total Links
                  </span>
                }
                value={analytics.totalLinks}
                valueStyle={{
                  color: 'var(--secondary)',
                  fontWeight: 700,
                  fontSize: '24px',
                }}
                prefix={<LinkOutlined style={{ color: 'var(--primary)' }} />}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card className={styles.statsCard}>
              <Statistic
                title={
                  <span style={{ color: 'var(--text-muted)', fontSize: '14px' }}>
                    Active Links
                  </span>
                }
                value={analytics.activeLinks}
                valueStyle={{
                  color: 'var(--primary)',
                  fontWeight: 700,
                  fontSize: '24px',
                }}
                prefix={<ClockCircleOutlined style={{ color: 'var(--primary)' }} />}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card className={styles.statsCard}>
              <Statistic
                title={
                  <span style={{ color: 'var(--text-muted)', fontSize: '14px' }}>
                    Total Collected
                  </span>
                }
                value={`₹${(analytics.paidAmount / 1000).toFixed(0)}K`}
                valueStyle={{
                  color: 'var(--secondary)',
                  fontWeight: 700,
                  fontSize: '24px',
                }}
                prefix={<CheckCircleOutlined style={{ color: '#0DD25F' }} />}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card className={styles.statsCard}>
              <Statistic
                title={
                  <span style={{ color: 'var(--text-muted)', fontSize: '14px' }}>
                    Conversion Rate
                  </span>
                }
                value={analytics.conversionRate}
                suffix="%"
                valueStyle={{
                  color: 'var(--primary)',
                  fontWeight: 700,
                  fontSize: '24px',
                }}
                prefix={<BarChartOutlined style={{ color: 'var(--primary)' }} />}
              />
            </Card>
          </Col>
        </Row>
      </div>

      {/* Main Content Grid */}
      <Row gutter={[24, 24]}>
        {/* Recent Links Section */}
        <Col xs={24} lg={16}>
          <RecentLinksList
            links={recentLinks}
            onCopyLink={handleCopyLink}
            onCreateNew={() => setIsCreateModalOpen(true)}
          />
        </Col>

        {/* Analytics Section */}
        <Col xs={24} lg={8}>
          <AnalyticsSection analytics={analytics} />
        </Col>
      </Row>

      {/* Subscription Section */}
      <div className="mt-6">
        <SubscriptionSection />
      </div>

      {/* Modals */}
      <PaymentLinkCreateModal
        open={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSuccess={handleCreateSuccess}
      />

      <PaymentLinkSuccessModal
        open={isSuccessModalOpen}
        onClose={() => setIsSuccessModalOpen(false)}
        paymentLink={createdLink}
        onCopyLink={handleCopyLink}
      />
    </div>
  );
}
