'use client';

import React, { useEffect, useState } from 'react';
import {
  useParams,
  useRouter,
  useSelectedLayoutSegments,
} from 'next/navigation';
import {
  Table,
  Pagination,
  Tag,
  Spin,
  DatePicker,
  Input,
  Select,
  Button,
} from 'antd';
import type { TableColumnsType } from 'antd';
import dayjs, { Dayjs } from 'dayjs';
import { EyeOutlined, SearchOutlined } from '@ant-design/icons';
import { useStyle } from '@/lib/hooks/use-style';
import { downloadBlob, xlsxBlob } from '@/lib/utils/file.utils';

const { RangePicker } = DatePicker;

import { safeAny } from '@/lib/interfaces/global.interface';
import {
  CollectionsApiResponse,
  CollectionsTransactionsData,
  MerchantCollectionsData,
} from '@/lib/interfaces/transactions.interface';
import {
  formatAmount,
  formatNumber,
  isAdmin,
  isMerchant,
  getFormattedTime,
  formatStatus,
  isChannelPartner,
  isOps,
  formatColorStatus,
} from '@/lib/utils/utils';
import { useToast } from '@/lib/components/Toast/ToastContext';
import {
  getAdminCollectionData,
  getChannelPartnerCollectionData,
  getMerchantCollectionData,
} from '@/lib/hooks/use-collections';
import {
  AdminCollectionsColumns,
  CollectionsMerchantColumns,
} from '@/lib/constants/collections/collections.constants';
import '../../../global.scss';
import MerchantTransactionDetails from '@/lib/components/transactionDetails/page';
import useDebounce from '@/lib/hooks/use-debounce';
import { useRole } from '@/lib/components/Role/RoleContext';
import { useDownloadReports } from '@/lib/hooks/use-downloadReports';
import { STATUS_OPTIONS } from '@/lib/constants/payoutConstants/payout.constants';
import { getMerchantList } from '@/lib/hooks/merchant-list';
import { IMerchantList } from '@/lib/interfaces/merchant-list.interface';

const RecentTransactions = () => {
  const { showToast } = useToast();
  const router = useRouter();
  const { role } = useRole();

  const [adminCollectionsData, setAdminCollectionsData] = useState<safeAny[]>(
    [],
  );
  const [merchantCollectionsData, setMerchantCollectionsData] = useState<
    safeAny[]
  >([]);
  const [channelPartnerCollectionsData, setChannelPartnerCollectionsData] =
    useState<safeAny[]>([]);
  const [dateRange, setDateRange] = useState<[Dayjs, Dayjs]>([
    dayjs().startOf('day'),
    dayjs().endOf('day'),
  ]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [totalRecords, setTotalRecords] = useState(0);
  const [openTrnDetails, setOpenTrnDetails] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState<string | null>(null);
  const [loadingDownload, setLoadingDownload] = useState<boolean>(false);
  const [countNumber, setCountNumber] = useState<string>('');
  const [startingNumber, setStartingNumber] = useState<string>('');
  const [selectedMerchantId, setSelectedMerchantId] = useState<string>('');

  const rowsPerPage = 50;
  const merchantListQuery = getMerchantList();
  const { data: merchantList } = merchantListQuery || {};
  const debouncedSearch = useDebounce(search, 500);
  const { styles } = useStyle();

  const startDate = dateRange[0]
    ? dateRange[0].startOf('day').toISOString()
    : '';
  const endDate = dateRange[1] ? dateRange[1].endOf('day').toISOString() : '';

  const query =
    isAdmin(role) || isOps(role)
      ? getAdminCollectionData({
          page,
          limit: rowsPerPage,
          search: debouncedSearch,
          startDate,
          endDate,
        })
      : isChannelPartner(role)
        ? getChannelPartnerCollectionData({
            page,
            limit: rowsPerPage,
            search: debouncedSearch,
            startDate,
            endDate,
          })
        : getMerchantCollectionData({
            page,
            limit: rowsPerPage,
            search: debouncedSearch,
            startDate,
            endDate,
          });

  const { data } = query;

  const { mutateAsync: downloadReports } = useDownloadReports();

  const downloadDailyReports = async () => {
    setLoadingDownload(true);
    try {
      const [response, error] = await downloadReports({
        userId: selectedMerchantId || '',
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
    if (data && data[0]) {
      if (isAdmin(role) || isOps(role)) {
        const collectionsData = Array.isArray(data) ? data[0] : data;
        const dataArray = (collectionsData as safeAny).data?.data || [];
        setAdminCollectionsData(Array.isArray(dataArray) ? dataArray : []);
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
            (collection): collection is CollectionsApiResponse =>
              collection !== null &&
              typeof collection === 'object' &&
              'id' in collection,
          );
        setMerchantCollectionsData(validCollections);
      } else if (isChannelPartner(role)) {
        const channelPartnerCollectionsData = Array.isArray(data)
          ? data[0]
          : data;
        const dataArray =
          (channelPartnerCollectionsData as safeAny).data?.data || [];
        setChannelPartnerCollectionsData(
          Array.isArray(dataArray) ? dataArray : [],
        );
        const totalItems = (channelPartnerCollectionsData as safeAny).data
          ?.pagination?.totalItems;
        setTotalRecords(typeof totalItems === 'number' ? totalItems : 0);
      }
      setLoading(false);
    }
  }, [data]);

  const handleAdminViewDetails = (userId: string) => {
    router.push(`/transactions/${userId}`);
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

  const renderCell = React.useCallback(
    (
      item: CollectionsTransactionsData | MerchantCollectionsData,
      columnKey: React.Key,
    ) => {
      if (isAdmin(role) || isChannelPartner(role) || isOps(role)) {
        const adminItem = item as CollectionsTransactionsData;
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
        const merchantItem = item as MerchantCollectionsData;
        switch (columnKey) {
          case 'createdAt':
            return getFormattedTime(new Date(merchantItem.createdAt)) || '-';
          case 'utr':
            return merchantItem.utr || '-';
          case 'orderId':
            return merchantItem.orderId || '-';
          case 'amount':
            return formatAmount(merchantItem.amount) || '-';
          case 'netPayableAmount':
            return formatAmount(merchantItem.netPayableAmount) || '-';
          case 'status':
            return (
              <Tag style={getTagStyle(merchantItem.status)} bordered={false}>
                {formatStatus(merchantItem.status) || '-'}
              </Tag>
            );
          case 'txnRefId':
            return merchantItem.txnRefId || '-';
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
    [adminCollectionsData, merchantCollectionsData, role],
  );

  useEffect(() => {
    setLoading(true);
    query.refetch().finally(() => {
      setLoading(false);
    });
  }, [page, dateRange, debouncedSearch]);

  const columns: TableColumnsType<safeAny> =
    isAdmin(role) || isOps(role) || isChannelPartner(role)
      ? AdminCollectionsColumns.map((col, index) => {
          const isFirstCol = index === 0;
          const isLastCol = index === AdminCollectionsColumns.length - 1;
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
      : CollectionsMerchantColumns.map((col, index) => {
          const isFirstCol = index === 0;
          const isLastCol = index === CollectionsMerchantColumns.length - 1;
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
    isAdmin(role) || isOps(role)
      ? (adminCollectionsData as CollectionsTransactionsData[])
      : isChannelPartner(role)
        ? (channelPartnerCollectionsData as CollectionsTransactionsData[])
        : (merchantCollectionsData as safeAny[]);

  const handleDateRangeChange = (
    dates: null | [Dayjs | null, Dayjs | null],
  ) => {
    if (dates && dates[0] && dates[1]) {
      setDateRange([dates[0], dates[1]]);
    }
  };

  return (
    <>
      <div className={`mx-4 px-6 py-4 mb-1 ${styles.customTable}`}>
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
            <div className="flex items-center justify-between gap-4 flex-wrap">
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

              <div className="flex items-center gap-4">
                <Input.Search
                  placeholder="Search by name"
                  prefix={<SearchOutlined style={{ color: 'var(--text-muted)' }} />}
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  onSearch={() => setPage(1)}
                  allowClear
                  className="custom-search-input"
                  style={{
                    width: 300,
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

                  {isMerchant(role) && (<Button
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
                </Button>)}
              </div>
            </div>
          </div>
        </div>
      </div>

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
            <Spin spinning={loading} size="large" tip="Loading">
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

      {openTrnDetails && selectedUserId && isMerchant(role) && (
        <MerchantTransactionDetails
          userId={selectedUserId}
          onClose={() => setOpenTrnDetails(false)}
        />
      )}
    </>
  );
};

export default RecentTransactions;
