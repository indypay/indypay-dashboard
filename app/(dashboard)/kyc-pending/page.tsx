'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
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

import { useFetchKYCPending } from '@/lib/hooks/use-fetchKyc';
import {
  formatOnboardingStatus,
  formatAccountStatus,
  formatRole,
  getFormattedTime,
} from '@/lib/utils/utils';
import { IAdminUser } from '@/lib/interfaces/users.interface';
import useDebounce from '@/lib/hooks/use-debounce';
import { safeAny } from '@/lib/interfaces/global.interface';
import { ONBOARDING_STATUS } from '@/lib/enum';

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

const TableColumns = [
  { key: 'fullName', label: 'Full Name' },
  { key: 'email', label: 'Email' },
  { key: 'mobile', label: 'Mobile' },
  { key: 'status', label: 'Status' },
  { key: 'role', label: 'Role' },
  { key: 'onboardingStatus', label: 'Onboarding Status' },
  { key: 'view-kyc', label: 'Actions' },
];

const getOnboardingStatusStyle = (status: number): React.CSSProperties => {
  const statusInfo = formatOnboardingStatus(status);

  const baseStyle = {
    borderRadius: '6px',
    padding: '4px 12px',
    fontWeight: 500,
    border: 'none',
  };

  // Map colors based on status
  switch (statusInfo?.label) {
    case 'KYC Verified':
      return {
        ...baseStyle,
        backgroundColor: '#0DD25F15',
        color: '#0DD25F',
        border: '1px solid #0DD25F40',
      };
    case 'KYC Pending':
      return {
        ...baseStyle,
        backgroundColor: '#F5A52415',
        color: '#F5A524',
        border: '1px solid #F5A52440',
      };
    case 'Sign Up':
      return {
        ...baseStyle,
        backgroundColor: '#30F3BC15',
        color: 'var(--secondary)',
        border: '1px solid #30F3BC40',
      };
    default:
      return {
        ...baseStyle,
        backgroundColor: '#95A19D15',
        color: 'var(--text-muted)',
        border: '1px solid #95A19D40',
      };
  }
};

const getAccountStatusStyle = (status: string): React.CSSProperties => {
  if (status === 'Active') {
    return {
      backgroundColor: '#0DD25F15',
      color: '#0DD25F',
      border: '1px solid #0DD25F40',
      borderRadius: '6px',
      padding: '4px 12px',
      fontWeight: 500,
    };
  } else {
    return {
      backgroundColor: '#D51C4415',
      color: '#D51C44',
      border: '1px solid #D51C4440',
      borderRadius: '6px',
      padding: '4px 12px',
      fontWeight: 500,
    };
  }
};

const KYCPage = () => {
  const { styles } = useStyle();
  const router = useRouter();

  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState<IAdminUser[]>([]);
  const debouncedSearch = useDebounce(search, 500);

  const rowsPerPage = 50;

  const { data, refetch } = useFetchKYCPending({
    search: debouncedSearch,
    page,
    limit: rowsPerPage,
  });

  useEffect(() => {
    setLoading(true);
    if (data) {
      const responseData = Array.isArray(data) ? data[0] : data;
      setUsers(responseData?.data?.data || []);
      setTotalRecords(responseData?.data?.pagination?.totalItems || 0);
      setLoading(false);
    }
  }, [data]);

  const pages = useMemo(() => {
    return Math.ceil(totalRecords / rowsPerPage);
  }, [totalRecords]);

  const handleUserViewDetails = (userId: string) => {
    router.push(`/kyc-pending/${userId}`);
  };

  const renderCell = React.useCallback(
    (user: IAdminUser, columnKey: React.Key) => {
      switch (columnKey) {
        case 'fullName':
          return user.fullName || '-';
        case 'email':
          return user.email || '-';
        case 'mobile':
          return user.mobile || '-';
        case 'status':
          return (
            <Tag
              style={getAccountStatusStyle(
                formatAccountStatus(user.accountStatus),
              )}
              bordered={false}
            >
              {formatAccountStatus(user.accountStatus) || '-'}
            </Tag>
          );
        case 'role':
          return formatRole(user.role.toString()) || '-';
        case 'onboardingStatus':
          return (
            <Tag
              style={getOnboardingStatusStyle(user.onboardingStatus)}
              bordered={false}
            >
              {formatOnboardingStatus(user.onboardingStatus)?.label || '-'}
            </Tag>
          );
        case 'view-kyc':
          return (
            <Button
              type="primary"
              size="middle"
              icon={<EyeOutlined />}
              onClick={() => handleUserViewDetails(user.id)}
              disabled={user.onboardingStatus === ONBOARDING_STATUS.SIGN_UP}
              style={{
                background:
                  user.onboardingStatus === ONBOARDING_STATUS.SIGN_UP
                    ? 'var(--border)'
                    : 'linear-gradient(to right, var(--border), var(--primary))',
                border: 'none',
                color:
                  user.onboardingStatus === ONBOARDING_STATUS.SIGN_UP
                    ? 'var(--text-muted)'
                    : 'var(--background)',
                fontWeight: 600,
                cursor:
                  user.onboardingStatus === ONBOARDING_STATUS.SIGN_UP
                    ? 'not-allowed'
                    : 'pointer',
              }}
            >
              View KYC
            </Button>
          );
        default:
          return '-';
      }
    },
    [],
  );

  const columns: TableColumnsType<IAdminUser> = TableColumns.map(
    (col, index) => {
      const isFirstCol = index === 0;
      const isLastCol = index === TableColumns.length - 1;

      return {
        title: col.label,
        dataIndex: col.key,
        key: col.key,
        fixed: isFirstCol
          ? ('left' as const)
          : isLastCol
            ? ('right' as const)
            : undefined,
        width: isFirstCol ? 200 : isLastCol ? 150 : 180,
        ellipsis: { showTitle: true },
        render: (_: safeAny, record: IAdminUser) => renderCell(record, col.key),
      };
    },
  );

  const handleReset = () => {
    setSearch('');
    setPage(1);
  };

  useEffect(() => {
    refetch();
  }, [debouncedSearch, refetch]);

  return (
    <div className="w-full">
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
              tip="Loading KYC Pending Users"
              className={styles.customSpin}
            >
              <Table
                className={styles.customTable}
                columns={columns}
                dataSource={users}
                rowKey="id"
                pagination={false}
                scroll={{ x: 'max-content', y: 'calc(100vh - 400px)' }}
                locale={{
                  emptyText: (
                    <div
                      className="text-center py-4 text-xl"
                      style={{ color: 'var(--text-muted)' }}
                    >
                      No KYC Pending Users Found
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

export default KYCPage;
