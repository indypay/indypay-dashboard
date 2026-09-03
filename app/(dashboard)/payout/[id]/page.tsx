'use client';

import React, { useEffect, useState, useMemo } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
  Table,
  Button,
  Pagination,
  Spin,
  DatePicker,
  Card,
  Row,
  Col,
  Statistic,
  Input,
  Select,
  Tag,
  TableColumnsType,
} from 'antd';
import { SearchOutlined, SyncOutlined, EyeOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import dayjs, { Dayjs } from 'dayjs';
import { createStyles } from 'antd-style';
import { downloadBlob, xlsxBlob } from '@/lib/utils/file.utils';

import { getAdminPayoutByUserId } from '@/lib/hooks/use-payout';
import {
  MerchantPayoutCollectionsData,
  MerchantPayoutDetailsTransRes,
  PayoutCardStats,
  PayoutDetailsTransData,
} from '@/lib/interfaces/payout.interface';
import {
  formatAmount,
  formatColorStatus,
  formatStatus,
  getFormattedTime,
} from '@/lib/utils/utils';
import { safeAny } from '@/lib/interfaces/global.interface';
import { useToast } from '@/lib/components/Toast/ToastContext';
import useDebounce from '@/lib/hooks/use-debounce';
import PayoutMerchantDetails from '@/lib/components/PayoutMerchantDetails/PayoutDetails';
import { PayoutTransactionColumns } from '@/lib/constants/payoutConstants/payout.constants';
import { callPayoutStatusApi } from '@/lib/services/payout-service';
import { useDownloadReportsPayout } from '@/lib/hooks/use-downloadReports';
import { STATUS_OPTIONS } from '@/lib/constants/payoutConstants/payout.constants';
import BulkPayout from '../BulkPayout';

const { RangePicker } = DatePicker;
const { Option } = Select;

const useStyle = createStyles(({ css }) => {
  return {
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
        background: transparent !important;
      }

      .ant-pagination-item-active {
        background: linear-gradient(to right, var(--border), var(--primary)) !important;
        border-color: transparent !important;

        a {
          color: #0c0c0c !important;
        }
      }

      .ant-pagination-item {
        background: transparent !important;
        border-color: #4e4e4e !important;

        a {
          color: var(--text) !important;
        }

        &:hover {
          border-color: #30f3bc !important;
          background: transparent !important;
        }
      }

      .ant-pagination-prev,
      .ant-pagination-next {
        .ant-pagination-item-link {
          background: transparent !important;
          border-color: #4e4e4e !important;
          color: var(--text) !important;

          &:hover {
            border-color: #30f3bc !important;
            background: transparent !important;
          }
        }
      }

      .ant-pagination-options-quick-jumper input {
        background: #ffffff !important;
        border-color: #4e4e4e !important;
        color: var(--text) !important;

        &:hover {
          border-color: #30f3bc !important;
        }

        &:focus {
          border-color: #30f3bc !important;
          box-shadow: 0 0 0 2px rgba(48, 243, 188, 0.1) !important;
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
  };
});

const customInputStyles = `
  .custom-search-input .ant-input,
  .custom-search-input .ant-input-affix-wrapper {
    background-color: #FFFFFF !important;
    border-color: #4E4E4E !important;
    color: var(--text) !important;
    border-radius: 8px !important;
    caret-color: #30F3BC !important;
  }

  .custom-search-input .ant-input::placeholder,
  .custom-search-input .ant-input-affix-wrapper input::placeholder {
    color: var(--text-muted) !important;
  }

  .custom-search-input .ant-input-affix-wrapper:hover,
  .custom-search-input .ant-input-affix-wrapper:focus,
  .custom-search-input .ant-input-affix-wrapper-focused {
    border-color: #30F3BC !important;
    box-shadow: 0 0 0 2px rgba(48, 243, 188, 0.1) !important;
  }

  .custom-select .ant-select-selector {
    background-color: #FFFFFF !important;
    border-color: #4E4E4E !important;
    color: var(--text) !important;
    border-radius: 8px !important;
  }

  .custom-select .ant-select-selector:hover {
    border-color: #30F3BC !important;
  }

  .custom-select.ant-select-focused .ant-select-selector {
    border-color: #30F3BC !important;
    box-shadow: 0 0 0 2px rgba(48, 243, 188, 0.1) !important;
  }

  .custom-select .ant-select-selection-placeholder {
    color: var(--text-muted) !important;
  }

  .custom-select .ant-select-selection-item {
    color: var(--text) !important;
  }

  .custom-select .ant-select-arrow {
    color: var(--text-muted) !important;
  }

  .custom-input {
    background-color: #FFFFFF !important;
    border-color: #4E4E4E !important;
    color: var(--text) !important;
    border-radius: 8px !important;
    caret-color: #30F3BC !important;
  }

  .custom-input::placeholder {
    color: var(--text-muted) !important;
  }

  .custom-input:hover {
    border-color: #30F3BC !important;
  }

  .custom-input:focus {
    border-color: #30F3BC !important;
    box-shadow: 0 0 0 2px rgba(48, 243, 188, 0.1) !important;
  }
`;

if (typeof document !== 'undefined') {
  const styleTag = document.createElement('style');
  styleTag.innerHTML = customInputStyles;
  document.head.appendChild(styleTag);
}

const PayoutTransactionDetailsPage: React.FC = () => {
  const { styles } = useStyle();
  const { id: userId } = useParams<{ id: string }>() || { id: null };
  const router = useRouter();
  const { showToast } = useToast();

  const [page, setPage] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(true);
  const [merchantTransList, setMerchantTransList] = useState<
    PayoutDetailsTransData[]
  >([]);
  const [openMerchantDetails, setOpenMerchantDetails] =
    useState<boolean>(false);
  const [selectedUserId, setSelectedUserId] = useState<string>('');
  const [totalItems, setTotalItems] = useState<number>(0);
  const [dateRange, setDateRange] = useState<[Dayjs, Dayjs]>([
    dayjs().startOf('day'),
    dayjs().endOf('day'),
  ]);
  const [checkingStatusId, setCheckingStatusId] = useState<string | null>(null);
  const [status, setStatus] = useState('');
  const [search, setSearch] = useState('');
  const [countNumber, setCountNumber] = useState<string>('');
  const [startingNumber, setStartingNumber] = useState<string>('');
  const [loadingDownload, setLoadingDownload] = useState<boolean>(false);
  const [openBulkPayout, setOpenBulkPayout] = useState<boolean>(false);

  const debouncedSearch = useDebounce(search, 500);
  const limit = 50;

  const [cardStats, setCardStats] = useState<PayoutCardStats>({
    totalPayouts: 0,
    totalSuccess: 0,
    totalFailed: 0,
    totalPayoutsWithCharges: 0,
    totalSuccessWithCharges: 0,
    totalFailedWithCharges: 0,
  });

  const startDate = dateRange[0]
    ? dateRange[0].startOf('day').toISOString()
    : '';
  const endDate = dateRange[1] ? dateRange[1].endOf('day').toISOString() : '';

  const query = getAdminPayoutByUserId({
    userId,
    page,
    limit,
    search: debouncedSearch,
    startDate,
    endDate,
  });

  const { data } = query;

  useEffect(() => {
    if (data) {
      const collectionsData = Array.isArray(data) ? data[0] : data;
      const responseData = (collectionsData?.data ||
        {}) as MerchantPayoutDetailsTransRes;

      setMerchantTransList(
        Array.isArray(responseData.data) ? responseData.data : [],
      );
      setTotalItems(responseData.pagination?.totalItems || 0);
      setCardStats(
        responseData.stats || {
          totalPayouts: 0,
          totalSuccess: 0,
          totalFailed: 0,
          totalPayoutsWithCharges: 0,
          totalSuccessWithCharges: 0,
          totalFailedWithCharges: 0,
        },
      );
    }
  }, [data]);

  useEffect(() => {
    setLoading(query.isLoading);
  }, [query.isLoading]);

  const handleDateRangeChange = (
    dates: null | [Dayjs | null, Dayjs | null],
  ) => {
    if (dates && dates[0] && dates[1]) {
      setDateRange([dates[0], dates[1]]);
      setPage(1);
    }
  };

  const handleViewDetails = (userId: string) => {
    setSelectedUserId(userId);
    setOpenMerchantDetails((prev) => !prev);
  };

  const handleReset = () => {
    setSearch('');
    setStatus('');
    setDateRange([dayjs().startOf('day'), dayjs().endOf('day')]);
    setPage(1);
  };

  const { mutateAsync: downloadReports } = useDownloadReportsPayout();

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

      downloadBlob(xlsxBlob(response), `payout-report-${new Date().toISOString().split('T')[0]}.xlsx`);
      showToast('File downloaded successfully', 'success');
    } catch (err) {
      console.error('Download error:', err);
      showToast('Error downloading the file', 'error');
    } finally {
      setLoadingDownload(false);
    }
  };

  const handleRefresh = async (id: string) => {
    if (!id) {
      showToast('Payout ID is required', 'error');
      return;
    }

    try {
      setCheckingStatusId(id);
      const result = await callPayoutStatusApi(id);
      if (result[0]?.data) {
        showToast('Status updated successfully', 'success');
        await query.refetch();
      } else {
        const errorMessage = result[1]?.message || 'Failed to check status';
        showToast(errorMessage, 'error');
      }
    } catch (error: Error | unknown) {
      const errorMessage =
        error instanceof Error ? error.message : 'Failed to check status';
      showToast(errorMessage, 'error');
    } finally {
      setCheckingStatusId(null);
    }
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

  const renderCell = (
    record: MerchantPayoutCollectionsData,
    columnKey: string,
  ) => {
    switch (columnKey) {
      case 'fullName':
        return record.user.fullName || '-';
      case 'createdAt':
        return record.createdAt
          ? getFormattedTime(new Date(record.createdAt))
          : '-';
      case 'orderId':
        return record.orderId || '-';
      case 'payoutId':
        return record.payoutId || '-';
      case 'amountBeforeDeduction':
        return formatAmount(record.amountBeforeDeduction) || '-';
      case 'charges':
        return (
          formatAmount(+record.amountBeforeDeduction - +record.amount) || '-'
        );
      case 'amount':
        return formatAmount(record.amount) || '-';
      case 'utr':
        return record.utr || '-';
      case 'status':
        return (
          <div className="flex items-center gap-2">
            <Tag style={getTagStyle(record.status)}>
              {formatStatus(record.status) || '-'}
            </Tag>
            {record.status !== 'SUCCESS' && (
              <Button
                type="primary"
                size="small"
                icon={
                  <SyncOutlined spin={checkingStatusId === record.id} />
                }
                loading={checkingStatusId === record.id}
                disabled={checkingStatusId === record.id}
                onClick={() => handleRefresh(record.id)}
                style={{
                  background: 'linear-gradient(to right, var(--border), var(--primary))',
                  border: 'none',
                  color: 'var(--background)',
                }}
              />
            )}
          </div>
        );
      case 'transferId':
        return record.transferId || '-';
      case 'view-details':
        return (
          <Button
            size="middle"
            type="primary"
            icon={<EyeOutlined />}
            style={{
              background: 'linear-gradient(to right, var(--border), var(--primary))',
              border: 'none',
              color: 'var(--background)',
              fontWeight: 600,
            }}
            onClick={() => handleViewDetails(record.id)}
          >
            View
          </Button>
        );
      default:
        return '-';
    }
  };

  const columns: TableColumnsType<MerchantPayoutCollectionsData> =
    PayoutTransactionColumns.map((col, index) => {
      const isFirstCol = index === 0;
      const isLastCol = index === PayoutTransactionColumns.length - 1;
      const isActionCol = col.key === 'view-details';
      return {
        title: col.label,
        dataIndex: isActionCol ? undefined : col.key,
        key: col.key,
        fixed: isFirstCol
          ? ('left' as const)
          : isLastCol
            ? ('right' as const)
            : undefined,
        width: isFirstCol ? 200 : isLastCol ? 150 : 200,
        ellipsis: isActionCol ? false : { showTitle: true },
        render: (_: safeAny, record: MerchantPayoutCollectionsData) =>
          renderCell(record, col.key),
      };
    });

  return (
    <>
      {/* Back Button */}
      <div className="mx-4 mt-4">
        <Button
          icon={<ArrowLeftOutlined />}
          onClick={() => router.back()}
          style={{ marginBottom: 8 }}
        >
          Go Back
        </Button>
      </div>

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
                    title="Total Payouts"
                    value={formatAmount(cardStats.totalPayouts)}
                    valueStyle={{ color: '#F5A524' }}
                  />
                  <div
                    style={{
                      fontSize: '12px',
                      color: 'var(--text-muted)',
                      marginTop: '8px',
                    }}
                  >
                    With Charges:{' '}
                    {formatAmount(cardStats.totalPayoutsWithCharges)}
                  </div>
                </Card>
              </Col>
              <Col span={8}>
                <Card className={styles.statsCard}>
                  <Statistic
                    title="Total Success"
                    value={formatAmount(cardStats.totalSuccess)}
                    valueStyle={{ color: '#0DD25F' }}
                  />
                  <div
                    style={{
                      fontSize: '12px',
                      color: 'var(--text-muted)',
                      marginTop: '8px',
                    }}
                  >
                    With Charges:{' '}
                    {formatAmount(cardStats.totalSuccessWithCharges)}
                  </div>
                </Card>
              </Col>
              <Col span={8}>
                <Card className={styles.statsCard}>
                  <Statistic
                    title="Total Failed"
                    value={formatAmount(cardStats.totalFailed)}
                    valueStyle={{ color: 'var(--secondary)' }}
                  />
                  <div
                    style={{
                      fontSize: '12px',
                      color: 'var(--text-muted)',
                      marginTop: '8px',
                    }}
                  >
                    With Charges:{' '}
                    {formatAmount(cardStats.totalFailedWithCharges)}
                  </div>
                </Card>
              </Col>
            </Row>
          </div>
        </div>
      </div>

      {/* Filters Section */}
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
            <div className="flex items-center justify-between gap-4">
              <RangePicker
                value={dateRange}
                onChange={handleDateRangeChange}
                format="YYYY-MM-DD"
                style={{
                  width: 300,
                  backgroundColor: '#FFFFFF',
                  borderColor: 'var(--border)',
                  color: 'var(--text)',
                }}
                allowClear={false}
              />

              <div className="flex items-center gap-4">
                <Input.Search
                  className="custom-search-input"
                  placeholder="Search by name"
                  prefix={<SearchOutlined style={{ color: 'var(--text-muted)' }} />}
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  onSearch={() => setPage(1)}
                  allowClear
                  style={{
                    width: 250,
                    backgroundColor: '#FFFFFF',
                    borderColor: 'var(--border)',
                    borderRadius: '8px',
                    caretColor: 'var(--secondary)',
                  }}
                  styles={{
                    input: {
                      backgroundColor: '#FFFFFF',
                      color: 'var(--text)',
                    },
                  }}
                />

                <Select
                  className="custom-select"
                  placeholder="Status"
                  value={status || undefined}
                  onChange={(value) => setStatus(value)}
                  allowClear
                  style={{
                    width: 150,
                    backgroundColor: '#FFFFFF',
                  }}
                  options={STATUS_OPTIONS.map((option) => ({
                    label: option.label,
                    value: option.key,
                  }))}
                />

                <Input
                  className="custom-input"
                  placeholder="From"
                  value={startingNumber}
                  onChange={(e) => setStartingNumber(e.target.value)}
                  style={{
                    width: 100,
                    backgroundColor: '#FFFFFF',
                    borderColor: 'var(--border)',
                    color: 'var(--text)',
                    borderRadius: '8px',
                    caretColor: 'var(--secondary)',
                  }}
                />

                <Input
                  className="custom-input"
                  placeholder="Count"
                  value={countNumber}
                  onChange={(e) => setCountNumber(e.target.value)}
                  style={{
                    width: 100,
                    backgroundColor: '#FFFFFF',
                    borderColor: 'var(--border)',
                    color: 'var(--text)',
                    borderRadius: '8px',
                    caretColor: 'var(--secondary)',
                  }}
                />

                <Button
                  type="primary"
                  onClick={() => setOpenBulkPayout(true)}
                  style={{
                    background: 'linear-gradient(to right, var(--border), var(--primary))',
                    border: 'none',
                    color: 'var(--background)',
                    fontWeight: 600,
                  }}
                >
                  Bulk Payout
                </Button>

                <Button
                  type="primary"
                  onClick={handleReset}
                  style={{
                    background: '#D51C44',
                    border: 'none',
                    color: '#FFFFFF',
                    fontWeight: 600,
                  }}
                >
                  Reset
                </Button>

                <Button
                  type="primary"
                  onClick={downloadDailyReports}
                  loading={loadingDownload}
                  style={{
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
            <Spin
              spinning={loading}
              size="large"
              tip="Loading"
              className={styles.customSpin}
            >
              <Table
                className={styles.customTable}
                columns={columns}
                dataSource={merchantTransList}
                rowKey="id"
                pagination={false}
                scroll={{ x: 'max-content', y: 'calc(100vh - 500px)' }}
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
        <PayoutMerchantDetails
          payoutId={selectedUserId}
          onClose={() => setOpenMerchantDetails(false)}
        />
      )}

      {openBulkPayout && (
        <BulkPayout
          onClose={() => setOpenBulkPayout(false)}
          refetch={async () => {
            await query.refetch();
          }}
        />
      )}
    </>
  );
};

export default PayoutTransactionDetailsPage;
