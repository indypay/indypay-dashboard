'use client';

import { useEffect, useCallback, useState } from 'react';
import { Table, Button, Spin, TableColumnsType } from 'antd';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { createStyles } from 'antd-style';

import { getItems } from '@/lib/hooks/use-invoice';
import { IItem } from '@/lib/interfaces/invoice.interface';
import { safeAny } from '@/lib/interfaces/global.interface';

const useStyle = createStyles(({ css }) => {
  return {
    customTable: css`
      .ant-table-wrapper {
        width: 100%;
        background: linear-gradient(to right, var(--border), var(--primary));
        borderradius: 12px;
        padding: 2px;
      }

      .ant-table-inner-wrapper {
        background: #ffffff;
        borderradius: 10px;
        padding: 14px;
      }

      .ant-table {
        background: #ffffff;
        borderradius: 8px;

        .ant-table-container {
          borderradius: 8px;

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
            borderradius: 4px;
          }

          &::-webkit-scrollbar-thumb {
            background: #40a17f;
            borderradius: 4px;

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
        borderradius: 8px;
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

interface ItemsTableProps {
  onEdit?: (item: IItem) => void;
  onDelete?: (item: IItem) => void;
}

const columnsConfig = [
  { key: 'id', label: 'ID' },
  { key: 'name', label: 'Name' },
  { key: 'description', label: 'Description' },
  { key: 'hsnCode', label: 'HSN/SAC Code' },
  { key: 'price', label: 'Price' },
  { key: 'actions', label: 'Actions' },
];

export const ItemsTable = ({ onEdit, onDelete }: ItemsTableProps) => {
  const { styles } = useStyle();
  const { data: itemsData, isLoading, refetch } = getItems();
  const [items, setItems] = useState<IItem[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(isLoading);
  }, [isLoading]);

  useEffect(() => {
    if (itemsData) {
      const responseData = Array.isArray(itemsData) ? itemsData[0] : itemsData;
      setItems(responseData?.data?.data || []);
    }
  }, [itemsData]);

  const formatCurrency = useCallback((amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
    }).format(amount);
  }, []);

  const renderCell = useCallback(
    (item: IItem, columnKey: React.Key) => {
      switch (columnKey) {
        case 'id':
          return item.id || '-';
        case 'name':
          return item.name || '-';
        case 'description':
          return item.description || '-';
        case 'hsnCode':
          return item.hsnCode ? (
            <div>
              <div style={{ color: 'var(--text)', fontWeight: 500 }}>
                {item.hsnCode}
              </div>
            </div>
          ) : (
            <span style={{ color: 'var(--text-muted)' }}>-</span>
          );
        case 'price':
          return formatCurrency(item.price || 0);
        case 'actions':
          return (
            <div className="flex gap-2">
              <Button
                type="text"
                icon={<EditOutlined />}
                onClick={() => onEdit?.(item)}
                style={{ color: 'var(--primary)' }}
              />
              <Button
                type="text"
                icon={<DeleteOutlined />}
                onClick={() => onDelete?.(item)}
                style={{ color: '#D51C44' }}
              />
            </div>
          );
        default:
          return '-';
      }
    },
    [formatCurrency, onEdit, onDelete],
  );

  const columns: TableColumnsType<IItem> = columnsConfig.map((col, index) => {
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
      width: isFirstCol ? 200 : isLastCol ? 150 : 200,
      ellipsis: { showTitle: true },
      render: (_: safeAny, record: IItem) => renderCell(record, col.key),
    };
  });

  return (
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
              dataSource={items}
              rowKey="id"
              pagination={false}
              scroll={{ x: 'max-content', y: 'calc(100vh - 400px)' }}
              locale={{
                emptyText: (
                  <div
                    className="text-center py-4 text-xl"
                    style={{ color: 'var(--text-muted)' }}
                  >
                    No Items Found
                  </div>
                ),
              }}
              size="middle"
            />
          </Spin>
        </div>
      </div>
    </div>
  );
};
