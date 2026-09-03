'use client';

import React, { useEffect, useState } from 'react';
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
  TableColumnsType,
} from 'antd';
import { SearchOutlined, EyeOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import dayjs, { Dayjs } from 'dayjs';
import { createStyles } from 'antd-style';
import { UseQueryResult } from '@tanstack/react-query';

import {
  getWalletDetailsById,
  getMerchantWalletDetails,
} from '@/lib/hooks/use-payout-wallet';
import {
  TopupRecord,
  WalletDetailsData,
} from '@/lib/interfaces/payout-wallet.interface';
import {
  formatAmount,
  getFormattedTime,
  isAdmin,
  isChannelPartner,
  isMerchant,
} from '@/lib/utils/utils';
import { safeAny } from '@/lib/interfaces/global.interface';
import useDebounce from '@/lib/hooks/use-debounce';
import { useRole } from '@/lib/components/Role/RoleContext';
import { MerchantWalletColumns } from '@/lib/constants/payout-wallet/payout-wallet.constants';
import WalletRecharge from '@/lib/components/WalletRecharge/WalletRecharge';

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

const MerchantWalletTransactions: React.FC = () => {
  const router = useRouter();
  const { styles } = useStyle();
  const { role } = useRole();
  const { id: userId } = useParams<{ id: string }>() || { id: null };

  const [page, setPage] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(true);
  const [merchantWalletList, setMerchantWalletList] = useState<TopupRecord[]>(
    [],
  );
  const [merchantTransList, setMerchantTransList] = useState<TopupRecord[]>([]);
  const [totalItems, setTotalItems] = useState<number>(0);
  const [selectedUserId, setSelectedUserId] = useState<string>('');
  const [isRefund, setIsRefund] = useState<boolean>(false);
  const [dateRange, setDateRange] = useState<[Dayjs, Dayjs]>([
    dayjs().startOf('day'),
    dayjs().endOf('day'),
  ]);
  const [stats, setStats] = useState({
    availablePayoutBalance: 0,
    totalTopup: 0,
  });
  const [search, setSearch] = useState('');

  const debouncedSearch = useDebounce(search, 500);
  const limit = 50;

  const startDate = dateRange[0]
    ? dateRange[0].startOf('day').toISOString()
    : '';
  const endDate = dateRange[1] ? dateRange[1].endOf('day').toISOString() : '';

  const merchantData = getWalletDetailsById(
    userId,
    page,
    limit,
    debouncedSearch,
    startDate,
    endDate,
  ) as unknown as UseQueryResult<WalletDetailsData | null, Error>;

  const merchantTransData = getMerchantWalletDetails(
    page,
    limit,
    debouncedSearch,
    startDate,
    endDate,
  ) as unknown as UseQueryResult<WalletDetailsData | null, Error>;

  useEffect(() => {
    setLoading(true);
    if (isAdmin(role) || isChannelPartner(role)) {
      if (Array.isArray(merchantData?.data) && merchantData?.data.length > 0) {
        setMerchantWalletList(merchantData?.data[0]?.data?.data || []);
        setTotalItems(merchantData?.data[0]?.data?.pagination?.totalItems || 0);

        const apiStats = merchantData?.data[0]?.data?.stats;
        setStats({
          availablePayoutBalance: Number(apiStats?.availablePayoutBalance || 0),
          totalTopup: Number(apiStats?.totalTopup || 0),
        });
      } else {
        setMerchantWalletList([]);
      }
    } else if (isMerchant(role)) {
      if (
        Array.isArray(merchantTransData?.data) &&
        merchantTransData?.data.length > 0
      ) {
        setMerchantTransList(merchantTransData?.data[0]?.data?.data || []);
        setTotalItems(
          merchantTransData?.data[0]?.data?.pagination?.totalItems || 0,
        );
        const apiStats = merchantTransData?.data[0]?.data?.stats;
        setStats({
          availablePayoutBalance: Number(apiStats?.availablePayoutBalance || 0),
          totalTopup: Number(apiStats?.totalTopup || 0),
        });
      } else {
        setMerchantTransList([]);
      }
    }
    setLoading(false);
  }, [role, merchantData.data, merchantTransData.data]);

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
  };

  const handleRefundWallet = (userId: string) => {
    setSelectedUserId(userId);
    setIsRefund(true);
  };

  const handleReset = () => {
    setSearch('');
    setDateRange([dayjs().startOf('day'), dayjs().endOf('day')]);
    setPage(1);
  };

  const renderCell = (record: TopupRecord, columnKey: string) => {
    switch (columnKey) {
      case 'fullName':
        return record.user?.fullName || '-';
      case 'email':
        return record.user?.email || '-';
      case 'mobile':
        return record.user?.mobile || '-';
      case 'collectionAmount':
        return formatAmount(record.collectionAmount) || '-';
      case 'payinCharges':
        return formatAmount(record.payInCharge) || '-';
      case 'payoutCharges':
        return formatAmount(record.payOutCharge) || '-';
      case 'topUpAmount':
        return formatAmount(record.topUpAmount) || '-';
      case 'topupBy':
        return record.topupBy?.fullName || '-';
      case 'createdAt':
        return record.createdAt
          ? getFormattedTime(new Date(record.createdAt))
          : '-';
      default:
        return '-';
    }
  };

  const columns: TableColumnsType<TopupRecord> = MerchantWalletColumns.map(
    (col, index) => {
      const isFirstCol = index === 0;
      const isLastCol = index === MerchantWalletColumns.length - 1;
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
        render: (_: safeAny, record: TopupRecord) =>
          renderCell(record, col.key),
      };
    },
  );

  const dataSource =
    isAdmin(role) || isChannelPartner(role)
      ? merchantWalletList
      : merchantTransList;

  useEffect(() => {
    const isLoadingData = merchantData.isLoading || merchantTransData.isLoading;
    setLoading(isLoadingData);
  }, [merchantData.isLoading, merchantTransData.isLoading]);

  if (role && !isAdmin(role) && !isChannelPartner(role)) {
    router.replace('/access-denied');
  }

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
              <Col span={12}>
                <Card className={styles.statsCard}>
                  <Statistic
                    title="Available Balance"
                    value={formatAmount(stats.availablePayoutBalance)}
                    valueStyle={{ color: '#0DD25F' }}
                  />
                </Card>
              </Col>
              <Col span={12}>
                <Card className={styles.statsCard}>
                  <Statistic
                    title="Today's TopUp"
                    value={formatAmount(stats.totalTopup)}
                    valueStyle={{ color: 'var(--secondary)' }}
                  />
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

                {isAdmin(role) && (
                  <>
                    <Button
                      type="primary"
                      onClick={() => handleViewDetails(userId)}
                      style={{
                        background:
                          'linear-gradient(to right, var(--border), var(--primary))',
                        border: 'none',
                        color: 'var(--background)',
                        fontWeight: 600,
                      }}
                    >
                      Top Up
                    </Button>

                    <Button
                      type="primary"
                      onClick={() => handleRefundWallet(userId)}
                      style={{
                        background:
                          'linear-gradient(to right, var(--border), var(--primary))',
                        border: 'none',
                        color: 'var(--background)',
                        fontWeight: 600,
                      }}
                    >
                      Refund
                    </Button>
                  </>
                )}
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

      <WalletRecharge
        isOpen={!!selectedUserId}
        onClose={() => {
          setSelectedUserId('');
          setIsRefund(false);
        }}
        userId={selectedUserId}
        onSuccess={() => {
          if (isMerchant(role)) {
            merchantTransData.refetch();
          } else {
            merchantData.refetch();
          }
        }}
        isRefund={isRefund}
      />
    </>
  );
};

export default MerchantWalletTransactions;
