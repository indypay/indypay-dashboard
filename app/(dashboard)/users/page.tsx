'use client';

import React, { useEffect, useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import {
  Table,
  Pagination,
  Spin,
  Button,
  Input,
  Tag,
  TableColumnsType,
  Select,
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

const useStyle = createStyles(({ css }) => ({
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
    }
    .ant-table-tbody > tr:hover > td {
      background: var(--background) !important;
    }
    .ant-table-tbody > tr > td {
      border-bottom: 1px solid var(--border) !important;
      color: var(--text) !important;
      padding: 16px 12px;
    }
    .ant-table-cell-fix-left,
    .ant-table-cell-fix-right {
      background: #ffffff !important;
    }
    .ant-table-tbody > tr:hover .ant-table-cell-fix-left,
    .ant-table-tbody > tr:hover .ant-table-cell-fix-right {
      background: var(--background) !important;
    }
    .custom-pagination .ant-pagination-item,
    .custom-pagination .ant-pagination-item-link,
    .custom-pagination .ant-pagination-total-text,
    .custom-pagination .ant-pagination-options-quick-jumper input {
      color: var(--text) !important;
    }
    .custom-pagination .ant-pagination-item-active {
      background: linear-gradient(to right, var(--border), var(--primary)) !important;
      border-color: transparent !important;
    }
    .custom-pagination .ant-pagination-item-active a {
      color: #0c0c0c !important;
    }
    .custom-pagination .ant-pagination-item {
      background: #ffffff !important;
      border-color: var(--border) !important;
    }
    .custom-pagination .ant-pagination-item a {
      color: var(--text) !important;
    }
  `,
  customSpin: css`
    .ant-spin-dot-item {
      background-color: var(--primary) !important;
    }
  `,
}));

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
  const router = useRouter();

  const [users, setUsers] = useState<IAdminUser[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);
  const [search, setSearch] = useState('');
  const [selectedRole, setSelectedRole] = useState<string>('merchant');
  const debouncedSearch = useDebounce(search, 500);

  const rowsPerPage = 50;

  const roleMap: Record<string, string> = {
    merchant: 'merchant',
    'channel-partner': 'cp',
    operations: 'ops',
    admin: 'admin', // For future use
  };

  const { data, refetch, isLoading } = getAdminUserList({
    search: debouncedSearch,
    page,
    limit: rowsPerPage,
    role: roleMap[selectedRole] || 'merchant',
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
      setUsers(responseData?.data?.data || []);
      setTotalRecords(responseData?.data?.pagination?.totalItems || 0);
    }
  }, [data]);

  useEffect(() => {
    refetch();
  }, [page, debouncedSearch, selectedRole, refetch]);

  const handleUserViewDetails = (id: string) => {
    // Map role to userType for navigation
    const userTypeMap: Record<string, string> = {
      merchant: 'merchants',
      'channel-partner': 'channel-partners',
      operations: 'operations',
      admin: 'admin',
    };
    const userType = userTypeMap[selectedRole] || 'merchants';
    router.push(`/users/${userType}/${id}`);
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
        case 'accountStatus':
          return (
            <Tag
              style={getStatusStyle(formatAccountStatus(user.accountStatus))}
              bordered={false}
            >
              {formatAccountStatus(user.accountStatus) || '-'}
            </Tag>
          );
        case 'onboardingStatus':
          return formatOnboardingStatus(user.onboardingStatus)?.label || '-';
        case 'createdAt':
          return getFormattedTime(new Date(user.createdAt)) || '-';
        case 'view-details':
          return (
            <EyeOutlined
              onClick={() => handleUserViewDetails(user.id)}
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
    [selectedRole, router],
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
    setSelectedRole('merchant');
  };

  return (
    <div className="w-full">
      {/* Filters */}
      <div className="mx-4 mt-4 mb-4">
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
                prefix={<SearchOutlined style={{ color: 'var(--text-muted)' }} />}
                size="large"
                style={{
                  width: 400,
                  backgroundColor: '#FFFFFF',
                  borderColor: 'var(--border)',
                  color: 'var(--text)',
                }}
                allowClear
              />
              <Select
                value={selectedRole}
                onChange={setSelectedRole}
                size="large"
                style={{
                  width: 200,
                  backgroundColor: '#FFFFFF',
                  borderColor: 'var(--border)',
                  color: 'var(--text)',
                }}
                options={[
                  { value: 'merchant', label: 'Merchants' },
                  { value: 'channel-partner', label: 'Channel Partners' },
                  { value: 'operations', label: 'Operations' },
                  // { value: 'admin', label: 'Admin' }, // Uncomment when ready
                ]}
              />
              <Button
                size="large"
                onClick={handleReset}
                style={{
                  background: '#FFFFFF',
                  border: '1px solid var(--border)',
                  color: 'var(--text)',
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
      <div
        className={`mx-4 my-4 ${styles.customTable}`}
        style={{ maxWidth: 'calc(100vw - 190px)' }}
      >
        <Spin
          spinning={loading}
          size="large"
          tip="Loading"
          className={styles.customSpin}
        >
          <Table
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
                  No Users Found
                </div>
              ),
            }}
            size="middle"
          />
        </Spin>
        <div
          className="flex justify-center p-4 custom-pagination"
          style={{
            background: '#FFFFFF',
            borderTop: '1px solid var(--border)',
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
    // </div>
  );
};

export default UserListPage;
