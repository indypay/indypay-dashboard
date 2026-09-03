'use client';
import {
  Pagination,
  Spinner,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from '@heroui/react';
import React, { useState } from 'react';
import { createStyles } from 'antd-style';
import { EyeOutlined } from '@ant-design/icons';

import { CustomButton } from '@/lib/components/ButtonComponent/CustomButton';
import { OperationsPendingColumns } from '@/lib/constants/operationsConstants/OperationsConstants';
import { CollectionDetailsTransData } from '@/lib/interfaces/transactions.interface';
import { getFormattedTime } from '@/lib/utils/utils';
import { formatAmount } from '@/lib/utils/utils';
import { formatStatus } from '@/lib/utils/utils';

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
      .custom-input {
        .ant-input,
        .ant-input-outlined {
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

          &::placeholder {
            color: var(--text-muted) !important;
          }
        }
      }

      /* Custom Select Styles */
      .custom-select {
        .ant-select-selector {
          background: #ffffff !important;
          border-color: #4e4e4e !important;
          color: var(--text) !important;

          &:hover {
            border-color: #30f3bc !important;
          }
        }

        &.ant-select-focused .ant-select-selector {
          border-color: #30f3bc !important;
          box-shadow: 0 0 0 2px rgba(48, 243, 188, 0.1) !important;
        }

        .ant-select-arrow {
          color: var(--text-muted) !important;
        }

        .ant-select-selection-placeholder {
          color: var(--text-muted) !important;
        }
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
  };
});

const PendingCollections = () => {
  const [page, setPage] = useState(1);
  const { styles } = useStyle();

  const renderCell = React.useCallback(
    (item: CollectionDetailsTransData, columnKey: React.Key) => {
      switch (columnKey) {
        case 'fullName':
          return item.user.fullName || '-';
        case 'createdAt':
          return item.createdAt
            ? getFormattedTime(new Date(item.createdAt))
            : '-';
        case 'orderId':
          return item.orderId || '-';
        case 'amount':
          return formatAmount(item.amount) || '-';
        case 'netPayableAmount':
          return formatAmount(item.netPayableAmount) || '-';
        case 'status':
          return formatStatus(item.status) || '-';
        // case "settlementStatus":
        //       return formatStatus(item.settlementStatus) || "-";
        case 'txnRefId':
          return item.txnRefId || '-';
        case 'view-details':
          return (
            <div
              // onClick={() => handleViewDetails(item.id)}
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
          return null;
      }
    },
    [],
  );

  // const pages = useMemo(() => {
  //   return Math.ceil(totalItems / limit);
  // }, [totalItems, limit]);

  // useEffect(() => {
  //   setLoading(true);
  //   merchantData.refetch().finally(() => {
  //     setLoading(false);
  //   });
  // }, [page]);

  return (
    <>
      <Table
        classNames={{
          wrapper: 'h-[calc(100vh-180px)] overflow-y-auto relative',
        }}
        isHeaderSticky
        aria-label="Collections-Table"
        bottomContent={
          <div
            className={`flex justify-center fixed bottom-[16px] left-1/2 -translate-x-1/2 ${styles.customTable}`}
          >
            <Pagination
              isCompact
              showControls
              showShadow
              page={1}
              initialPage={1}
              total={1}
              onChange={(currPage) => setPage(currPage)}
              classNames={{
                wrapper:
                  'bg-white dark:bg-default-200/60 rounded-xl !w-[400px] !h-[40px] custom-pagination',
              }}
              color="warning"
            />
          </div>
        }
        className="mx-4 my-4 w-auto"
      >
        <TableHeader columns={OperationsPendingColumns}>
          {(column) => (
            <TableColumn
              key={column.key}
              align={column.key === 'actions' ? 'center' : 'start'}
            >
              {column.label}
            </TableColumn>
          )}
        </TableHeader>
        <TableBody items={[]} loadingContent={<Spinner />}>
          {/* {item => (
              <TableRow key={item.id}>
                {columnKey => (
                  <TableCell className="whitespace-nowrap">
                    {renderCell(item, columnKey)}
                  </TableCell>
                )}
              </TableRow>
            )} */}
          <TableRow>
            <TableCell>Rahul</TableCell>
            <TableCell>1000</TableCell>
            <TableCell>100</TableCell>
            <TableCell>900</TableCell>
            <TableCell>100</TableCell>
            <TableCell>Pending</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </>
  );
};

export default PendingCollections;
