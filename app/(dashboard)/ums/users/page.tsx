'use client';

import { useState } from 'react';
import {
  Button,
  Card,
  Drawer,
  Form,
  Input,
  Select,
  Table,
  Tag,
  Typography,
  Space,
  DatePicker,
  Popconfirm,
  Spin,
  TableColumnsType,
} from 'antd';
import {
  PlusOutlined,
  DeleteOutlined,
  SearchOutlined,
  UserOutlined,
  ReloadOutlined,
} from '@ant-design/icons';
import { useToast } from '@/lib/components/Toast/ToastContext';
import {
  useGetRoles,
  useGetUserRoles,
  useAssignRole,
  useRevokeRole,
  useRevokeAllSessions,
} from '@/lib/hooks/use-ums';
import { IUmsUserRole } from '@/lib/interfaces/ums.interface';
import useDebounce from '@/lib/hooks/use-debounce';

const { Title, Text } = Typography;

const RISK_COLOR: Record<string, string> = {
  CRITICAL: 'red',
  HIGH: 'orange',
  MEDIUM: 'gold',
  LOW: 'green',
};

export default function UmsUsersPage() {
  const [searchInput, setSearchInput] = useState('');
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [form] = Form.useForm();
  const { showToast } = useToast();

  const debouncedUserId = useDebounce(searchInput, 400);

  const { data: rolesResult } = useGetRoles();
  const {
    data: userRolesResult,
    isLoading,
    refetch,
  } = useGetUserRoles(debouncedUserId);
  const { mutate: assignRole, isPending: assigning } = useAssignRole();
  const { mutate: revokeRole, isPending: revoking } = useRevokeRole();
  const { mutate: revokeAllSessions } = useRevokeAllSessions();

  const allRoles = Array.isArray(rolesResult?.[0]) ? rolesResult![0]! : [];
  const userRoles = Array.isArray(userRolesResult?.[0])
    ? userRolesResult![0]!
    : [];

  const handleSearch = () => {};

  const handleAssign = (values: {
    roleCode: string;
    tenantId?: string;
    expiresAt?: string;
  }) => {
    assignRole(
      {
        userId: debouncedUserId,
        ...values,
        expiresAt: values.expiresAt
          ? new Date(values.expiresAt).toISOString()
          : undefined,
      },
      {
        onSuccess: ([, err]) => {
          if (err) {
            showToast('Failed to assign role', 'error');
            return;
          }
          showToast('Role assigned successfully', 'success');
          setDrawerOpen(false);
          form.resetFields();
        },
      },
    );
  };

  const handleRevoke = (roleCode: string) => {
    revokeRole(
      { userId: debouncedUserId, roleCode },
      {
        onSuccess: ([, err]) => {
          if (err) {
            showToast('Failed to revoke role', 'error');
            return;
          }
          showToast('Role revoked', 'success');
        },
      },
    );
  };

  const handleRevokeAllSessions = () => {
    revokeAllSessions(debouncedUserId, {
      onSuccess: ([data, err]) => {
        if (err) {
          showToast('Failed to revoke sessions', 'error');
          return;
        }
        showToast(
          `Revoked ${(data as { revoked: number })?.revoked ?? 0} session(s)`,
          'success',
        );
      },
    });
  };

  const columns: TableColumnsType<IUmsUserRole> = [
    {
      title: 'Role Code',
      dataIndex: ['role', 'code'],
      render: (code: string) => <Tag color="blue">{code}</Tag>,
    },
    {
      title: 'Name',
      dataIndex: ['role', 'name'],
    },
    {
      title: 'Risk',
      dataIndex: ['role', 'riskLevel'],
      render: (risk: string) => (
        <Tag color={RISK_COLOR[risk] ?? 'default'}>{risk}</Tag>
      ),
    },
    {
      title: 'Tenant',
      dataIndex: 'tenantId',
      render: (v: string | null) =>
        v ? (
          <Tag>{v.slice(0, 12)}…</Tag>
        ) : (
          <Text type="secondary">Platform</Text>
        ),
    },
    {
      title: 'Expires',
      dataIndex: 'expiresAt',
      render: (v: string | null) =>
        v ? new Date(v).toLocaleDateString() : '—',
    },
    {
      title: 'Actions',
      render: (_: unknown, row: IUmsUserRole) => (
        <Popconfirm
          title="Revoke this role?"
          onConfirm={() => handleRevoke(row.role?.code ?? row.roleId)}
          okText="Yes"
          cancelText="No"
        >
          <Button
            type="link"
            danger
            icon={<DeleteOutlined />}
            loading={revoking}
          >
            Revoke
          </Button>
        </Popconfirm>
      ),
    },
  ];

  return (
    <div style={{ padding: 24 }}>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 20,
        }}
      >
        <Title level={4} style={{ margin: 0 }}>
          <UserOutlined style={{ marginRight: 8 }} />
          User Role Management
        </Title>
      </div>

      {/* User search */}
      <Card bordered style={{ borderRadius: 12, marginBottom: 20 }}>
        <Space>
          <Input
            placeholder="Enter User ID"
            prefix={<SearchOutlined />}
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            onPressEnter={handleSearch}
            style={{ width: 280 }}
            allowClear
          />
          <Button
            type="primary"
            onClick={handleSearch}
            style={{ background: 'var(--primary)' }}
          >
            Load Roles
          </Button>
        </Space>
      </Card>

      {debouncedUserId && (
        <Card
          bordered
          style={{ borderRadius: 12 }}
          title={
            <Text>
              Roles for: <Text code>{debouncedUserId}</Text>
            </Text>
          }
          extra={
            <Space>
              <Button icon={<ReloadOutlined />} onClick={() => refetch()}>
                Refresh
              </Button>
              <Popconfirm
                title="Revoke all active sessions for this user?"
                onConfirm={handleRevokeAllSessions}
              >
                <Button danger>Revoke All Sessions</Button>
              </Popconfirm>
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={() => setDrawerOpen(true)}
                style={{ background: 'var(--primary)' }}
              >
                Assign Role
              </Button>
            </Space>
          }
        >
          <Spin spinning={isLoading}>
            <Table
              dataSource={userRoles}
              columns={columns}
              rowKey="id"
              pagination={false}
              size="small"
              locale={{ emptyText: 'No roles assigned' }}
            />
          </Spin>
        </Card>
      )}

      {/* Assign Role Drawer */}
      <Drawer
        title="Assign Role"
        open={drawerOpen}
        onClose={() => {
          setDrawerOpen(false);
          form.resetFields();
        }}
        width={400}
        footer={
          <Button
            type="primary"
            onClick={() => form.submit()}
            loading={assigning}
            style={{ width: '100%', background: 'var(--primary)' }}
          >
            Assign
          </Button>
        }
      >
        <Form form={form} layout="vertical" onFinish={handleAssign}>
          <Form.Item name="roleCode" label="Role" rules={[{ required: true }]}>
            <Select
              placeholder="Select role"
              showSearch
              optionFilterProp="label"
            >
              {allRoles.map((r) => (
                <Select.Option key={r.code} value={r.code} label={r.name}>
                  <Tag color="blue">{r.code}</Tag> {r.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            name="tenantId"
            label="Tenant ID (optional)"
            tooltip="Leave blank for platform-wide role"
          >
            <Input placeholder="e.g. umst_..." allowClear />
          </Form.Item>
          <Form.Item
            name="expiresAt"
            label="Expires At (optional)"
            tooltip="For temporary elevated access"
          >
            <DatePicker
              showTime
              style={{ width: '100%' }}
              format="DD MMM YYYY HH:mm"
              allowClear
            />
          </Form.Item>
        </Form>
      </Drawer>
    </div>
  );
}
