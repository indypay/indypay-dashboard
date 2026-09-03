'use client';

import React, { useState } from 'react';
import { Button, Card, Form, Input, Table, message } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { SendOutlined } from '@ant-design/icons';

import { useBroadcastNotification } from '@/lib/hooks/use-notification-broadcast';
import type { BroadcastNotificationDto } from '@/lib/interfaces/notification.interface';

const { TextArea } = Input;

const labelStyle: React.CSSProperties = {
  display: 'block',
  marginBottom: '6px',
  color: 'var(--text-muted)',
  fontSize: '13px',
  fontWeight: 500,
  letterSpacing: '0.01em',
};

const inputStyle: React.CSSProperties = {
  backgroundColor: 'var(--background)',
  borderColor: 'var(--border)',
  borderRadius: '8px',
  color: 'var(--text)',
};

const cardGradientWrapper = (children: React.ReactNode) => (
  <div
    style={{
      background: 'linear-gradient(to right, var(--border), var(--primary))',
      borderRadius: '14px',
      padding: '1.5px',
    }}
  >
    <Card
      style={{ background: '#FFFFFF', borderRadius: '13px', border: 'none' }}
      styles={{ body: { padding: '28px 32px' } }}
    >
      {children}
    </Card>
  </div>
);

const GradientTitle = ({
  title,
  subtitle,
}: {
  title: string;
  subtitle?: string;
}) => (
  <div style={{ marginBottom: '24px' }}>
    <h2
      style={{
        fontSize: '20px',
        fontWeight: 700,
        margin: 0,
        background: 'linear-gradient(135deg, var(--secondary), var(--primary))',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        backgroundClip: 'text',
        letterSpacing: '-0.01em',
      }}
    >
      {title}
    </h2>
    {subtitle && (
      <p style={{ color: 'var(--text-muted)', fontSize: '13px', margin: '4px 0 0' }}>
        {subtitle}
      </p>
    )}
  </div>
);

type RecentBroadcastRow = {
  key: string;
  title: string;
  messagePreview: string;
  sentAtLabel: string;
};

export default function NotificationsSettingsPage() {
  const [form] = Form.useForm();
  const broadcastMutation = useBroadcastNotification();
  const [recent, setRecent] = useState<RecentBroadcastRow[]>([]);

  const handleBroadcast = async (values: {
    title: string;
    message: string;
    dataJson?: string;
  }) => {
    let data: Record<string, unknown> | undefined;
    const raw = values.dataJson?.trim();
    if (raw) {
      try {
        const parsed = JSON.parse(raw) as unknown;
        if (
          parsed === null ||
          typeof parsed !== 'object' ||
          Array.isArray(parsed)
        ) {
          message.error(
            'Optional data must be a JSON object (e.g. {"ctaUrl":"..."})',
          );
          return;
        }
        data = parsed as Record<string, unknown>;
      } catch {
        message.error('Optional data is not valid JSON');
        return;
      }
    }

    const body: BroadcastNotificationDto = {
      title: values.title.trim(),
      message: values.message.trim(),
      ...(data !== undefined ? { data } : {}),
    };

    const [_, err] = await broadcastMutation.mutateAsync(body);
    if (err) {
      message.error(
        (err as { message?: string })?.message ??
          'Failed to send broadcast notification',
      );
      return;
    }

    message.success('Broadcast sent to all users');
    form.resetFields();
    setRecent((prev) => [
      {
        key: `${Date.now()}`,
        title: body.title,
        messagePreview:
          body.message.length > 80
            ? `${body.message.slice(0, 80)}…`
            : body.message,
        sentAtLabel: new Date().toLocaleString(),
      },
      ...prev,
    ]);
  };

  const columns: ColumnsType<RecentBroadcastRow> = [
    {
      title: 'Title',
      dataIndex: 'title',
      key: 'title',
      render: (v) => (
        <span style={{ color: 'var(--text)', fontWeight: 500 }}>{v}</span>
      ),
    },
    {
      title: 'Message',
      dataIndex: 'messagePreview',
      key: 'messagePreview',
      render: (v) => (
        <span style={{ color: 'var(--text-muted)', fontSize: '13px' }}>{v}</span>
      ),
    },
    {
      title: 'Sent (this session)',
      dataIndex: 'sentAtLabel',
      key: 'sentAtLabel',
      width: 200,
      render: (v) => (
        <span style={{ color: 'var(--text)', fontSize: '13px' }}>{v}</span>
      ),
    },
  ];

  return (
    <div className="space-y-5">
      {cardGradientWrapper(
        <>
          <GradientTitle
            title="Broadcast notification"
            subtitle="Send an in-app (and push, if configured) announcement to every user — feature launches, maintenance, promotions, etc."
          />
          <Form form={form} layout="vertical" onFinish={handleBroadcast}>
            <div className="grid grid-cols-1 gap-y-1">
              <Form.Item
                name="title"
                rules={[
                  { required: true, message: 'Title is required' },
                  { max: 255, message: 'Title must be at most 255 characters' },
                ]}
                style={{ marginBottom: '20px' }}
                label={<span style={labelStyle}>Title</span>}
              >
                <Input
                  size="large"
                  placeholder="e.g. New dashboard filters"
                  maxLength={255}
                  showCount
                  style={inputStyle}
                  styles={{
                    input: { backgroundColor: 'var(--background)', color: 'var(--text)' },
                  }}
                  className="notification-text-input"
                />
              </Form.Item>

              <Form.Item
                name="message"
                rules={[
                  { required: true, message: 'Message is required' },
                  {
                    max: 5000,
                    message: 'Message must be at most 5000 characters',
                  },
                ]}
                style={{ marginBottom: '20px' }}
                label={<span style={labelStyle}>Message</span>}
              >
                <TextArea
                  rows={6}
                  placeholder="Write the announcement body users will see…"
                  maxLength={5000}
                  showCount
                  style={inputStyle}
                  className="notification-textarea"
                />
              </Form.Item>

              <Form.Item
                name="dataJson"
                style={{ marginBottom: '24px' }}
                label={
                  <span style={labelStyle}>
                    Extra payload (JSON object, optional){' '}
                    <span style={{ color: '#3D5C56', fontSize: '11px' }}>
                      — deep links, campaign ids, etc.
                    </span>
                  </span>
                }
                rules={[
                  {
                    validator: (_, value) => {
                      const s = typeof value === 'string' ? value.trim() : '';
                      if (!s) return Promise.resolve();
                      try {
                        const parsed = JSON.parse(s) as unknown;
                        if (
                          parsed === null ||
                          typeof parsed !== 'object' ||
                          Array.isArray(parsed)
                        ) {
                          return Promise.reject(
                            new Error(
                              'Must be a JSON object, e.g. {"ctaUrl":"..."}',
                            ),
                          );
                        }
                        return Promise.resolve();
                      } catch {
                        return Promise.reject(new Error('Invalid JSON'));
                      }
                    },
                  },
                ]}
              >
                <TextArea
                  rows={4}
                  placeholder='{"ctaUrl":"https://…","campaign":"spring-2026"}'
                  style={inputStyle}
                  className="notification-textarea"
                />
              </Form.Item>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <Button
                htmlType="submit"
                icon={<SendOutlined />}
                size="large"
                loading={broadcastMutation.isPending}
                style={{
                  background: 'linear-gradient(to right, var(--border), var(--primary))',
                  border: 'none',
                  color: 'var(--background)',
                  fontWeight: 700,
                  borderRadius: '8px',
                  paddingInline: '28px',
                }}
              >
                Send to all users
              </Button>
            </div>
          </Form>
        </>,
      )}

      {cardGradientWrapper(
        <>
          <GradientTitle
            title="Recent broadcasts"
            subtitle="Successful sends from this browser session (for your reference only)"
          />
          <Table
            columns={columns}
            dataSource={recent}
            rowKey="key"
            pagination={false}
            className="notification-broadcast-table"
            locale={{
              emptyText: (
                <span style={{ color: 'var(--text-muted)' }}>
                  No broadcasts sent yet this session
                </span>
              ),
            }}
          />
        </>,
      )}

      <style jsx global>{`
        .notification-text-input.ant-input-affix-wrapper,
        .notification-text-input.ant-input {
          background-color: var(--background) !important;
          border-color: var(--border) !important;
          border-radius: 8px !important;
          color: var(--text) !important;
        }
        .notification-text-input .ant-input {
          background-color: var(--background) !important;
          color: var(--text) !important;
        }
        .notification-text-input.ant-input-affix-wrapper:hover,
        .notification-text-input.ant-input:hover {
          border-color: var(--primary) !important;
        }
        .notification-text-input.ant-input-affix-wrapper:focus-within,
        .notification-text-input.ant-input:focus {
          border-color: var(--primary) !important;
          box-shadow: 0 0 0 2px rgba(0, 135, 90, 0.12) !important;
        }

        .notification-textarea.ant-input {
          background-color: var(--background) !important;
          border-color: var(--border) !important;
          border-radius: 8px !important;
          color: var(--text) !important;
        }
        .notification-textarea.ant-input:hover {
          border-color: var(--primary) !important;
        }
        .notification-textarea.ant-input:focus {
          border-color: var(--primary) !important;
          box-shadow: 0 0 0 2px rgba(0, 135, 90, 0.12) !important;
        }

        .notification-broadcast-table .ant-table {
          background: #ffffff !important;
          border-radius: 8px;
        }
        .notification-broadcast-table .ant-table-thead > tr > th {
          background: var(--background) !important;
          color: var(--text-muted) !important;
          border-bottom: 1px solid var(--border) !important;
          font-size: 11px !important;
          font-weight: 600 !important;
          letter-spacing: 0.07em !important;
          text-transform: uppercase !important;
        }
        .notification-broadcast-table .ant-table-tbody > tr > td {
          background: #ffffff !important;
          border-bottom: 1px solid var(--border) !important;
          color: var(--text) !important;
        }
        .notification-broadcast-table .ant-table-tbody > tr:hover > td {
          background: var(--background) !important;
        }
        .notification-broadcast-table .ant-table-placeholder {
          background: #ffffff !important;
          color: var(--text-muted) !important;
        }

        .ant-form-item-label > label {
          height: auto !important;
        }
      `}</style>
    </div>
  );
}
