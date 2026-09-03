'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  Alert,
  Button,
  Card,
  Col,
  DatePicker,
  Row,
  Spin,
  Statistic,
  Table,
  Tag,
  Tooltip,
  Typography,
  Upload,
} from 'antd';
import dayjs from 'dayjs';
import type { TableColumnsType, UploadProps } from 'antd';
import {
  ArrowLeftOutlined,
  CheckCircleOutlined,
  CloudUploadOutlined,
  ExclamationCircleOutlined,
  FilePdfOutlined,
  FileTextOutlined,
  PlayCircleOutlined,
  QuestionCircleOutlined,
  RobotOutlined,
} from '@ant-design/icons';
import { createStyles } from 'antd-style';
import { useReconciliationResults } from '@/lib/hooks/use-platform-billing';
import {
  callUploadBankStatement,
  callRunReconciliation,
  callGenerateTaxInvoices,
} from '@/lib/services/platform-billing-service';
import { IReconResult, ReconMatchStatus } from '@/lib/interfaces/platform-billing.interface';
import { formatAmount } from '@/lib/utils/utils';
import { SafeAny } from '@/lib/types/api.types';

const { Title, Text } = Typography;
const { Dragger } = Upload;

const STATUS_COLOR: Record<ReconMatchStatus, string> = {
  MATCHED:   'green',
  PARTIAL:   'orange',
  UNMATCHED: 'red',
  EXCESS:    'purple',
};

const STATUS_ICON: Record<ReconMatchStatus, React.ReactNode> = {
  MATCHED:   <CheckCircleOutlined />,
  PARTIAL:   <ExclamationCircleOutlined />,
  UNMATCHED: <QuestionCircleOutlined />,
  EXCESS:    <ExclamationCircleOutlined />,
};

const currentMonth = () => {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
};

const useStyle = createStyles(({ css }) => ({
  customTable: css`
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

const ReconcilePage = () => {
  const { styles } = useStyle();
  const router       = useRouter();
  const searchParams = useSearchParams();

  const [billingMonth, setBillingMonth]   = useState(searchParams.get('month') ?? currentMonth());
  const [uploading, setUploading]         = useState(false);
  const [running, setRunning]             = useState(false);
  const [uploadCount, setUploadCount]     = useState<number | null>(null);
  const [uploadedFile, setUploadedFile]   = useState<{ name: string; type: 'csv' | 'pdf' | 'xlsx' } | null>(null);
  const [runSummary, setRunSummary]       = useState<SafeAny>(null);
  const [results, setResults]             = useState<IReconResult[]>([]);
  const [errorMsg, setErrorMsg]           = useState<string | null>(null);
  const [generatingTax, setGeneratingTax] = useState(false);
  const [taxResult, setTaxResult]         = useState<{ generated: number; skipped: number; errors: number } | null>(null);

  const reconQuery = useReconciliationResults(billingMonth);

  useEffect(() => {
    if (reconQuery.data) {
      const payload = Array.isArray(reconQuery.data)
        ? reconQuery.data[0]
        : (reconQuery.data as SafeAny)?.data;
      setResults(Array.isArray(payload) ? payload : []);
    }
  }, [reconQuery.data]);

  const handleUpload: UploadProps['customRequest'] = async ({ file, onSuccess, onError }) => {
    const f = file as File;
    const isPdf  = f.name.toLowerCase().endsWith('.pdf') || f.type === 'application/pdf';
    const isXlsx = f.name.toLowerCase().endsWith('.xlsx') || f.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
    const fileType = isPdf ? 'pdf' : isXlsx ? 'xlsx' : 'csv';
    setUploading(true);
    setErrorMsg(null);
    setUploadedFile({ name: f.name, type: fileType });
    const [res, err] = await callUploadBankStatement(billingMonth, f);
    setUploading(false);
    if (err || !res) {
      const msg = err?.message ?? 'Upload failed';
      setErrorMsg(msg);
      setUploadedFile(null);
      onError?.(new Error(msg));
      return;
    }
    const count = (res as SafeAny)?.data?.count ?? (res as SafeAny)?.count ?? 0;
    setUploadCount(count);
    onSuccess?.('ok');
  };

  const handleRun = async () => {
    setRunning(true);
    setErrorMsg(null);
    setTaxResult(null);
    const [res, err] = await callRunReconciliation(billingMonth);
    setRunning(false);
    if (err || !res) {
      setErrorMsg(err?.message ?? 'Reconciliation failed');
      return;
    }
    const payload = (res as SafeAny)?.data ?? res;
    setRunSummary(payload?.summary ?? null);
    reconQuery.refetch();
  };

  const handleGenerateTaxInvoices = async () => {
    setGeneratingTax(true);
    setErrorMsg(null);
    const [res, err] = await callGenerateTaxInvoices(billingMonth);
    setGeneratingTax(false);
    if (err || !res) {
      setErrorMsg(err?.message ?? 'Tax invoice generation failed');
      return;
    }
    const payload = (res as SafeAny)?.data ?? res;
    setTaxResult({
      generated: payload?.generated ?? 0,
      skipped:   payload?.skipped   ?? 0,
      errors:    payload?.errors    ?? 0,
    });
  };

  const matched   = results.filter((r) => r.matchStatus === 'MATCHED').length;
  const partial   = results.filter((r) => r.matchStatus === 'PARTIAL').length;
  const unmatched = results.filter((r) => r.matchStatus === 'UNMATCHED').length;
  const excess    = results.filter((r) => r.matchStatus === 'EXCESS').length;

  const columns: TableColumnsType<IReconResult> = [
    {
      title: 'Invoice #',
      key: 'invoiceNumber',
      render: (_, r) => (
        <span style={{ fontFamily: 'monospace', fontWeight: 600, color: 'var(--secondary)', fontSize: 12 }}>
          {r.invoice?.invoiceNumber ?? '—'}
        </span>
      ),
    },
    {
      title: 'Merchant',
      key: 'merchant',
      render: (_, r) => (
        <div>
          <div style={{ fontWeight: 500, fontSize: 13 }}>
            {r.invoice?.merchant?.businessDetails?.businessName ?? r.invoice?.merchant?.fullName ?? '—'}
          </div>
          <div style={{ fontSize: 11, color: '#999' }}>{r.invoice?.merchant?.email}</div>
        </div>
      ),
    },
    {
      title: 'Invoice Amt',
      dataIndex: 'invoiceAmount',
      key: 'invoiceAmount',
      align: 'right',
      render: (val) => (val != null ? formatAmount(val) : '—'),
    },
    {
      title: 'Bank Credit',
      dataIndex: 'bankAmount',
      key: 'bankAmount',
      align: 'right',
      render: (val) => (val != null ? formatAmount(val) : '—'),
    },
    {
      title: 'Difference',
      dataIndex: 'difference',
      key: 'difference',
      align: 'right',
      render: (val) => {
        if (val == null) return '—';
        const color = val === 0 ? '#16a34a' : val > 0 ? 'var(--primary)' : '#dc2626';
        return (
          <span style={{ color, fontWeight: 600 }}>
            {val === 0 ? '—' : formatAmount(Math.abs(val))}
          </span>
        );
      },
    },
    {
      title: 'Status',
      dataIndex: 'matchStatus',
      key: 'matchStatus',
      render: (val: ReconMatchStatus) => (
        <Tag color={STATUS_COLOR[val]} icon={STATUS_ICON[val]}>{val}</Tag>
      ),
    },
    {
      title: 'Confidence',
      dataIndex: 'confidenceScore',
      key: 'confidenceScore',
      align: 'center',
      render: (val) => {
        if (val == null) return '—';
        const pct   = Math.round(val * 100);
        const color = pct >= 80 ? '#16a34a' : pct >= 50 ? '#f59e0b' : '#dc2626';
        return <span style={{ color, fontWeight: 600 }}>{pct}%</span>;
      },
    },
    {
      title: 'Bank UTR / Date',
      key: 'bankRef',
      render: (_, r) => (
        <div style={{ fontSize: 12 }}>
          {r.bankEntry?.utr && <div style={{ fontFamily: 'monospace' }}>{r.bankEntry.utr}</div>}
          {r.bankEntry?.valueDate && (
            <div style={{ color: '#999' }}>
              {new Date(r.bankEntry.valueDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
            </div>
          )}
          {!r.bankEntry?.utr && !r.bankEntry?.valueDate && '—'}
        </div>
      ),
    },
    {
      title: 'AI Explanation',
      dataIndex: 'aiExplanation',
      key: 'aiExplanation',
      width: 260,
      render: (val) =>
        val ? (
          <Tooltip title={val}>
            <div
              style={{
                fontSize: 12,
                color: '#555',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
                maxWidth: 240,
                display: 'flex',
                alignItems: 'center',
                gap: 4,
              }}
            >
              <RobotOutlined style={{ color: '#16a34a', flexShrink: 0 }} />
              {val}
            </div>
          </Tooltip>
        ) : '—',
    },
  ];

  return (
    <div style={{ padding: '0 16px' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 20 }}>
        <Button icon={<ArrowLeftOutlined />} onClick={() => router.back()}>Back</Button>
        <div>
          <Title level={4} style={{ color: 'var(--secondary)', margin: 0 }}>
            Bank Statement Reconciliation
          </Title>
          <Text type="secondary" style={{ fontSize: 12 }}>
            Match bank credits against platform invoices · powered by AI
          </Text>
        </div>
      </div>

      {errorMsg && (
        <Alert
          type="error"
          message={errorMsg}
          closable
          onClose={() => setErrorMsg(null)}
          style={{ marginBottom: 16 }}
        />
      )}

      {/* Upload + Run */}
      <Row gutter={16} style={{ marginBottom: 16 }}>
        <Col span={14}>
          <Card style={{ borderRadius: 10, border: '2px solid var(--primary)' }} styles={{ body: { padding: 16 } }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14 }}>
              <Text strong style={{ fontSize: 13 }}>Billing Month</Text>
              <DatePicker
                picker="month"
                value={dayjs(billingMonth, 'YYYY-MM')}
                onChange={(date) => { if (date) setBillingMonth(date.format('YYYY-MM')); }}
                allowClear={false}
                format="MMM YYYY"
              />
            </div>
            <Dragger
              accept=".csv,.pdf,.xlsx"
              showUploadList={false}
              customRequest={handleUpload}
              disabled={uploading}
              style={{ borderRadius: 10, padding: '8px 0' }}
            >
              <p style={{ fontSize: 28, color: 'var(--primary)', margin: '8px 0' }}>
                {uploadedFile?.type === 'pdf'
                  ? <FilePdfOutlined style={{ color: '#ff4d4f' }} />
                  : uploadedFile?.type === 'xlsx'
                  ? <FileTextOutlined style={{ color: '#1677ff' }} />
                  : uploadedFile?.type === 'csv'
                  ? <FileTextOutlined style={{ color: '#52c41a' }} />
                  : <CloudUploadOutlined />}
              </p>
              <p style={{ fontWeight: 600, margin: '4px 0' }}>
                {uploadedFile ? uploadedFile.name : 'Drop your bank statement here'}
              </p>
              <p style={{ color: '#999', fontSize: 12, margin: '4px 0' }}>
                {uploadedFile
                  ? <Tag color={uploadedFile.type === 'pdf' ? 'red' : uploadedFile.type === 'xlsx' ? 'blue' : 'green'}>{uploadedFile.type.toUpperCase()}</Tag>
                  : 'CSV · XLSX · PDF · click to browse'}
              </p>
              {uploading && <Spin style={{ marginTop: 8 }} />}
              {uploadCount !== null && !uploading && (
                <p style={{ color: '#52c41a', marginTop: 8, fontWeight: 600 }}>
                  ✅ {uploadedFile?.type === 'pdf' ? 'PDF parsed by AI —' : ''} {uploadCount} rows extracted
                </p>
              )}
            </Dragger>
            <div style={{ marginTop: 14, display: 'flex', flexDirection: 'column', gap: 8 }}>
              <Button
                type="primary"
                icon={<PlayCircleOutlined />}
                loading={running}
                style={{ background: 'var(--secondary)', border: 'none', width: '100%' }}
                onClick={handleRun}
              >
                Run Reconciliation (AI Match)
              </Button>
              <Button
                icon={<FilePdfOutlined />}
                loading={generatingTax}
                disabled={!runSummary && results.length === 0}
                style={{ width: '100%', borderColor: 'var(--secondary)', color: 'var(--secondary)' }}
                onClick={handleGenerateTaxInvoices}
              >
                Generate Tax Invoices for Matched
              </Button>
              {taxResult && (
                <Alert
                  type={taxResult.errors > 0 ? 'warning' : 'success'}
                  message={`Tax invoices: ${taxResult.generated} generated · ${taxResult.skipped} skipped · ${taxResult.errors} errors`}
                  style={{ fontSize: 12 }}
                />
              )}
            </div>
          </Card>
        </Col>

        <Col span={10}>
          {runSummary || results.length > 0 ? (
            <Card style={{ borderRadius: 10, border: '2px solid #22a06b', height: '100%' }}>
              <Row gutter={[12, 12]}>
                <Col span={12}>
                  <Statistic
                    title="Matched"
                    value={runSummary?.MATCHED ?? matched}
                    valueStyle={{ color: '#16a34a', fontWeight: 700 }}
                    prefix={<CheckCircleOutlined />}
                  />
                </Col>
                <Col span={12}>
                  <Statistic
                    title="Partial"
                    value={runSummary?.PARTIAL ?? partial}
                    valueStyle={{ color: '#f59e0b', fontWeight: 700 }}
                    prefix={<ExclamationCircleOutlined />}
                  />
                </Col>
                <Col span={12}>
                  <Statistic
                    title="Unmatched"
                    value={runSummary?.UNMATCHED ?? unmatched}
                    valueStyle={{ color: '#dc2626', fontWeight: 700 }}
                    prefix={<QuestionCircleOutlined />}
                  />
                </Col>
                <Col span={12}>
                  <Statistic
                    title="Excess Credits"
                    value={runSummary?.EXCESS ?? excess}
                    valueStyle={{ color: 'var(--primary)', fontWeight: 700 }}
                  />
                </Col>
              </Row>
            </Card>
          ) : (
            <Card
              style={{ borderRadius: 10, border: '2px dashed #d9d9d9', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              styles={{ body: { display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 24 } }}
            >
              <RobotOutlined style={{ fontSize: 36, color: '#ccc', marginBottom: 10 }} />
              <Text type="secondary" style={{ textAlign: 'center', fontSize: 13 }}>
                Upload a bank statement and run reconciliation to see results
              </Text>
            </Card>
          )}
        </Col>
      </Row>

      {/* Results table */}
      {(results.length > 0 || reconQuery.isLoading) && (
        <Card style={{ borderRadius: 10, border: '2px solid #22a06b', padding: 0 }} styles={{ body: { padding: 0 } }}>
          <div style={{ padding: '12px 16px 8px', borderBottom: '1px solid #f0f0f0' }}>
            <Text strong style={{ color: 'var(--secondary)', fontSize: 13 }}>
              Reconciliation Results — {billingMonth}
            </Text>
            <Text type="secondary" style={{ fontSize: 12, marginLeft: 10 }}>
              {results.length} entries
            </Text>
          </div>
          <div className={styles.customTable}>
            <Table
              columns={columns}
              dataSource={results}
              rowKey="id"
              loading={reconQuery.isLoading}
              pagination={{ pageSize: 20, showTotal: (t) => `${t} results` }}
              size="middle"
              expandable={{
                expandedRowRender: (record) =>
                  record.aiExplanation ? (
                    <div
                      style={{
                        background: '#f0fdf4',
                        border: '1px solid #86efac',
                        borderRadius: 8,
                        padding: '10px 14px',
                        fontSize: 13,
                        color: '#166534',
                        display: 'flex',
                        gap: 8,
                        alignItems: 'flex-start',
                      }}
                    >
                      <RobotOutlined style={{ color: '#16a34a', marginTop: 2, flexShrink: 0 }} />
                      {record.aiExplanation}
                    </div>
                  ) : null,
                rowExpandable: (record) => !!record.aiExplanation,
              }}
            />
          </div>
        </Card>
      )}
    </div>
  );
};

export default ReconcilePage;
