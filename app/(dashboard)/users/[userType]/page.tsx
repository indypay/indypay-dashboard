'use client';

import React, { useEffect, useState, useMemo } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
  Table,
  Pagination,
  Spin,
  Button,
  Input,
  Tag,
  TableColumnsType,
} from 'antd';
import { SearchOutlined, EyeOutlined } from '@ant-design/icons';
import { createStyles } from 'antd-style';

import useDebounce from '@/lib/hooks/use-debounce';
import { getAdminUserList } from '@/lib/hooks/merchant-list';
import {
  formatAccountStatus,
  formatOnboardingStatus,
  getFormattedTime,
} from '@/lib/utils/utils';
import { safeAny } from '@/lib/interfaces/global.interface';
import { IAdminUser } from '@/lib/interfaces/users.interface';

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

const MerchantColumns = [
  { key: 'fullName', label: 'Full Name' },
  { key: 'email', label: 'Email' },
  { key: 'mobile', label: 'Mobile' },
  { key: 'accountStatus', label: 'Status' },
  { key: 'onboardingStatus', label: 'Onboarding Status' },
  { key: 'createdAt', label: 'Created At' },
  { key: 'view-details', label: 'Actions' },
];

const getStatusStyle = (status: string): React.CSSProperties => {
  const baseStyle = {
    borderRadius: '6px',
    padding: '4px 12px',
    fontWeight: 500,
    border: 'none',
  };

  if (status === 'Active') {
    return {
      ...baseStyle,
      backgroundColor: '#0DD25F15',
      color: '#0DD25F',
      border: '1px solid #0DD25F40',
    };
  } else {
    return {
      ...baseStyle,
      backgroundColor: '#D51C4415',
      color: '#D51C44',
      border: '1px solid #D51C4440',
    };
  }
};

const UserListPage = () => {
  const { styles } = useStyle();
  const { userType } = useParams();
  const router = useRouter();

  const [merchants, setMerchants] = useState<IAdminUser[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search, 500);

  const rowsPerPage = 50;

  const roleMap = {
    merchants: 'merchant',
    'channel-partners': 'cp',
    operations: 'ops',
  };

  const { data, refetch, isLoading } = getAdminUserList({
    search: debouncedSearch,
    page,
    limit: rowsPerPage,
    role: roleMap[userType as keyof typeof roleMap],
  });

  const pages = useMemo(() => {
    return Math.ceil(totalRecords / rowsPerPage);
  }, [totalRecords]);

  useEffect(() => {
    setLoading(isLoading);
  }, [isLoading]);

  useEffect(() => {
    if (data) {
      const responseData = Array.isArray(data) ? data[0] : data;
      setMerchants(responseData?.data?.data || []);
      setTotalRecords(responseData?.data?.pagination?.totalItems || 0);
    }
  }, [data]);

  useEffect(() => {
    refetch();
  }, [page, debouncedSearch, refetch]);

  const handleUserViewDetails = (id: string) => {
    router.push(`/users/${userType}/${id}`);
  };

  const renderCell = React.useCallback(
    (merchant: IAdminUser, columnKey: React.Key) => {
      switch (columnKey) {
        case 'fullName':
          return merchant.fullName || '-';
        case 'email':
          return merchant.email || '-';
        case 'mobile':
          return merchant.mobile || '-';
        case 'accountStatus':
          return (
            <Tag
              style={getStatusStyle(
                formatAccountStatus(merchant.accountStatus),
              )}
              bordered={false}
            >
              {formatAccountStatus(merchant.accountStatus) || '-'}
            </Tag>
          );
        case 'onboardingStatus':
          return (
            formatOnboardingStatus(merchant.onboardingStatus)?.label || '-'
          );
        case 'createdAt':
          return getFormattedTime(new Date(merchant.createdAt)) || '-';
        case 'view-details':
          return (
            <EyeOutlined
              onClick={() => handleUserViewDetails(merchant.id)}
              style={{
                cursor: 'pointer',
                fontSize: '18px',
                color: 'var(--secondary)',
              }}
            />
          );
        default:
          return '-';
      }
    },
    [userType, router],
  );

  const columns: TableColumnsType<IAdminUser> = MerchantColumns.map(
    (col, index) => {
      const isFirstCol = index === 0;
      const isLastCol = index === MerchantColumns.length - 1;

      return {
        title: col.label,
        dataIndex: col.key,
        key: col.key,
        fixed: isFirstCol
          ? ('left' as const)
          : isLastCol
            ? ('right' as const)
            : undefined,
        width: isFirstCol ? 200 : isLastCol ? 100 : 180,
        ellipsis: { showTitle: true },
        render: (_: safeAny, record: IAdminUser) => renderCell(record, col.key),
      };
    },
  );

  const handleReset = () => {
    setSearch('');
    setPage(1);
  };

  return (
    <div className="w-full">
      {/* Filters */}
      <div className="mx-4 my-4">
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
              padding: '20px 24px',
            }}
          >
            <div className="flex items-center gap-4">
              <Input
                placeholder="Search by name or email"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                prefix={<SearchOutlined />}
                size="large"
                classNames={{
                  input: 'placeholder:text-[#95A19D]',
                }}
                style={{
                  width: 400,
                  backgroundColor: 'var(--background)',
                  borderColor: 'var(--border)',
                  color: 'var(--text)',
                }}
                allowClear
              />
              <Button
                size="large"
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
                dataSource={merchants}
                rowKey="id"
                pagination={false}
                scroll={{ x: 'max-content', y: 'calc(100vh - 400px)' }}
                locale={{
                  emptyText: (
                    <div
                      className="text-center py-4 text-xl"
                      style={{ color: 'var(--text-muted)' }}
                    >
                      No Users Found
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
    </div>
  );
};

export default UserListPage;
