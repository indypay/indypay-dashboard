'use client';

import { Card, Progress, Statistic } from 'antd';
import {
  BarChartOutlined,
  EyeOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
} from '@ant-design/icons';
import { createStyles } from 'antd-style';

const useStyles = createStyles(({ css }) => ({
  card: css`
    background: linear-gradient(to right, var(--border), var(--primary));
    border-radius: 12px;
    padding: 2px;

    .inner {
      background: #ffffff;
      border-radius: 10px;
      padding: 20px;
    }
  `,
  metricCard: css`
    background: var(--background);
    border: 1px solid var(--border);
    border-radius: 10px;
    padding: 16px;
    margin-bottom: 12px;

    &:last-child {
      margin-bottom: 0;
    }
  `,
  progress: css`
    .ant-progress-bg {
      background: linear-gradient(to right, var(--secondary), var(--primary)) !important;
    }
  `,
}));

interface AnalyticsSectionProps {
  analytics: {
    totalLinks: number;
    activeLinks: number;
    totalAmount: number;
    paidAmount: number;
    conversionRate: number;
    totalViews: number;
  };
}

export default function AnalyticsSection({ analytics }: AnalyticsSectionProps) {
  const { styles } = useStyles();

  const paidPercentage =
    analytics.totalAmount > 0
      ? (analytics.paidAmount / analytics.totalAmount) * 100
      : 0;

  return (
    <div className={styles.card}>
      <div className="inner">
        <div className="flex items-center gap-2 mb-4">
          <BarChartOutlined style={{ color: 'var(--primary)', fontSize: '20px' }} />
          <h2 className="text-xl font-bold text-primary-dark-green">
            Analytics
          </h2>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {/* Conversion Rate */}
          <div className={styles.metricCard}>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-semibold text-primary-dark-green">
                Conversion Rate
              </span>
              <span className="text-lg font-bold text-primary-green">
                {analytics.conversionRate.toFixed(1)}%
              </span>
            </div>
            <Progress
              percent={analytics.conversionRate}
              showInfo={false}
              strokeColor={{
                '0%': 'var(--secondary)',
                '100%': 'var(--primary)',
              }}
              className={styles.progress}
            />
          </div>

          {/* Payment Collection Progress */}
          <div className={styles.metricCard}>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-semibold text-primary-dark-green">
                Collection Progress
              </span>
              <span className="text-sm text-muted">
                ₹{(analytics.paidAmount / 1000).toFixed(0)}K / ₹
                {(analytics.totalAmount / 1000).toFixed(0)}K
              </span>
            </div>
            <Progress
              percent={paidPercentage}
              showInfo={false}
              strokeColor={{
                '0%': 'var(--secondary)',
                '100%': 'var(--primary)',
              }}
              className={styles.progress}
            />
          </div>

          {/* Key Metrics */}
          <div className="grid grid-cols-2 gap-3">
            <div className={styles.metricCard}>
              <Statistic
                title={
                  <span style={{ color: 'var(--text-muted)', fontSize: '12px' }}>
                    Total Views
                  </span>
                }
                value={analytics.totalViews}
                valueStyle={{
                  color: 'var(--primary)',
                  fontWeight: 700,
                  fontSize: '20px',
                }}
                prefix={
                  <EyeOutlined style={{ color: 'var(--primary)', fontSize: '16px' }} />
                }
              />
            </div>
            <div className={styles.metricCard}>
              <Statistic
                title={
                  <span style={{ color: 'var(--text-muted)', fontSize: '12px' }}>
                    Active Links
                  </span>
                }
                value={analytics.activeLinks}
                valueStyle={{
                  color: 'var(--secondary)',
                  fontWeight: 700,
                  fontSize: '20px',
                }}
                prefix={
                  <CheckCircleOutlined
                    style={{ color: 'var(--primary)', fontSize: '16px' }}
                  />
                }
              />
            </div>
          </div>

          {/* Drop-off Insight */}
          <div className={styles.metricCard}>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm font-semibold text-primary-dark-green mb-1">
                  Drop-off Analysis
                </div>
                <div className="text-xs text-muted">
                  {analytics.totalViews - analytics.conversionRate} visitors
                  didn't complete payment
                </div>
              </div>
              <CloseCircleOutlined
                style={{ color: '#D51C44', fontSize: '20px' }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
