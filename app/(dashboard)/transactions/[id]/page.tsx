'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import {
  Table,
  Button,
  Pagination,
  Tag,
  Spin,
  DatePicker,
  Select,
  Input,
  Card,
  Row,
  Col,
  Statistic,
} from 'antd';
import type { TableColumnsType } from 'antd';
import dayjs, { Dayjs } from 'dayjs';
import { createStyles } from 'antd-style';
import { SearchOutlined, EyeOutlined } from '@ant-design/icons';
import { downloadBlob, xlsxBlob } from '@/lib/utils/file.utils';
import { UseQueryResult } from '@tanstack/react-query';

const { RangePicker } = DatePicker;

import {
  getAdmincollectionByUserId,
  getChannelPartnerCollectionByUserId,
} from '@/lib/hooks/use-collections';
import { CollectionTransactionColumns } from '@/lib/constants/collections/collections.constants';
import {
  CollectionDetailsTransData,
  CollectionDetailsTransRes,
  CardStats,
} from '@/lib/interfaces/transactions.interface';
import MerchantDetails from '@/lib/components/MerchantDetails/MerchantDetails';
import {
  formatAmount,
  formatColorStatus,
  formatStatus,
  getFormattedTime,
  isAdmin,
  isChannelPartner,
  isOps,
} from '@/lib/utils/utils';
import { useToast } from '@/lib/components/Toast/ToastContext';
import useDebounce from '@/lib/hooks/use-debounce';
import { useRole } from '@/lib/components/Role/RoleContext';
import { useDownloadReports } from '@/lib/hooks/use-downloadReports';
import { STATUS_OPTIONS } from '@/lib/constants/payoutConstants/payout.constants';
import CreateDisputeModal from '@/lib/components/disputes/CreateDisputeModal';
// import '../../../global.scss';

const useStyle = createStyles(({ css }) => {
  return {
    customTable: css`
      /* Custom Input Styles */
      .custom-search-input .ant-input,
      .custom-input {
        background-color: #ffffff !important;
        color: var(--text) !important;
        border-color: var(--text-muted) !important;
        caret-color: var(--text) !important;
        box-shadow: none !important;

        &::placeholder {
          color: var(--text-muted) !important;
        }

        &:hover {
          background-color: #ffffff !important;
          border-color: var(--text-muted) !important;
          color: var(--text) !important;
          box-shadow: none !important;
        }

        &:focus,
        &:focus-within {
          background-color: #ffffff !important;
          border-color: var(--text-muted) !important;
          color: var(--text) !important;
          box-shadow: none !important;
          outline: none !important;
        }
      }

      .custom-search-input .ant-input-affix-wrapper {
        background-color: #ffffff !important;
        border-color: var(--text-muted) !important;
        box-shadow: none !important;

        &:hover,
        &:focus,
        &:focus-within {
          background-color: #ffffff !important;
          border-color: var(--text-muted) !important;
          box-shadow: none !important;
          outline: none !important;
        }
      }

      .custom-search-input .ant-input-search-button {
        background-color: #ffffff !important;
        border-color: var(--text-muted) !important;
        color: var(--text-muted) !important;
        box-shadow: none !important;

        &:hover {
          border-color: var(--text-muted) !important;
          color: #30f3bc !important;
          box-shadow: none !important;
        }
      }

      /* Custom Select Styles */
      .custom-select .ant-select-selector {
        background-color: #ffffff !important;
        border-color: var(--text-muted) !important;
        color: var(--text) !important;
        box-shadow: none !important;

        .ant-select-selection-placeholder {
          color: var(--text-muted) !important;
        }

        .ant-select-selection-item {
          color: var(--text) !important;
        }
      }

      .custom-select:hover .ant-select-selector {
        background-color: #ffffff !important;
        border-color: var(--text-muted) !important;
        box-shadow: none !important;
      }

      .custom-select.ant-select-focused .ant-select-selector,
      .custom-select.ant-select-open .ant-select-selector {
        background-color: #ffffff !important;
        border-color: var(--text-muted) !important;
        box-shadow: none !important;
        outline: none !important;
      }

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

          &::-webkit-scrollbar {
            height: 8px;
            width: 8px;
          }

          &::-webkit-scrollbar-track {
            background: #01261d;
            border-radius: 4px;
          }

          &::-webkit-scrollbar-thumb {
            background: #40a17f;
            border-radius: 4px;

            &:hover {
              background: #30f3bc;
            }
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

      .ant-table-thead .ant-table-cell-fix-left,
      .ant-table-thead .ant-table-cell-fix-right {
        background: #ffffff !important;
      }

      .ant-table-tbody > tr:hover {
        .ant-table-cell-fix-left,
        .ant-table-cell-fix-right {
          background: var(--background) !important;
        }
      }

      .ant-table-bordered .ant-table-container {
        border: none;
        border-radius: 8px;
      }
    `,
    customCard: css`
      background: #ffffff;
      border: 2px solid transparent;
      border-image: linear-gradient(to right, var(--border), var(--primary)) 1;
      border-radius: 12px;

      .ant-card-body {
        padding: 24px;
      }
    `,
    statsCard: css`
      background: #ffffff;
      border: 1px solid #4e4e4e;
      border-radius: 12px;

      .ant-card-body {
        padding: 20px;
      }

      .ant-statistic-title {
        color: var(--text-muted);
        font-size: 14px;
        margin-bottom: 8px;
      }

      .ant-statistic-content {
        color: var(--text);
        font-size: 24px;
        font-weight: 600;
      }
    `,
    customPagination: css`
      .ant-pagination-item,
      .ant-pagination-item-link,
      .ant-pagination-total-text,
      .ant-pagination-jump-prev,
      .ant-pagination-jump-next,
      .ant-pagination-options-quick-jumper input {
        color: var(--text) !important;
        background: #ffffff !important;
      }

      .ant-pagination-options-quick-jumper input {
        background: #ffffff !important;
        border-color: #4e4e4e !important;
        color: var(--text) !important;

        &:hover,
        &:focus {
          background: #ffffff !important;
          border-color: var(--text-muted) !important;
          box-shadow: none !important;
        }
      }

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
          background: #ffffff !important;
          border-color: #30f3bc !important;
        }
      }

      .ant-pagination-prev,
      .ant-pagination-next {
        .ant-pagination-item-link {
          background: #ffffff !important;
          border-color: #4e4e4e !important;
          color: var(--text) !important;

          &:hover {
            background: #ffffff !important;
            border-color: #30f3bc !important;
          }
        }
      }

      .ant-pagination-jump-prev,
      .ant-pagination-jump-next {
        .ant-pagination-item-ellipsis {
          color: var(--text) !important;
        }
      }

      .ant-pagination-disabled {
        .ant-pagination-item-link {
          background: #ffffff !important;
          border-color: #4e4e4e !important;
          color: var(--text-muted) !important;
        }
      }
    `,
  };
});

const TransactionDetailsPage: React.FC = () => {
  const [page, setPage] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(true);
  const [merchantTransList, setMerchantTransList] = useState<
    CollectionDetailsTransData[]
  >([]);
  const [channelPartnerTransList, setChannelPartnerTransList] = useState<
    CollectionDetailsTransData[]
  >([]);
  const [status, setStatus] = useState<string | null>(null);
  const [appliedStatus, setAppliedStatus] = useState<string | null>(null);
  const [openMerchantDetails, setOpenMerchantDetails] =
    useState<boolean>(false);
  const [selectedUserId, setSelectedUserId] = useState<string>('');
  const [totalItems, setTotalItems] = useState<number>(0);
  const [dateRange, setDateRange] = useState<[Dayjs, Dayjs]>([
    dayjs().startOf('day'),
    dayjs().endOf('day'),
  ]);
  const [cardStats, setCardStats] = useState<CardStats>({
    todayCollections: 0,
    todaySuccess: 0,
    todayFailed: 0,
  });
  const [search, setSearch] = useState('');
  const [countNumber, setCountNumber] = useState<string>('');
  const [startingNumber, setStartingNumber] = useState<string>('');
  const debouncedSearch = useDebounce(search, 500);

  const { showToast } = useToast();
  const { styles } = useStyle();

  const [loadingDownload, setLoadingDownload] = useState<boolean>(false);
  const [disputeModalTxnId, setDisputeModalTxnId] = useState<string | null>(
    null,
  );
  const limit = 50;
  const { role } = useRole();

  const { id: userId } = useParams<{ id: string }>() || { id: null };

  const startDate = dateRange[0]
    ? dateRange[0].startOf('day').toISOString()
    : '';
  const endDate = dateRange[1] ? dateRange[1].endOf('day').toISOString() : '';

  const merchantData = getAdmincollectionByUserId(
    userId,
    page,
    limit,
    debouncedSearch,
    appliedStatus,
    startDate,
    endDate,
    true,
  ) as unknown as UseQueryResult<CollectionDetailsTransRes | null, Error>;

  const channelPartnerData = isChannelPartner(role)
    ? (getChannelPartnerCollectionByUserId(
        userId,
        page,
        limit,
        debouncedSearch,
        appliedStatus,
        startDate,
        endDate,
      ) as unknown as UseQueryResult<CollectionDetailsTransRes | null, Error>)
    : {
        data: null,
        isLoading: false,
        refetch: () => Promise.resolve(),
      };

  const { mutateAsync: downloadReports } = useDownloadReports();

  const downloadDailyReports = async () => {
    setLoadingDownload(true);
    try {
      const [response, error] = await downloadReports({
        userId: userId || '',
        startDate,
        endDate,
        search: debouncedSearch,
        status: status || null || undefined,
        from: +startingNumber,
        count: +countNumber,
      });

      if (error || !response) {
        showToast('Error downloading the file', 'error');
        return;
      }

      downloadBlob(xlsxBlob(response), `transactions-report-${new Date().toISOString().split('T')[0]}.xlsx`);
      showToast('File downloaded successfully', 'success');
    } catch (err) {
      console.error('Download error:', err);
      showToast('Error downloading the file', 'error');
    } finally {
      setLoadingDownload(false);
    }
  };

  useEffect(() => {
    if (merchantData.isLoading || channelPartnerData.isLoading) {
      setLoading(true);
      return;
    }

    setLoading(false);

    if (isAdmin(role) || isOps(role)) {
      console.log('Admin merchantData:', merchantData.data);
      if (Array.isArray(merchantData?.data) && merchantData?.data.length > 0) {
        const transData = merchantData?.data[0]?.data?.data || [];
        console.log('Setting merchant trans list:', transData);
        setMerchantTransList(transData);
        setTotalItems(merchantData?.data[0]?.data?.pagination?.totalItems || 0);
        setCardStats(merchantData?.data[0]?.data?.stats || {});
      } else {
        console.log('No merchant data found');
        setMerchantTransList([]);
        setTotalItems(0);
      }
    } else if (isChannelPartner(role)) {
      console.log('Channel Partner data:', channelPartnerData.data);
      if (
        Array.isArray(channelPartnerData?.data) &&
        channelPartnerData?.data.length > 0
      ) {
        const transData = channelPartnerData?.data[0]?.data?.data || [];
        console.log('Setting channel partner trans list:', transData);
        setChannelPartnerTransList(transData);
        setTotalItems(
          channelPartnerData?.data[0]?.data?.pagination?.totalItems || 0,
        );
        setCardStats(channelPartnerData?.data[0]?.data?.stats || {});
      } else {
        console.log('No channel partner data found');
        setChannelPartnerTransList([]);
        setTotalItems(0);
      }
    }
  }, [
    role,
    merchantData.data,
    merchantData.isLoading,
    channelPartnerData.data,
    channelPartnerData.isLoading,
  ]);

  const handleViewDetails = (userId: string) => {
    setSelectedUserId(userId);
    setOpenMerchantDetails((prev) => !prev);
  };

  const getTagStyle = (status: string): React.CSSProperties => {
    const colorStatus = formatColorStatus(status);
    const colorMap: Record<
      string,
      { bg: string; text: string; border: string }
    > = {
      success: { bg: '#0DD25F15', text: '#0DD25F', border: '#0DD25F40' },
      warning: { bg: '#F5A52415', text: '#F5A524', border: '#F5A52440' },
      danger: { bg: '#D51C4415', text: '#D51C44', border: '#D51C4440' },
      default: { bg: '#30F3BC15', text: 'var(--secondary)', border: '#30F3BC40' },
    };
    const colors = colorMap[colorStatus] || colorMap.default;
    return {
      backgroundColor: colors.bg,
      color: colors.text,
      border: `1px solid ${colors.border}`,
      borderRadius: '6px',
      padding: '4px 12px',
      fontWeight: 500,
    };
  };

  const columns: TableColumnsType<CollectionDetailsTransData> =
    CollectionTransactionColumns.map((col, index) => {
      const isFirstCol = index === 0;
      const isLastCol = col.key === 'view-details';
      const isActionCol = col.key === 'view-details';
      const isDisputeCol = col.key === 'dispute';

      return {
        title: col.label,
        dataIndex: isActionCol ? undefined : col.key,
        key: col.key,
        fixed: isFirstCol
          ? ('left' as const)
          : isLastCol
            ? ('right' as const)
            : undefined,
        width: isFirstCol ? 200 : isLastCol ? 150 : isDisputeCol ? 130 : 200,
        ellipsis: isActionCol ? false : { showTitle: true },
        render: (_: unknown, record: CollectionDetailsTransData) => {
          switch (col.key) {
            case 'fullName':
              return record.user.fullName || '-';
            case 'createdAt':
              return record.createdAt
                ? getFormattedTime(new Date(record.createdAt))
                : '-';
            case 'orderId':
              return record.orderId || '-';
            case 'userName':
              return record.name || '-';
            case 'utr':
              return record.utr || '-';
            case 'amount':
              return formatAmount(record.amount) || '-';
            case 'netPayableAmount':
              return formatAmount(record.netPayableAmount) || '-';
            case 'status':
              return (
                <Tag style={getTagStyle(record.status)}>
                  {formatStatus(record.status) || '-'}
                </Tag>
              );
            case 'txnRefId':
              return record.txnRefId || '-';
            case 'dispute':
              if (isChannelPartner(role)) return '—';
              if (!isAdmin(role) && !isOps(role)) return '—';
              return (
                <Button
                  type="link"
                  size="small"
                  onClick={() => setDisputeModalTxnId(record.id)}
                  style={{ padding: 0, color: '#006B4F' }}
                >
                  Open dispute
                </Button>
              );
            case 'view-details':
              return (
                <div
                  onClick={() => handleViewDetails(record.id)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    cursor: 'pointer',
                    color: 'var(--secondary)',
                  }}
                >
                  <EyeOutlined style={{ fontSize: '18px', color: 'var(--secondary)' }} />
                  <span style={{ color: 'var(--secondary)', fontWeight: 500 }}>
                    View Details
                  </span>
                </div>
              );
            default:
              return '-';
          }
        },
      };
    });

  const dataSource = isChannelPartner(role)
    ? channelPartnerTransList
    : merchantTransList;

  useEffect(() => {
    if (isAdmin(role) || !isChannelPartner(role)) {
      setLoading(true);
      merchantData.refetch().finally(() => {
        setLoading(false);
      });
    }
  }, [page, startDate, endDate, debouncedSearch, appliedStatus]);

  useEffect(() => {
    if (isChannelPartner(role)) {
      setLoading(true);
      channelPartnerData.refetch().finally(() => {
        setLoading(false);
      });
    }
  }, [page, startDate, endDate, debouncedSearch, appliedStatus]);

  const handleDateRangeChange = (
    dates: null | [Dayjs | null, Dayjs | null],
  ) => {
    if (dates && dates[0] && dates[1]) {
      setDateRange([dates[0], dates[1]]);
      setPage(1); // Reset to first page when date range changes
    }
  };

  const handleApplyFilters = () => {
    setAppliedStatus(status);
    setPage(1);
  };

  return (
    <>
      {/* Stats Cards */}
      <div className="mx-4 my-4 mb-8">
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
            <Row gutter={16}>
              <Col span={8}>
                <Card className={styles.statsCard}>
                  <Statistic
                    title="Today's Total Collections"
                    value={formatAmount(cardStats.todayCollections)}
                    valueStyle={{ color: '#F5A524' }}
                  />
                </Card>
              </Col>
              <Col span={8}>
                <Card className={styles.statsCard}>
                  <Statistic
                    title="Today's Total Success"
                    value={formatAmount(cardStats.todaySuccess)}
                    valueStyle={{ color: '#0DD25F' }}
                  />
                </Card>
              </Col>
              <Col span={8}>
                <Card className={styles.statsCard}>
                  <Statistic
                    title="Today's Total Failed"
                    value={formatAmount(cardStats.todayFailed)}
                    valueStyle={{ color: 'var(--secondary)' }}
                  />
                </Card>
              </Col>
            </Row>
            {(isAdmin(role) || isOps(role)) && userId && (
              <div className="mt-4">
                <Link
                  href={`/disputes?merchantUserId=${encodeURIComponent(userId)}`}
                  style={{ color: '#006B4F', fontWeight: 600 }}
                >
                  View disputes for this merchant →
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Filters Card */}
      <div className={`mx-4 my-4 mb-8 ${styles.customTable}`}>
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
            <div className="flex flex-wrap items-center justify-between gap-4">
              <RangePicker
                value={dateRange}
                onChange={handleDateRangeChange}
                format="YYYY-MM-DD"
                style={{
                  width: '100%',
                  maxWidth: 300,
                  minWidth: 220,
                  backgroundColor: '#FFFFFF',
                  borderColor: 'var(--border)',
                  color: 'var(--text)',
                }}
                allowClear={false}
              />

              <div className="flex flex-1 flex-wrap items-center justify-end gap-4">
                <Input.Search
                  placeholder="Search by name"
                  prefix={<SearchOutlined style={{ color: 'var(--text-muted)' }} />}
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  onSearch={() => setPage(1)}
                  allowClear
                  className="custom-search-input"
                  style={{
                    width: '100%',
                    minWidth: 220,
                    maxWidth: 300,
                    backgroundColor: '#FFFFFF',
                    borderColor: 'var(--text-muted)',
                    borderRadius: '8px',
                  }}
                  styles={{
                    input: {
                      backgroundColor: '#FFFFFF',
                      color: 'var(--text)',
                      caretColor: 'var(--text)',
                    },
                  }}
                />

                <Select
                  placeholder="Status"
                  value={status}
                  onChange={(value) => setStatus(value)}
                  allowClear
                  className="custom-select"
                  style={{
                    width: '100%',
                    minWidth: 160,
                    maxWidth: 200,
                  }}
                  popupMatchSelectWidth={200}
                  dropdownStyle={{
                    backgroundColor: '#FFFFFF',
                  }}
                  options={STATUS_OPTIONS.map((option) => ({
                    label: option.label,
                    value: option.key,
                  }))}
                />

                <Button
                  onClick={handleApplyFilters}
                  style={{
                    minWidth: 110,
                    borderColor: 'var(--text-muted)',
                    color: 'var(--text)',
                    fontWeight: 600,
                    backgroundColor: '#FFFFFF',
                  }}
                >
                  Filter
                </Button>

                <Button
                  type="primary"
                  onClick={downloadDailyReports}
                  disabled={loadingDownload}
                  style={{
                    minWidth: 170,
                    background: 'linear-gradient(to right, var(--border), var(--primary))',
                    border: 'none',
                    color: 'var(--background)',
                    fontWeight: 600,
                  }}
                >
                  {loadingDownload ? 'Downloading...' : 'Download Reports'}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="mx-4 my-4" style={{ maxWidth: 'calc(100vw - 190px)' }}>
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
            <Spin spinning={loading} size="large" tip="Loading">
              <Table
                className={styles.customTable}
                columns={columns}
                dataSource={dataSource}
                rowKey="id"
                pagination={false}
                scroll={{ x: 'max-content', y: 'calc(100vh - 450px)' }}
                locale={{
                  emptyText: (
                    <div
                      className="text-center py-4 text-xl"
                      style={{ color: 'var(--text-muted)' }}
                    >
                      No Data Found
                    </div>
                  ),
                }}
                size="middle"
              />
            </Spin>
          </div>

          <div
            className={`flex justify-center p-4 sticky bottom-0 ${styles.customPagination}`}
            style={{
              background: '#FFFFFF',
              borderTop: '1px solid #4E4E4E',
              borderRadius: '0 0 10px 10px',
              color: 'var(--text)',
            }}
          >
            <Pagination
              current={page}
              total={totalItems}
              pageSize={limit}
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

      {openMerchantDetails && selectedUserId && (
        <MerchantDetails
          userId={selectedUserId}
          onClose={() => setOpenMerchantDetails(false)}
        />
      )}

      <CreateDisputeModal
        open={Boolean(disputeModalTxnId)}
        transactionId={disputeModalTxnId}
        onClose={() => setDisputeModalTxnId(null)}
        onCreated={() => {
          merchantData.refetch();
        }}
      />
    </>
  );
};

export default TransactionDetailsPage;
