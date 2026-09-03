'use client';

import { useState, useEffect } from 'react';
import { Button, Select, SelectItem } from '@heroui/react';
import { InputNumber } from 'antd';
import { PlusIcon, TrashIcon } from '@heroicons/react/24/outline';
import { ItemModal } from './ItemModal';
import { IInvoiceItems, IItem } from '@/lib/interfaces/invoice.interface';
import { createItem, getItems } from '@/lib/hooks/use-invoice';
import { INVOICE_STATUS } from '@/lib/enum';
import { FieldErrors, Path } from 'react-hook-form';
import { InvoiceFormData } from '@/lib/formHandler/useHandleForm';
import { useToast } from '@/lib/components/Toast/ToastContext';

interface InvoiceItemsProps {
  invoiceId?: string;
  items: IItem[];
  selectedItems: IInvoiceItems[];
  onItemsChange: (items: IInvoiceItems[]) => void;
  onTotalChange: (total: number) => void;
  invoiceStatus: INVOICE_STATUS;
  errors: FieldErrors<InvoiceFormData>;
  clearErrors: (name: Path<InvoiceFormData>) => void;
  onUpdateInvoiceItemPrice?: (invoiceItemId: string, price: number) => Promise<void>;
}

export const InvoiceItems = ({
  invoiceId,
  items,
  selectedItems,
  onItemsChange,
  onTotalChange,
  invoiceStatus,
  errors,
  clearErrors,
  onUpdateInvoiceItemPrice,
}: InvoiceItemsProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeRowIndex, setActiveRowIndex] = useState<number | null>(null);
  const [savingIndex, setSavingIndex] = useState<number | null>(null);
  const { mutateAsync: createItemMutation } = createItem();
  const { refetch: refetchItems } = getItems();
  const { showToast } = useToast();
  useEffect(() => {
    const total = calculateTotal(selectedItems);
    onTotalChange?.(total);
  }, [selectedItems, onTotalChange]);

  const calculateTotal = (items: IInvoiceItems[]) => {
    return items.reduce((sum, item) => {
      const subtotal = (item.price || 0) * item.quantity;
      const gst = subtotal * ((item.gstRate || 18) / 100);
      return sum + subtotal + gst;
    }, 0);
  };

  useEffect(() => {
    const hasValidItem = selectedItems.some(
      (item) => item.id && item.quantity > 0,
    );

    if (hasValidItem) {
      clearErrors('items');
    }
  }, [selectedItems, clearErrors]);

  const handleItemSelect = (value: string, index: number) => {
    if (value === 'create-new') {
      setActiveRowIndex(index);
      setIsModalOpen(true);
      return;
    }

    const selectedItem = items.find((i) => String(i.id) === String(value));

    if (!selectedItem) {
      console.error(`Item with ID ${value} not found`);
      return;
    }

    const updatedItems = [...selectedItems];

    updatedItems[index] = {
      id: value,
      quantity: Number(updatedItems[index]?.quantity) || 1,
      price: Number(selectedItem.price) || 0,
      gstRate: Number(selectedItem.gstRate) || 0,
    };

    onItemsChange([...updatedItems]);
    clearErrors('items');
  };

  const handleItemSubmit = async (
    item: Omit<IItem, 'id' | 'createdAt' | 'updatedAt'>,
  ) => {
    const [response, error] = await createItemMutation({
      ...item,
      description: item.description || '',
    } as IItem);
    if (response && !error) {
      showToast('Item Added Successfully', 'success');
      refetchItems();
    } else {
      showToast('Item Addition Failed', 'error');
    }
  };

  const handleQuantityChange = (value: string, index: number) => {
    const quantity = parseInt(value) || 0;
    const updatedItems = [...selectedItems];
    const price = updatedItems[index]?.price || 0;
    const taxRate = updatedItems[index]?.gstRate || 18;
    const taxAmount = (price * quantity * taxRate) / 100;

    updatedItems[index] = {
      ...updatedItems[index],
      quantity: Number(quantity) || 0,
      price: Number(price) || 0,
      total: price * quantity + taxAmount, // Include tax in total
    };

    onItemsChange([...updatedItems]);
    if (quantity > 0) {
      clearErrors('items');
    }
  };

  const addNewRow = () => {
    onItemsChange([...selectedItems, { id: '', quantity: 1 }]);
  };

  const removeRow = (index: number) => {
    const updatedItems = selectedItems.filter((_, i) => i !== index);
    onItemsChange(updatedItems);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Items</h3>
      </div>

      <div
        className="p-4"
        style={{
          background: 'var(--primary)',
          color: '#ffffff',
        }}
      >
        <div className="grid grid-cols-12 gap-4">
          <div className="col-span-4">
            <h3 className="font-medium">DESCRIPTION</h3>
          </div>
          <div className="col-span-2">
            <h3 className="font-medium">RATE/ITEM</h3>
          </div>
          <div className="col-span-2">
            <h3 className="font-medium">QTY</h3>
          </div>
          <div className="col-span-2">
            <h3 className="font-medium">TAX</h3>
          </div>
          <div className="col-span-1">
            <h3 className="font-medium">TOTAL</h3>
          </div>
          <div className="col-span-1">
            <h3 className="font-medium"></h3>
          </div>
        </div>
      </div>
      {errors.items && <p className="text-red-500">{errors.items.message}</p>}
      <div className="space-y-2">
        {selectedItems.map((item, index) => {
          const selectedItem = items.find((i) => i.id === item.id);
          const rowPrice = item.price ?? selectedItem?.price ?? 0;
          const rowGstRate = item.gstRate ?? selectedItem?.gstRate ?? 18;
          return (
            <div
              key={index}
              className={`grid grid-cols-12 gap-10 items-center py-4 pl-0 pr-4 ${index % 2 === 1 ? 'bg-gray-50' : ''}`}
            >
              <div className="col-span-4">
                {invoiceStatus === INVOICE_STATUS.DRAFT ? (
                  <Select
                    label="Select an item"
                    selectedKeys={
                      items.some((i) => i.id === item.id) ? [item.id] : []
                    }
                    // selectedKeys={item.id ? new Set([item.id]) : new Set()}
                    // selectedKeys={selectedItem?.id ? new Set([selectedItem.id]) : new Set()}
                    onChange={(e) => handleItemSelect(e.target.value, index)}
                    items={[
                      ...items,
                      {
                        id: 'create-new',
                        name: '+ Create new Item',
                        divider: true,
                      },
                    ]}
                  >
                    {(option) => (
                      <SelectItem
                        key={option.id}
                        className={
                          option.id === 'create-new'
                            ? 'text-primary border-t mt-2 pt-2'
                            : ''
                        }
                      >
                        {option.name}
                      </SelectItem>
                    )}
                  </Select>
                ) : (
                  <p className="text-md font-medium mt-1">
                    {selectedItem?.name}
                  </p>
                )}
                {selectedItem?.description && (
                  <p className="text-sm text-gray-500 mt-1">
                    {selectedItem.description}
                  </p>
                )}
              </div>

              <div className="col-span-2">
                {invoiceStatus === INVOICE_STATUS.DRAFT ? (
                  <div className="flex items-center gap-2">
                    <InputNumber
                      value={rowPrice}
                      min={0}
                      onChange={(val) => {
                        const updatedItems = [...selectedItems];
                        updatedItems[index] = {
                          ...updatedItems[index],
                          price: typeof val === 'number' ? val : Number(val) || 0,
                        };
                        onItemsChange(updatedItems);
                      }}
                      className="w-28"
                    />
                    {invoiceId && item.invoiceItemId && (
                      <Button
                        size="sm"
                        color="primary"
                        variant="flat"
                        isLoading={savingIndex === index}
                        onPress={async () => {
                          if (!onUpdateInvoiceItemPrice || !item.invoiceItemId) return;
                          setSavingIndex(index);
                          try {
                            await onUpdateInvoiceItemPrice(
                              item.invoiceItemId,
                              Number(rowPrice),
                            );
                          } finally {
                            setSavingIndex(null);
                          }
                        }}
                      >
                        Save
                      </Button>
                    )}
                  </div>
                ) : (
                  <p className="text-gray-600">₹{rowPrice.toLocaleString('en-IN')}</p>
                )}
              </div>

              <div className="col-span-2">
                {invoiceStatus === INVOICE_STATUS.DRAFT ? (
                  <InputNumber
                    value={item.quantity}
                    onChange={(val) =>
                      handleQuantityChange((val || 1).toString(), index)
                    }
                    className="w-20"
                    min={1}
                  />
                ) : (
                  <p className="text-md font-medium mt-1">{item.quantity}</p>
                )}
              </div>

              <div className="col-span-2">
                <p className="text-gray-600">{rowGstRate}%</p>
              </div>

              <div className="col-span-1 flex items-center gap-2">
                <p className="text-gray-600">
                  ₹
                  {(
                    rowPrice * (item.quantity || 0) +
                    rowPrice * (item.quantity || 0) * (rowGstRate / 100)
                  ).toLocaleString('en-IN')}
                </p>
              </div>

              <div className="flex-col">
                {invoiceStatus === INVOICE_STATUS.DRAFT ? (
                  <Button
                    isIconOnly
                    color="danger"
                    variant="light"
                    className="min-w-unit-8 w-8 h-8"
                    onClick={() => removeRow(index)}
                  >
                    <TrashIcon className="h-4 w-4" />
                  </Button>
                ) : null}
              </div>
            </div>
          );
        })}
      </div>

      <Button
        color="primary"
        variant="light"
        className="w-full"
        startContent={<PlusIcon className="h-4 w-4" />}
        onPress={addNewRow}
        isDisabled={selectedItems.some((item) => !item.id)}
      >
        Add Item Row
      </Button>

      <ItemModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setActiveRowIndex(null);
        }}
        onSubmit={handleItemSubmit}
      />
    </div>
  );
};
