'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import {
  Alert,
  Button,
  Card,
  Checkbox,
  Col,
  Collapse,
  Form,
  Input,
  Row,
  Select,
  Spin,
  Table,
  Typography,
  Upload,
} from 'antd';
import type { TableColumnsType, UploadProps } from 'antd';
import { CloudUploadOutlined } from '@ant-design/icons';

import { useRouter } from 'next/navigation';
import { useToast } from '@/lib/components/Toast/ToastContext';
import { useRole } from '@/lib/components/Role/RoleContext';
import { isAdmin, isOps } from '@/lib/utils/utils';
import { safeAny } from '@/lib/interfaces/global.interface';
import { IAdminUser } from '@/lib/interfaces/users.interface';
import { ACCOUNT_STATUS, ONBOARDING_STATUS } from '@/lib/enum';
import useDebounce from '@/lib/hooks/use-debounce';
import { callGetAllAdminMerchantList } from '@/lib/services/users-service';
import {
  callImportSettlementBankReport,
  callListBankReportFormats,
  callRegisterBankReportFormat,
  callSetSettlementBankMatchKey,
} from '@/lib/services/settlement-bank-report.service';
import type {
  BankReportFormatItem,
  BankReportFormatRegisterResponse,
  BankReportImportResponse,
  BankReportImportUnmatchedSample,
} from '@/lib/interfaces/settlement-bank-report.interface';

const { Title, Paragraph, Text } = Typography;
const { Dragger } = Upload;
const { TextArea } = Input;

function pickImportPayload(res: safeAny): safeAny {
  if (res == null) return null;
  return (res as { data?: safeAny }).data ?? res;
}

function normalizeImportResponse(res: safeAny): BankReportImportResponse | null {
  const raw = pickImportPayload(res);
  if (!raw || typeof raw !== 'object') return null;
  return raw as BankReportImportResponse;
}

function isApprovedActiveMerchant(u: IAdminUser) {
  const onboarded =
    u.onboardingStatus === ONBOARDING_STATUS.KYC_VERIFIED ||
    u.onboardingStatus === ONBOARDING_STATUS.FILLED_BUSINESS_DETAILS;
  return onboarded && u.accountStatus === ACCOUNT_STATUS.ACTIVE;
}

const BankReportImportPage = () => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { role, isLoading } = useRole();
  const { showToast } = useToast();
  const [form] = Form.useForm();
  const [importBusy, setImportBusy] = useState(false);
  const [matchBusy, setMatchBusy] = useState(false);
  const [formatJsonBusy, setFormatJsonBusy] = useState(false);
  const [customFormatJson, setCustomFormatJson] = useState('');
  const [lastImportResult, setLastImportResult] =
    useState<BankReportImportResponse | null>(null);
  const [merchantSearch, setMerchantSearch] = useState('');
  const debouncedMerchantSearch = useDebounce(merchantSearch, 400);

  const allowed = useMemo(
    () => isAdmin(role || '') || isOps(role || ''),
    [role],
  );

  const formatsQuery = useQuery({
    queryKey: ['bank-report-formats'],
    queryFn: async () => {
      const [res, err] = await callListBankReportFormats();
      if (err) throw new Error(err.message ?? 'Failed to load formats');
      return (res?.formats ?? []) as BankReportFormatItem[];
    },
    enabled: !isLoading && allowed,
  });

  const merchantsQuery = useQuery({
    queryKey: ['bank-report-merchant-pick', debouncedMerchantSearch],
    queryFn: async () => {
      const [res, err] = await callGetAllAdminMerchantList(
        debouncedMerchantSearch,
        1,
        100,
        'merchant',
      );
      if (err) throw new Error(err.message ?? 'Failed to load merchants');
      const rows = (res?.data?.data ?? []) as IAdminUser[];
      return rows.filter(isApprovedActiveMerchant);
    },
    enabled: !isLoading && allowed,
  });

  const merchantSelectOptions = useMemo(
    () =>
      (merchantsQuery.data ?? []).map((u) => ({
        value: u.id,
        label: [u.fullName?.trim() || 'Merchant', u.email].filter(Boolean).join(' · '),
        title: u.id,
      })),
    [merchantsQuery.data],
  );

  const formatSelectOptions = useMemo(
    () =>
      (formatsQuery.data ?? []).map((f) => ({
        value: f.id,
        label: f.displayName ? `${f.displayName} (${f.id})` : f.id,
      })),
    [formatsQuery.data],
  );

  useEffect(() => {
    if (isLoading) return;
    if (!allowed) router.replace('/access-denied');
  }, [allowed, isLoading, router]);

  useEffect(() => {
    const list = formatsQuery.data;
    if (!list?.length) return;
    const current = form.getFieldValue('importFormatId');
    if (!current) {
      form.setFieldValue('importFormatId', list[0].id);
    }
  }, [formatsQuery.data, form]);

  const handleMatchKey = async () => {
    const v = await form.validateFields(['userId', 'matchKey', 'providerCode']);
    const userId = (v.userId as string).trim();
    const matchKey = (v.matchKey as string).trim();
    const providerCode = (v.providerCode as string | undefined)?.trim();
    if (!userId || !matchKey) return;
    setMatchBusy(true);
    const [res, err] = await callSetSettlementBankMatchKey(userId, {
      matchKey,
      ...(providerCode ? { providerCode } : {}),
    });
    setMatchBusy(false);
    if (err || res == null) {
      showToast(err?.message ?? 'Failed to save match key', 'error');
      return;
    }
    showToast('Match key saved for this merchant', 'success');
    form.resetFields(['matchKey']);
  };

  const handleRegisterCustomFormat = async () => {
    let parsed: safeAny;
    try {
      parsed = JSON.parse(customFormatJson || '{}');
    } catch {
      showToast('Invalid JSON', 'error');
      return;
    }
    if (!parsed || typeof parsed !== 'object' || !parsed.id) {
      showToast('JSON must include an id field', 'error');
      return;
    }
    setFormatJsonBusy(true);
    const [res, err] = await callRegisterBankReportFormat(parsed);
    setFormatJsonBusy(false);
    if (err || res == null) {
      showToast(err?.message ?? 'Failed to register format', 'error');
      return;
    }
    showToast(`Format saved: ${(res as BankReportFormatRegisterResponse).id}`, 'success');
    await queryClient.invalidateQueries({ queryKey: ['bank-report-formats'] });
  };

  const uploadProps: UploadProps = {
    maxCount: 1,
    accept: '.csv,text/csv',
    showUploadList: true,
    customRequest: async ({ file, onSuccess, onError }) => {
      const f = file as File;
      let formatId: string;
      try {
        formatId = (await form.validateFields(['importFormatId']))
          .importFormatId as string;
      } catch {
        onError?.(new Error('format'));
        return;
      }
      const dryRun = !!form.getFieldValue('dryRun');
      setImportBusy(true);
      setLastImportResult(null);
      const [res, err] = await callImportSettlementBankReport(f, formatId, dryRun);
      setImportBusy(false);
      if (err || res == null) {
        showToast(err?.message ?? 'Import failed', 'error');
        onError?.(new Error('import'));
        return;
      }
      setLastImportResult(normalizeImportResponse(res));
      showToast(dryRun ? 'Dry run completed' : 'Import completed', 'success');
      onSuccess?.('ok');
    },
  };

  const errorColumns: TableColumnsType<{ line: number; message: string }> = [
    { title: 'Line', dataIndex: 'line', width: 80 },
    { title: 'Message', dataIndex: 'message' },
  ];

  const unmatchedColumns: TableColumnsType<BankReportImportUnmatchedSample> = [
    { title: 'Line', dataIndex: 'line', width: 72 },
    { title: 'Api user', dataIndex: 'apiUser', ellipsis: true },
    { title: 'Client ref', dataIndex: 'clientReferenceId', ellipsis: true },
    {
      title: 'Amount',
      dataIndex: 'amount',
      width: 100,
      render: (v) => (v != null ? String(v) : '—'),
    },
  ];

  if (isLoading || !allowed) {
    return (
      <div className="p-6">
        <Text type="secondary">Checking access…</Text>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 max-w-5xl mx-auto space-y-6">
      <div>
        <Title level={3} style={{ marginBottom: 4 }}>
          Bank settlement CSV
        </Title>
        <Paragraph type="secondary" style={{ marginBottom: 0 }}>
          Formats are loaded from GET /api/settlements/bank-report/formats. Map each merchant&apos;s
          bank identifier, then import with formatId and dryRun as query parameters (same as the
          backend contract).
        </Paragraph>
      </div>

      {formatsQuery.isError && (
        <Alert
          type="error"
          showIcon
          message="Could not load report formats"
          description={(formatsQuery.error as Error)?.message}
        />
      )}

      <Form form={form} layout="vertical" initialValues={{ dryRun: true }}>
        <Card title="1. Map bank string → merchant" bordered={false}>
          <Alert
            type="info"
            showIcon
            className="mb-4"
            message="Match key must match the CSV exactly (after trim), e.g. the Api User cell for gateway_ledger_v1."
          />
          <Row gutter={16}>
            <Col xs={24}>
              <Form.Item
                name="userId"
                label="Merchant (KYC approved, active)"
                rules={[{ required: true, message: 'Select a merchant' }]}
              >
                <Select
                  showSearch
                  allowClear
                  placeholder="Search by name or email"
                  filterOption={false}
                  onSearch={setMerchantSearch}
                  loading={merchantsQuery.isFetching}
                  notFoundContent={
                    merchantsQuery.isFetching ? (
                      <Spin size="small" />
                    ) : merchantsQuery.isError ? (
                      'Could not load merchants'
                    ) : (
                      'No matching approved merchants'
                    )
                  }
                  options={merchantSelectOptions}
                  optionFilterProp="label"
                />
              </Form.Item>
            </Col>
            <Col xs={24}>
              <Form.Item
                name="matchKey"
                label="Match key (as in bank file)"
                rules={[{ required: true, message: 'Required' }]}
              >
                <Input placeholder="Exact string from report column" />
              </Form.Item>
            </Col>
          </Row>
          <Form.Item
            name="providerCode"
            label="Provider code (optional)"
            tooltip="Scopes the key. Omit for server default. For custom formats, use that format id (e.g. my_bank_v1)."
          >
            <Input placeholder="e.g. gateway_ledger_v1 or my_bank_v1" />
          </Form.Item>
          <Button type="primary" onClick={handleMatchKey} loading={matchBusy}>
            Save mapping
          </Button>
        </Card>

        <Collapse
          bordered={false}
          style={{ marginTop: 24, background: '#f4f8f6' }}
          items={[
            {
              key: 'custom-format',
              label: 'Register or update custom format (optional)',
              children: (
                <>
                  <Paragraph type="secondary" style={{ fontSize: 13 }}>
                    POST JSON to /api/settlements/bank-report/formats. Built-in ids (e.g.
                    gateway_ledger_v1) return 400. Same custom id updates the existing row.
                  </Paragraph>
                  <TextArea
                    rows={12}
                    value={customFormatJson}
                    onChange={(e) => setCustomFormatJson(e.target.value)}
                    placeholder='{ "id": "my_bank_v1", "displayName": "…", "columnAliases": { … }, … }'
                    className="font-mono text-xs"
                  />
                  <Button
                    type="default"
                    className="mt-3"
                    loading={formatJsonBusy}
                    onClick={handleRegisterCustomFormat}
                  >
                    Submit format definition
                  </Button>
                </>
              ),
            },
          ]}
        />

        <Card title="2. Import CSV" bordered={false} style={{ marginTop: 24 }}>
          <Form.Item
            name="importFormatId"
            label="Report format"
            rules={[{ required: true, message: 'Select a format' }]}
          >
            <Select
              placeholder={formatsQuery.isLoading ? 'Loading formats…' : 'Select format'}
              loading={formatsQuery.isFetching}
              options={formatSelectOptions}
              notFoundContent={
                formatsQuery.isFetching ? <Spin size="small" /> : 'No formats returned'
              }
            />
          </Form.Item>
          <Form.Item name="dryRun" valuePropName="checked">
            <Checkbox>Dry run (no DB writes; preview counts)</Checkbox>
          </Form.Item>
          <Dragger {...uploadProps} disabled={importBusy}>
            <p className="ant-upload-drag-icon">
              <CloudUploadOutlined />
            </p>
            <p className="ant-upload-text">Drop CSV here or click to upload</p>
            <p className="ant-upload-hint">
              Multipart field <code>file</code> only; <code>formatId</code> and optional{' '}
              <code>dryRun</code> are sent as query params (max 15 MB per backend).
            </p>
          </Dragger>
        </Card>
      </Form>

      {lastImportResult != null && (
        <Card bordered={false} title="Last import result">
          <Row gutter={[16, 16]}>
            <Col xs={12} sm={8}>
              <Text type="secondary">Format</Text>
              <div className="font-medium">{lastImportResult.formatId}</div>
            </Col>
            <Col xs={12} sm={8}>
              <Text type="secondary">Dry run</Text>
              <div className="font-medium">{String(lastImportResult.dryRun)}</div>
            </Col>
            <Col xs={12} sm={8}>
              <Text type="secondary">Rows read</Text>
              <div className="font-medium">{lastImportResult.rowsRead ?? '—'}</div>
            </Col>
            <Col xs={12} sm={8}>
              <Text type="secondary">Created</Text>
              <div className="font-medium">{lastImportResult.created ?? '—'}</div>
            </Col>
            <Col xs={12} sm={8}>
              <Text type="secondary">Skipped (no amount)</Text>
              <div className="font-medium">{lastImportResult.skippedNoAmount ?? '—'}</div>
            </Col>
            <Col xs={12} sm={8}>
              <Text type="secondary">Skipped (duplicate)</Text>
              <div className="font-medium">{lastImportResult.skippedDuplicate ?? '—'}</div>
            </Col>
            <Col xs={12} sm={8}>
              <Text type="secondary">Skipped (missing user)</Text>
              <div className="font-medium">{lastImportResult.skippedMissingUser ?? '—'}</div>
            </Col>
          </Row>

          {(lastImportResult.errors?.length ?? 0) > 0 && (
            <>
              <Title level={5} className="mt-4">
                Errors
              </Title>
              <Table
                size="small"
                rowKey={(r, i) => `${i}-${r.line}-${r.message}`}
                columns={errorColumns}
                dataSource={lastImportResult.errors}
                pagination={false}
              />
            </>
          )}

          {(lastImportResult.unmatchedSamples?.length ?? 0) > 0 && (
            <>
              <Title level={5} className="mt-4">
                Unmatched samples
              </Title>
              <Table
                size="small"
                rowKey={(_, i) => String(i)}
                columns={unmatchedColumns}
                dataSource={lastImportResult.unmatchedSamples}
                pagination={false}
                scroll={{ x: true }}
              />
            </>
          )}

          <Title level={5} className="mt-4">
            Raw JSON
          </Title>
          <pre
            style={{
              background: '#0a1f18',
              color: '#e8fff4',
              padding: 12,
              borderRadius: 8,
              fontSize: 12,
              overflow: 'auto',
              maxHeight: 240,
            }}
          >
            {JSON.stringify(lastImportResult, null, 2)}
          </pre>
        </Card>
      )}
    </div>
  );
};

export default BankReportImportPage;
