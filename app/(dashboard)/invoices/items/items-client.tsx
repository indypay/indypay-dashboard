'use client';

import { useState } from 'react';
import {
  Table,
  TableHeader,
  TableBody,
  TableColumn,
  TableRow,
  TableCell,
  Button,
  useDisclosure,
} from '@heroui/react';
import { PencilIcon, TrashIcon } from '@heroicons/react/24/outline';

import { ItemModal } from '../components/ItemModal';
import { Item } from '../stores/itemsStore';
import { IItem } from '@/lib/interfaces/invoice.interface';

interface ItemsClientProps {
  initialItems: Item[];
  onEdit?: (item: Item) => void;
}

export default function ItemsClient({ initialItems }: ItemsClientProps) {
  const [items, setItems] = useState<Item[]>(initialItems);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [editingItem, setEditingItem] = useState<IItem | null>(null);

  const handleEdit = (item: IItem) => {
    setEditingItem(item);
    onOpen();
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/items?id=${id}`, {
        method: 'DELETE',
      });
      if (!res.ok) throw new Error('Failed to delete item');
      setItems(items.filter((item) => item.id !== id));
    } catch (error) {
      console.error('Error deleting item:', error);
    }
  };

  const handleCreateOrUpdate = async (itemData: Partial<Item>) => {
    try {
      const res = await fetch('/api/items', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(itemData),
      });
      if (!res.ok) throw new Error('Failed to save item');
      const newItem = await res.json();

      if (editingItem) {
        setItems(
          items.map((item) => (item.id === editingItem.id ? newItem : item)),
        );
      } else {
        setItems([...items, newItem]);
      }

      onClose();
      setEditingItem(null);
    } catch (error) {
      console.error('Error saving item:', error);
    }
  };

  return (
    <>
      <Table aria-label="Items table">
        <TableHeader>
          <TableColumn>NAME</TableColumn>
          <TableColumn>DESCRIPTION</TableColumn>
          <TableColumn>PRICE</TableColumn>
          <TableColumn>TAX</TableColumn>
          <TableColumn>ACTIONS</TableColumn>
        </TableHeader>
        <TableBody>
          {items.map((item) => (
            <TableRow key={item.id}>
              <TableCell>{item.name}</TableCell>
              <TableCell>{item.description}</TableCell>
              <TableCell>₹{item.price}</TableCell>
              <TableCell>{item.tax}%</TableCell>
              <TableCell>
                <div className="flex gap-2">
                  <Button
                    isIconOnly
                    variant="light"
                    onPress={() => handleEdit(item as IItem)}
                  >
                    <PencilIcon className="h-4 w-4" />
                  </Button>
                  <Button
                    isIconOnly
                    variant="light"
                    color="danger"
                    onPress={() => handleDelete(item.id)}
                  >
                    <TrashIcon className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <ItemModal
        isOpen={isOpen}
        onClose={() => {
          onClose();
          setEditingItem(null);
        }}
        editItem={editingItem || undefined}
        onSubmit={handleCreateOrUpdate}
      />
    </>
  );
}
