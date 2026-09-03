'use client';
import React, { useState, useEffect } from 'react';
import {
  Card,
  Tabs,
  Modal,
  DatePicker,
  Button,
  Divider,
  Table,
  Tag,
  Space,
  Select,
} from 'antd';
import {
  DownloadOutlined,
  InfoCircleOutlined,
  FileTextOutlined,
} from '@ant-design/icons';
import dayjs, { Dayjs } from 'dayjs';
import { downloadBlob, xlsxBlob } from '@/lib/utils/file.utils';
import { useToast } from '@/lib/components/Toast/ToastContext';
import {
  useDownloadReports,
  useDownloadReportsPayout,
  useDownloadReportsSettlement,
  useDownloadCombinedReports,
  useDownloadPayinPayoutReports,
  useDownloadPaymentLinkReports,
  useDownloadCheckoutReports,
  useDownloadCheckoutPageReports,
  useDownloadInvoiceReports,
} from '@/lib/hooks/use-downloadReports';
import { useRole } from '@/lib/components/Role/RoleContext';
import { isAdmin, isOps, isChannelPartner } from '@/lib/utils/utils';
import { getMerchantList } from '@/lib/hooks/merchant-list';
import { IMerchantList } from '@/lib/interfaces/merchant-list.interface';
import { getDownloadHistory } from '@/lib/services/download-reports';

const { RangePicker } = DatePicker;

interface ReportCard {
  id: string;
  title: string;
  description: string;
  icon?: React.ReactNode;
  category: string;
  reportInfo: string[];
}

const reportSections = {
  collections: {
    title: 'Collections',
    reports: [
      {
        id: 'collections',
        title: 'Collections',
        description: 'View all collection transactions',
        category: 'collections',
        reportInfo: [
          'Transaction ID',
          'Order ID',
          'Amount',
          'Status',
          'Payment Method',
          'Customer Details',
          'Date & Time',
        ],
      },
      {
        id: 'payouts',
        title: 'Payouts',
        description: 'View all payout transactions',
        category: 'collections',
        reportInfo: [
          'Payout ID',
          'Amount',
          'Status',
          'Beneficiary Details',
          'UTR Number',
          'Date & Time',
        ],
      },
      {
        id: 'settlements',
        title: 'Settlements',
        description: 'View settlement reports',
        category: 'collections',
        reportInfo: [
          'Settlement ID',
          'Settlement Amount',
          'Status',
          'Settlement Date',
          'Transaction Count',
        ],
      },
      {
        id: 'payment-links-collections',
        title: 'Payment Links',
        description: 'View payment link transactions',
        category: 'collections',
        reportInfo: [
          'Payment Link ID',
          'Amount',
          'Status',
          'Customer Email',
          'Created Date',
        ],
      },
      {
        id: 'orders',
        title: 'Orders',
        description: 'View all orders',
        category: 'collections',
        reportInfo: [
          'Order ID',
          'Product Details',
          'Amount',
          'Status',
          'Customer Information',
          'Order Date',
        ],
      },
    ],
  },
  payments: {
    title: 'Payments',
    reports: [
      {
        id: 'upi',
        title: 'UPI',
        description: 'UPI payment transactions',
        category: 'payments',
        reportInfo: [
          'Transaction ID',
          'UPI ID',
          'Amount',
          'Status',
          'Transaction Date',
        ],
      },
      {
        id: 'qr-codes',
        title: 'QR Codes',
        description: 'QR code payment transactions',
        category: 'payments',
        reportInfo: [
          'QR Code ID',
          'Amount',
          'Status',
          'Scanned Date',
          'Payment Method',
        ],
      },
      {
        id: 'checkouts',
        title: 'Checkouts',
        description: 'Checkout page transactions',
        category: 'payments',
        reportInfo: [
          'Checkout ID',
          'Amount',
          'Status',
          'Payment Method',
          'Customer Details',
          'Date',
        ],
      },
    ],
  },
  transactions: {
    title: 'Transactions',
    reports: [
      {
        id: 'combined-report',
        title: 'Combined Report',
        description: 'Complete transaction overview',
        category: 'transactions',
        reportInfo: [
          'All Transaction Types',
          'Collections & Payouts',
          'Settlements',
          'Payment Methods',
          'Date Range Summary',
          'Total Amounts',
        ],
      },
    ],
  },
  orders: {
    title: 'Orders',
    reports: [
      {
        id: 'orders-report',
        title: 'Orders',
        description: 'Detailed orders report',
        category: 'orders',
        reportInfo: [
          'Order ID',
          'Product Information',
          'Quantity',
          'Price',
          'Customer Details',
          'Order Status',
          'Date',
        ],
      },
    ],
  },
  refunds: {
    title: 'Refunds',
    reports: [
      {
        id: 'refunds',
        title: 'Refunds',
        description: 'All refund transactions',
        category: 'refunds',
        reportInfo: [
          'Refund ID',
          'Original Transaction ID',
          'Refund Amount',
          'Status',
          'Reason',
          'Date',
        ],
      },
      {
        id: 'instant-refunds',
        title: 'Instant Refunds',
        description: 'Instant refund transactions',
        category: 'refunds',
        reportInfo: [
          'Refund ID',
          'Transaction ID',
          'Refund Amount',
          'Status',
          'Processing Time',
          'Date',
        ],
      },
    ],
  },
  paymentLinks: {
    title: 'Payment Links',
    reports: [
      {
        id: 'payment-links',
        title: 'Payment Links',
        description: 'Payment link reports',
        category: 'paymentLinks',
        reportInfo: [
          'Payment Link ID',
          'Link URL',
          'Amount',
          'Status',
          'Created Date',
          'Expiry Date',
        ],
      },
      {
        id: 'payment-pages',
        title: 'Payment Pages',
        description: 'Payment page reports',
        category: 'paymentLinks',
        reportInfo: [
          'Page ID',
          'Page Name',
          'Transactions',
          'Total Amount',
          'Status',
          'Created Date',
        ],
      },
    ],
  },
  otherPages: {
    title: 'Other Pages',
    reports: [
      {
        id: 'monthly-invoices',
        title: 'Monthly Invoices',
        description: 'Monthly invoice reports',
        category: 'otherPages',
        reportInfo: [
          'Invoice Number',
          'Invoice Date',
          'Amount',
          'Status',
          'Customer Details',
          'Due Date',
        ],
      },
    ],
  },
};

const ReportsPage = () => {
  const { showToast } = useToast();
  const { role } = useRole();
  const { mutateAsync: downloadReports } = useDownloadReports();
  const { mutateAsync: downloadReportsPayout } = useDownloadReportsPayout();
  const { mutateAsync: downloadReportsSettlement } =
    useDownloadReportsSettlement();
    const { mutateAsync: downloadCombinedReports } =
  useDownloadCombinedReports();

const { mutateAsync: downloadPayinPayoutReports } =
  useDownloadPayinPayoutReports();

const { mutateAsync: downloadPaymentLinkReports } =
  useDownloadPaymentLinkReports();

const { mutateAsync: downloadCheckoutReports } =
  useDownloadCheckoutReports();

const { mutateAsync: downloadCheckoutPageReports } =
  useDownloadCheckoutPageReports();

const { mutateAsync: downloadInvoiceReports } =
  useDownloadInvoiceReports();
  const [activeTab, setActiveTab] = useState('all-reports');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedReport, setSelectedReport] = useState<ReportCard | null>(null);
  const [dateRange, setDateRange] = useState<[Dayjs, Dayjs]>([
    dayjs().subtract(30, 'day'),
    dayjs(),
  ]);
  const [loadingDownload, setLoadingDownload] = useState(false);
  const [selectedMerchantId, setSelectedMerchantId] = useState<string>('');
const [downloadHistory, setDownloadHistory] = useState<any[]>([]);  
const [historyLoading, setHistoryLoading] = useState(false);

  const fetchDownloadHistory = async () => {
    setHistoryLoading(true);
    const [data, error] = await getDownloadHistory();
    if (data && !error) {
      setDownloadHistory(Array.isArray(data) ? data : data?.data ?? []);
    }
    setHistoryLoading(false);
  };

  useEffect(() => {
    if (activeTab === 'downloads') {
      fetchDownloadHistory();
    }
  }, [activeTab]);
  const merchantListQuery = getMerchantList();
  const { data: merchantList } = merchantListQuery || {};

  const handleReportClick = (report: ReportCard) => {
    setSelectedReport(report);
    setSelectedMerchantId(''); // Reset merchant selection when opening new report
    setIsModalOpen(true);
  };

  const handleDownload = async () => {
    if (!selectedReport) return;

    setLoadingDownload(true);
    try {
      const startDate = dateRange[0]
        ? dateRange[0].startOf('day').toISOString()
        : '';
      const endDate = dateRange[1]
        ? dateRange[1].endOf('day').toISOString()
        : '';

      let response: ArrayBuffer | null = null;
      let error: any = null;

      // Determine which API to use based on report ID
      if (selectedReport.id === 'payouts') {
  [response, error] = await downloadReportsPayout({
    userId: selectedMerchantId || '',
    startDate,
    endDate,
    status: undefined,
    search: undefined,
    from: 0,
    count: 0,
  });
} else if (selectedReport.id === 'settlements') {
  [response, error] = await downloadReportsSettlement({
    userId: selectedMerchantId || '',
    startDate,
    endDate,
    status: undefined,
    search: undefined,
    from: 0,
    count: 0,
  });
} else if (selectedReport.id === 'combined-report') {
  [response, error] = await downloadCombinedReports({
    userId: selectedMerchantId || '',
    startDate,
    endDate,
    status: undefined,
    search: undefined,
    from: 0,
    count: 0,
  });
} else if (
  selectedReport.id === 'payment-links' ||
  selectedReport.id === 'payment-links-collections'
) {
  [response, error] = await downloadPaymentLinkReports({
    userId: selectedMerchantId || '',
    startDate,
    endDate,
    status: undefined,
    search: undefined,
    from: 0,
    count: 0,
  });
} else if (selectedReport.id === 'checkouts') {
  [response, error] = await downloadCheckoutReports({
    userId: selectedMerchantId || '',
    startDate,
    endDate,
    status: undefined,
    search: undefined,
    from: 0,
    count: 0,
  });
} else if (selectedReport.id === 'payment-pages') {
  [response, error] = await downloadCheckoutPageReports({
    userId: selectedMerchantId || '',
    startDate,
    endDate,
    status: undefined,
    search: undefined,
    from: 0,
    count: 0,
  });
} else if (selectedReport.id === 'monthly-invoices') {
  [response, error] = await downloadInvoiceReports({
    userId: selectedMerchantId || '',
    startDate,
    endDate,
    status: undefined,
    search: undefined,
    from: 0,
    count: 0,
  });
} else if (
  selectedReport.id === 'orders' ||
  selectedReport.id === 'orders-report'
) {
  [response, error] = await downloadPayinPayoutReports({
    userId: selectedMerchantId || '',
    startDate,
    endDate,
    status: undefined,
    search: undefined,
    from: 0,
    count: 0,
  });
} else {
  [response, error] = await downloadReports({
    userId: selectedMerchantId || '',
    startDate,
    endDate,
    status: undefined,
    search:
      selectedReport.id === 'collections'
        ? undefined
        : selectedReport.id,
    from: 0,
    count: 0,
  });
}

      if (error || !response) {
        showToast('Error downloading the report', 'error');
        return;
      }

      downloadBlob(xlsxBlob(response), `${selectedReport.title}-${new Date().toISOString().split('T')[0]}.xlsx`);
      showToast('Report downloaded successfully', 'success');
      setIsModalOpen(false);
    } catch (err) {
      console.error('Download error:', err);
      showToast('Error downloading the report', 'error');
    } finally {
      setLoadingDownload(false);
    }
  };

  const handleDateRangeChange = (
    dates: null | [Dayjs | null, Dayjs | null],
  ) => {
    if (dates && dates[0] && dates[1]) {
      setDateRange([dates[0], dates[1]]);
    }
  };

  const renderReportCard = (report: ReportCard) => (
    <Card
      key={report.id}
      hoverable
      onClick={() => handleReportClick(report)}
      style={{
        background: 'linear-gradient(to right, var(--border), var(--primary))',
        borderRadius: '12px',
        padding: '2px',
        cursor: 'pointer',
        height: '100%',
      }}
      bodyStyle={{
        padding: '20px',
        background: '#FFFFFF',
        borderRadius: '10px',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          marginBottom: '12px',
        }}
      >
        <div
          style={{
            width: '48px',
            height: '48px',
            borderRadius: '8px',
            background: 'linear-gradient(to right, var(--border), var(--primary))',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--background)',
            fontSize: '24px',
          }}
        >
          <FileTextOutlined />
        </div>
        <div style={{ flex: 1 }}>
          <h3
            style={{
              color: 'var(--text)',
              fontSize: '16px',
              fontWeight: 600,
              margin: 0,
            }}
          >
            {report.title}
          </h3>
        </div>
      </div>
      <p style={{ color: 'var(--text-muted)', fontSize: '14px', margin: 0, flex: 1 }}>
        {report.description}
      </p>
      <div
        style={{
          marginTop: '16px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
        }}
      >
        <Tag
          style={{
            background: '#30F3BC15',
            color: 'var(--secondary)',
            border: '1px solid #30F3BC40',
            borderRadius: '6px',
          }}
        >
{report.title}          </Tag>
      </div>
    </Card>
  );

  const renderReportSection = (
    section: (typeof reportSections)[keyof typeof reportSections],
  ) => (
    <div key={section.title} style={{ marginBottom: '32px' }}>
      <h2
        style={{
          color: 'var(--text)',
          fontSize: '18px',
          fontWeight: 600,
          marginBottom: '16px',
          textTransform: 'uppercase',
          letterSpacing: '0.5px',
        }}
      >
        {section.title}
      </h2>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: '20px',
        }}
      >
        {section.reports.map(renderReportCard)}
      </div>
    </div>
  );

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'var(--background)',
        padding: '48px 32px 32px',
        width: '100%',
      }}
    >
      <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
        <h1
          style={{
            color: 'var(--text)',
            fontSize: '32px',
            fontWeight: 700,
            marginBottom: '32px',
          }}
        >
          Reports
        </h1>

        <Tabs
          activeKey={activeTab}
          onChange={setActiveTab}
          style={{
            background: '#FFFFFF',
            borderRadius: '12px',
            padding: '20px',
          }}
          items={[
            {
              key: 'all-reports',
              label: 'All Reports',
              children: (
                <div style={{ padding: '20px 0' }}>
                  {Object.values(reportSections).map(renderReportSection)}
                </div>
              ),
            },
            {
              key: 'downloads',
              label: 'Downloads',
              children: (
                <div style={{ padding: '20px 0' }}>
                  <Table
                    loading={historyLoading}
                    dataSource={downloadHistory}
                    rowKey="id"
                    pagination={{ pageSize: 10 }}
                    locale={{ emptyText: 'No downloads yet' }}
                    columns={[
                      {
                        title: 'Report Type',
                        dataIndex: 'reportType',
                        key: 'reportType',
                        render: (t: string) => (
                          <Tag color="cyan">{t?.replace(/_/g, ' ').toUpperCase()}</Tag>
                        ),
                      },
                      {
                        title: 'File Name',
                        dataIndex: 'fileName',
                        key: 'fileName',
                      },
                      {
                        title: 'Date Range',
                        key: 'dateRange',
                        render: (_: any, r: any) =>
                          r.reportStartDate && r.reportEndDate
                            ? `${dayjs(r.reportStartDate).format('DD MMM YYYY')} – ${dayjs(r.reportEndDate).format('DD MMM YYYY')}`
                            : '—',
                      },
                      {
                        title: 'Downloaded At',
                        dataIndex: 'createdAt',
                        key: 'createdAt',
                        render: (d: string) =>
                          d ? dayjs(d).format('DD MMM YYYY, hh:mm A') : '—',
                      },
                    ]}
                  />
                </div>
              ),
            },
            {
              key: 'custom-reports',
              label: 'Custom Reports',
              children: (
                <div style={{ padding: '20px 0', color: 'var(--text)' }}>
                  <p>
                    Create custom reports with specific filters and parameters.
                  </p>
                  {/* TODO: Implement custom reports */}
                </div>
              ),
            },
          ]}
        />

        {/* Report Configuration Modal */}
        <Modal
          title={
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <InfoCircleOutlined
                style={{ color: 'var(--secondary)', fontSize: '20px' }}
              />
              <span
                style={{ color: 'var(--text)', fontSize: '20px', fontWeight: 600 }}
              >
                Configure Report: {selectedReport?.title}
              </span>
            </div>
          }
          open={isModalOpen}
          onCancel={() => {
            setIsModalOpen(false);
            setSelectedMerchantId(''); // Reset merchant selection when closing modal
          }}
          footer={null}
          width={600}
          styles={{
            content: {
              background: '#FFFFFF',
              borderRadius: '12px',
            },
            header: {
              background: '#FFFFFF',
              borderBottom: '1px solid #4E4E4E',
              padding: '20px 24px',
            },
            body: {
              background: '#FFFFFF',
              padding: '24px',
            },
          }}
        >
          {selectedReport && (
            <div>
              <div style={{ marginBottom: '24px' }}>
                <label
                  style={{
                    display: 'block',
                    color: 'var(--text-muted)',
                    fontSize: '14px',
                    fontWeight: 600,
                    marginBottom: '8px',
                  }}
                >
                  Report Type
                </label>
                <div
                  style={{
                    padding: '12px',
                    background: 'var(--background)',
                    borderRadius: '8px',
                    border: '1px solid #4E4E4E',
                    color: 'var(--text)',
                  }}
                >
                  {selectedReport.title}
                </div>
              </div>

              {(isAdmin(role) || isOps(role) || isChannelPartner(role)) && (
                <div style={{ marginBottom: '24px' }}>
                  <label
                    style={{
                      display: 'block',
                      color: '#95A19D',
                      fontSize: '14px',
                      fontWeight: 600,
                      marginBottom: '8px',
                    }}
                  >
                    Select Merchant
                  </label>
                  <Select
                    placeholder="Select Merchant (Optional)"
                    value={selectedMerchantId || undefined}
                    onChange={(value) => setSelectedMerchantId(value)}
                    allowClear
                    style={{
                      width: '100%',
                      background: '#01261D',
                    }}
                    options={
                      merchantList?.[0]?.data?.map(
                        (merchant: IMerchantList) => ({
                          label: merchant.fullName,
                          value: merchant.id,
                        }),
                      ) || []
                    }
                  />
                </div>
              )}

              <div style={{ marginBottom: '24px' }}>
                <label
                  style={{
                    display: 'block',
                    color: 'var(--text-muted)',
                    fontSize: '14px',
                    fontWeight: 600,
                    marginBottom: '8px',
                  }}
                >
                  Date Range
                </label>
                <RangePicker
                  value={dateRange}
                  onChange={handleDateRangeChange}
                  format="YYYY-MM-DD"
                  style={{
                    width: '100%',
                    background: 'var(--background)',
                    borderColor: 'var(--border)',
                  }}
                  className="custom-date-picker"
                />
              </div>

              <Divider style={{ borderColor: 'var(--border)', margin: '24px 0' }} />

              <div style={{ marginBottom: '24px' }}>
                <label
                  style={{
                    display: 'block',
                    color: 'var(--text-muted)',
                    fontSize: '14px',
                    fontWeight: 600,
                    marginBottom: '12px',
                  }}
                >
                  Report Includes
                </label>
                <div
                  style={{
                    background: 'var(--background)',
                    borderRadius: '8px',
                    padding: '16px',
                    border: '1px solid #4E4E4E',
                  }}
                >
                  <Space
                    direction="vertical"
                    size="small"
                    style={{ width: '100%' }}
                  >
                    {selectedReport.reportInfo.map((info, index) => (
                      <div
                        key={index}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px',
                          color: 'var(--text)',
                          fontSize: '14px',
                        }}
                      >
                        <div
                          style={{
                            width: '6px',
                            height: '6px',
                            borderRadius: '50%',
                            background: 'var(--secondary)',
                          }}
                        />
                        {info}
                      </div>
                    ))}
                  </Space>
                </div>
              </div>

              <div
                style={{
                  display: 'flex',
                  justifyContent: 'flex-end',
                  gap: '12px',
                }}
              >
                <Button
                  onClick={() => setIsModalOpen(false)}
                  style={{
                    background: 'var(--border)',
                    border: 'none',
                    color: 'var(--text)',
                  }}
                >
                  Cancel
                </Button>
                <Button
                  type="primary"
                  icon={<DownloadOutlined />}
                  onClick={handleDownload}
                  loading={loadingDownload}
                  style={{
                    background: 'linear-gradient(to right, var(--border), var(--primary))',
                    border: 'none',
                    color: 'var(--background)',
                    fontWeight: 600,
                  }}
                >
                  Download Report
                </Button>
              </div>
            </div>
          )}
        </Modal>
      </div>
    </div>
  );
};

export default ReportsPage;
