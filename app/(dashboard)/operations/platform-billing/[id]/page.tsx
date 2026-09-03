'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
  Button,
  Card,
  Col,
  Descriptions,
  Divider,
  Row,
  Spin,
  Table,
  Tag,
  Typography,
} from 'antd';
import type { TableColumnsType } from 'antd';
import {
  ArrowLeftOutlined,
  FileTextOutlined,
  RobotOutlined,
  SendOutlined,
} from '@ant-design/icons';
import { usePlatformInvoice } from '@/lib/hooks/use-platform-billing';
import { callSendInvoice } from '@/lib/services/platform-billing-service';
import {
  IPlatformInvoice,
  IPlatformLineItem,
  PlatformInvoiceStatus,
} from '@/lib/interfaces/platform-billing.interface';
import { formatAmount } from '@/lib/utils/utils';
import { SafeAny } from '@/lib/types/api.types';

const { Title, Text } = Typography;

const STATUS_COLOR: Record<PlatformInvoiceStatus, string> = {
  DRAFT:     'default',
  SENT:      'blue',
  PAID:      'green',
  DISPUTED:  'orange',
  CANCELLED: 'red',
};

const lineItemColumns: TableColumnsType<IPlatformLineItem> = [
  {
    title: 'Description',
    dataIndex: 'description',
    key: 'description',
  },
  {
    title: 'SAC Code',
    dataIndex: 'sacCode',
    key: 'sacCode',
    render: (val) => <span style={{ fontFamily: 'monospace', fontSize: 12 }}>{val}</span>,
  },
  {
    title: 'Transactions',
    dataIndex: 'txnCount',
    key: 'txnCount',
    align: 'right',
    render: (val) => val?.toLocaleString(),
  },
  {
    title: 'Taxable Amt',
    dataIndex: 'taxableAmount',
    key: 'taxableAmount',
    align: 'right',
    render: (val) => formatAmount(val),
  },
  {
    title: 'GST',
    key: 'gst',
    align: 'right',
    render: (_, item) => {
      const gstAmt = item.cgstAmount + item.sgstAmount + item.igstAmount;
      return (
        <div style={{ fontSize: 12, lineHeight: '20px' }}>
          {item.cgstAmount > 0 && <div>CGST: {formatAmount(item.cgstAmount)}</div>}
          {item.sgstAmount > 0 && <div>SGST: {formatAmount(item.sgstAmount)}</div>}
          {item.igstAmount > 0 && <div>IGST: {formatAmount(item.igstAmount)}</div>}
          <div style={{ fontWeight: 600 }}>Total: {formatAmount(gstAmt)}</div>
        </div>
      );
    },
  },
  {
    title: 'Total',
    dataIndex: 'totalAmount',
    key: 'totalAmount',
    align: 'right',
    render: (val) => <strong>{formatAmount(val)}</strong>,
  },
];

const PlatformInvoiceDetailPage = () => {
  const params    = useParams();
  const router    = useRouter();
  const invoiceId = params.id as string;

  const [invoice, setInvoice] = useState<IPlatformInvoice | null>(null);
  const [sending, setSending] = useState(false);

  const query = usePlatformInvoice(invoiceId);
  const { data, isLoading } = query;

  useEffect(() => {
    if (data) {
      const payload = Array.isArray(data) ? data[0] : (data as SafeAny)?.data;
      setInvoice(payload ?? null);
    }
  }, [data]);

  const handleSend = async () => {
    if (!invoice) return;
    setSending(true);
    await callSendInvoice(invoice.id);
    setSending(false);
    query.refetch();
  };

  if (isLoading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 260 }}>
        <Spin size="large" />
      </div>
    );
  }

  if (!invoice) {
    return <div style={{ textAlign: 'center', marginTop: 64, color: '#999' }}>Invoice not found.</div>;
  }

  const merchant     = invoice.merchant;
  const bd           = merchant?.businessDetails;
  const addr         = merchant?.address;
  const isInterState = invoice.igstAmount > 0;

  return (
    <div style={{ padding: '0 16px' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <Button icon={<ArrowLeftOutlined />} onClick={() => router.back()} style={{ borderRadius: 6 }}>
            Back
          </Button>
          <div>
            <Title level={4} style={{ color: 'var(--primary)', margin: 0 }}>
              <FileTextOutlined style={{ marginRight: 8 }} />
              {invoice.invoiceNumber}
            </Title>
            <Text type="secondary" style={{ fontSize: 12 }}>
              {invoice.billingMonth} · Payment Gateway Services
            </Text>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <Tag color={STATUS_COLOR[invoice.status]} style={{ fontSize: 13 }}>
            {invoice.status}
          </Tag>
          {invoice.status === 'DRAFT' ? (
            <Button
              type="primary"
              icon={<SendOutlined />}
              loading={sending}
              style={{ background: 'var(--secondary)', border: 'none' }}
              onClick={handleSend}
            >
              Send to Merchant
            </Button>
          ) : (
            <Button
              icon={<SendOutlined />}
              loading={sending}
              style={{ background: 'var(--primary)', color: '#fff', border: 'none' }}
              onClick={handleSend}
            >
              Resend Email
            </Button>
          )}
        </div>
      </div>

      {/* AI Summary */}
      {invoice.aiSummary && (
        <Card
          style={{ marginBottom: 16, borderRadius: 10, borderColor: '#86efac', background: '#f0fdf4' }}
          styles={{ body: { padding: '12px 16px' } }}
        >
          <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
            <RobotOutlined style={{ fontSize: 22, color: '#16a34a', marginTop: 2 }} />
            <div>
              <Text strong style={{ color: '#15803d', fontSize: 12, display: 'block', marginBottom: 4 }}>
                AI Invoice Summary
              </Text>
              <Text style={{ color: '#166534', fontSize: 13 }}>{invoice.aiSummary}</Text>
            </div>
          </div>
        </Card>
      )}

      {/* Billing parties */}
      <Row gutter={16} style={{ marginBottom: 16 }}>
        <Col span={12}>
          <Card
            style={{ borderRadius: 10, border: '2px solid #ddd8fe' }}
            styles={{ body: { padding: '14px 16px' } }}
          >
            <Text strong style={{ color: 'var(--primary)', fontSize: 11, textTransform: 'uppercase', letterSpacing: 0.5, display: 'block', marginBottom: 8 }}>
              Billed By
            </Text>
            <div style={{ fontWeight: 600, fontSize: 14 }}>RupeeFlow Finance Pvt Ltd</div>
            <div style={{ color: '#999', fontSize: 13 }}>Bangalore, Karnataka — 560001</div>
            <div style={{ color: '#999', fontSize: 13 }}>billing@rupeeflow.co</div>
            <div style={{ color: '#999', fontSize: 12, marginTop: 4 }}>GSTIN: 29AAICP0353Q1ZA</div>
          </Card>
        </Col>
        <Col span={12}>
          <Card
            style={{ borderRadius: 10, border: '2px solid #ddd8fe' }}
            styles={{ body: { padding: '14px 16px' } }}
          >
            <Text strong style={{ color: 'var(--primary)', fontSize: 11, textTransform: 'uppercase', letterSpacing: 0.5, display: 'block', marginBottom: 8 }}>
              Billed To
            </Text>
            <div style={{ fontWeight: 600, fontSize: 14 }}>{bd?.businessName ?? merchant?.fullName ?? '-'}</div>
            {bd?.gstin && <div style={{ color: '#999', fontSize: 12 }}>GSTIN: {bd.gstin}</div>}
            {addr && (
              <div style={{ color: '#999', fontSize: 13 }}>
                {addr.address}, {addr.city}, {addr.state} — {addr.pincode}
              </div>
            )}
            <div style={{ color: '#999', fontSize: 13 }}>{merchant?.email}</div>
          </Card>
        </Col>
      </Row>

      {/* Line items */}
      <Card
        style={{ marginBottom: 16, borderRadius: 10, border: '2px solid #ddd8fe' }}
        styles={{ body: { padding: '14px 16px' } }}
      >
        <Text strong style={{ color: 'var(--primary)', fontSize: 12, textTransform: 'uppercase', letterSpacing: 0.5, display: 'block', marginBottom: 12 }}>
          Line Items
        </Text>
        <Table
          columns={lineItemColumns}
          dataSource={invoice.lineItems ?? []}
          rowKey="id"
          pagination={false}
          size="small"
        />
      </Card>

      {/* Totals */}
      <Row justify="end">
        <Col xs={24} sm={14} md={10} lg={8}>
          <Card
            style={{ borderRadius: 10, border: '2px solid var(--primary)' }}
            styles={{ body: { padding: '14px 18px' } }}
          >
            <Descriptions column={1} size="small" colon={false}>
              <Descriptions.Item label={<Text type="secondary">Subtotal</Text>}>
                {formatAmount(invoice.subtotalAmount)}
              </Descriptions.Item>
              {!isInterState && (
                <>
                  <Descriptions.Item label={<Text type="secondary">CGST @ 9%</Text>}>
                    {formatAmount(invoice.cgstAmount)}
                  </Descriptions.Item>
                  <Descriptions.Item label={<Text type="secondary">SGST @ 9%</Text>}>
                    {formatAmount(invoice.sgstAmount)}
                  </Descriptions.Item>
                </>
              )}
              {isInterState && (
                <Descriptions.Item label={<Text type="secondary">IGST @ 18%</Text>}>
                  {formatAmount(invoice.igstAmount)}
                </Descriptions.Item>
              )}
            </Descriptions>
            <Divider style={{ margin: '8px 0' }} />
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Text strong style={{ color: 'var(--primary)', fontSize: 15 }}>Total Due</Text>
              <Text strong style={{ color: 'var(--primary)', fontSize: 15 }}>{formatAmount(invoice.totalAmount)}</Text>
            </div>
            {invoice.paidAt && (
              <div style={{ marginTop: 8, fontSize: 12, color: '#16a34a' }}>
                ✅ Paid on {new Date(invoice.paidAt).toLocaleDateString('en-IN')}
              </div>
            )}
            {invoice.sentAt && (
              <div style={{ marginTop: 4, fontSize: 12, color: '#999' }}>
                Sent on {new Date(invoice.sentAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
              </div>
            )}
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default PlatformInvoiceDetailPage;
