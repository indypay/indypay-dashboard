'use client';

import React, { useEffect, useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import {
  Table,
  Pagination,
  Spin,
  Tag,
  TableColumnsType,
  Button,
  Dropdown,
  message,
  Tooltip,
  Badge,
} from 'antd';
import type { MenuProps } from 'antd';
import {
  CopyOutlined,
  MoreOutlined,
  CheckCircleOutlined,
  BellOutlined,
  BankOutlined,
} from '@ant-design/icons';
import { createStyles } from 'antd-style';

import {
  getInvoices,
  useMarkInvoicePaid,
  useSendInvoiceReminder,
} from '@/lib/hooks/use-invoice';
import { IInvoice, IInvoiceFilters } from '@/lib/interfaces/invoice.interface';
import { formatInvoiceStatus, getFormattedTime } from '@/lib/utils/utils';
import { safeAny } from '@/lib/interfaces/global.interface';
import { INVOICE_STATUS } from '@/lib/enum';

const useStyle = createStyles(({ css }) => ({
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

      .ant-table-container {
        border-radius: 8px;

        .ant-table-body,
        .ant-table-content {
          scrollbar-width: thin;
          scrollbar-color: #40a17f #01261d;
        }
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
        transition: background 0.2s;

        &:hover > td {
          background: var(--background) !important;
        }

        > td {
          border-bottom: 1px solid var(--border) !important;
          color: var(--text) !important;
          padding: 16px 12px;
        }
      }
    }

    .ant-table-cell-fix-left,
    .ant-table-cell-fix-right {
      background: #ffffff !important;
    }

    .ant-table-tbody > tr:hover {
      .ant-table-cell-fix-left,
      .ant-table-cell-fix-right {
        background: var(--background) !important;
      }
    }

    .custom-pagination {
      .ant-pagination-item-active {
        background: linear-gradient(to right, var(--border), var(--primary)) !important;
        border-color: transparent !important;
        a {
          color: #0c0c0c !important;
        }
      }
      .ant-pagination-item {
        background: #ffffff !important;
        border-color: #4e4e4e !important;
        a {
          color: var(--text) !important;
        }
        &:hover {
          border-color: var(--primary) !important;
        }
      }
      .ant-pagination-prev,
      .ant-pagination-next {
        .ant-pagination-item-link {
          background: #ffffff !important;
          border-color: #4e4e4e !important;
          color: var(--text) !important;
          &:hover {
            border-color: var(--primary) !important;
          }
        }
      }
    }
  `,
  customSpin: css`
    .ant-spin-dot-item {
      background-color: #a855f7 !important;
    }
    .ant-spin-text {
      color: #a855f7 !important;
    }
  `,
}));

// ─── Status styling ────────────────────────────────────────────────────────────

const STATUS_CONFIG: Record<
  string,
  { bg: string; color: string; border: string; label: string }
> = {
  draft: {
    bg: '#F5A52415',
    color: '#F5A524',
    border: '#F5A52440',
    label: 'Draft',
  },
  sent: {
    bg: '#3B82F615',
    color: '#3B82F6',
    border: '#3B82F640',
    label: 'Sent',
  },
  failed: {
    bg: '#D51C4415',
    color: '#D51C44',
    border: '#D51C4440',
    label: 'Failed',
  },
  viewed: {
    bg: '#8B5CF615',
    color: '#8B5CF6',
    border: '#8B5CF640',
    label: 'Viewed',
  },
  paid: {
    bg: 'var(--sidebar-active-bg)',
    color: 'var(--secondary)',
    border: 'var(--sidebar-active-border)',
    label: 'Paid',
  },
  overdue: {
    bg: '#EF444415',
    color: '#EF4444',
    border: '#EF444440',
    label: 'Overdue',
  },
  cancelled: {
    bg: '#6B728015',
    color: '#6B7280',
    border: '#6B728040',
    label: 'Cancelled',
  },
};

const getStatusStyle = (statusKey: string): React.CSSProperties => {
  const cfg = STATUS_CONFIG[statusKey.toLowerCase()] ?? STATUS_CONFIG.draft;
  return {
    borderRadius: '6px',
    padding: '4px 12px',
    fontWeight: 500,
    backgroundColor: cfg.bg,
    color: cfg.color,
    border: `1px solid ${cfg.border}`,
  };
};

// ─── Columns config ───────────────────────────────────────────────────────────

const columnsConfig = [
  { key: 'id', label: 'Invoice Id' },
  { key: 'createdAt', label: 'Created At' },
  { key: 'totalAmount', label: 'Amount' },
  { key: 'invoiceNumber', label: 'Invoice No.' },
  { key: 'customer', label: 'Customer' },
  { key: 'status', label: 'Status' },
  { key: 'financing', label: 'Financing' },
  { key: 'actions', label: 'Actions' },
];

// ─── Component ─────────────────────────────────────────────────────────────────

export const InvoiceTable = ({ filters }: { filters: IInvoiceFilters }) => {
  const { styles } = useStyle();
  const [page, setPage] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);
  const [loading, setLoading] = useState(false);
  const [invoices, setInvoices] = useState<IInvoice[]>([]);
  const router = useRouter();

  const rowsPerPage = 50;
  const { data, isLoading } = getInvoices({
    ...filters,
    page,
    limit: rowsPerPage,
  });

  const markPaidMutation = useMarkInvoicePaid();
  const sendReminderMutation = useSendInvoiceReminder();

  useEffect(() => {
    setLoading(isLoading);
  }, [isLoading]);

  useEffect(() => {
    if (data) {
      const responseData = Array.isArray(data) ? data[0] : data;
      setInvoices(responseData?.data?.data || []);
      setTotalRecords(responseData?.data?.pagination?.totalItems || 0);
    }
  }, [data]);

  useEffect(() => {
    setPage(1);
  }, [filters.status, filters.date, filters.search]);

  const pages = useMemo(
    () => Math.ceil(totalRecords / rowsPerPage),
    [totalRecords],
  );

  const handleCopyLink = async (invoiceId: string) => {
    const link = `${window.location.origin}/invoice/${invoiceId}`;
    try {
      await navigator.clipboard.writeText(link);
      message.success('Invoice link copied!');
    } catch {
      message.error('Failed to copy link');
    }
  };

  const handleMarkPaid = async (invoiceId: string) => {
    const [, err] = await markPaidMutation.mutateAsync(invoiceId);
    if (err) {
      message.error('Failed to mark as paid');
    } else {
      message.success('Invoice marked as paid');
    }
  };

  const handleSendReminder = async (invoiceId: string) => {
    const [, err] = await sendReminderMutation.mutateAsync(invoiceId);
    if (err) {
      message.error('Failed to send reminder');
    } else {
      message.success('Reminder sent to customer');
    }
  };

  const getActionsMenu = (invoice: IInvoice): MenuProps['items'] => {
    const isPaid = invoice.status === INVOICE_STATUS.PAID;
    const isCancelled = invoice.status === INVOICE_STATUS.CANCELLED;
    const isDraft = invoice.status === INVOICE_STATUS.DRAFT;

    return [
      {
        key: 'copy',
        label: 'Copy Invoice Link',
        icon: <CopyOutlined />,
        onClick: () => handleCopyLink(invoice.id),
      },
      {
        type: 'divider',
      },
      {
        key: 'mark-paid',
        label: 'Mark as Paid',
        icon: <CheckCircleOutlined style={{ color: 'var(--secondary)' }} />,
        disabled: isPaid || isCancelled || isDraft,
        onClick: () => handleMarkPaid(invoice.id),
      },
      {
        key: 'send-reminder',
        label: 'Send Reminder',
        icon: <BellOutlined style={{ color: '#F59E0B' }} />,
        disabled: isPaid || isCancelled || isDraft,
        onClick: () => handleSendReminder(invoice.id),
      },
    ];
  };

  const renderCell = React.useCallback(
    (invoice: IInvoice, columnKey: React.Key) => {
      switch (columnKey) {
        case 'id':
          return (
            <div
              style={{
                color: 'var(--primary)',
                cursor: 'pointer',
                textDecoration: 'underline',
                fontFamily: 'monospace',
                fontSize: '12px',
              }}
              onClick={() =>
                router.push(`/invoices/create?invoiceId=${invoice.id}`)
              }
            >
              {invoice.id?.slice(-12) || '-'}
            </div>
          );

        case 'invoiceNumber':
          return (
            <span style={{ fontWeight: 600 }}>
              {invoice.invoiceNumber || '-'}
            </span>
          );

        case 'createdAt':
          return getFormattedTime(invoice.createdAt) || '-';

        case 'totalAmount':
          return (
            <div>
              <div style={{ fontWeight: 700, color: '#1a1a1a' }}>
                ₹
                {Number(invoice.totalAmount || 0).toLocaleString('en-IN', {
                  minimumFractionDigits: 2,
                })}
              </div>
              {invoice.totalTaxAmount && Number(invoice.totalTaxAmount) > 0 && (
                <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                  incl. GST ₹
                  {Number(invoice.totalTaxAmount).toLocaleString('en-IN', {
                    minimumFractionDigits: 2,
                  })}
                </div>
              )}
            </div>
          );

        case 'status': {
          const statusKey = formatInvoiceStatus(invoice.status);
          const cfg = STATUS_CONFIG[statusKey.toLowerCase()];
          return (
            <Tag style={getStatusStyle(statusKey)} bordered={false}>
              {cfg?.label ?? statusKey}
            </Tag>
          );
        }

        case 'customer':
          return (
            <div>
              <div style={{ fontWeight: 600 }}>
                {invoice.customer?.name || '-'}
              </div>
              <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                {invoice.customer?.email}
              </div>
            </div>
          );

        case 'financing':
          if (invoice.isFinancingEligible) {
            return (
              <Tooltip title="This invoice is 30+ days unpaid and may be eligible for invoice financing">
                <Badge
                  count="Eligible"
                  style={{
                    backgroundColor: '#FEF3C7',
                    color: '#D97706',
                    border: '1px solid #FDE68A',
                    fontWeight: 600,
                    fontSize: '11px',
                  }}
                />
              </Tooltip>
            );
          }
          if (invoice.paidAt) {
            return (
              <span style={{ fontSize: '11px', color: 'var(--secondary)' }}>
                Paid {getFormattedTime(invoice.paidAt)}
              </span>
            );
          }
          return <span style={{ color: '#d1d5db', fontSize: '12px' }}>—</span>;

        case 'actions':
          return (
            <Dropdown
              menu={{ items: getActionsMenu(invoice) }}
              trigger={['click']}
              placement="bottomRight"
            >
              <Button
                type="text"
                icon={<MoreOutlined />}
                style={{ color: 'var(--text-muted)', width: '32px', padding: 0 }}
              />
            </Dropdown>
          );

        default:
          return '-';
      }
    },
    [router, markPaidMutation, sendReminderMutation],
  );

  const columns: TableColumnsType<IInvoice> = columnsConfig.map(
    (col, index) => {
      const isFirstCol = index === 0;
      const isLastCol = index === columnsConfig.length - 1;
      return {
        title: col.label,
        dataIndex: col.key,
        key: col.key,
        fixed: isFirstCol
          ? ('left' as const)
          : isLastCol
            ? ('right' as const)
            : undefined,
        width: isFirstCol
          ? 160
          : isLastCol
            ? 80
            : col.key === 'actions'
              ? 80
              : 180,
        ellipsis: { showTitle: true },
        render: (_: safeAny, record: IInvoice) => renderCell(record, col.key),
      };
    },
  );

  return (
    <div className="mx-4 my-4" style={{ maxWidth: 'calc(100vw - 190px)' }}>
      <div
        style={{
          width: '100%',
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
          <Spin
            spinning={loading}
            size="large"
            tip="Loading"
            className={styles.customSpin}
          >
            <Table
              className={styles.customTable}
              columns={columns}
              dataSource={invoices}
              rowKey="id"
              pagination={false}
              scroll={{ x: 'max-content', y: 'calc(100vh - 400px)' }}
              locale={{
                emptyText: (
                  <div
                    className="text-center py-8"
                    style={{ color: 'var(--text-muted)' }}
                  >
                    <BankOutlined
                      style={{
                        fontSize: '32px',
                        marginBottom: '8px',
                        display: 'block',
                      }}
                    />
                    <div style={{ fontSize: '16px', fontWeight: 500 }}>
                      No Invoices Found
                    </div>
                    <div style={{ fontSize: '13px', marginTop: '4px' }}>
                      Create your first invoice to get started
                    </div>
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
            borderTop: '1px solid #4E4E4E',
            borderRadius: '0 0 10px 10px',
            color: 'var(--text)',
          }}
        >
          <Pagination
            current={page}
            total={totalRecords}
            pageSize={rowsPerPage}
            onChange={(newPage) => setPage(newPage)}
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
  );
};
