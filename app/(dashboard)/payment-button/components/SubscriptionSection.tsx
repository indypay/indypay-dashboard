'use client';

import { useState } from 'react';
import {
  Card,
  Button,
  Radio,
  Space,
  Modal,
  Form,
  InputNumber,
  Select,
  Switch,
} from 'antd';
import {
  ReloadOutlined,
  CalendarOutlined,
  DollarOutlined,
  SettingOutlined,
  PlusOutlined,
} from '@ant-design/icons';
import { createStyles } from 'antd-style';
import { useToast } from '@/lib/components/Toast/ToastContext';

const useStyles = createStyles(({ css }) => ({
  card: css`
    background: linear-gradient(to right, var(--border), var(--primary));
    border-radius: 12px;
    padding: 2px;

    .inner {
      background: #ffffff;
      border-radius: 10px;
      padding: 24px;
    }
  `,
  subscriptionCard: css`
    border: 1px solid var(--border);
    border-radius: 10px;
    padding: 16px;
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
  primaryButton: css`
    background: linear-gradient(to right, var(--secondary), var(--primary)) !important;
    border: none !important;
    color: #ffffff !important;
    font-weight: 600 !important;

    &:hover {
      box-shadow: 0 4px 12px rgba(0, 135, 90, 0.3) !important;
    }
  `,
}));

export default function SubscriptionSection() {
  const { styles } = useStyles();
  const { showToast } = useToast();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [subscriptionType, setSubscriptionType] = useState<
    'fixed' | 'emi' | 'custom'
  >('fixed');
  const [form] = Form.useForm();

  const subscriptions = [
    {
      id: '1',
      type: 'Fixed Monthly',
      amount: 5000,
      frequency: 'Monthly',
      status: 'active',
      nextPayment: '2024-02-15',
      customer: 'John Doe',
    },
    {
      id: '2',
      type: 'EMI Plan',
      amount: 10000,
      frequency: 'Monthly (6 months)',
      status: 'active',
      nextPayment: '2024-02-20',
      customer: 'Jane Smith',
      remaining: 4,
    },
  ];

  const handleCreateSubscription = async (values: any) => {
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      showToast('Subscription created successfully!', 'success');
      setIsModalOpen(false);
      form.resetFields();
    } catch (error) {
      showToast('Failed to create subscription', 'error');
    }
  };

  return (
    <div className={styles.card}>
      <div className="inner">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <ReloadOutlined style={{ color: 'var(--primary)', fontSize: '20px' }} />
            <h2 className="text-xl font-bold text-primary-dark-green">
              Subscriptions
            </h2>
          </div>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => setIsModalOpen(true)}
            className={styles.primaryButton}
          >
            Create Subscription
          </Button>
        </div>

        {subscriptions.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '32px 0' }}>
            <p style={{ color: 'var(--text-muted)', marginBottom: '16px' }}>
              No active subscriptions
            </p>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => setIsModalOpen(true)}
              className={styles.primaryButton}
            >
              Create Your First Subscription
            </Button>
          </div>
        ) : (
          <div
            style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}
          >
            {subscriptions.map((sub) => (
              <div key={sub.id} className={styles.subscriptionCard}>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <CalendarOutlined style={{ color: 'var(--primary)' }} />
                      <span className="font-semibold text-primary-dark-green">
                        {sub.type}
                      </span>
                      <span
                        className="px-2 py-1 rounded text-xs font-semibold"
                        style={{
                          background: 'var(--sidebar-active-bg)',
                          color: 'var(--primary)',
                        }}
                      >
                        {sub.status}
                      </span>
                    </div>
                    <div className="text-lg font-bold text-primary-green mb-1">
                      ₹{sub.amount.toLocaleString()}
                    </div>
                    <div className="text-sm text-muted space-y-1">
                      <div>Customer: {sub.customer}</div>
                      <div>Frequency: {sub.frequency}</div>
                      <div>
                        Next payment:{' '}
                        {new Date(sub.nextPayment).toLocaleDateString()}
                      </div>
                      {sub.remaining && (
                        <div>Remaining installments: {sub.remaining}</div>
                      )}
                    </div>
                  </div>
                  <Button
                    icon={<SettingOutlined />}
                    onClick={() => {
                      showToast('Subscription settings coming soon!', 'hint');
                    }}
                    style={{
                      borderColor: 'var(--border)',
                      color: 'var(--text)',
                    }}
                  >
                    Manage
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Create Subscription Modal */}
        <Modal
          title={
            <div className="flex items-center gap-2">
              <ReloadOutlined style={{ color: 'var(--primary)' }} />
              <span>Create Subscription</span>
            </div>
          }
          open={isModalOpen}
          onCancel={() => {
            setIsModalOpen(false);
            form.resetFields();
          }}
          footer={null}
          width={560}
        >
          <Form
            form={form}
            layout="vertical"
            onFinish={handleCreateSubscription}
            initialValues={{ type: 'fixed', autoRetry: true }}
          >
            <Form.Item
              name="type"
              label="Subscription Type"
              rules={[{ required: true }]}
            >
              <Radio.Group
                value={subscriptionType}
                onChange={(e) => setSubscriptionType(e.target.value)}
                className="w-full"
              >
                <Space direction="vertical" className="w-full">
                  <Radio.Button value="fixed" className="w-full text-center">
                    Fixed Monthly
                  </Radio.Button>
                  <Radio.Button value="emi" className="w-full text-center">
                    EMI Plan
                  </Radio.Button>
                  <Radio.Button value="custom" className="w-full text-center">
                    Custom Recurring
                  </Radio.Button>
                </Space>
              </Radio.Group>
            </Form.Item>

            <Form.Item
              name="amount"
              label={
                <span className="flex items-center gap-2">
                  <DollarOutlined style={{ color: 'var(--primary)' }} />
                  Amount
                </span>
              }
              rules={[{ required: true, message: 'Please enter amount' }]}
            >
              <InputNumber
                style={{ width: '100%' }}
                prefix="₹"
                placeholder="Enter amount"
                size="large"
                min={1}
                formatter={(value) =>
                  `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                }
              />
            </Form.Item>

            {subscriptionType === 'emi' && (
              <Form.Item
                name="installments"
                label="Number of Installments"
                rules={[
                  {
                    required: true,
                    message: 'Please enter number of installments',
                  },
                ]}
              >
                <InputNumber
                  style={{ width: '100%' }}
                  placeholder="e.g., 6, 12, 24"
                  size="large"
                  min={2}
                  max={60}
                />
              </Form.Item>
            )}

            <Form.Item
              name="frequency"
              label="Frequency"
              rules={[{ required: true }]}
            >
              <Select
                size="large"
                placeholder="Select frequency"
                options={[
                  { label: 'Daily', value: 'daily' },
                  { label: 'Weekly', value: 'weekly' },
                  { label: 'Monthly', value: 'monthly' },
                  { label: 'Quarterly', value: 'quarterly' },
                  { label: 'Yearly', value: 'yearly' },
                ]}
              />
            </Form.Item>

            <Form.Item
              name="autoRetry"
              valuePropName="checked"
              label="Smart Retry on Failure"
            >
              <div className="flex items-center justify-between p-3 bg-surface-dark-deep rounded-lg">
                <div>
                  <div className="font-semibold text-primary-dark-green">
                    Auto-retry Failed Payments
                  </div>
                  <div className="text-xs text-muted">
                    Automatically retry failed payments with smart scheduling
                  </div>
                </div>
                <Switch defaultChecked />
              </div>
            </Form.Item>

            <div className="flex justify-end gap-3 mt-6">
              <Button
                onClick={() => {
                  setIsModalOpen(false);
                  form.resetFields();
                }}
                size="large"
              >
                Cancel
              </Button>
              <Button
                type="primary"
                htmlType="submit"
                size="large"
                className={styles.primaryButton}
              >
                Create Subscription
              </Button>
            </div>
          </Form>
        </Modal>
      </div>
    </div>
  );
}
