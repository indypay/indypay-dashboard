'use client';

import React, { useEffect, useState } from 'react';
import {
  Table,
  Button,
  Pagination,
  Spin,
  Input,
  Card,
  Row,
  Col,
  Statistic,
  TableColumnsType,
} from 'antd';
import dayjs, { Dayjs } from 'dayjs';
import { createStyles } from 'antd-style';
import { SearchOutlined } from '@ant-design/icons';

import SettlementAmount from '@/lib/components/SettlementAmount/SettlementAmount';
import { OperationsUnsettledColumns } from '@/lib/constants/operationsConstants/OperationsConstants';
import useDebounce from '@/lib/hooks/use-debounce';
import {
  getOperationsStats,
  getUnsettledCollections,
} from '@/lib/hooks/use-operations';
import { safeAny } from '@/lib/interfaces/global.interface';
import {
  ISettlementDetails,
  ISettlementResponse,
} from '@/lib/interfaces/settlement.interface';
import { formatAmount } from '@/lib/utils/utils';
import { UseQueryResult } from '@tanstack/react-query';

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
              border-color: #30f3bc !important;
            }
          }
        }
      }
    `,
    statsCard: css`
      background: #ffffff;
      border: 1px solid #4e4e4e;
      border-radius: 12px;
      position: relative;

      &::before {
        content: '';
        position: absolute;
        inset: -1px;
        border-radius: 12px;
        padding: 1px;
        background: linear-gradient(to right, var(--border), var(--primary));
        -webkit-mask:
          linear-gradient(#fff 0 0) content-box,
          linear-gradient(#fff 0 0);
        -webkit-mask-composite: xor;
        mask-composite: exclude;
        pointer-events: none;
      }

      .ant-card-body {
        padding: 24px;
      }

      .ant-statistic-title {
        color: var(--text-muted);
        font-size: 14px;
        margin-bottom: 8px;
      }

      .ant-statistic-content {
        font-size: 24px;
        font-weight: 600;
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

const UnsettledCollections = () => {
  const { styles } = useStyle();
  const [page, setPage] = useState(1);
  const [openBankDetails, setOpenBankDetails] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [unsettledCollectionsList, setUnsettledCollectionsList] = useState<
    ISettlementDetails[]
  >([]);
  const [search, setSearch] = useState('');
  const [totalItems, setTotalItems] = useState<number>(0);
  const limit = 50;

  const debouncedSearch = useDebounce(search, 500);

  const { data: operationsStats } = getOperationsStats();
  const query = getUnsettledCollections(
    page,
    limit,
    debouncedSearch,
  ) as unknown as UseQueryResult<ISettlementResponse | null, Error>;
  const { data } = query;
  const { todayTotalUnSettled, todayTotalSettlements, todayTotalCollections } =
    operationsStats?.[0]?.data || {};

  useEffect(() => {
    setLoading(query.isLoading);
  }, [query.isLoading]);

  useEffect(() => {
    if (data) {
      const settlementTransData = Array.isArray(data)
        ? data[0]?.data
        : data?.data;
      const dataArray = settlementTransData?.data || [];
      setUnsettledCollectionsList(Array.isArray(dataArray) ? dataArray : []);

      const totalItems = settlementTransData?.pagination?.totalItems;
      setTotalItems(typeof totalItems === 'number' ? totalItems : 0);
    }
  }, [data]);

  const renderCell = React.useCallback(
    (item: ISettlementDetails, columnKey: React.Key) => {
      switch (columnKey) {
        case 'name':
          return item.name || '-';
        case 'totalCollections':
          return formatAmount(item.totalCollections) || '-';
        case 'serviceChange':
          return formatAmount(item.serviceChange) || '-';
        case 'collectionAfterDeduction':
          return formatAmount(item.collectionAfterDeduction) || '-';
        case 'settle':
          return (
            <Button
              size="middle"
              type="primary"
              style={{
                background: 'linear-gradient(to right, var(--border), var(--primary))',
                border: 'none',
                color: 'var(--background)',
                fontWeight: 600,
              }}
              onClick={() => {
                setSelectedUserId(item.id);
                setOpenBankDetails(true);
              }}
            >
              Settle
            </Button>
          );
        default:
          return '-';
      }
    },
    [],
  );

  const columns: TableColumnsType<ISettlementDetails> =
    OperationsUnsettledColumns.map((col, index) => {
      const isFirstCol = index === 0;
      const isLastCol = index === OperationsUnsettledColumns.length - 1;
      const isActionCol = col.key === 'settle';

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
        render: (_: safeAny, record: ISettlementDetails) =>
          renderCell(record, col.key),
      };
    });

  const handleReset = () => {
    setSearch('');
    setPage(1);
  };

  return (
    <>
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
                    title="Total Collections"
                    value={formatAmount(todayTotalCollections ?? 0)}
                    valueStyle={{ color: '#F5A524' }}
                  />
                </Card>
              </Col>
              <Col span={8}>
                <Card className={styles.statsCard}>
                  <Statistic
                    title="Total Settlements"
                    value={formatAmount(todayTotalSettlements ?? 0)}
                    valueStyle={{ color: '#0DD25F' }}
                  />
                </Card>
              </Col>
              <Col span={8}>
                <Card className={styles.statsCard}>
                  <Statistic
                    title="Total Unsettled"
                    value={formatAmount(todayTotalUnSettled ?? 0)}
                    valueStyle={{ color: 'var(--secondary)' }}
                  />
                </Card>
              </Col>
            </Row>
          </div>
        </div>
      </div>

      <div className="mx-4 px-6 py-4 mb-1">
        <div className="flex items-center gap-4">
          <Input
            placeholder="Search by name"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            prefix={<SearchOutlined />}
            style={{
              width: 400,
              backgroundColor: '#FFFFFF',
              borderColor: 'var(--border)',
              color: 'var(--text)',
            }}
            allowClear
          />
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
                dataSource={unsettledCollectionsList}
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

      {openBankDetails && selectedUserId && (
        <SettlementAmount
          userId={selectedUserId}
          onClose={() => setOpenBankDetails(false)}
        />
      )}
    </>
  );
};

export default UnsettledCollections;
