'use client';

import { useEffect, useMemo, useState } from 'react';
import {
  Button,
  Input,
  InputNumber,
  Select,
  Switch,
  Table,
  Pagination,
  Spin,
  Modal,
  Form,
  DatePicker,
  Checkbox,
  TableColumnsType,
} from 'antd';
import {
  PlusOutlined,
  SearchOutlined,
  CopyOutlined,
  WhatsAppOutlined,
  BarChartOutlined,
} from '@ant-design/icons';
import dayjs, { Dayjs } from 'dayjs';
import { useToast } from '@/lib/components/Toast/ToastContext';
import { safeAny } from '@/lib/interfaces/global.interface';
import {
  IPaymentLinkData,
  IPaymentLinkCreateRequest,
} from '@/lib/interfaces/payment-link.interface';
import { formatAmount, getFormattedTime } from '@/lib/utils/utils';
import { useGetPaymentLinks } from '@/lib/hooks/use-paymentLink';
import useDebounce from '@/lib/hooks/use-debounce';
import { useRole } from '@/lib/components/Role/RoleContext';
import { PaymentProductBanner } from '@/lib/components/PaymentProductBanner/PaymentProductBanner';
import { PricingModal } from '@/app/(dashboard)/invoices/components/PricingModal';
import { createNewPaymentLink } from '@/lib/services/payment-link-new-service';
import { getUserProfiles } from '@/lib/hooks/user-profile';
import LinkAnalyticsDrawer from './components/LinkAnalyticsDrawer';
import { createStyles } from 'antd-style';

const useStyles = createStyles(({ css }) => ({
  customTable: css`
    .ant-table-wrapper {
      width: 100%;
      background: linear-gradient(to right, var(--border), var(--primary));
      border-radius: 12px;
      padding: 2px;
    }
    .ant-table-inner-wrapper {
      background: #ffffff;
      border-radius: 10px;
      padding: 14px;
    }
    .ant-table {
      background: #ffffff;
      border-radius: 8px;
    }
    .ant-table-thead > tr > th {
      background: #ffffff !important;
      color: var(--text-muted) !important;
      border-bottom: 1px solid var(--border) !important;
      font-weight: 600;
      font-size: 12px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      padding: 16px 12px;
    }
    .ant-table-tbody > tr {
      background: #ffffff;
    }
    .ant-table-tbody > tr:hover > td {
      background: var(--background) !important;
    }
    .ant-table-tbody > tr > td {
      border-bottom: 1px solid var(--border) !important;
      color: var(--text) !important;
      padding: 16px 12px;
    }
    .ant-table-cell-fix-left,
    .ant-table-cell-fix-right {
      background: #ffffff !important;
    }
    .ant-table-tbody > tr:hover .ant-table-cell-fix-left,
    .ant-table-tbody > tr:hover .ant-table-cell-fix-right {
      background: var(--background) !important;
    }
    .custom-pagination .ant-pagination-item,
    .custom-pagination .ant-pagination-item-link,
    .custom-pagination .ant-pagination-total-text,
    .custom-pagination .ant-pagination-options-quick-jumper input {
      color: var(--text) !important;
    }
    .custom-pagination .ant-pagination-item-active {
      background: linear-gradient(to right, var(--border), var(--primary)) !important;
      border-color: transparent !important;
    }
    .custom-pagination .ant-pagination-item-active a {
      color: #0c0c0c !important;
    }
    .custom-pagination .ant-pagination-item {
      background: #ffffff !important;
      border-color: var(--border) !important;
    }
    .custom-pagination .ant-pagination-item a {
      color: var(--text) !important;
    }
  `,
  customSpin: css`
    .ant-spin-dot-item {
      background-color: var(--primary) !important;
    }
  `,
}));

const statusOptions = [
  { label: 'All', value: '' },
  { label: 'Pending', value: 'pending' },
  { label: 'Success', value: 'success' },
  { label: 'Failed', value: 'failed' },
];

const paymentLinkColumns = [
  { label: 'Payment Link ID', key: 'id' },
  { label: 'Customer Name', key: 'name' },
  { label: 'Email', key: 'email' },
  { label: 'Mobile', key: 'mobile' },
  { label: 'Amount', key: 'amount' },
  { label: 'Status', key: 'status' },
  { label: 'Created At', key: 'createdAt' },
  { label: 'Link', key: 'link' },
];

export default function PaymentLinkPage() {
  const { styles } = useStyles();
  const { showToast } = useToast();
  const { role } = useRole();
  const { data: profileData } = getUserProfiles();
  const merchantName = profileData?.[0]?.data?.fullName || 'RupeeFlow Merchant';
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [createdLink, setCreatedLink] = useState<{
    linkUrl: string;
    expiryTime: string;
    amount: number;
  } | null>(null);
  const [recentlyCreated, setRecentlyCreated] = useState<safeAny[]>([]);
  const [status, setStatus] = useState('');
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const [creating, setCreating] = useState(false);
  const [paymentLinks, setPaymentLinks] = useState<safeAny[]>([]);
  const [totalRecords, setTotalRecords] = useState(0);
  const [isPricingModalOpen, setIsPricingModalOpen] = useState(false);
  const [analyticsLink, setAnalyticsLink] = useState<IPaymentLinkData | null>(
    null,
  );

  const [form] = Form.useForm();
  const debouncedSearch = useDebounce(search, 500);
  const rowsPerPage = 50;

  const { data, refetch, isLoading } = useGetPaymentLinks({
    page,
    limit: rowsPerPage,
    search: debouncedSearch,
    status,
    startDate: '',
    endDate: '',
  });

  const pages = useMemo(
    () => Math.ceil(totalRecords / rowsPerPage) || 1,
    [totalRecords, rowsPerPage],
  );

  useEffect(() => {
    setLoading(isLoading);
  }, [isLoading]);

  useEffect(() => {
    const raw = Array.isArray(data) ? data[0] : data;
    if (raw && typeof raw === 'object') {
      const list = (raw as safeAny)?.data?.data ?? (raw as safeAny)?.data ?? [];
      setPaymentLinks(Array.isArray(list) ? list : []);
      const total =
        (raw as safeAny)?.data?.pagination?.totalItems ??
        (raw as safeAny)?.pagination?.totalItems ??
        0;
      setTotalRecords(Number(total) || 0);
    } else {
      setPaymentLinks([]);
      setTotalRecords(0);
    }
  }, [data]);

  const handleCreateClick = () => {
    form.resetFields();
    setIsCreateModalOpen(true);
    setCreatedLink(null);
  };

  const handleCreateSubmit = async (values: {
    amount: string | number;
    email: string;
    mobile: string;
    name: string;
    notifyOnEmail?: boolean;
    notifyOnNumber?: boolean;
    expiryTime?: Dayjs;
    note?: string;
    allowPartialPayment?: boolean;
    minimumAmount?: number;
  }) => {
    setCreating(true);
    try {
      const payload: IPaymentLinkCreateRequest = {
        amount: Number(values.amount) || 0,
        name: values.name ? String(values.name).trim() : undefined,
        email: String(values.email).trim(),
        mobile: String(values.mobile).trim(),
        notifyOnEmail: !!values.notifyOnEmail,
        notifyOnNumber: !!values.notifyOnNumber,
        expiresAt: values.expiryTime
          ? values.expiryTime.toISOString()
          : undefined,
        note: values.note ? String(values.note).trim() : undefined,
        allowPartialPayment: !!values.allowPartialPayment,
        minimumAmount:
          values.allowPartialPayment && values.minimumAmount
            ? Number(values.minimumAmount)
            : undefined,
      };

      const [response, error] = await createNewPaymentLink(payload);

      if (error || !response) {
        const msg =
          (error as safeAny)?.message || 'Failed to create payment link';
        showToast(msg, 'error');
        setCreating(false);
        return;
      }

      setRecentlyCreated((prev) => [
        {
          id: response.linkId,
          amount: String(payload.amount),
          name: payload.name,
          email: payload.email,
          mobile: payload.mobile,
          status: 'pending',
          createdAt: new Date().toISOString(),
        },
        ...prev,
      ]);
      setCreatedLink({
        linkUrl: response.linkUrl,
        expiryTime: response.expiryTime,
        amount: payload.amount,
      });
      setIsCreateModalOpen(false);
      setIsSuccessModalOpen(true);
      form.resetFields();
      refetch();
      showToast('Payment link created successfully', 'success');
    } catch (err) {
      showToast('Failed to create payment link', 'error');
    } finally {
      setCreating(false);
    }
  };

  const handleCopyLink = (text: string) => {
    navigator.clipboard.writeText(text);
    showToast('Link copied to clipboard', 'success');
  };

  const handleReset = () => {
    setSearch('');
    setStatus('');
    setPage(1);
  };

  const disabledDate = (current: Dayjs) =>
    current && current < dayjs().startOf('day');

  const renderCell = (record: IPaymentLinkData, key: string) => {
    const idStr = record.id != null ? String(record.id) : '';
    switch (key) {
      case 'id':
        return (
          <span
            style={{ color: 'var(--text)', fontFamily: 'monospace', fontSize: 13 }}
          >
            {idStr ? `${idStr.slice(0, 12)}...` : '-'}
          </span>
        );
      case 'name':
        return record.name ?? '-';
      case 'email':
        return record.email ?? '-';
      case 'mobile':
        return record.mobile ?? (record as safeAny).number ?? '-';
      case 'amount':
        return (
          formatAmount(Number(record.amount) || record.amount) ||
          record.amount ||
          '-'
        );
      case 'status':
        return (
          <span
            style={{
              padding: '4px 12px',
              borderRadius: '6px',
              fontWeight: 500,
              backgroundColor:
                record.status === 'success'
                  ? '#0DD25F15'
                  : record.status === 'failed'
                    ? '#D51C4415'
                    : '#F5A52415',
              color:
                record.status === 'success'
                  ? '#0DD25F'
                  : record.status === 'failed'
                    ? '#D51C44'
                    : '#F5A524',
            }}
          >
            {record.status || 'pending'}
          </span>
        );
      case 'createdAt':
        return record.createdAt
          ? getFormattedTime(new Date(record.createdAt))
          : '-';
      case 'link':
        return (
          <Button
            type="link"
            size="small"
            icon={<CopyOutlined />}
            onClick={() =>
              handleCopyLink(
                `${typeof window !== 'undefined' ? window.location.origin : ''}/payment-link/${idStr}`,
              )
            }
            style={{ color: 'var(--secondary)', padding: 0, fontWeight: 500 }}
          >
            Copy link
          </Button>
        );
      case 'actions':
        return (
          <Button
            type="text"
            size="small"
            icon={<BarChartOutlined />}
            onClick={() => setAnalyticsLink(record)}
            style={{ color: 'var(--secondary)', fontWeight: 500, padding: '0 6px' }}
          >
            Analytics
          </Button>
        );
      default:
        return '-';
    }
  };

  const columns: TableColumnsType<IPaymentLinkData> = [
    ...paymentLinkColumns.map((col) => ({
      title: col.label,
      dataIndex: col.key,
      key: col.key,
      width:
        col.key === 'id'
          ? 150
          : col.key === 'link'
            ? 110
            : col.key === 'orderId'
              ? 140
              : col.key === 'name'
                ? 140
                : col.key === 'email'
                  ? 180
                  : col.key === 'mobile'
                    ? 120
                    : col.key === 'amount'
                      ? 100
                      : col.key === 'status'
                        ? 100
                        : col.key === 'createdAt'
                          ? 160
                          : undefined,
      ellipsis: { showTitle: true },
      render: (_: unknown, record: IPaymentLinkData) =>
        renderCell(record, col.key),
    })),
    {
      title: '',
      key: 'actions',
      dataIndex: 'actions',
      width: 110,
      fixed: 'right',
      render: (_: unknown, record: IPaymentLinkData) =>
        renderCell(record, 'actions'),
    },
  ];

  return (
    <div className="w-full">
      <PaymentProductBanner
        productName="Payment Links"
        productDescription="Create and manage payment links for your customers"
        pricingInfo={{
          title: 'Charges',
          description:
            "A reminder on how you'll be charged for Payment Link transactions",
          onViewPricing: () => setIsPricingModalOpen(true),
        }}
        getStartedSteps={[
          {
            step: 1,
            title: 'Create Payment Link',
            description:
              'Generate a unique payment link with amount and customer details.',
          },
          {
            step: 2,
            title: 'Share with Customer',
            description:
              'Send the payment link to your customer via email or SMS.',
          },
          {
            step: 3,
            title: 'Receive Payments',
            description:
              'Your customers can make payments directly via the payment link.',
          },
        ]}
        scrollTargetId="filters-section"
      />

      {/* Create button + Filters */}
      <div className="mx-4 px-6 py-4 mb-1 flex justify-between items-center">
        <div />
        <Button
          type="primary"
          size="large"
          icon={<PlusOutlined />}
          onClick={handleCreateClick}
          style={{
            background: 'linear-gradient(to right, var(--border), var(--primary))',
            border: 'none',
            color: 'var(--background)',
            fontWeight: 600,
          }}
        >
          Create Payment Link
        </Button>
      </div>

      {/* Filters */}
      <div id="filters-section" className="mx-4 px-6 py-4 mb-1">
        <div
          style={{
            background: 'linear-gradient(to right, var(--border), var(--primary))',
            borderRadius: '12px',
            padding: '2px',
          }}
        >
          <div
            style={{
              background: '#FFFFFF',
              borderRadius: '10px',
              padding: '24px',
            }}
          >
            <div className="flex items-center gap-4">
              <Input
                placeholder="Search by email, mobile or order ID"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                prefix={<SearchOutlined style={{ color: 'var(--text-muted)' }} />}
                size="large"
                className="custom-search-input"
                style={{
                  width: 400,
                  backgroundColor: '#FFFFFF',
                  borderColor: 'var(--border)',
                  borderRadius: '8px',
                  color: 'var(--text)',
                }}
                allowClear
              />
              <Select
                placeholder="Status"
                value={status || undefined}
                onChange={(v) => setStatus(v)}
                size="large"
                className="custom-select"
                style={{
                  width: 200,
                  backgroundColor: '#FFFFFF',
                  borderColor: 'var(--border)',
                  color: 'var(--text)',
                }}
                options={statusOptions}
              />
              <Button
                size="large"
                onClick={handleReset}
                style={{
                  background: '#FFFFFF',
                  border: '1px solid var(--border)',
                  color: 'var(--text)',
                  fontWeight: 600,
                }}
              >
                Reset
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Table - List of payment links */}
      <div className="mx-4 px-6 mb-4">
        <div
          style={{
            width: '100%',
            position: 'relative',
            background: 'linear-gradient(to right, var(--border), var(--primary))',
            borderRadius: '12px',
            padding: '2px',
          }}
        >
          <div
            style={{
              width: '100%',
              overflowX: 'auto',
              background: '#FFFFFF',
              borderRadius: '10px',
              borderBottomLeftRadius: 0,
              borderBottomRightRadius: 0,
            }}
          >
            <Spin spinning={loading} size="large" className={styles.customSpin}>
              <Table
                className={styles.customTable}
                columns={columns}
                dataSource={[...recentlyCreated, ...paymentLinks]}
                rowKey="id"
                pagination={false}
                scroll={{ x: 'max-content', y: 'calc(100vh - 350px)' }}
                locale={{
                  emptyText: (
                    <div
                      className="text-center py-4 text-xl"
                      style={{ color: 'var(--text-muted)' }}
                    >
                      No Payment Links Found
                    </div>
                  ),
                }}
                size="middle"
              />
            </Spin>
          </div>
          <div
            className="flex justify-center p-4 sticky bottom-0 custom-pagination"
            style={{
              background: '#FFFFFF',
              borderTop: '1px solid var(--border)',
              borderRadius: '0 0 10px 10px',
              color: 'var(--text)',
            }}
          >
            <Pagination
              current={page}
              total={totalRecords}
              pageSize={rowsPerPage}
              onChange={setPage}
              showSizeChanger={false}
              showQuickJumper
              showTotal={(total, range) =>
                `${range[0]}-${range[1]} of ${total} items`
              }
              style={{ color: 'var(--text)' }}
            />
          </div>
        </div>
      </div>

      {/* Create Payment Link Modal */}
      <Modal
        title={
          <span style={{ color: 'var(--text)', fontSize: '20px', fontWeight: 600 }}>
            Create Payment Link
          </span>
        }
        open={isCreateModalOpen}
        onCancel={() => {
          setIsCreateModalOpen(false);
          form.resetFields();
        }}
        footer={null}
        width={560}
        destroyOnClose
        styles={{
          content: {
            background: '#FFFFFF',
            borderRadius: '12px',
          },
          header: {
            background: '#FFFFFF',
            borderBottom: '1px solid var(--border)',
            padding: '20px 24px',
          },
          body: {
            background: '#FFFFFF',
            padding: '24px',
          },
        }}
      >
        <p
          style={{
            color: 'var(--text-muted)',
            fontSize: '14px',
            marginBottom: '24px',
          }}
        >
          Fill in the details to create a new payment link. The link will show
          encrypted details and an expiry time.
        </p>
        <Form
          form={form}
          layout="vertical"
          onFinish={handleCreateSubmit}
          initialValues={{ notifyOnEmail: false, notifyOnNumber: false }}
          requiredMark={true}
        >
          <Form.Item
            name="amount"
            label={
              <span style={{ color: 'var(--text)', fontWeight: 600 }}>Amount</span>
            }
            rules={[
              { required: true, message: 'Please enter amount' },
              {
                pattern: /^\d+(\.\d{1,2})?$/,
                message: 'Enter a valid amount',
              },
            ]}
          >
            <Input
              type="number"
              size="large"
              placeholder="Enter amount"
              className="custom-input"
              style={{
                background: '#FFFFFF',
                borderColor: 'var(--border)',
                color: 'var(--text)',
              }}
            />
          </Form.Item>
          <Form.Item
            name="email"
            label={
              <span style={{ color: 'var(--text)', fontWeight: 600 }}>Email</span>
            }
            rules={[
              { required: true, message: 'Please enter email' },
              { type: 'email', message: 'Please enter a valid email' },
            ]}
          >
            <Input
              type="email"
              size="large"
              placeholder="Enter email"
              className="custom-input"
              style={{
                background: '#FFFFFF',
                borderColor: 'var(--border)',
                color: 'var(--text)',
              }}
            />
          </Form.Item>
          <Form.Item
            name="name"
            label={<span style={{ color: 'var(--text)' }}>Name</span>}
            rules={[
              { required: true, message: 'Please enter name' },
              { type: 'string', message: 'Please enter a valid name' },
            ]}
          >
            <Input
              type="text"
              size="large"
              placeholder="Enter name"
              style={{
                background: '#FFFFFF',
                borderColor: 'var(--border)',
                color: 'var(--text)',
              }}
            />
          </Form.Item>
          <Form.Item
            name="mobile"
            label={
              <span style={{ color: 'var(--text)', fontWeight: 600 }}>Number</span>
            }
            rules={[
              { required: true, message: 'Please enter mobile number' },
              {
                pattern: /^[0-9]{10}$/,
                message: 'Enter a valid 10-digit number',
              },
            ]}
          >
            <Input
              size="large"
              placeholder="Enter mobile number"
              maxLength={10}
              className="custom-input"
              style={{
                background: '#FFFFFF',
                borderColor: 'var(--border)',
                color: 'var(--text)',
              }}
            />
          </Form.Item>
          <Form.Item>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <Form.Item name="notifyOnEmail" valuePropName="checked" noStyle>
                <Checkbox style={{ color: 'var(--text)' }}>
                  Notify on this email
                </Checkbox>
              </Form.Item>
              <Form.Item name="notifyOnNumber" valuePropName="checked" noStyle>
                <Checkbox style={{ color: 'var(--text)' }}>
                  Notify on this number
                </Checkbox>
              </Form.Item>
            </div>
          </Form.Item>
          <Form.Item
            label={
              <span style={{ color: 'var(--text)', fontWeight: 600 }}>
                Partial Payment
              </span>
            }
            style={{ marginBottom: 8 }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <Form.Item
                name="allowPartialPayment"
                valuePropName="checked"
                noStyle
              >
                <Switch
                  style={{ background: undefined }}
                  checkedChildren="On"
                  unCheckedChildren="Off"
                />
              </Form.Item>
              <span style={{ color: 'var(--text-muted)', fontSize: 13 }}>
                Let customer pay any amount or in parts
              </span>
            </div>
          </Form.Item>
          <Form.Item
            noStyle
            shouldUpdate={(prev, curr) =>
              prev.allowPartialPayment !== curr.allowPartialPayment
            }
          >
            {({ getFieldValue }) =>
              getFieldValue('allowPartialPayment') ? (
                <Form.Item
                  name="minimumAmount"
                  label={
                    <span style={{ color: 'var(--text)', fontWeight: 600 }}>
                      Minimum Amount{' '}
                      <span style={{ fontWeight: 400, color: 'var(--text-muted)' }}>
                        (optional)
                      </span>
                    </span>
                  }
                  rules={[
                    {
                      validator: (_, value) => {
                        if (!value) return Promise.resolve();
                        const total = Number(form.getFieldValue('amount'));
                        if (Number(value) <= 0)
                          return Promise.reject('Must be greater than 0');
                        if (total && Number(value) >= total)
                          return Promise.reject(
                            'Must be less than total amount',
                          );
                        return Promise.resolve();
                      },
                    },
                  ]}
                >
                  <InputNumber
                    placeholder="e.g. 500"
                    min={1}
                    precision={0}
                    prefix="₹"
                    size="large"
                    style={{
                      width: '100%',
                      background: '#FFFFFF',
                      borderColor: 'var(--border)',
                    }}
                  />
                </Form.Item>
              ) : null
            }
          </Form.Item>
          <Form.Item
            name="note"
            label={
              <span style={{ color: 'var(--text)', fontWeight: 600 }}>
                Note{' '}
                <span style={{ fontWeight: 400, color: 'var(--text-muted)' }}>
                  (optional)
                </span>
              </span>
            }
          >
            <Input.TextArea
              rows={2}
              placeholder="e.g. Invoice #1042 for October supply"
              maxLength={200}
              showCount
              style={{
                background: '#FFFFFF',
                borderColor: 'var(--border)',
                color: 'var(--text)',
                resize: 'none',
              }}
            />
          </Form.Item>
          <Form.Item
            name="expiryTime"
            label={
              <span style={{ color: 'var(--text)', fontWeight: 600 }}>
                Expiry Date & Time{' '}
                <span style={{ fontWeight: 400, color: 'var(--text-muted)' }}>
                  (optional — leave blank for no expiry)
                </span>
              </span>
            }
          >
            <DatePicker
              showTime
              format="DD MMM YYYY HH:mm"
              disabledDate={disabledDate}
              size="large"
              className="custom-date-picker"
              style={{
                width: '100%',
                background: '#FFFFFF',
                borderColor: 'var(--border)',
                color: 'var(--text)',
              }}
              placeholder="Select expiry date and time"
              allowClear
            />
          </Form.Item>
          <div className="flex justify-end gap-3" style={{ marginTop: 24 }}>
            <Button
              size="large"
              onClick={() => {
                setIsCreateModalOpen(false);
                form.resetFields();
              }}
              style={{
                background: '#FFFFFF',
                border: '1px solid var(--border)',
                color: 'var(--text)',
                fontWeight: 600,
              }}
            >
              Cancel
            </Button>
            <Button
              type="primary"
              htmlType="submit"
              size="large"
              loading={creating}
              disabled={creating}
              style={{
                background: 'linear-gradient(to right, var(--border), var(--primary))',
                border: 'none',
                color: 'var(--background)',
                fontWeight: 600,
              }}
            >
              Create Payment Link
            </Button>
          </div>
        </Form>
        <style jsx global>{`
          /* Modal Form Styles */
          .ant-modal-content .ant-form-item-label > label {
            color: var(--text) !important;
            font-weight: 600 !important;
          }

          .ant-modal-content
            .ant-form-item-label
            > label.ant-form-item-required:not(
              .ant-form-item-required-mark-optional
            )::before {
            color: #d51c44 !important;
            margin-right: 4px;
          }

          /* Input Styles - Follow Coding Standards */
          .ant-modal-content .custom-input.ant-input,
          .ant-modal-content .custom-input {
            background-color: #ffffff !important;
            color: var(--text) !important;
            border-color: var(--border) !important;
            caret-color: var(--text) !important;
            box-shadow: none !important;
          }

          .ant-modal-content .custom-input.ant-input:hover,
          .ant-modal-content .custom-input:hover {
            background-color: #ffffff !important;
            border-color: var(--primary) !important;
            color: var(--text) !important;
            box-shadow: none !important;
          }

          .ant-modal-content .custom-input.ant-input:focus,
          .ant-modal-content .custom-input.ant-input-focused,
          .ant-modal-content .custom-input:focus,
          .ant-modal-content .custom-input:focus-within {
            background-color: #ffffff !important;
            border-color: var(--primary) !important;
            color: var(--text) !important;
            box-shadow: 0 0 0 2px rgba(0, 135, 90, 0.1) !important;
            outline: none !important;
          }

          /* Error State Styles */
          .ant-modal-content .ant-form-item-has-error .custom-input.ant-input,
          .ant-modal-content .ant-form-item-has-error .custom-input {
            border-color: #d51c44 !important;
          }

          .ant-modal-content
            .ant-form-item-has-error
            .custom-input.ant-input:focus,
          .ant-modal-content .ant-form-item-has-error .custom-input:focus,
          .ant-modal-content
            .ant-form-item-has-error
            .custom-input.ant-input-focused {
            border-color: #d51c44 !important;
            box-shadow: 0 0 0 2px rgba(213, 28, 68, 0.1) !important;
          }

          .ant-modal-content .ant-form-item-explain-error {
            color: #d51c44 !important;
            font-size: 12px !important;
          }

          /* DatePicker Styles */
          .ant-modal-content .custom-date-picker.ant-picker {
            background-color: #ffffff !important;
            border-color: var(--border) !important;
            color: var(--text) !important;
          }

          .ant-modal-content .custom-date-picker.ant-picker:hover {
            border-color: var(--primary) !important;
          }

          .ant-modal-content .custom-date-picker.ant-picker-focused {
            border-color: var(--primary) !important;
            box-shadow: 0 0 0 2px rgba(0, 135, 90, 0.1) !important;
          }

          .ant-modal-content
            .ant-form-item-has-error
            .custom-date-picker.ant-picker {
            border-color: #d51c44 !important;
          }

          .ant-modal-content
            .ant-form-item-has-error
            .custom-date-picker.ant-picker-focused {
            border-color: #d51c44 !important;
            box-shadow: 0 0 0 2px rgba(213, 28, 68, 0.1) !important;
          }
        `}</style>
      </Modal>

      {/* Success Modal - after creating link */}
      <Modal
        title={
          <span style={{ color: 'var(--text)', fontSize: '20px', fontWeight: 600 }}>
            Payment Link Created
          </span>
        }
        open={isSuccessModalOpen}
        onCancel={() => {
          setIsSuccessModalOpen(false);
          setCreatedLink(null);
        }}
        footer={null}
        width={520}
        styles={{
          content: {
            background: '#FFFFFF',
            borderRadius: '12px',
          },
          header: {
            background: '#FFFFFF',
            borderBottom: '1px solid var(--border)',
            padding: '20px 24px',
          },
          body: {
            background: '#FFFFFF',
            padding: '24px',
          },
        }}
      >
        {createdLink && (
          <div style={{ padding: '8px 0' }}>
            <div
              style={{
                background: 'linear-gradient(to right, var(--border), var(--primary))',
                borderRadius: '12px',
                padding: '16px',
                marginBottom: '20px',
                textAlign: 'center',
              }}
            >
              <p
                style={{
                  color: 'var(--background)',
                  fontSize: '14px',
                  fontWeight: 600,
                  margin: 0,
                }}
              >
                Share this link with your customer to collect payment
              </p>
            </div>
            <div style={{ marginBottom: '12px' }}>
              <label
                style={{
                  display: 'block',
                  color: 'var(--text-muted)',
                  fontSize: '14px',
                  fontWeight: 600,
                  marginBottom: '8px',
                }}
              >
                Payment Link URL
              </label>
              <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                <Input
                  value={createdLink.linkUrl}
                  readOnly
                  size="large"
                  style={{
                    background: '#FFFFFF',
                    borderColor: 'var(--border)',
                    color: 'var(--text)',
                    flex: 1,
                  }}
                />
                <Button
                  type="primary"
                  icon={<CopyOutlined />}
                  onClick={() => handleCopyLink(createdLink.linkUrl)}
                  style={{
                    background: 'linear-gradient(to right, var(--border), var(--primary))',
                    border: 'none',
                    color: 'var(--background)',
                    fontWeight: 600,
                  }}
                >
                  Copy
                </Button>
              </div>
            </div>
            <p style={{ color: 'var(--text-muted)', fontSize: '12px', marginBottom: 20 }}>
              Expires on: {new Date(createdLink.expiryTime).toLocaleString()}
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <Button
                size="large"
                block
                icon={<WhatsAppOutlined />}
                onClick={() => {
                  const amount = createdLink.amount
                    ? `₹${createdLink.amount}`
                    : '';
                  const text = `Hi, please pay ${amount} here: ${createdLink.linkUrl} — ${merchantName}`;
                  window.open(
                    `https://wa.me/?text=${encodeURIComponent(text)}`,
                    '_blank',
                  );
                  showToast('Opening WhatsApp...', 'success');
                }}
                style={{
                  background: '#25D366',
                  border: 'none',
                  color: '#fff',
                  fontWeight: 600,
                }}
              >
                Share on WhatsApp
              </Button>
              <Button
                type="primary"
                size="large"
                block
                onClick={() => {
                  setIsSuccessModalOpen(false);
                  setCreatedLink(null);
                }}
                style={{
                  background: 'linear-gradient(to right, var(--border), var(--primary))',
                  border: 'none',
                  color: '#0C0C0C',
                  fontWeight: 600,
                }}
              >
                Done
              </Button>
            </div>
          </div>
        )}
      </Modal>

      <PricingModal
        isOpen={isPricingModalOpen}
        onClose={() => setIsPricingModalOpen(false)}
      />

      <LinkAnalyticsDrawer
        open={!!analyticsLink}
        onClose={() => setAnalyticsLink(null)}
        paymentLink={analyticsLink}
      />
    </div>
  );
}
