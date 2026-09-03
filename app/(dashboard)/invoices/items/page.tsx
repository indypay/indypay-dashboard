'use client';

import { Suspense, useState } from 'react';
import { Button } from '@heroui/react';
import { PlusIcon } from '@heroicons/react/24/outline';

import { ItemModal } from '../components/ItemModal';
import { Item } from '../stores/itemsStore';

import ItemsClient from './items-client';

import { safeAny } from '@/lib/interfaces/global.interface';
import { IItem } from '@/lib/interfaces/invoice.interface';
async function getItems() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/items`, {
    cache: 'no-store',
  });
  if (!res.ok) throw new Error('Failed to fetch items');
  return res.json();
}

export default async function ItemsPage() {
  const { items } = await getItems();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Item | undefined>(undefined);

  const handleEdit = (item: safeAny) => {
    setEditingItem(item);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingItem(undefined);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold">Items</h1>
        <Button
          color="primary"
          className="bg-[#7AEBB8]"
          endContent={<PlusIcon className="h-5 w-5" />}
          onPress={() => setIsModalOpen(true)}
        >
          Create Item
        </Button>
      </div>

      <Suspense fallback={<div>Loading items...</div>}>
        <ItemsClient initialItems={items} onEdit={handleEdit} />
      </Suspense>
      <ItemModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        editItem={editingItem as IItem}
      />
    </div>
  );
}
