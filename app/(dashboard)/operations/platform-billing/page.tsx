'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Button,
  Card,
  Col,
  DatePicker,
  Input,
  Pagination,
  Row,
  Select,
  Spin,
  Statistic,
  Table,
  Tag,
  Typography,
} from 'antd';
import type { TableColumnsType } from 'antd';
import { createStyles } from 'antd-style';
import {
  ArrowUpOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  ExclamationCircleOutlined,
  FileTextOutlined,
  ReloadOutlined,
  SearchOutlined,
  SendOutlined,
  SyncOutlined,
} from '@ant-design/icons';
import dayjs from 'dayjs';
import useDebounce from '@/lib/hooks/use-debounce';
import { usePlatformInvoices, useMonthlySummary } from '@/lib/hooks/use-platform-billing';
import { callGenerateInvoices, callSendInvoice } from '@/lib/services/platform-billing-service';
import {
  IPlatformInvoice,
  IPlatformMonthlySummary,
  PlatformInvoiceStatus,
} from '@/lib/interfaces/platform-billing.interface';
import { formatAmount } from '@/lib/utils/utils';
import { SafeAny } from '@/lib/types/api.types';

const { Title } = Typography;

const STATUS_COLOR: Record<PlatformInvoiceStatus, string> = {
  DRAFT:     'default',
  SENT:      'blue',
  PAID:      'green',
  DISPUTED:  'orange',
  CANCELLED: 'red',
};

const currentMonth = () => {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
};

const useStyle = createStyles(({ css }) => ({
  customTable: css`
    .ant-table-wrapper {
      background: linear-gradient(to right, var(--border), var(--primary));
      border-radius: 12px;
      padding: 2px;
    }
    .ant-table {
      background: #ffffff;
      border-radius: 10px;
    }
    .ant-table-thead > tr > th {
      background: var(--primary) !important;
      color: #fff !important;
      font-size: 11px;
      font-weight: 600;
      letter-spacing: 0.4px;
    }
    .ant-table-tbody > tr:hover > td {
      background: #f0faf5 !important;
    }
    .ant-table-tbody > tr:nth-child(even) > td {
      background: #f8fffe;
    }
  `,
}));

const PlatformBillingPage = () => {
  const { styles } = useStyle();
  const router = useRouter();

  const [page, setPage] = useState(1);
  const [billingMonth, setBillingMonth] = useState(currentMonth());
  const [statusFilter, setStatusFilter] = useState('');
  const [searchMerchant, setSearchMerchant] = useState('');
  const [invoiceList, setInvoiceList] = useState<IPlatformInvoice[]>([]);
  const [totalItems, setTotalItems] = useState(0);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [sendingId, setSendingId] = useState<string | null>(null);
  const limit = 20;

  const debouncedSearch = useDebounce(searchMerchant, 500);

  const query = usePlatformInvoices(billingMonth, statusFilter, debouncedSearch, page, limit);
  const { data } = query;

  const summaryQuery = useMonthlySummary(billingMonth);
  const summaryRaw  = summaryQuery.data;
  const summary: IPlatformMonthlySummary | null = Array.isArray(summaryRaw)
    ? summaryRaw[0]
    : (summaryRaw as SafeAny)?.data ?? summaryRaw;

  useEffect(() => {
    if (data) {
      const payload = Array.isArray(data) ? data[0]?.data : (data as SafeAny)?.data;
      setInvoiceList(payload?.data ?? []);
      setTotalItems(payload?.total ?? 0);
      setLoading(false);
    }
  }, [data]);

  useEffect(() => {
    setLoading(true);
    query.refetch().finally(() => setLoading(false));
  }, [page, billingMonth, statusFilter, debouncedSearch]);

  const totalRaised  = (summary?.SENT?.total ?? 0) + (summary?.PAID?.total ?? 0) + (summary?.DISPUTED?.total ?? 0);
  const totalPaid    = summary?.PAID?.total ?? 0;
  const totalPending = (summary?.SENT?.total ?? 0) + (summary?.DISPUTED?.total ?? 0);
  const mismatches   = summary?.DISPUTED?.count ?? 0;

  const handleGenerate = async () => {
    const [y, m] = billingMonth.split('-').map(Number);
    setGenerating(true);
    await callGenerateInvoices(y, m);
    setGenerating(false);
    query.refetch();
    summaryQuery.refetch();
  };

  const handleSend = async (invoiceId: string) => {
    setSendingId(invoiceId);
    await callSendInvoice(invoiceId);
    setSendingId(null);
    query.refetch();
  };

  const columns: TableColumnsType<IPlatformInvoice> = [
    {
      title: 'Invoice #',
      dataIndex: 'invoiceNumber',
      key: 'invoiceNumber',
      render: (val) => (
        <span style={{ fontFamily: 'monospace', fontWeight: 600, color: 'var(--secondary)' }}>{val}</span>
      ),
    },
    {
      title: 'Merchant',
      key: 'merchant',
      render: (_, record) => (
        <div>
          <div style={{ fontWeight: 500 }}>
            {record.merchant?.businessDetails?.businessName ?? record.merchant?.fullName ?? '-'}
          </div>
          <div style={{ fontSize: 11, color: '#999' }}>{record.merchant?.email}</div>
        </div>
      ),
    },
    {
      title: 'Month',
      dataIndex: 'billingMonth',
      key: 'billingMonth',
    },
    {
      title: 'Subtotal',
      dataIndex: 'subtotalAmount',
      key: 'subtotalAmount',
      render: (val) => formatAmount(val),
    },
    {
      title: 'GST',
      dataIndex: 'totalTaxAmount',
      key: 'totalTaxAmount',
      render: (val) => formatAmount(val),
    },
    {
      title: 'Total',
      dataIndex: 'totalAmount',
      key: 'totalAmount',
      render: (val) => <strong>{formatAmount(val)}</strong>,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (val: PlatformInvoiceStatus) => <Tag color={STATUS_COLOR[val]}>{val}</Tag>,
    },
    {
      title: 'Sent At',
      dataIndex: 'sentAt',
      key: 'sentAt',
      render: (val) =>
        val
          ? new Date(val).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })
          : '—',
    },
    {
      title: 'Actions',
      key: 'actions',
      align: 'center',
      render: (_, record) => (
        <div style={{ display: 'flex', gap: 8, justifyContent: 'center' }}>
          <Button
            size="small"
            icon={<FileTextOutlined />}
            style={{ background: 'var(--primary)', color: '#fff', border: 'none' }}
            onClick={() => router.push(`/operations/platform-billing/${record.id}`)}
          >
            View
          </Button>
          {record.status === 'DRAFT' && (
            <Button
              size="small"
              icon={<SendOutlined />}
              loading={sendingId === record.id}
              style={{ background: 'var(--secondary)', color: '#fff', border: 'none' }}
              onClick={() => handleSend(record.id)}
            >
              Send
            </Button>
          )}
        </div>
      ),
    },
  ];

  return (
    <div style={{ padding: '0 16px' }}>
      <Title level={4} style={{ color: 'var(--secondary)', marginBottom: 16 }}>
        Platform Billing — GST Invoices to Merchants
      </Title>

      {/* Stats */}
      <Row gutter={16} style={{ marginBottom: 16 }}>
        <Col span={6}>
          <Card style={{ borderRadius: 10 }}>
            <Statistic
              title="Total Raised"
              value={totalRaised}
              prefix={<ArrowUpOutlined />}
              formatter={(val) => `₹ ${Number(val).toLocaleString('en-IN')}`}
              valueStyle={{ color: 'var(--primary)', fontWeight: 700 }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card style={{ borderRadius: 10 }}>
            <Statistic
              title="Total Collected"
              value={totalPaid}
              prefix={<CheckCircleOutlined />}
              formatter={(val) => `₹ ${Number(val).toLocaleString('en-IN')}`}
              valueStyle={{ color: '#52c41a', fontWeight: 700 }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card style={{ borderRadius: 10 }}>
            <Statistic
              title="Outstanding"
              value={totalPending}
              prefix={<ClockCircleOutlined />}
              formatter={(val) => `₹ ${Number(val).toLocaleString('en-IN')}`}
              valueStyle={{ color: '#1677ff', fontWeight: 700 }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card style={{ borderRadius: 10 }}>
            <Statistic
              title="Disputed / Mismatches"
              value={mismatches}
              prefix={<ExclamationCircleOutlined />}
              suffix="invoices"
              valueStyle={{ color: mismatches > 0 ? '#ff4d4f' : '#52c41a', fontWeight: 700 }}
            />
          </Card>
        </Col>
      </Row>

      {/* Filters */}
      <Card style={{ marginBottom: 16, borderRadius: 10, border: '2px solid var(--primary)' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>
            <DatePicker
              picker="month"
              value={dayjs(billingMonth, 'YYYY-MM')}
              onChange={(date) => {
                if (date) { setBillingMonth(date.format('YYYY-MM')); setPage(1); }
              }}
              allowClear={false}
              format="MMM YYYY"
            />
            <Select
              style={{ width: 140 }}
              placeholder="All Status"
              value={statusFilter || undefined}
              allowClear
              onChange={(val) => { setStatusFilter(val ?? ''); setPage(1); }}
              options={[
                { value: 'DRAFT',     label: 'Draft' },
                { value: 'SENT',      label: 'Sent' },
                { value: 'PAID',      label: 'Paid' },
                { value: 'DISPUTED',  label: 'Disputed' },
                { value: 'CANCELLED', label: 'Cancelled' },
              ]}
            />
            <Input
              prefix={<SearchOutlined />}
              placeholder="Search merchant…"
              style={{ width: 240 }}
              value={searchMerchant}
              onChange={(e) => { setSearchMerchant(e.target.value); setPage(1); }}
            />
            <Button
              danger
              icon={<ReloadOutlined />}
              onClick={() => { setSearchMerchant(''); setStatusFilter(''); setBillingMonth(currentMonth()); setPage(1); }}
            >
              Reset
            </Button>
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            <Button
              type="primary"
              icon={<SyncOutlined spin={generating} />}
              loading={generating}
              style={{ background: 'var(--primary)', border: 'none' }}
              onClick={handleGenerate}
            >
              Generate {billingMonth} Invoices
            </Button>
            <Button
              style={{ background: 'var(--secondary)', color: '#fff', border: 'none' }}
              onClick={() => router.push(`/operations/platform-billing/reconcile?month=${billingMonth}`)}
            >
              Reconcile Bank Statement
            </Button>
          </div>
        </div>
      </Card>

      {/* Table */}
      <div className={styles.customTable}>
        <Table
          columns={columns}
          dataSource={invoiceList}
          rowKey="id"
          loading={{ spinning: loading, indicator: <Spin /> }}
          pagination={false}
          scroll={{ y: 'calc(100vh - 520px)' }}
          size="middle"
        />
      </div>

      {/* Pagination */}
      <div style={{ display: 'flex', justifyContent: 'center', marginTop: 16 }}>
        <Pagination
          current={page}
          pageSize={limit}
          total={totalItems}
          onChange={setPage}
          showSizeChanger={false}
          showTotal={(total) => `Total ${total} invoices`}
        />
      </div>
    </div>
  );
};

export default PlatformBillingPage;
