'use client';

import React, { useEffect, useState } from 'react';
import {
  Table,
  Button,
  Pagination,
  Spin,
  DatePicker,
  Input,
  Tag,
  TableColumnsType,
  Select,
} from 'antd';
import type { TableProps } from 'antd';
import dayjs, { Dayjs } from 'dayjs';
import { createStyles } from 'antd-style';
import { SearchOutlined, SyncOutlined, EyeOutlined } from '@ant-design/icons';
import { downloadBlob, xlsxBlob } from '@/lib/utils/file.utils';

const { RangePicker } = DatePicker;

import {
  getSettlementsTransactions,
  useChannelPartnerCheckSettlementStatus,
  useChannelPartnerSettlementsTransactions,
  useCheckSettlementStatus,
} from '@/lib/hooks/use-manual-payout';
import { getSettlementColumns } from '@/lib/constants/SettlementsConstants/SettlementConstants';
import {
  formatAmount,
  formatColorStatus,
  formatStatus,
  getFormattedTime,
  isAdmin,
  isChannelPartner,
} from '@/lib/utils/utils';
import { ISettlementData } from '@/lib/interfaces/settlement.interface';
import useDebounce from '@/lib/hooks/use-debounce';
import { useToast } from '@/lib/components/Toast/ToastContext';
import { safeAny } from '@/lib/interfaces/global.interface';
import { useRole } from '@/lib/components/Role/RoleContext';
import { SettlementModal } from './SettlementModal';
import { useDownloadReportsSettlement } from '@/lib/hooks/use-downloadReports';
import { getMerchantList } from '@/lib/hooks/merchant-list';
import { IMerchantList } from '@/lib/interfaces/merchant-list.interface';

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
              background: var(--primary);
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

      /* Custom DatePicker Styles */
      .custom-date-picker {
        .ant-picker-input > input {
          color: var(--text) !important;
        }

        .ant-picker-suffix,
        .ant-picker-separator {
          color: var(--text-muted) !important;
        }
      }

      /* Custom Pagination Styles */
      .custom-pagination {
        .ant-pagination-item,
        .ant-pagination-item-link,
        .ant-pagination-total-text,
        .ant-pagination-jump-prev,
        .ant-pagination-jump-next,
        .ant-pagination-options-quick-jumper input {
          color: var(--text) !important;
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

        .ant-pagination-options-quick-jumper input {
          background: #ffffff !important;
          border-color: #4e4e4e !important;
          color: var(--text) !important;
        }
      }

      /* Custom Input Styles */
      .custom-input {
        background: #ffffff !important;
        border-color: #4e4e4e !important;
        color: var(--text) !important;

        &:hover,
        &:focus {
          border-color: var(--primary) !important;
          background: #ffffff !important;
        }

        input {
          background: #ffffff !important;
          color: var(--text) !important;
          caret-color: var(--primary) !important;
        }

        .ant-input-prefix {
          color: var(--text-muted) !important;
        }
      }

      .custom-search-input {
        background: #ffffff !important;
        border-color: #4e4e4e !important;
        border-radius: 8px !important;

        &:hover,
        &:focus-within {
          border-color: var(--primary) !important;
          background: #ffffff !important;
        }

        input {
          background: #ffffff !important;
          color: var(--text) !important;
          caret-color: var(--primary) !important;
        }

        .ant-input-prefix {
          color: var(--text-muted) !important;
        }
      }

      /* Custom Select Styles */
      .custom-select {
        .ant-select-selector {
          background: #ffffff !important;
          border-color: #4e4e4e !important;
          color: var(--text) !important;

          &:hover {
            border-color: var(--primary) !important;
          }
        }

        &.ant-select-focused .ant-select-selector {
          border-color: var(--primary) !important;
          box-shadow: 0 0 0 2px rgba(48, 243, 188, 0.1) !important;
        }

        .ant-select-arrow {
          color: var(--text-muted) !important;
        }

        .ant-select-selection-placeholder {
          color: var(--text-muted) !important;
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

const SettlementTransactionsPage: React.FC = () => {
  const { styles } = useStyle();
  const { role } = useRole();
  const settlementColumns = getSettlementColumns(isAdmin(role || ''));

  const [generatingPdf, setGeneratingPdf] = useState<string | null>(null);
  const [stlModalData, setStlModalData] = useState<ISettlementData | null>(
    null,
  );

  const { showToast } = useToast();
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState<boolean>(true);
  const [checkingStatus, setCheckingStatus] = useState<string | null>(null);
  const [settlementTransList, setSettlementTransList] = useState<
    ISettlementData[]
  >([]);
  const [search, setSearch] = useState('');
  const [dateRange, setDateRange] = useState<[Dayjs, Dayjs]>([
    dayjs().startOf('day'),
    dayjs().endOf('day'),
  ]);
  const [totalItems, setTotalItems] = useState(0);
  const [selectedSettlementId, setSelectedSettlementId] = useState<
    string | null
  >(null);
  const [selectedMerchantId, setSelectedMerchantId] = useState<string>('');
  const [loadingDownload, setLoadingDownload] = useState(false);
  const limit = 50;

  const { mutateAsync: downloadReports } = useDownloadReportsSettlement();
  const merchantListQuery = getMerchantList();
  const { data: merchantList } = merchantListQuery || {};

  const startDate = dateRange[0]
    ? dateRange[0].startOf('day').toISOString()
    : '';
  const endDate = dateRange[1] ? dateRange[1].endOf('day').toISOString() : '';

  const debouncedSearch = useDebounce(search, 500);

  const query = getSettlementsTransactions({
    page,
    limit,
    search: debouncedSearch,
    startDate,
    endDate,
  });

  const channelPartnerQuery = useChannelPartnerSettlementsTransactions({
    page,
    limit: limit,
    search: debouncedSearch,
    startDate,
    endDate,
  });

  const { data: queryData } = query;
  const { data: channelPartnerData } = channelPartnerQuery;

  const [settlementData] = queryData ?? [null, null];
  const [channelPartnerSettlementData] = channelPartnerData ?? [null, null];

  useEffect(() => {
    setLoading(query.isLoading || channelPartnerQuery.isLoading);
  }, [query.isLoading, channelPartnerQuery.isLoading]);

  useEffect(() => {
    const settlementTransData = settlementData || channelPartnerSettlementData;
    if (settlementTransData) {
      const dataArray = settlementTransData?.data || [];
      setSettlementTransList(dataArray ? dataArray.data : []);
      const totalItems = settlementTransData?.pagination?.totalItems;
      setTotalItems(typeof totalItems === 'number' ? totalItems : 0);
    }
  }, [settlementData, channelPartnerSettlementData]);

  const { data: checkSettlementStatusData, refetch } = useCheckSettlementStatus(
    selectedSettlementId || '',
  );
  const { data: channelPartnerCheckSettlementStatusData } = isChannelPartner(
    role,
  )
    ? useChannelPartnerCheckSettlementStatus(selectedSettlementId || '')
    : { data: null };

  useEffect(() => {
    const statusData =
      checkSettlementStatusData || channelPartnerCheckSettlementStatusData;

    if (statusData) {
      const shouldRefetch =
        Array.isArray(statusData) &&
        statusData.length > 0 &&
        statusData[0]?.data;
      if (shouldRefetch) {
        if (queryData) {
          query.refetch();
        } else {
          channelPartnerQuery.refetch();
        }
      }
    }
  }, [
    checkSettlementStatusData,
    channelPartnerCheckSettlementStatusData,
    queryData,
  ]);

  const handleCheckSettlementStatus = (settlementId: string) => {
    if (!settlementId) {
      showToast('No settlement ID provided', 'error');
      return;
    }
    setCheckingStatus(settlementId);
    setSelectedSettlementId(settlementId);
    refetch()
      .then(() => {
        setCheckingStatus(null);
        showToast('Status checked successfully', 'success');
      })
      .catch((error: safeAny) => {
        showToast(
          `${error?.message || 'Error checking settlement status'}`,
          'error',
        );
        setCheckingStatus(null);
      });
  };

  const generatePDF = async (rowData: ISettlementData) => {
    setStlModalData(rowData);
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
      default: { bg: 'var(--primary)15', text: 'var(--secondary)', border: 'var(--primary)40' },
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

  const renderCell = React.useCallback(
    (item: ISettlementData, columnKey: React.Key) => {
      switch (columnKey) {
        case 'fullName':
          return item.user.fullName || '-';
        case 'createdAt':
          return item.createdAt
            ? getFormattedTime(new Date(item.createdAt))
            : '-';
        case 'transferMode':
          return item.transferMode || '-';
        case 'collectionAmount':
          return formatAmount(item.collectionAmount) || '-';
        case 'serviceCharge':
          return formatAmount(item.serviceCharge) || '-';
        case 'amount':
          return formatAmount(item.amountAfterDeduction) || '-';
        case 'utr':
          return item.utr || '-';
        case 'status':
          return (
            <div className="flex items-center gap-2">
              <Tag style={getTagStyle(item.status)} bordered={false}>
                {formatStatus(item.status) || '-'}
              </Tag>
              {item.status !== 'SUCCESS' && item.status !== 'FAILED' && (
                <Button
                  type="primary"
                  size="small"
                  icon={<SyncOutlined spin={checkingStatus === item.id} />}
                  loading={checkingStatus === item.id}
                  onClick={() => handleCheckSettlementStatus(item.id)}
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
          return item.transferId || '-';
        case 'remarks':
          return item.remarks || '-';
        case 'settledBy':
          return item.settledBy?.fullName || '-';
        case 'generate-pdf':
          return isAdmin(role || '') ? (
            <div
              onClick={() => generatePDF(item)}
              style={{
                cursor: generatingPdf === item.id ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '32px',
                height: '32px',
                background:
                  generatingPdf === item.id
                    ? 'var(--border)'
                    : 'linear-gradient(to right, var(--border), var(--primary))',
                borderRadius: '6px',
                transition: 'all 0.2s',
                opacity: generatingPdf === item.id ? 0.6 : 1,
              }}
            >
              <EyeOutlined style={{ color: 'var(--background)', fontSize: '16px' }} />
            </div>
          ) : null;
        default:
          return '-';
      }
    },
    [role, checkingStatus, generatingPdf],
  );

  const columns: TableColumnsType<ISettlementData> = settlementColumns.map(
    (col, index) => {
      const isFirstCol = index === 0;
      const isLastCol = index === settlementColumns.length - 1;
      const isActionCol = col.key === 'generate-pdf' || col.key === 'actions';

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
        render: (_: safeAny, record: ISettlementData) =>
          renderCell(record, col.key),
      };
    },
  );

  const handleDateRangeChange = (
    dates: null | [Dayjs | null, Dayjs | null],
  ) => {
    if (dates && dates[0] && dates[1]) {
      setDateRange([dates[0], dates[1]]);
      setPage(1);
    }
  };

  const handleReset = () => {
    setSearch('');
    setDateRange([dayjs().startOf('day'), dayjs().endOf('day')]);
    setSelectedMerchantId('');
    setPage(1);
  };

  const downloadDailyReports = async () => {
    setLoadingDownload(true);
    const startDate = dateRange[0]
      ? dateRange[0].startOf('day').toISOString()
      : '';
    const endDate = dateRange[1] ? dateRange[1].endOf('day').toISOString() : '';

    try {
      const [response, error] = await downloadReports({
        userId: selectedMerchantId || '',
        startDate,
        endDate,
        search: debouncedSearch,
        status: undefined,
        from: 0,
        count: 0,
      });

      if (error || !response) {
        showToast('Error downloading the file', 'error');
        return;
      }

      downloadBlob(xlsxBlob(response), `Settlement-Reports-${new Date().toISOString().split('T')[0]}.xlsx`);
      showToast('File downloaded successfully', 'success');
    } catch (err) {
      console.error('Download error:', err);
      showToast('Error downloading the file', 'error');
    } finally {
      setLoadingDownload(false);
    }
  };

  return (
    <>
      <SettlementModal
        rowData={stlModalData}
        isOpen={!!stlModalData}
        onClose={() => {
          setStlModalData(null);
        }}
      />

      <div className={`mx-4 px-6 py-4 mb-1 ${styles.customTable}`}>
        <div className="flex items-center gap-4">
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
            className="custom-date-picker"
          />
          {(isAdmin(role || '') || isChannelPartner(role || '')) && (
            <Select
              placeholder="Select Merchant"
              value={selectedMerchantId || undefined}
              onChange={(value) => setSelectedMerchantId(value)}
              allowClear
              className="custom-select"
              style={{
                width: 250,
              }}
              options={
                merchantList?.[0]?.data?.map((merchant: IMerchantList) => ({
                  label: merchant.fullName,
                  value: merchant.id,
                })) || []
              }
            />
          )}
          <Input
            placeholder="Search by name"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            prefix={<SearchOutlined />}
            className="custom-search-input"
            style={{
              width: 250,
            }}
            allowClear
          />
          <Button
            type="primary"
            onClick={downloadDailyReports}
            disabled={loadingDownload}
            style={{
              background: 'linear-gradient(to right, #53BEC2, #00EF64)',
              border: 'none',
              color: '#0C0C0C',
              fontWeight: 600,
            }}
          >
            {loadingDownload ? 'Downloading...' : 'Download Reports'}
          </Button>
          <Button
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
        </div>
      </div>

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
                dataSource={settlementTransList}
                rowKey="id"
                pagination={false}
                scroll={{ x: 'max-content', y: 'calc(100vh - 350px)' }}
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
    </>
  );
};

export default SettlementTransactionsPage;
