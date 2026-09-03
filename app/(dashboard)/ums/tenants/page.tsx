'use client';

import { useState } from 'react';
import {
  Button,
  Card,
  Drawer,
  Form,
  Input,
  InputNumber,
  Modal,
  Select,
  Table,
  Tag,
  Typography,
  TableColumnsType,
} from 'antd';
import {
  PlusOutlined,
  ApartmentOutlined,
  UserAddOutlined,
} from '@ant-design/icons';
import { useToast } from '@/lib/components/Toast/ToastContext';
import {
  useGetTenants,
  useCreateTenant,
  useAddTenantMember,
  useGetTenantMembers,
} from '@/lib/hooks/use-ums';
import {
  IUmsTenant,
  UmsTenantType,
  UmsTenantStatus,
} from '@/lib/interfaces/ums.interface';

const { Title, Text } = Typography;

const STATUS_COLORS: Record<UmsTenantStatus, string> = {
  ACTIVE: 'green',
  PENDING: 'gold',
  SUSPENDED: 'orange',
  TERMINATED: 'red',
};

const TYPE_COLORS: Record<UmsTenantType, string> = {
  PARTNER: 'blue',
  RESELLER: 'purple',
  AGGREGATOR: 'cyan',
};

export default function UmsTenantsPage() {
  const [page, setPage] = useState(1);
  const [createOpen, setCreateOpen] = useState(false);
  const [membersOpen, setMembersOpen] = useState(false);
  const [selectedTenant, setSelectedTenant] = useState<IUmsTenant | null>(null);
  const [addMemberOpen, setAddMemberOpen] = useState(false);
  const [createForm] = Form.useForm();
  const [memberForm] = Form.useForm();
  const { showToast } = useToast();

  const { data: tenantsResult, isLoading } = useGetTenants(page);
  const { data: membersResult } = useGetTenantMembers(selectedTenant?.id ?? '');
  const { mutate: createTenant, isPending: creating } = useCreateTenant();
  const { mutate: addMember, isPending: addingMember } = useAddTenantMember();

  const tenantsPayload =
    tenantsResult?.[0] && !Array.isArray(tenantsResult[0])
      ? tenantsResult[0]
      : null;
  const tenants = Array.isArray(tenantsPayload?.data)
    ? tenantsPayload!.data
    : [];
  const total = tenantsPayload?.total ?? 0;
  const members = Array.isArray(membersResult?.[0]) ? membersResult![0]! : [];

  const handleCreate = (values: {
    code: string;
    name: string;
    type: UmsTenantType;
    ownerId: string;
    parentTenantId?: string;
    apiRateLimit?: number;
  }) => {
    createTenant(values, {
      onSuccess: ([, err]) => {
        if (err) {
          showToast('Failed to create tenant', 'error');
          return;
        }
        showToast('Tenant created', 'success');
        setCreateOpen(false);
        createForm.resetFields();
      },
    });
  };

  const handleAddMember = (values: {
    userId: string;
    designation?: string;
  }) => {
    if (!selectedTenant) return;
    addMember(
      { tenantId: selectedTenant.id, ...values },
      {
        onSuccess: ([, err]) => {
          if (err) {
            showToast('Failed to add member', 'error');
            return;
          }
          showToast('Member added', 'success');
          setAddMemberOpen(false);
          memberForm.resetFields();
        },
      },
    );
  };

  const columns: TableColumnsType<IUmsTenant> = [
    {
      title: 'Code',
      dataIndex: 'code',
      render: (v: string) => <Text code>{v}</Text>,
    },
    {
      title: 'Name',
      dataIndex: 'name',
    },
    {
      title: 'Type',
      dataIndex: 'type',
      render: (v: UmsTenantType) => <Tag color={TYPE_COLORS[v]}>{v}</Tag>,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      render: (v: UmsTenantStatus) => <Tag color={STATUS_COLORS[v]}>{v}</Tag>,
    },
    {
      title: 'KYB',
      dataIndex: 'kybStatus',
      render: (v: string) => <Tag>{v}</Tag>,
    },
    {
      title: 'Rate Limit',
      dataIndex: 'apiRateLimit',
      render: (v: number | null) => (v ? `${v} req/min` : '—'),
    },
    {
      title: 'Created',
      dataIndex: 'createdAt',
      render: (v: string) => new Date(v).toLocaleDateString(),
    },
    {
      title: 'Actions',
      render: (_: unknown, row: IUmsTenant) => (
        <Button
          type="link"
          icon={<UserAddOutlined />}
          onClick={() => {
            setSelectedTenant(row);
            setMembersOpen(true);
          }}
        >
          Members
        </Button>
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
          <ApartmentOutlined style={{ marginRight: 8 }} />
          Tenant Registry
        </Title>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => setCreateOpen(true)}
          style={{ background: 'var(--primary)' }}
        >
          New Tenant
        </Button>
      </div>

      <Card bordered style={{ borderRadius: 12 }}>
        <Table
          dataSource={tenants}
          columns={columns}
          rowKey="id"
          loading={isLoading}
          pagination={{ current: page, total, pageSize: 20, onChange: setPage }}
          size="small"
        />
      </Card>

      {/* Create Tenant Drawer */}
      <Drawer
        title="Register New Tenant"
        open={createOpen}
        onClose={() => {
          setCreateOpen(false);
          createForm.resetFields();
        }}
        width={440}
        footer={
          <Button
            type="primary"
            onClick={() => createForm.submit()}
            loading={creating}
            style={{ width: '100%', background: 'var(--primary)' }}
          >
            Create
          </Button>
        }
      >
        <Form form={createForm} layout="vertical" onFinish={handleCreate}>
          <Form.Item
            name="code"
            label="Tenant Code"
            rules={[{ required: true, max: 80 }]}
          >
            <Input placeholder="e.g. HDFC_PARTNER" />
          </Form.Item>
          <Form.Item
            name="name"
            label="Display Name"
            rules={[{ required: true }]}
          >
            <Input placeholder="HDFC Bank Partner" />
          </Form.Item>
          <Form.Item name="type" label="Type" rules={[{ required: true }]}>
            <Select placeholder="Select type">
              {Object.values(UmsTenantType).map((t) => (
                <Select.Option key={t} value={t}>
                  <Tag color={TYPE_COLORS[t]}>{t}</Tag>
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            name="ownerId"
            label="Owner User ID"
            rules={[{ required: true }]}
          >
            <Input placeholder="usr_..." />
          </Form.Item>
          <Form.Item name="parentTenantId" label="Parent Tenant ID (optional)">
            <Input placeholder="umst_... (for Resellers)" allowClear />
          </Form.Item>
          <Form.Item
            name="apiRateLimit"
            label="API Rate Limit (req/min, optional)"
          >
            <InputNumber
              min={1}
              style={{ width: '100%' }}
              placeholder="Default: global limit"
            />
          </Form.Item>
        </Form>
      </Drawer>

      {/* Members Modal */}
      <Modal
        title={`Members — ${selectedTenant?.name ?? ''}`}
        open={membersOpen}
        onCancel={() => {
          setMembersOpen(false);
          setSelectedTenant(null);
        }}
        footer={null}
        width={560}
      >
        <div style={{ marginBottom: 16 }}>
          <Button
            icon={<UserAddOutlined />}
            onClick={() => setAddMemberOpen(true)}
          >
            Add Member
          </Button>
        </div>
        <Table
          dataSource={members}
          rowKey="id"
          size="small"
          pagination={false}
          columns={[
            {
              title: 'User ID',
              dataIndex: 'userId',
              render: (v: string) => <Text code>{v.slice(0, 16)}…</Text>,
            },
            {
              title: 'Designation',
              dataIndex: 'designation',
              render: (v: string | null) => v ?? '—',
            },
            {
              title: 'Primary Contact',
              dataIndex: 'isPrimaryContact',
              render: (v: boolean) => (v ? <Tag color="green">Yes</Tag> : '—'),
            },
          ]}
        />
        {addMemberOpen && (
          <Form
            form={memberForm}
            layout="vertical"
            onFinish={handleAddMember}
            style={{
              marginTop: 16,
              borderTop: '1px solid #f0f0f0',
              paddingTop: 16,
            }}
          >
            <Form.Item
              name="userId"
              label="User ID"
              rules={[{ required: true }]}
            >
              <Input placeholder="usr_..." />
            </Form.Item>
            <Form.Item name="designation" label="Designation (optional)">
              <Input placeholder="Senior Manager" />
            </Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              loading={addingMember}
              style={{ background: 'var(--primary)' }}
            >
              Add Member
            </Button>
          </Form>
        )}
      </Modal>
    </div>
  );
}
