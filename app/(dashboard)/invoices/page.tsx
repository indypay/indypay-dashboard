'use client';

import { useState } from 'react';
import { Tabs, Button } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { PaymentProductBanner } from '@/lib/components/PaymentProductBanner/PaymentProductBanner';
import { InvoiceFilters } from './components/InvoiceFilters';
import { InvoiceTable } from './components/InvoiceTable';
import { ItemsTable } from './components/ItemsTable';
import { ItemModal } from './components/ItemModal';
import { useRouter } from 'next/navigation';
import { IItem, IInvoiceFilters } from '@/lib/interfaces/invoice.interface';
import DeleteItemModal from './components/DeleteItemModal';
import { deleteItem } from '@/lib/hooks/use-invoice';
import { PricingModal } from './components/PricingModal';

export default function InvoicesPage() {
  const [selectedTab, setSelectedTab] = useState('invoices');
  const [isItemModalOpen, setIsItemModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<IItem | undefined>(undefined);
  const [isItemDeleteModalOpen, setIsItemDeleteModalOpen] = useState(false);
  const [deletingItem, setDeletingItem] = useState<IItem | undefined>(
    undefined,
  );
  const [filters, setFilters] = useState({});
  const [isPricingModalOpen, setIsPricingModalOpen] = useState(false);

  const { mutate: deleteItemMutation } = deleteItem();

  const handleSearch = (newFilters: IInvoiceFilters) => {
    setFilters(newFilters);
  };

  const router = useRouter();
  const handleEdit = (item: IItem) => {
    setEditingItem(item);
    setIsItemModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsItemModalOpen(false);
    setEditingItem(undefined);
  };

  const handleDelete = (item: IItem) => {
    deleteItemMutation(item.id as string);
    setIsItemDeleteModalOpen(true);
    setDeletingItem(item);
  };

  const tabItems = [
    {
      key: 'invoices',
      label: (
        <span style={{ fontSize: '14px', fontWeight: 500 }}>Invoices</span>
      ),
    },
    {
      key: 'items',
      label: <span style={{ fontSize: '14px', fontWeight: 500 }}>Items</span>,
    },
  ];

  const renderTabContent = () => {
    if (selectedTab === 'invoices') {
      return (
        <>
          <InvoiceFilters onSearch={handleSearch} />
          <InvoiceTable filters={filters} />
        </>
      );
    }

    return (
      <>
        <div className="mx-4 px-6 py-4 mb-4 flex justify-end">
          <Button
            type="primary"
            size="large"
            icon={<PlusOutlined />}
            style={{
              background: 'var(--cta-gradient)',
              border: 'none',
              color: 'var(--background)',
              fontWeight: 600,
            }}
            onClick={() => setIsItemModalOpen(true)}
          >
            Create Item
          </Button>
        </div>
        <ItemsTable onEdit={handleEdit} onDelete={handleDelete} />
      </>
    );
  };

  return (
    <div className="w-full">
      <PaymentProductBanner
        productName="Invoices"
        productDescription="Create and manage invoices for your business"
        pricingInfo={{
          title: 'Charges',
          description:
            "A reminder on how you'll be charged for Invoices transactions",
          onViewPricing: () => setIsPricingModalOpen(true),
        }}
        getStartedSteps={[
          {
            step: 1,
            title: 'Invoice Created',
            description:
              'Create GST based invoices instantly and notify your customer via sms or email.',
          },
          {
            step: 2,
            title: 'Receive Payments',
            description:
              'Your customers can make payments directly via the invoice link.',
          },
        ]}
        scrollTargetId="filters-section"
      />

      <div
        id="filters-section"
        className="mx-4 px-6 py-4 mb-1"
        style={{ marginTop: '24px' }}
      >
        <div className="flex justify-between items-center">
          <Tabs
            activeKey={selectedTab}
            onChange={(key) => setSelectedTab(key)}
            items={tabItems}
          />
          {selectedTab === 'invoices' && (
            <Button
              type="primary"
              size="large"
              icon={<PlusOutlined />}
              style={{
                background: 'var(--cta-gradient)',
                border: 'none',
                color: 'var(--background)',
                fontWeight: 600,
              }}
              onClick={() => router.push('/invoices/create')}
            >
              Create Invoice
            </Button>
          )}
        </div>
      </div>

      {renderTabContent()}

      <ItemModal
        isOpen={isItemModalOpen}
        onClose={handleCloseModal}
        editItem={editingItem as IItem}
      />
      <DeleteItemModal
        isOpen={isItemDeleteModalOpen}
        onClose={() => setIsItemDeleteModalOpen(false)}
        item={deletingItem as IItem}
      />
      <PricingModal
        isOpen={isPricingModalOpen}
        onClose={() => setIsPricingModalOpen(false)}
      />
    </div>
  );
}
