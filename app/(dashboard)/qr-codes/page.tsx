'use client';

import { useState } from 'react';
import { Button, Input, Select, Table, Pagination, Spin } from 'antd';
import { PlusOutlined, SearchOutlined } from '@ant-design/icons';
import { PaymentProductBanner } from '@/lib/components/PaymentProductBanner/PaymentProductBanner';
import { PricingModal } from '@/app/(dashboard)/invoices/components/PricingModal';

export default function QRCodesPage() {
  const [isPricingModalOpen, setIsPricingModalOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');

  return (
    <div className="w-full">
      <PaymentProductBanner
        productName="QR Codes"
        productDescription="Create and manage QR codes for payments"
        pricingInfo={{
          title: 'Charges',
          description:
            "A reminder on how you'll be charged for QR Code transactions",
          onViewPricing: () => setIsPricingModalOpen(true),
        }}
        getStartedSteps={[
          {
            step: 1,
            title: 'Generate QR Code',
            description:
              'Create a unique QR code for your business with payment details.',
          },
          {
            step: 2,
            title: 'Display QR Code',
            description:
              'Print or display the QR code at your store or share it digitally.',
          },
          {
            step: 3,
            title: 'Receive Payments',
            description: 'Customers scan the QR code to make instant payments.',
          },
        ]}
        scrollTargetId="filters-section"
      />

      <div className="mx-4 px-6 py-4 mb-1 flex justify-end">
        <Button
          type="primary"
          size="large"
          icon={<PlusOutlined />}
          style={{
            background: 'linear-gradient(to right, var(--border), var(--primary))',
            border: 'none',
            color: 'var(--background)',
            fontWeight: 600,
          }}
        >
          Create QR Code
        </Button>
      </div>

      {/* Filters */}
      <div id="filters-section" className="mx-4 my-4">
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
                placeholder="Search QR codes"
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
              <Select
                placeholder="Status"
                value={status}
                onChange={(value) => setStatus(value)}
                allowClear
                style={{
                  width: 200,
                  backgroundColor: 'var(--background)',
                }}
                options={[
                  { label: 'Active', value: 'active' },
                  { label: 'Inactive', value: 'inactive' },
                ]}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Table */}
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
              padding: '20px',
            }}
          >
            <Spin spinning={false}>
              <div
                style={{
                  textAlign: 'center',
                  padding: '40px',
                  color: 'var(--text-muted)',
                }}
              >
                QR Codes table will be displayed here
              </div>
            </Spin>
          </div>
        </div>
      </div>

      <PricingModal
        isOpen={isPricingModalOpen}
        onClose={() => setIsPricingModalOpen(false)}
      />
    </div>
  );
}
