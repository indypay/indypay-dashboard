'use client';

import React, { useEffect, useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import {
  Table,
  Button,
  Pagination,
  Spin,
  DatePicker,
  Input,
  Select,
  Tag,
  TableColumnsType,
} from 'antd';
import { SearchOutlined, SyncOutlined, EyeOutlined } from '@ant-design/icons';
import { createStyles } from 'antd-style';
import dayjs, { Dayjs } from 'dayjs';
import { downloadBlob, xlsxBlob } from '@/lib/utils/file.utils';
import { safeAny } from '@/lib/interfaces/global.interface';
import {
  PayoutTransactionsData,
  MerchantPayoutCollectionsData,
  PayoutApiResponse,
} from '@/lib/interfaces/payout.interface';

import {
  formatAmount,
  formatNumber,
  isAdmin,
  isMerchant,
  getFormattedTime,
  formatStatus,
  isChannelPartner,
  formatColorStatus,
} from '@/lib/utils/utils';
import { useToast } from '@/lib/components/Toast/ToastContext';
import '../../../../global.scss';
import useDebounce from '@/lib/hooks/use-debounce';
import {
  getAdminPayoutData,
  getMerchantPayoutData,
} from '@/lib/hooks/use-payout';
import { callPayoutStatusApi } from '@/lib/services/payout-service';
import PayoutMerchantDetails from '@/lib/components/PayoutMerchantDetails/PayoutDetails';
import {
  AdminPayoutColumns,
  PayoutMerchantColumns,
} from '@/lib/constants/payoutConstants/payout.constants';
import InstantPayout from '../InstantPayout';
import BulkPayout from '../BulkPayout';
import { todayEndDate, todayStartDate } from '@/lib/utils/date.utils';
import { useRole } from '@/lib/components/Role/RoleContext';
import { useDownloadReportsPayout } from '@/lib/hooks/use-downloadReports';
import { STATUS_OPTIONS } from '@/lib/constants/payoutConstants/payout.constants';
import { getMerchantList } from '@/lib/hooks/merchant-list';
import { IMerchantList } from '@/lib/interfaces/merchant-list.interface';

const { RangePicker } = DatePicker;

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
        background: #ffffff !important;

        .ant-pagination-item,
        .ant-pagination-item-link,
        .ant-pagination-total-text,
        .ant-pagination-jump-prev,
        .ant-pagination-jump-next,
        .ant-pagination-options-quick-jumper input {
          color: var(--text) !important;
        }

        .ant-pagination-options-quick-jumper input {
          background: #ffffff !important;
          border-color: #4e4e4e !important;

          &:hover {
            background: #ffffff !important;
            border-color: #30f3bc !important;
          }

          &:focus {
            background: #ffffff !important;
            border-color: #30f3bc !important;
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

        .ant-pagination-item-ellipsis {
          color: var(--text) !important;
        }

        .ant-pagination-disabled {
          .ant-pagination-item-link {
            color: #4e4e4e !important;
            background: #ffffff !important;
            border-color: #4e4e4e !important;
          }
        }

        .ant-pagination-prev,
        .ant-pagination-next {
          .ant-pagination-item-link {
            background: #ffffff !important;
            border-color: #4e4e4e !important;
            color: var(--text) !important;

            &:hover {
              border-color: #30f3bc !important;
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
  };
});

const PayoutTransactions = () => {
  const { styles } = useStyle();
  const { showToast } = useToast();
  const router = useRouter();
  const { role } = useRole();

  const [adminPayoutData, setAdminPayoutData] = useState<safeAny[]>([]);
  const [merchantPayoutData, setMerchantPayoutData] = useState<safeAny[]>([]);
  const [dateRange, setDateRange] = useState<[Dayjs, Dayjs]>([
    dayjs(todayStartDate()),
    dayjs(todayEndDate()),
  ]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [totalRecords, setTotalRecords] = useState(0);
  const [status, setStatus] = useState('');
  const rowsPerPage = 50;

  const { mutateAsync: downloadReports } = useDownloadReportsPayout();

  const [openTrnDetails, setOpenTrnDetails] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [loadingDownload, setLoadingDownload] = useState(false);
  const [search, setSearch] = useState('');
  const [openInstantPayout, setOpenInstantPayout] = useState<boolean>(false);
  const [openBulkPayout, setOpenBulkPayout] = useState<boolean>(false);
  const [checkingStatusId, setCheckingStatusId] = useState<string | null>(null);
  const [countNumber, setCountNumber] = useState<number>();
  const [startingNumber, setStartingNumber] = useState<number>(0);
  const [selectedMerchantId, setSelectedMerchantId] = useState<string>('');

  const debouncedSearch = useDebounce(search, 500);
  const merchantListQuery = getMerchantList();
  const { data: merchantList } = merchantListQuery || {};

  const query =
    isAdmin(role) || isChannelPartner(role)
      ? getAdminPayoutData({
          page,
          limit: rowsPerPage,
          search: debouncedSearch,
          startDate: dateRange[0]
            ? dateRange[0].startOf('day').toISOString()
            : '',
          endDate: dateRange[1] ? dateRange[1].endOf('day').toISOString() : '',
        })
      : getMerchantPayoutData({
          page,
          limit: rowsPerPage,
          search: debouncedSearch,
          startDate: dateRange[0]
            ? dateRange[0].startOf('day').toISOString()
            : '',
          endDate: dateRange[1] ? dateRange[1].endOf('day').toISOString() : '',
        });

  const { data } = query;

  useEffect(() => {
    setLoading(query.isLoading);
  }, [query.isLoading]);

  useEffect(() => {
    if (data && data[0]) {
      if (isAdmin(role) || isChannelPartner(role)) {
        const collectionsData = Array.isArray(data) ? data[0] : data;
        const dataArray = (collectionsData as safeAny).data?.data || [];
        setAdminPayoutData(Array.isArray(dataArray) ? dataArray : []);
        const totalItems = (collectionsData as safeAny).data?.pagination
          ?.totalItems;
        setTotalRecords(typeof totalItems === 'number' ? totalItems : 0);
      } else if (isMerchant(role)) {
        const responseData = Array.isArray(data) ? data : [data];
        if (responseData?.[0]) {
          const totalItems = (responseData[0] as safeAny)?.data?.pagination
            ?.totalItems;
          if (totalItems !== undefined) {
            setTotalRecords(totalItems);
          }
        }
        const validCollections = data
          .filter((item): item is NonNullable<typeof item> => item !== null)
          .flatMap((item) => item.data?.data || [])
          .filter(
            (collection): collection is PayoutApiResponse =>
              collection !== null &&
              typeof collection === 'object' &&
              'id' in collection,
          );
        setMerchantPayoutData(validCollections);
      }
    }
  }, [data, role]);

  const handleAdminViewDetails = (userId: string) => {
    router.push(`/payout/${userId}`);
  };

  const handleMerchantViewDetails = (userId: string) => {
    setOpenTrnDetails(true);
    setSelectedUserId(userId);
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

  const renderCell = React.useCallback(
    (
      item: PayoutTransactionsData | MerchantPayoutCollectionsData,
      columnKey: React.Key,
    ) => {
      if (isAdmin(role) || isChannelPartner(role)) {
        const adminItem = item as PayoutTransactionsData;
        switch (columnKey) {
          case 'fullName':
            return adminItem.fullName || '-';
          case 'initiatedTotalAmount':
            return formatAmount(adminItem.initiatedTotalAmount) || '-';
          case 'successTotalAmount':
            return formatAmount(adminItem.successTotalAmount) || '-';
          case 'failedTotalAmount':
            return formatAmount(adminItem.failedTotalAmount) || '-';
          case 'pendingTotalAmount':
            return formatAmount(adminItem.pendingTotalAmount) || '-';
          case 'initiatedCommissionAmount':
            return formatAmount(adminItem.initiatedCommissionAmount) || '-';
          case 'successCommissionAmount':
            return formatAmount(adminItem.successCommissionAmount) || '-';
          case 'failedCommissionAmount':
            return formatAmount(adminItem.failedCommissionAmount) || '-';
          case 'pendingCommissionAmount':
            return formatAmount(adminItem.pendingCommissionAmount) || '-';
          case 'initiatedGstAmount':
            return formatAmount(adminItem.initiatedGstAmount) || '-';
          case 'successGstAmount':
            return formatAmount(adminItem.successGstAmount) || '-';
          case 'failedGstAmount':
            return formatAmount(adminItem.failedGstAmount) || '-';
          case 'pendingGstAmount':
            return formatAmount(adminItem.pendingGstAmount) || '-';
          case 'initiatedNetPayableAmount':
            return formatAmount(adminItem.initiatedNetPayableAmount) || '-';
          case 'successNetPayableAmount':
            return formatAmount(adminItem.successNetPayableAmount) || '-';
          case 'failedNetPayableAmount':
            return formatAmount(adminItem.failedNetPayableAmount) || '-';
          case 'pendingNetPayableAmount':
            return formatAmount(adminItem.pendingNetPayableAmount) || '-';
          case 'initiatedTotalCount':
            return formatNumber(adminItem.initiatedTotalCount) || '-';
          case 'successCount':
            return formatNumber(adminItem.successCount) || '-';
          case 'failedCount':
            return formatNumber(adminItem.failedCount) || '-';
          case 'pendingCount':
            return formatNumber(adminItem.pendingCount) || '-';
          case 'view-details':
            return (
              <div
                onClick={() => handleAdminViewDetails(adminItem.id)}
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
      } else if (isMerchant(role)) {
        const merchantItem = item as MerchantPayoutCollectionsData;
        switch (columnKey) {
          case 'createdAt':
            return getFormattedTime(new Date(merchantItem.createdAt)) || '-';
          case 'orderId':
            return merchantItem.orderId || '-';
          case 'payoutId':
            return merchantItem.payoutId || '-';
          case 'amountBeforeDeduction':
            return formatAmount(merchantItem.amountBeforeDeduction || '-');
          case 'charges':
            return (
              formatAmount(
                +merchantItem.amountBeforeDeduction - +merchantItem.amount,
              ) || '-'
            );
          case 'amount':
            return formatAmount(merchantItem.amount) || '-';
          case 'utr':
            return merchantItem.utr || '-';
          case 'transferId':
            return merchantItem.transferId || '-';
          case 'status':
            return (
              <div className="flex items-center gap-2">
                <Tag style={getTagStyle(merchantItem.status)} bordered={false}>
                  {formatStatus(merchantItem.status) || '-'}
                </Tag>
                {merchantItem.status !== 'SUCCESS' && (
                  <Button
                    type="primary"
                    size="small"
                    icon={
                      <SyncOutlined
                        spin={checkingStatusId === merchantItem.id}
                      />
                    }
                    loading={checkingStatusId === merchantItem.id}
                    onClick={() => handleRefresh(merchantItem.id)}
                    style={{
                      background: 'linear-gradient(to right, var(--border), var(--primary))',
                      border: 'none',
                      color: 'var(--background)',
                    }}
                  />
                )}
              </div>
            );
          case 'view-details':
            return (
              <div
                onClick={() => handleMerchantViewDetails(merchantItem.id)}
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
      }
      return '-';
    },
    [adminPayoutData, merchantPayoutData, checkingStatusId, role],
  );

  const columns: TableColumnsType<safeAny> =
    isAdmin(role) || isChannelPartner(role)
      ? AdminPayoutColumns.map((col, index) => {
          const isFirstCol = index === 0;
          const isLastCol = index === AdminPayoutColumns.length - 1;
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
            render: (_: safeAny, record: safeAny) =>
              renderCell(record, col.key),
          };
        })
      : PayoutMerchantColumns.map((col, index) => {
          const isFirstCol = index === 0;
          const isLastCol = index === PayoutMerchantColumns.length - 1;
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
            width: isFirstCol ? 200 : isLastCol ? 180 : 200,
            ellipsis: isActionCol ? false : { showTitle: true },
            render: (_: safeAny, record: safeAny) =>
              renderCell(record, col.key),
          };
        });

  const dataSource =
    isAdmin(role) || isChannelPartner(role)
      ? (adminPayoutData as PayoutTransactionsData[])
      : (merchantPayoutData as safeAny[]);

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
        status: status || null || undefined,
        from: +startingNumber,
        count: countNumber,
      });

      if (error || !response) {
        showToast('Error downloading the file', 'error');
        return;
      }

      downloadBlob(xlsxBlob(response), `Payout-Reports-${new Date().toISOString().split('T')[0]}.xlsx`);
      showToast('File downloaded successfully', 'success');
    } catch (err) {
      console.error('Download error:', err);
      showToast('Error downloading the file', 'error');
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

  const handleReset = () => {
    setSearch('');
    setStatus('');
    setStartingNumber(0);
    setCountNumber(undefined);
    setSelectedMerchantId('');
    setDateRange([dayjs(todayStartDate()), dayjs(todayEndDate())]);
    setPage(1);
  };

  return (
    <>
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
          {(isAdmin(role) || isChannelPartner(role)) && (
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
              backgroundColor: '#FFFFFF',
              borderColor: 'var(--border)',
              color: 'var(--text)',
              borderRadius: '8px',
              caretColor: 'var(--text)',
            }}
            allowClear
          />
          {isMerchant(role) && (
            <>
              <Select
                placeholder="Select status"
                value={status || undefined}
                onChange={(value) => setStatus(value)}
                className="custom-select"
                style={{ width: 200 }}
                allowClear
                options={STATUS_OPTIONS.map((option) => ({
                  label: option.label,
                  value: option.key,
                }))}
              />
              <Input
                placeholder="From"
                type="number"
                value={startingNumber}
                onChange={(e) => setStartingNumber(Number(e.target.value))}
                className="custom-input"
                style={{
                  width: 120,
                  borderRadius: '8px',
                  caretColor: 'var(--text)',
                }}
              />
              <Input
                placeholder="Count"
                type="number"
                value={countNumber}
                onChange={(e) => setCountNumber(Number(e.target.value))}
                className="custom-input"
                style={{
                  width: 120,
                  borderRadius: '8px',
                  caretColor: 'var(--text)',
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
            </>
          )}
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
          <Button
            type="primary"
            onClick={downloadDailyReports}
            disabled={loadingDownload}
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
                dataSource={dataSource}
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

      {openTrnDetails && selectedUserId && (
        <PayoutMerchantDetails
          payoutId={selectedUserId}
          onClose={() => setOpenTrnDetails(false)}
        />
      )}
      {openInstantPayout && (
        <InstantPayout
          onClose={() => setOpenInstantPayout(false)}
          refetch={async () => {
            await query.refetch();
          }}
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

export default PayoutTransactions;
