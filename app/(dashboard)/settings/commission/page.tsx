'use client';

import React, { useState } from 'react';
import {
  Button,
  Card,
  Drawer,
  Form,
  Input,
  InputNumber,
  Select,
  Space,
  Table,
  Spin,
  Tag,
  Popconfirm,
  message,
} from 'antd';
import type { ColumnsType } from 'antd/es/table';
import {
  EditOutlined,
  PercentageOutlined,
  PlusOutlined,
  SaveOutlined,
} from '@ant-design/icons';
import {
  useCommissions,
  useCreateCommission,
  useUpdateCommission,
  useAddSlab,
  useUpdateSlab,
  useDeleteSlab,
} from '@/lib/hooks/use-commission';
import type {
  CommissionPlan,
  CommissionSlab,
  CommissionType,
  ChargeType,
} from '@/lib/interfaces/commission.interface';

const { Option } = Select;

// ─── Shared style helpers ─────────────────────────────────────────────────────

const labelStyle: React.CSSProperties = {
  display: 'block',
  marginBottom: '6px',
  color: 'var(--text-muted)',
  fontSize: '13px',
  fontWeight: 500,
  letterSpacing: '0.01em',
};

const inputStyle: React.CSSProperties = {
  backgroundColor: 'var(--background)',
  borderColor: 'var(--border)',
  borderRadius: '8px',
  color: 'var(--text)',
};

const cardGradientWrapper = (children: React.ReactNode) => (
  <div
    style={{
      background: 'linear-gradient(to right, var(--border), var(--primary))',
      borderRadius: '14px',
      padding: '1.5px',
    }}
  >
    <Card
      style={{ background: '#FFFFFF', borderRadius: '13px', border: 'none' }}
      styles={{ body: { padding: '28px 32px' } }}
    >
      {children}
    </Card>
  </div>
);

const GradientTitle = ({
  title,
  subtitle,
}: {
  title: string;
  subtitle?: string;
}) => (
  <div style={{ marginBottom: '24px' }}>
    <h2
      style={{
        fontSize: '20px',
        fontWeight: 700,
        margin: 0,
        background: 'linear-gradient(135deg, var(--secondary), var(--primary))',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        backgroundClip: 'text',
        letterSpacing: '-0.01em',
      }}
    >
      {title}
    </h2>
    {subtitle && (
      <p style={{ color: 'var(--text-muted)', fontSize: '13px', margin: '4px 0 0' }}>
        {subtitle}
      </p>
    )}
  </div>
);

type SlabFormState = {
  minAmount: number;
  maxAmount: number | null;
  chargeType: ChargeType;
  chargeValue: number;
  gstPercentage: number | null;
  priority: number;
};

const defaultSlabForm: SlabFormState = {
  minAmount: 0,
  maxAmount: null,
  chargeType: 'PERCENTAGE',
  chargeValue: 0,
  gstPercentage: null,
  priority: 0,
};

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function CommissionPage() {
  const commissionsQuery = useCommissions();
  const createCommissionMutation = useCreateCommission();
  const updateCommissionMutation = useUpdateCommission();
  const addSlabMutation = useAddSlab();
  const updateSlabMutation = useUpdateSlab();
  const deleteSlabMutation = useDeleteSlab();

  const packages: CommissionPlan[] = commissionsQuery.data?.[0] ?? [];
  const isLoading = commissionsQuery.isLoading;

  const [createForm] = Form.useForm();
  const [editDrawerOpen, setEditDrawerOpen] = useState(false);
  const [editingPackage, setEditingPackage] = useState<CommissionPlan | null>(null);
  const [editForm] = Form.useForm();

  const [updateDrawerOpen, setUpdateDrawerOpen] = useState(false);
  const [updatePackage, setUpdatePackage] = useState<CommissionPlan | null>(null);

  const [slabForm, setSlabForm] = useState<SlabFormState>(defaultSlabForm);
  const [editingSlabId, setEditingSlabId] = useState<string | null>(null);

  const typeTagColor: Record<CommissionType, string> = {
    PAYIN: '#00c98a',
    PAYOUT: 'var(--primary)',
  };
  const typeLabel: Record<CommissionType, string> = {
    PAYIN: 'PayIn',
    PAYOUT: 'PayOut',
  };

  const handleCreatePackage = async (values: {
    name: string;
    type: CommissionType;
    description?: string;
    defaultGstPercentage?: number;
  }) => {
    const [, err] = await createCommissionMutation.mutateAsync(values);
    if (err) {
      message.error(err?.message ?? 'Failed to create commission plan');
      return;
    }
    message.success('Commission plan created');
    createForm.resetFields();
  };

  const openEditDrawer = (pkg: CommissionPlan) => {
    setEditingPackage(pkg);
    editForm.setFieldsValue({
      name: pkg.name,
      type: pkg.type,
      description: pkg.description ?? '',
      defaultGstPercentage: pkg.defaultGstPercentage,
    });
    setEditDrawerOpen(true);
  };

  const handleEditSave = async (values: {
    name: string;
    type: CommissionType;
    description?: string;
    defaultGstPercentage?: number;
  }) => {
    if (!editingPackage) return;
    const [, err] = await updateCommissionMutation.mutateAsync({
      id: editingPackage.id,
      body: values,
    });
    if (err) {
      message.error(err?.message ?? 'Failed to update commission plan');
      return;
    }
    message.success('Commission plan updated');
    setEditDrawerOpen(false);
    setEditingPackage(null);
  };

  const openUpdateDrawer = (pkg: CommissionPlan) => {
    setUpdatePackage(pkg);
    setEditingSlabId(null);
    setSlabForm(defaultSlabForm);
    setUpdateDrawerOpen(true);
  };

  const handleSaveCommission = async () => {
    if (!updatePackage) return;

    if (slabForm.maxAmount !== null && slabForm.maxAmount <= slabForm.minAmount) {
      message.error('Max Amount must be greater than Min Amount');
      return;
    }
    if (slabForm.chargeType === 'PERCENTAGE' && slabForm.chargeValue > 100) {
      message.error('Charge Value cannot exceed 100 for Percentage type');
      return;
    }

    const body = {
      minAmount: slabForm.minAmount,
      maxAmount: slabForm.maxAmount,
      chargeType: slabForm.chargeType,
      chargeValue: slabForm.chargeValue,
      gstPercentage: slabForm.gstPercentage,
      priority: slabForm.priority,
    };

    try {
      if (editingSlabId) {
        const [, err] = await updateSlabMutation.mutateAsync({
          slabId: editingSlabId,
          body,
        });
        if (err) {
          message.error(
            (err as { message?: string })?.message ?? 'Failed to update slab',
          );
          return;
        }
        message.success('Slab updated');
        setEditingSlabId(null);
      } else {
        const [, err] = await addSlabMutation.mutateAsync({
          commissionId: updatePackage.id,
          body,
        });
        if (err) {
          message.error(
            (err as { message?: string })?.message ?? 'Failed to add slab',
          );
          return;
        }
        message.success('Slab added');
      }
      setSlabForm(defaultSlabForm);
      const { data } = await commissionsQuery.refetch();
      const plans = (data?.[0] ?? []) as CommissionPlan[];
      const updated = plans.find((p) => p.id === updatePackage.id);
      if (updated) setUpdatePackage(updated);
    } catch {
      message.error('Something went wrong');
    }
  };

  const handleEditSlab = (slab: CommissionSlab) => {
    setEditingSlabId(slab.id);
    setSlabForm({
      minAmount: Number(slab.minAmount),
      maxAmount: slab.maxAmount != null ? Number(slab.maxAmount) : null,
      chargeType: slab.chargeType,
      chargeValue: Number(slab.chargeValue),
      gstPercentage: slab.gstPercentage != null ? Number(slab.gstPercentage) : null,
      priority: slab.priority,
    });
  };

  const handleDeleteSlab = async (slabId: string) => {
    const [, err] = await deleteSlabMutation.mutateAsync(slabId);
    if (err) {
      message.error(err?.message ?? 'Failed to delete slab');
      return;
    }
    message.success('Slab deleted');
    if (editingSlabId === slabId) {
      setEditingSlabId(null);
      setSlabForm(defaultSlabForm);
    }
    commissionsQuery.refetch();
  };

  const currentSlabs: CommissionSlab[] = updatePackage?.slabs ?? [];

  // ── Package table columns ────────────────────────────────────────────────────

  const packageColumns: ColumnsType<CommissionPlan> = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      render: (v) => (
        <span style={{ color: 'var(--text)', fontWeight: 500 }}>{v}</span>
      ),
    },
    {
      title: 'Type',
      dataIndex: 'type',
      key: 'type',
      render: (v: CommissionType) => (
        <Tag
          style={{
            backgroundColor: `${typeTagColor[v]}22`,
            borderColor: typeTagColor[v],
            color: typeTagColor[v],
            borderRadius: '6px',
            fontWeight: 600,
            fontSize: '11px',
            letterSpacing: '0.04em',
          }}
        >
          {typeLabel[v] ?? v}
        </Tag>
      ),
    },
    {
      title: 'Default GST',
      dataIndex: 'defaultGstPercentage',
      key: 'defaultGstPercentage',
      render: (v) => (
        <span style={{ color: 'var(--text)' }}>{v ?? 18}%</span>
      ),
    },
    {
      title: 'Slabs',
      key: 'slabs',
      render: (_, record) => (
        <span style={{ color: 'var(--text-muted)', fontSize: '13px' }}>
          {record.slabs?.length ?? 0} slab{record.slabs?.length !== 1 ? 's' : ''}
        </span>
      ),
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
      render: (v) => (
        <span style={{ color: 'var(--text-muted)', fontSize: '13px' }}>{v ?? '—'}</span>
      ),
    },
    {
      title: 'Slabs',
      key: 'update',
      render: (_, record) => (
        <Button
          icon={<PercentageOutlined />}
          size="small"
          onClick={() => openUpdateDrawer(record)}
          style={{
            background: 'linear-gradient(to right, var(--border), var(--primary))',
            border: 'none',
            color: 'var(--background)',
            fontWeight: 700,
            borderRadius: '6px',
            fontSize: '12px',
          }}
        >
          Manage
        </Button>
      ),
    },
    {
      title: 'Edit',
      key: 'edit',
      render: (_, record) => (
        <Button
          icon={<EditOutlined />}
          size="small"
          onClick={() => openEditDrawer(record)}
          style={{
            background: 'var(--background)',
            borderColor: 'var(--border)',
            color: 'var(--text)',
            borderRadius: '6px',
            fontSize: '12px',
          }}
        >
          Edit
        </Button>
      ),
    },
  ];

  // ── Commission slab table columns ────────────────────────────────────────────

  const slabColumns: ColumnsType<CommissionSlab> = [
    {
      title: 'Min Amount',
      dataIndex: 'minAmount',
      key: 'minAmount',
      render: (v) => <span style={{ color: 'var(--text)' }}>₹{Number(v).toLocaleString()}</span>,
    },
    {
      title: 'Max Amount',
      dataIndex: 'maxAmount',
      key: 'maxAmount',
      render: (v) => (
        <span style={{ color: 'var(--text)' }}>
          {v == null ? (
            <Tag style={{ borderRadius: '4px', fontSize: '11px', background: '#F0FFF8', borderColor: 'var(--primary)', color: 'var(--secondary)' }}>
              Unlimited
            </Tag>
          ) : (
            `₹${Number(v).toLocaleString()}`
          )}
        </span>
      ),
    },
    {
      title: 'Charge Type',
      dataIndex: 'chargeType',
      key: 'chargeType',
      render: (v: ChargeType) => (
        <Tag
          style={{
            borderRadius: '5px',
            fontSize: '11px',
            fontWeight: 600,
            background: v === 'PERCENTAGE' ? '#EBF5FF' : '#FFF8E8',
            borderColor: v === 'PERCENTAGE' ? '#3B82F6' : '#D97706',
            color: v === 'PERCENTAGE' ? '#1D4ED8' : '#92400E',
          }}
        >
          {v === 'PERCENTAGE' ? '%' : '₹ Flat'}
        </Tag>
      ),
    },
    {
      title: 'Charge Value',
      key: 'chargeValue',
      render: (_, r) => (
        <span style={{ color: 'var(--text)', fontWeight: 600 }}>
          {r.chargeType === 'PERCENTAGE'
            ? `${Number(r.chargeValue)}%`
            : `₹${Number(r.chargeValue).toLocaleString()}`}
        </span>
      ),
    },
    {
      title: 'GST %',
      dataIndex: 'gstPercentage',
      key: 'gstPercentage',
      render: (v) => (
        <span style={{ color: 'var(--text-muted)', fontSize: '13px' }}>
          {v != null ? `${Number(v)}%` : 'Plan default'}
        </span>
      ),
    },
    {
      title: 'Priority',
      dataIndex: 'priority',
      key: 'priority',
      render: (v) => <span style={{ color: 'var(--text-muted)' }}>{v}</span>,
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <div style={{ display: 'flex', gap: '6px' }}>
          <Button
            size="small"
            onClick={() => handleEditSlab(record)}
            style={{
              background: 'linear-gradient(to right, var(--border), var(--primary))',
              border: 'none',
              color: 'var(--background)',
              fontWeight: 700,
              borderRadius: '5px',
              fontSize: '11px',
            }}
          >
            Edit
          </Button>
          <Popconfirm
            title="Delete this slab?"
            description="This will immediately affect all users on this commission plan."
            onConfirm={() => handleDeleteSlab(record.id)}
            okText="Delete"
            cancelText="Cancel"
            okButtonProps={{ danger: true }}
          >
            <Button
              size="small"
              style={{
                background: '#FFF0F3',
                borderColor: '#D32F4A',
                color: '#D32F4A',
                borderRadius: '5px',
                fontSize: '11px',
              }}
            >
              Delete
            </Button>
          </Popconfirm>
        </div>
      ),
    },
  ];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[320px]">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {/* ── Create Commission Package ── */}
      {cardGradientWrapper(
        <>
          <GradientTitle
            title="Create Commission Package"
            subtitle="Define a new commission package for payment types"
          />
          <Form
            form={createForm}
            layout="vertical"
            onFinish={handleCreatePackage}
          >
            <div className="grid grid-cols-1 md:grid-cols-4 gap-x-6 gap-y-1">
              <Form.Item
                name="name"
                rules={[{ required: true, message: 'Package name is required' }]}
                style={{ marginBottom: '20px' }}
                label={<span style={labelStyle}>Package Name</span>}
              >
                <Input
                  size="large"
                  placeholder="e.g. Standard PayIn Plan"
                  style={inputStyle}
                  styles={{ input: { backgroundColor: 'var(--background)', color: 'var(--text)' } }}
                  className="commission-text-input"
                />
              </Form.Item>

              <Form.Item
                name="type"
                rules={[{ required: true, message: 'Please select a type' }]}
                style={{ marginBottom: '20px' }}
                label={<span style={labelStyle}>Type</span>}
              >
                <Select size="large" placeholder="Select type" className="commission-select-full">
                  <Option value="PAYIN">PayIn</Option>
                  <Option value="PAYOUT">PayOut</Option>
                </Select>
              </Form.Item>

              <Form.Item
                name="defaultGstPercentage"
                style={{ marginBottom: '20px' }}
                label={<span style={labelStyle}>Default GST %</span>}
                initialValue={18}
              >
                <InputNumber
                  size="large"
                  min={0}
                  max={100}
                  placeholder="18"
                  style={{ width: '100%', ...inputStyle }}
                  className="commission-number-input"
                />
              </Form.Item>

              <Form.Item
                name="description"
                style={{ marginBottom: '20px' }}
                label={
                  <span style={labelStyle}>
                    Description{' '}
                    <span style={{ color: '#3D5C56', fontSize: '11px' }}>(optional)</span>
                  </span>
                }
              >
                <Input
                  size="large"
                  placeholder="Brief description"
                  style={inputStyle}
                  styles={{ input: { backgroundColor: 'var(--background)', color: 'var(--text)' } }}
                  className="commission-text-input"
                />
              </Form.Item>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <Button
                htmlType="submit"
                icon={<PlusOutlined />}
                size="large"
                loading={createCommissionMutation.isPending}
                style={{
                  background: 'linear-gradient(to right, var(--border), var(--primary))',
                  border: 'none',
                  color: 'var(--background)',
                  fontWeight: 700,
                  borderRadius: '8px',
                  paddingInline: '28px',
                }}
              >
                Save Package
              </Button>
            </div>
          </Form>
        </>,
      )}

      {/* ── Commission Packages Table ── */}
      {cardGradientWrapper(
        <>
          <GradientTitle
            title="Commission Packages"
            subtitle={`${packages.length} package${packages.length !== 1 ? 's' : ''} configured`}
          />
          <Table
            columns={packageColumns}
            dataSource={packages}
            rowKey="id"
            pagination={false}
            className="commission-table"
          />
        </>,
      )}

      {/* ── Edit Package Drawer ── */}
      <Drawer
        title={
          <span
            style={{
              background: 'linear-gradient(135deg, var(--secondary), var(--primary))',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              fontWeight: 700,
              fontSize: '18px',
            }}
          >
            Edit Package
          </span>
        }
        open={editDrawerOpen}
        onClose={() => setEditDrawerOpen(false)}
        width={480}
        styles={{
          body: { background: 'var(--background)', padding: '28px 24px' },
          header: { background: '#FFFFFF', borderBottom: '1px solid var(--border)' },
          mask: { backdropFilter: 'blur(4px)' },
        }}
        closeIcon={<span style={{ color: 'var(--text-muted)' }}>✕</span>}
      >
        <Form form={editForm} layout="vertical" onFinish={handleEditSave}>
          <Form.Item
            name="name"
            rules={[{ required: true, message: 'Package name is required' }]}
            style={{ marginBottom: '20px' }}
            label={<span style={labelStyle}>Package Name</span>}
          >
            <Input
              size="large"
              placeholder="Package name"
              style={inputStyle}
              styles={{ input: { backgroundColor: 'var(--background)', color: 'var(--text)' } }}
              className="commission-text-input"
            />
          </Form.Item>

          <Form.Item
            name="type"
            rules={[{ required: true, message: 'Please select a type' }]}
            style={{ marginBottom: '20px' }}
            label={<span style={labelStyle}>Type</span>}
          >
            <Select size="large" className="commission-select-full">
              <Option value="PAYIN">PayIn</Option>
              <Option value="PAYOUT">PayOut</Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="defaultGstPercentage"
            style={{ marginBottom: '20px' }}
            label={<span style={labelStyle}>Default GST %</span>}
          >
            <InputNumber
              size="large"
              min={0}
              max={100}
              style={{ width: '100%', ...inputStyle }}
              className="commission-number-input"
            />
          </Form.Item>

          <Form.Item
            name="description"
            style={{ marginBottom: '28px' }}
            label={<span style={labelStyle}>Description</span>}
          >
            <Input
              size="large"
              placeholder="Brief description"
              style={inputStyle}
              styles={{ input: { backgroundColor: 'var(--background)', color: 'var(--text)' } }}
              className="commission-text-input"
            />
          </Form.Item>

          <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
            <Button
              size="large"
              onClick={() => setEditDrawerOpen(false)}
              style={{
                background: '#FFFFFF',
                borderColor: 'var(--border)',
                color: 'var(--text)',
                borderRadius: '8px',
              }}
            >
              Cancel
            </Button>
            <Button
              htmlType="submit"
              size="large"
              icon={<SaveOutlined />}
              loading={updateCommissionMutation.isPending}
              style={{
                background: 'linear-gradient(to right, var(--border), var(--primary))',
                border: 'none',
                color: 'var(--background)',
                fontWeight: 700,
                borderRadius: '8px',
                paddingInline: '24px',
              }}
            >
              Save Changes
            </Button>
          </div>
        </Form>
      </Drawer>

      {/* ── Manage Slabs Drawer ── */}
      <Drawer
        title={
          <div>
            <span
              style={{
                background: 'linear-gradient(135deg, var(--secondary), var(--primary))',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                fontWeight: 700,
                fontSize: '17px',
              }}
            >
              {updatePackage?.name}
            </span>
            {updatePackage && (
              <Tag
                style={{
                  marginLeft: '10px',
                  backgroundColor: `${typeTagColor[updatePackage.type]}22`,
                  borderColor: typeTagColor[updatePackage.type],
                  color: typeTagColor[updatePackage.type],
                  borderRadius: '6px',
                  fontWeight: 600,
                  fontSize: '11px',
                }}
              >
                {typeLabel[updatePackage.type]}
              </Tag>
            )}
          </div>
        }
        open={updateDrawerOpen}
        onClose={() => {
          setUpdateDrawerOpen(false);
          setUpdatePackage(null);
          setEditingSlabId(null);
          setSlabForm(defaultSlabForm);
        }}
        width={820}
        styles={{
          body: { background: 'var(--background)', padding: '24px' },
          header: { background: '#FFFFFF', borderBottom: '1px solid var(--border)' },
          mask: { backdropFilter: 'blur(4px)' },
        }}
        closeIcon={<span style={{ color: 'var(--text-muted)' }}>✕</span>}
      >
        {/* Commission Slab Form */}
        <div
          style={{
            background: '#FFFFFF',
            borderRadius: '10px',
            border: '1px solid var(--border)',
            padding: '20px',
            marginBottom: '24px',
          }}
        >
          <p
            style={{
              color: 'var(--secondary)',
              fontSize: '11px',
              fontWeight: 600,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              margin: '0 0 16px',
            }}
          >
            {editingSlabId ? 'Edit Commission Slab' : 'Add Commission Slab'}
          </p>

          {/* Row 1: Min / Max amount */}
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label style={labelStyle}>
                Min Amount <span style={{ color: '#E8526A' }}>*</span>
              </label>
              <InputNumber
                value={slabForm.minAmount}
                onChange={(v) => setSlabForm((f) => ({ ...f, minAmount: v ?? 0 }))}
                min={0}
                placeholder="0"
                size="large"
                style={{ width: '100%', ...inputStyle }}
                className="commission-number-input"
                prefix="₹"
              />
            </div>
            <div>
              <label style={labelStyle}>
                Max Amount{' '}
                <span style={{ color: 'var(--text-muted)', fontSize: '11px' }}>(leave empty for unlimited)</span>
              </label>
              <InputNumber
                value={slabForm.maxAmount ?? undefined}
                onChange={(v) => setSlabForm((f) => ({ ...f, maxAmount: v ?? null }))}
                min={0}
                placeholder="Unlimited"
                size="large"
                style={{ width: '100%', ...inputStyle }}
                className="commission-number-input"
                prefix="₹"
              />
            </div>
          </div>

          {/* Row 2: Charge Type + Charge Value */}
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label style={labelStyle}>
                Charge Type <span style={{ color: '#E8526A' }}>*</span>
              </label>
              <Select
                value={slabForm.chargeType}
                onChange={(v) => setSlabForm((f) => ({ ...f, chargeType: v }))}
                size="large"
                style={{ width: '100%' }}
                className="commission-select-full"
              >
                <Option value="PERCENTAGE">Percentage (%)</Option>
                <Option value="FLAT">Flat (₹)</Option>
              </Select>
            </div>
            <div>
              <label style={labelStyle}>
                Charge Value <span style={{ color: '#E8526A' }}>*</span>
              </label>
              <Space.Compact style={{ width: '100%' }}>
                <InputNumber
                  value={slabForm.chargeValue}
                  onChange={(v) => setSlabForm((f) => ({ ...f, chargeValue: v ?? 0 }))}
                  min={0}
                  max={slabForm.chargeType === 'PERCENTAGE' ? 100 : undefined}
                  placeholder="0"
                  size="large"
                  style={{ width: '100%', ...inputStyle, borderRadius: '8px 0 0 8px' }}
                  className="commission-number-input"
                />
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    padding: '0 12px',
                    background: 'var(--sidebar-active-bg)',
                    border: '1px solid var(--border)',
                    borderLeft: 'none',
                    borderRadius: '0 8px 8px 0',
                    color: 'var(--secondary)',
                    fontWeight: 600,
                    fontSize: '14px',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {slabForm.chargeType === 'PERCENTAGE' ? '%' : '₹'}
                </div>
              </Space.Compact>
            </div>
          </div>

          {/* Row 3: GST % + Priority */}
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label style={labelStyle}>
                GST %{' '}
                <span style={{ color: 'var(--text-muted)', fontSize: '11px' }}>(leave empty to use plan default)</span>
              </label>
              <InputNumber
                value={slabForm.gstPercentage ?? undefined}
                onChange={(v) => setSlabForm((f) => ({ ...f, gstPercentage: v ?? null }))}
                min={0}
                max={100}
                placeholder={`Plan default (${updatePackage?.defaultGstPercentage ?? 18}%)`}
                size="large"
                style={{ width: '100%', ...inputStyle }}
                className="commission-number-input"
              />
            </div>
            <div>
              <label style={labelStyle}>
                Priority{' '}
                <span style={{ color: 'var(--text-muted)', fontSize: '11px' }}>(higher = checked first)</span>
              </label>
              <InputNumber
                value={slabForm.priority}
                onChange={(v) => setSlabForm((f) => ({ ...f, priority: v ?? 0 }))}
                min={0}
                placeholder="0"
                size="large"
                style={{ width: '100%', ...inputStyle }}
                className="commission-number-input"
              />
            </div>
          </div>

          {/* Row 4: Actions */}
          <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
            {editingSlabId && (
              <Button
                size="large"
                onClick={() => {
                  setEditingSlabId(null);
                  setSlabForm(defaultSlabForm);
                }}
                style={{
                  background: '#FFFFFF',
                  borderColor: 'var(--border)',
                  color: 'var(--text)',
                  borderRadius: '8px',
                }}
              >
                Cancel
              </Button>
            )}
            <Button
              icon={<SaveOutlined />}
              size="large"
              onClick={handleSaveCommission}
              loading={addSlabMutation.isPending || updateSlabMutation.isPending}
              style={{
                background: 'linear-gradient(to right, var(--border), var(--primary))',
                border: 'none',
                color: 'var(--background)',
                fontWeight: 700,
                borderRadius: '8px',
                paddingInline: '20px',
              }}
            >
              {editingSlabId ? 'Update Slab' : 'Add Slab'}
            </Button>
          </div>
        </div>

        {/* Commission Slab Table */}
        <div>
          <p
            style={{
              color: 'var(--secondary)',
              fontSize: '11px',
              fontWeight: 600,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              margin: '0 0 12px',
            }}
          >
            Commission Slabs — {currentSlabs.length}{' '}
            {currentSlabs.length === 1 ? 'entry' : 'entries'}
          </p>
          <Table
            columns={slabColumns}
            dataSource={currentSlabs}
            rowKey="id"
            pagination={false}
            scroll={{ x: 700 }}
            className="commission-slab-table"
            locale={{
              emptyText: (
                <span style={{ color: 'var(--text-muted)' }}>No slabs configured yet</span>
              ),
            }}
          />
        </div>
      </Drawer>

      {/* ── Global styles ── */}
      <style jsx global>{`
        .commission-text-input.ant-input-affix-wrapper,
        .commission-text-input.ant-input {
          background-color: var(--background) !important;
          border-color: var(--border) !important;
          border-radius: 8px !important;
          color: var(--text) !important;
        }
        .commission-text-input .ant-input {
          background-color: var(--background) !important;
          color: var(--text) !important;
        }
        .commission-text-input.ant-input-affix-wrapper:hover,
        .commission-text-input.ant-input:hover {
          border-color: var(--primary) !important;
        }
        .commission-text-input.ant-input-affix-wrapper:focus-within,
        .commission-text-input.ant-input:focus {
          border-color: var(--primary) !important;
          box-shadow: 0 0 0 2px rgba(0, 135, 90, 0.12) !important;
        }

        .commission-number-input.ant-input-number {
          background-color: var(--background) !important;
          border-color: var(--border) !important;
          border-radius: 8px !important;
        }
        .commission-number-input.ant-input-number .ant-input-number-input {
          background-color: var(--background) !important;
          color: var(--text) !important;
        }
        .commission-number-input.ant-input-number:hover,
        .commission-number-input.ant-input-number:focus {
          border-color: var(--primary) !important;
        }

        .commission-select-full .ant-select-selector {
          background-color: var(--background) !important;
          border-color: var(--border) !important;
          border-radius: 8px !important;
          color: var(--text) !important;
          height: 40px !important;
          align-items: center !important;
        }
        .commission-select-full .ant-select-arrow,
        .commission-select-full .ant-select-clear {
          color: var(--text-muted) !important;
        }
        .commission-select-full:hover .ant-select-selector {
          border-color: var(--primary) !important;
        }
        .commission-select-full.ant-select-focused .ant-select-selector {
          border-color: var(--primary) !important;
          box-shadow: 0 0 0 2px rgba(0, 135, 90, 0.12) !important;
        }

        .ant-select-dropdown {
          background-color: #ffffff !important;
          border: 1px solid var(--border) !important;
          border-radius: 8px !important;
        }
        .ant-select-item {
          color: var(--text) !important;
        }
        .ant-select-item-option-active {
          background-color: var(--background) !important;
        }
        .ant-select-item-option-selected {
          background-color: var(--sidebar-active-bg) !important;
          color: var(--secondary) !important;
          font-weight: 600 !important;
        }

        .commission-table .ant-table {
          background: #ffffff !important;
          border-radius: 8px;
        }
        .commission-table .ant-table-thead > tr > th {
          background: var(--background) !important;
          color: var(--text-muted) !important;
          border-bottom: 1px solid var(--border) !important;
          font-size: 11px !important;
          font-weight: 600 !important;
          letter-spacing: 0.07em !important;
          text-transform: uppercase !important;
        }
        .commission-table .ant-table-tbody > tr > td {
          background: #ffffff !important;
          border-bottom: 1px solid var(--border) !important;
          color: var(--text) !important;
        }
        .commission-table .ant-table-tbody > tr:hover > td {
          background: var(--background) !important;
        }
        .commission-table .ant-table-placeholder {
          background: #ffffff !important;
          color: var(--text-muted) !important;
        }

        .commission-slab-table .ant-table {
          background: #ffffff !important;
          border-radius: 8px;
        }
        .commission-slab-table .ant-table-thead > tr > th {
          background: var(--background) !important;
          color: var(--text-muted) !important;
          border-bottom: 1px solid var(--border) !important;
          font-size: 11px !important;
          font-weight: 600 !important;
          letter-spacing: 0.06em !important;
          text-transform: uppercase !important;
          white-space: nowrap !important;
        }
        .commission-slab-table .ant-table-tbody > tr > td {
          background: #ffffff !important;
          border-bottom: 1px solid var(--border) !important;
          font-size: 13px !important;
          color: var(--text) !important;
        }
        .commission-slab-table .ant-table-tbody > tr:hover > td {
          background: var(--background) !important;
        }
        .commission-slab-table .ant-table-placeholder {
          background: #ffffff !important;
          color: var(--text-muted) !important;
        }

        .ant-form-item-label > label {
          height: auto !important;
        }
      `}</style>
    </div>
  );
}
