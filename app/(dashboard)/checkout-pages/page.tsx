'use client';

import { useEffect, useMemo, useState } from 'react';
import {
  Button,
  Input,
  Select,
  Table,
  Tag,
  Modal,
  Spin,
  Space,
  Empty,
  TableColumnsType,
  Pagination,
} from 'antd';
import {
  PlusOutlined,
  SearchOutlined,
  FileOutlined,
  CheckOutlined,
  EditOutlined,
  CopyOutlined,
  EyeOutlined,
  ShopOutlined,
} from '@ant-design/icons';
import { useRouter } from 'next/navigation';
import { PaymentProductBanner } from '@/lib/components/PaymentProductBanner/PaymentProductBanner';
import { PricingModal } from '@/app/(dashboard)/invoices/components/PricingModal';
import { useGetCheckoutPages } from '@/lib/hooks/use-checkout-pages';
import type { CheckoutPageRecord } from '@/lib/interfaces/checkout-page.interface';
import { useToast } from '@/lib/components/Toast/ToastContext';
import { getFormattedTime } from '@/lib/utils/utils';
import { safeAny } from '@/lib/interfaces/global.interface';

// ─── Types ────────────────────────────────────────────────────────────────────

type PageStatus = 'DRAFT' | 'PUBLISHED' | string;
type AmountType = 'FIXED' | 'USER_ENTERED';

// ─── Helpers ──────────────────────────────────────────────────────────────────

const getStatusStyle = (status: PageStatus): React.CSSProperties => {
  const base: React.CSSProperties = {
    borderRadius: '6px',
    padding: '4px 12px',
    fontWeight: 500,
    border: 'none',
  };
  switch (String(status).toUpperCase()) {
    case 'PUBLISHED':
    case 'ACTIVE':
      return {
        ...base,
        backgroundColor: '#0DD25F15',
        color: '#0DD25F',
        border: '1px solid #0DD25F40',
      };
    case 'INACTIVE':
      return {
        ...base,
        backgroundColor: '#D51C4415',
        color: '#D51C44',
        border: '1px solid #D51C4440',
      };
    case 'DRAFT':
    default:
      return {
        ...base,
        backgroundColor: '#F5A52415',
        color: '#F5A524',
        border: '1px solid #F5A52440',
      };
  }
};

const getAmountTypeLabel = (amountType: AmountType) =>
  amountType === 'FIXED' ? 'Fixed Amount' : 'Customer Sets';

// ─── Type Selection Modal ─────────────────────────────────────────────────────

interface TypeSelectionModalProps {
  open: boolean;
  onClose: () => void;
}

function TypeSelectionModal({ open, onClose }: TypeSelectionModalProps) {
  const router = useRouter();

  const handleSelectPaymentPage = () => {
    onClose();
    router.push('/checkout-pages/create');
  };

  return (
    <Modal
      open={open}
      onCancel={onClose}
      footer={null}
      width={820}
      centered
      style={{ top: 0 }}
      styles={{
        content: {
          background: '#FFFFFF',
          borderRadius: '16px',
          padding: 0,
        },
        header: {
          background: '#FFFFFF',
          borderBottom: '1px solid var(--border)',
          padding: '24px 32px',
          borderRadius: '16px 16px 0 0',
        },
        body: {
          background: '#FFFFFF',
          padding: '32px',
          borderRadius: '0 0 16px 16px',
        },
        mask: {
          backgroundColor: 'rgba(0,0,0,0.75)',
        },
      }}
      title={
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: '8px',
              background: 'linear-gradient(135deg, var(--secondary), var(--primary))',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <FileOutlined style={{ fontSize: '18px', color: 'var(--background)' }} />
          </div>
          <span style={{ color: 'var(--text)', fontSize: '20px', fontWeight: 700 }}>
            Select page of your choice
          </span>
        </div>
      }
    >
      <div className="grid grid-cols-2 gap-6">
        {/* Card 1: Payment Page */}
        <div
          style={{
            background: 'var(--background)',
            border: '1px solid var(--border)',
            borderRadius: '12px',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          {/* Browser chrome mockup preview */}
          <div
            style={{
              background: 'var(--background)',
              height: '160px',
              position: 'relative',
              borderBottom: '1px solid var(--border)',
            }}
          >
            {/* browser bar */}
            <div
              style={{
                background: '#EEF5F1',
                padding: '8px 12px',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                borderBottom: '1px solid var(--border)',
              }}
            >
              <div
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: '50%',
                  background: '#D51C44',
                  opacity: 0.6,
                }}
              />
              <div
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: '50%',
                  background: '#F5A524',
                  opacity: 0.6,
                }}
              />
              <div
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: '50%',
                  background: '#0DD25F',
                  opacity: 0.6,
                }}
              />
              <div
                style={{
                  flex: 1,
                  height: '16px',
                  background: 'var(--background)',
                  borderRadius: '4px',
                  marginLeft: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  paddingLeft: '8px',
                }}
              >
                <span style={{ color: 'var(--text-muted)', fontSize: '9px' }}>
                  rupeeflow.in/pay/your-page
                </span>
              </div>
            </div>
            {/* page content preview */}
            <div style={{ padding: '12px 16px' }}>
              <div
                style={{
                  background: 'var(--border)',
                  height: '10px',
                  borderRadius: '3px',
                  width: '60%',
                  marginBottom: '6px',
                }}
              />
              <div
                style={{
                  background: 'var(--border)',
                  height: '8px',
                  borderRadius: '3px',
                  width: '80%',
                  marginBottom: '10px',
                }}
              />
              <div
                style={{
                  background: 'linear-gradient(135deg, var(--secondary), var(--primary))',
                  height: '22px',
                  borderRadius: '4px',
                  width: '40%',
                  opacity: 0.7,
                }}
              />
            </div>
          </div>

          <div
            style={{
              padding: '20px',
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <h3
              style={{
                color: 'var(--text)',
                fontSize: '17px',
                fontWeight: 700,
                margin: '0 0 8px 0',
              }}
            >
              Payment page
            </h3>
            <p
              style={{
                color: 'var(--text-muted)',
                fontSize: '13px',
                margin: '0 0 12px 0',
                lineHeight: 1.6,
              }}
            >
              Setup your own custom branded page. Collect payments for:
            </p>
            <div style={{ marginBottom: '20px', flex: 1 }}>
              {['Events & tickets', 'Donations', 'Fees', 'Courses & more'].map(
                (item) => (
                  <div
                    key={item}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      marginBottom: '6px',
                    }}
                  >
                    <CheckOutlined
                      style={{ color: 'var(--primary)', fontSize: '12px' }}
                    />
                    <span style={{ color: 'var(--text)', fontSize: '13px' }}>
                      {item}
                    </span>
                  </div>
                ),
              )}
            </div>
            <Button
              type="primary"
              size="large"
              style={{
                background: 'linear-gradient(135deg, var(--secondary), var(--primary))',
                border: 'none',
                color: 'var(--background)',
                fontWeight: 600,
                width: '100%',
                borderRadius: '8px',
              }}
              onClick={handleSelectPaymentPage}
            >
              Select Payment page →
            </Button>
          </div>
        </div>

        {/* Card 2: Webstore */}
        <div
          style={{
            background: 'var(--background)',
            border: '1px solid var(--border)',
            borderRadius: '12px',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          {/* Browser chrome mockup preview */}
          <div
            style={{
              background: 'var(--background)',
              height: '160px',
              position: 'relative',
              borderBottom: '1px solid var(--border)',
            }}
          >
            <div
              style={{
                background: '#EEF5F1',
                padding: '8px 12px',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                borderBottom: '1px solid var(--border)',
              }}
            >
              <div
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: '50%',
                  background: '#D51C44',
                  opacity: 0.6,
                }}
              />
              <div
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: '50%',
                  background: '#F5A524',
                  opacity: 0.6,
                }}
              />
              <div
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: '50%',
                  background: '#0DD25F',
                  opacity: 0.6,
                }}
              />
              <div
                style={{
                  flex: 1,
                  height: '16px',
                  background: 'var(--background)',
                  borderRadius: '4px',
                  marginLeft: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  paddingLeft: '8px',
                }}
              >
                <span style={{ color: 'var(--text-muted)', fontSize: '9px' }}>
                  rupeeflow.in/store/your-store
                </span>
              </div>
            </div>
            <div style={{ padding: '12px 16px' }}>
              <div className="grid grid-cols-2 gap-2">
                {[0, 1, 2, 3].map((i) => (
                  <div
                    key={i}
                    style={{
                      background: 'var(--border)',
                      height: '30px',
                      borderRadius: '4px',
                      opacity: 0.6,
                    }}
                  />
                ))}
              </div>
            </div>
          </div>

          <div
            style={{
              padding: '20px',
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                marginBottom: '8px',
              }}
            >
              <h3
                style={{
                  color: 'var(--text)',
                  fontSize: '17px',
                  fontWeight: 700,
                  margin: 0,
                }}
              >
                RupeeFlow Webstore
              </h3>
              <Tag
                style={{
                  background: '#0DD25F20',
                  color: '#0DD25F',
                  border: '1px solid #0DD25F50',
                  borderRadius: '4px',
                  fontSize: '10px',
                  fontWeight: 700,
                  padding: '0 6px',
                  lineHeight: '18px',
                }}
              >
                NEW
              </Tag>
            </div>
            <p
              style={{
                color: 'var(--text-muted)',
                fontSize: '13px',
                margin: '0 0 20px 0',
                lineHeight: 1.6,
                flex: 1,
              }}
            >
              Showcase products on your online store and start accepting orders
            </p>
            <Button
              type="primary"
              size="large"
              disabled
              style={{
                background: 'linear-gradient(135deg, var(--secondary), var(--primary))',
                border: 'none',
                color: 'var(--background)',
                fontWeight: 600,
                width: '100%',
                borderRadius: '8px',
                opacity: 0.5,
              }}
            >
              Select Webstore → (Coming Soon)
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

const rowsPerPage = 50;

export default function CheckoutPagesPage() {
  const router = useRouter();
  const { showToast } = useToast();
  const [isPricingModalOpen, setIsPricingModalOpen] = useState(false);
  const [isTypeModalOpen, setIsTypeModalOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string | undefined>(
    undefined,
  );
  const [page, setPage] = useState(1);
  const [tableData, setTableData] = useState<CheckoutPageRecord[]>([]);
  const [totalRecords, setTotalRecords] = useState(0);

  const { data, isLoading } = useGetCheckoutPages({
    page,
    limit: rowsPerPage,
    search: search || undefined,
    status: statusFilter,
  });

  useEffect(() => {
    const raw = data as [safeAny, safeAny] | undefined;
    if (!raw || !Array.isArray(raw)) return;
    const [response, err] = raw;
    if (err) {
      setTableData([]);
      setTotalRecords(0);
      return;
    }
    const list = Array.isArray(response) ? response : (response?.data ?? []);
    setTableData(Array.isArray(list) ? list : []);
    const total =
      (response &&
        !Array.isArray(response) &&
        response?.pagination?.totalItems) ??
      0;
    setTotalRecords(Number(total) || 0);
  }, [data]);

  const handleCopyLink = (record: CheckoutPageRecord) => {
    const url =
      typeof window !== 'undefined'
        ? `${window.location.origin}/checkout-page/${record.id}`
        : '';
    if (url) {
      navigator.clipboard.writeText(url);
      showToast('Link copied to clipboard', 'success');
    }
  };

  const columns: TableColumnsType<CheckoutPageRecord> = [
    {
      title: 'Page Title',
      dataIndex: 'title',
      key: 'title',
      width: 220,
      render: (title: string) => (
        <span style={{ color: 'var(--text)', fontWeight: 500 }}>
          {title || '-'}
        </span>
      ),
    },
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      width: 160,
      render: (name: string) => (
        <span style={{ color: 'var(--text-muted)' }}>{name || '-'}</span>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      width: 140,
      render: (status: PageStatus) => (
        <Tag style={getStatusStyle(status)} bordered={false}>
          {String(status || 'DRAFT')}
        </Tag>
      ),
    },
    {
      title: 'Amount Type',
      dataIndex: 'amountType',
      key: 'amountType',
      width: 160,
      render: (amountType: AmountType) => (
        <span style={{ color: 'var(--text-muted)' }}>
          {getAmountTypeLabel(amountType || 'USER_ENTERED')}
        </span>
      ),
    },
    {
      title: 'Created At',
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 180,
      render: (createdAt: string) => (
        <span style={{ color: 'var(--text-muted)' }}>
          {createdAt ? getFormattedTime(new Date(createdAt)) : '-'}
        </span>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 140,
      fixed: 'right' as const,
      render: (_: unknown, record: CheckoutPageRecord) => (
        <Space size={4}>
          <Button
            type="text"
            size="small"
            icon={<EditOutlined />}
            style={{ color: 'var(--primary)' }}
            title="Edit"
            onClick={() =>
              router.push(`/checkout-pages/create?id=${record.id}`)
            }
          />
          <Button
            type="text"
            size="small"
            icon={<CopyOutlined />}
            style={{ color: 'var(--primary)' }}
            title="Copy link"
            onClick={() => handleCopyLink(record)}
          />
          <Button
            type="text"
            size="small"
            icon={<EyeOutlined />}
            style={{ color: 'var(--primary)' }}
            title="Preview"
            onClick={() =>
              window.open(`/checkout-page/${record.id}`, '_blank', 'noopener')
            }
          />
        </Space>
      ),
    },
  ];

  return (
    <div className="w-full">
      <PaymentProductBanner
        productName="Checkout Pages"
        productDescription="Create and customize checkout pages for your business"
        pricingInfo={{
          title: 'Charges',
          description:
            "A reminder on how you'll be charged for Checkout Page transactions",
          onViewPricing: () => setIsPricingModalOpen(true),
        }}
        getStartedSteps={[
          {
            step: 1,
            title: 'Create Checkout Page',
            description:
              'Design and customize your checkout page with your branding.',
          },
          {
            step: 2,
            title: 'Configure Payment Methods',
            description:
              'Set up available payment methods and options for customers.',
          },
          {
            step: 3,
            title: 'Go Live',
            description:
              'Share your checkout page URL and start accepting payments.',
          },
        ]}
        scrollTargetId="filters-section"
      />

      {/* Create button */}
      <div className="mx-4 px-6 py-4 mb-1 flex justify-end">
        <Button
          type="primary"
          size="large"
          icon={<PlusOutlined />}
          onClick={() => setIsTypeModalOpen(true)}
          style={{
            background: 'linear-gradient(to right, var(--border), var(--primary))',
            border: 'none',
            color: 'var(--background)',
            fontWeight: 600,
          }}
        >
          Create Payment Page
        </Button>
      </div>

      {/* Filters */}
      <div id="filters-section" className="mx-4 px-6 py-4 mb-1">
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
            <div className="flex items-center gap-4">
              <Input
                placeholder="Search checkout pages"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                prefix={<SearchOutlined style={{ color: 'var(--text-muted)' }} />}
                size="large"
                allowClear
                className="custom-search-input"
                style={{
                  width: 400,
                  backgroundColor: '#FFFFFF',
                  borderColor: 'var(--text-muted)',
                  borderRadius: '8px',
                }}
              />
              <Select
                placeholder="Filter by status"
                value={statusFilter}
                onChange={(value) => setStatusFilter(value)}
                allowClear
                size="large"
                className="custom-select"
                style={{ width: 200 }}
                options={[
                  { label: 'Active', value: 'active' },
                  { label: 'Inactive', value: 'inactive' },
                  { label: 'Draft', value: 'draft' },
                ]}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="mx-4 px-6 mb-4">
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
            <Spin spinning={isLoading} size="large">
              <Table<CheckoutPageRecord>
                columns={columns}
                dataSource={tableData}
                rowKey="id"
                pagination={false}
                scroll={{ x: 'max-content', y: 'calc(100vh - 350px)' }}
                locale={{
                  emptyText: (
                    <Empty
                      image={
                        <div
                          style={{
                            width: 64,
                            height: 64,
                            margin: '0 auto',
                            borderRadius: '16px',
                            background: 'var(--sidebar-active-bg)',
                            border: '1px solid var(--border)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}
                        >
                          <ShopOutlined
                            style={{ fontSize: '28px', color: 'var(--primary)' }}
                          />
                        </div>
                      }
                      imageStyle={{ height: 'auto' }}
                      description={
                        <div style={{ marginTop: '16px' }}>
                          <p
                            style={{
                              color: 'var(--text)',
                              fontSize: '16px',
                              fontWeight: 600,
                              margin: '0 0 6px 0',
                            }}
                          >
                            No checkout pages yet
                          </p>
                          <p
                            style={{
                              color: 'var(--text-muted)',
                              fontSize: '14px',
                              margin: '0 0 20px 0',
                            }}
                          >
                            Create your first payment page or webstore to start
                            collecting payments
                          </p>
                          <Button
                            type="primary"
                            icon={<PlusOutlined />}
                            onClick={() => setIsTypeModalOpen(true)}
                            style={{
                              background:
                                'linear-gradient(to right, var(--border), var(--primary))',
                              border: 'none',
                              color: 'var(--background)',
                              fontWeight: 600,
                            }}
                          >
                            Create Payment Page
                          </Button>
                        </div>
                      }
                      style={{ padding: '48px 0' }}
                    />
                  ),
                }}
                style={{ background: '#FFFFFF' }}
                size="middle"
              />
            </Spin>
            {totalRecords > 0 && (
              <div
                className="flex justify-center p-4"
                style={{
                  borderTop: '1px solid var(--border)',
                  color: 'var(--text)',
                }}
              >
                <Pagination
                  current={page}
                  total={totalRecords}
                  pageSize={rowsPerPage}
                  onChange={setPage}
                  showSizeChanger={false}
                  showQuickJumper
                  showTotal={(total, range) =>
                    `${range[0]}-${range[1]} of ${total} items`
                  }
                />
              </div>
            )}
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
            {/* Pagination can be added here if needed */}
          </div>
        </div>
      </div>

      <TypeSelectionModal
        open={isTypeModalOpen}
        onClose={() => setIsTypeModalOpen(false)}
      />

      <PricingModal
        isOpen={isPricingModalOpen}
        onClose={() => setIsPricingModalOpen(false)}
      />
    </div>
  );
}
