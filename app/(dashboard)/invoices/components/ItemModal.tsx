'use client';

import { useState, useEffect } from 'react';
import { Modal, Input, Button, Alert, Select } from 'antd';
import { CloseOutlined, InfoCircleOutlined } from '@ant-design/icons';

import { IItem } from '@/lib/interfaces/invoice.interface';
import { FINANCE_HSN_CODES } from '@/lib/constants/hsn-codes.constants';

const { TextArea } = Input;

// Valid Indian GST slabs
const GST_SLABS = [
  { value: 0, label: '0% — Exempt' },
  { value: 5, label: '5%' },
  { value: 12, label: '12%' },
  { value: 18, label: '18% (standard)' },
  { value: 28, label: '28% (luxury)' },
];

interface ItemModalProps {
  isOpen: boolean;
  onClose: () => void;
  editItem?: IItem;
  onSubmit?: (item: Omit<IItem, 'id'>) => void;
}

interface FormData {
  name: string;
  description: string;
  price: string;
  gstRate: number;
  hsnCode: string;
}

export const ItemModal = ({
  isOpen,
  onClose,
  editItem,
  onSubmit,
}: ItemModalProps) => {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    description: '',
    price: '',
    gstRate: 18,
    hsnCode: '',
  });

  useEffect(() => {
    if (editItem) {
      setFormData({
        name: editItem.name,
        description: editItem.description || '',
        price: editItem.price.toString(),
        gstRate: editItem.gstRate ?? 18,
        hsnCode: editItem.hsnCode || '',
      });
    } else {
      setFormData({
        name: '',
        description: '',
        price: '',
        gstRate: 18,
        hsnCode: '',
      });
    }
  }, [editItem, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const itemData: Omit<IItem, 'id'> = {
      name: formData.name,
      description: formData.description || '',
      price: parseFloat(formData.price) || 0,
      gstRate: formData.gstRate,
      hsnCode: formData.hsnCode || undefined,
    };

    if (onSubmit) onSubmit(itemData);
    onClose();
    setFormData({
      name: '',
      description: '',
      price: '',
      gstRate: 18,
      hsnCode: '',
    });
  };

  const handleInput =
    (
      field: keyof Pick<FormData, 'name' | 'description' | 'price' | 'hsnCode'>,
    ) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setFormData((prev) => ({ ...prev, [field]: e.target.value }));
    };

  // Compute effective tax amount for preview
  const priceNum = parseFloat(formData.price) || 0;
  const taxAmount = (priceNum * formData.gstRate) / 100;
  const totalWithTax = priceNum + taxAmount;

  return (
    <Modal
      title={
        <h3
          style={{
            color: '#333333',
            fontSize: '20px',
            fontWeight: 600,
            margin: 0,
          }}
        >
          {editItem ? 'Edit Item' : 'Add Item'}
        </h3>
      }
      open={isOpen}
      onCancel={onClose}
      footer={null}
      width={680}
      closeIcon={
        <CloseOutlined style={{ color: '#999999', fontSize: '16px' }} />
      }
      style={{ top: 20 }}
      styles={{
        content: { background: '#FFFFFF', borderRadius: '12px' },
        header: {
          background: '#FFFFFF',
          borderBottom: '1px solid #E0E0E0',
          padding: '20px 24px',
        },
        body: { background: '#FFFFFF', padding: '24px' },
      }}
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Name */}
        <div>
          <label
            className="block mb-2"
            style={{ color: '#555555', fontSize: '14px', fontWeight: 600 }}
          >
            Item Name <span style={{ color: '#DC3545' }}>*</span>
          </label>
          <Input
            value={formData.name}
            onChange={handleInput('name')}
            placeholder="e.g. Web Design Services"
            required
            style={{
              backgroundColor: '#FAFAFA',
              borderColor: '#D0D0D0',
              color: '#333333',
            }}
            size="large"
          />
        </div>

        {/* Rate + GST side by side */}
        <div style={{ display: 'flex', gap: '16px' }}>
          <div style={{ flex: 1 }}>
            <label
              className="block mb-2"
              style={{ color: '#555555', fontSize: '14px', fontWeight: 600 }}
            >
              Rate (per unit) <span style={{ color: '#DC3545' }}>*</span>
            </label>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div
                style={{
                  backgroundColor: '#F5F5F5',
                  border: '1px solid #D0D0D0',
                  borderRadius: '8px',
                  padding: '8px 12px',
                  minWidth: '40px',
                  height: '40px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <span style={{ color: '#333', fontSize: '16px' }}>₹</span>
              </div>
              <Input
                type="number"
                value={formData.price}
                onChange={handleInput('price')}
                placeholder="0.00"
                required
                min={0}
                step="0.01"
                style={{
                  flex: 1,
                  backgroundColor: '#FAFAFA',
                  borderColor: '#D0D0D0',
                  color: '#333333',
                }}
                size="large"
              />
            </div>
          </div>

          <div style={{ width: '200px' }}>
            <label
              className="block mb-2"
              style={{ color: '#555555', fontSize: '14px', fontWeight: 600 }}
            >
              GST Rate <span style={{ color: '#DC3545' }}>*</span>
            </label>
            <Select
              value={formData.gstRate}
              onChange={(val) =>
                setFormData((prev) => ({ ...prev, gstRate: val }))
              }
              options={GST_SLABS}
              style={{ width: '100%' }}
              size="large"
            />
          </div>
        </div>

        {/* GST preview banner */}
        {priceNum > 0 && (
          <div
            style={{
              background: '#F0FDF4',
              border: '1px solid #BBF7D0',
              borderRadius: '8px',
              padding: '10px 14px',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
            }}
          >
            <InfoCircleOutlined
              style={{ color: '#16A34A', fontSize: '16px' }}
            />
            <div style={{ fontSize: '13px', color: '#166534' }}>
              ₹{priceNum.toLocaleString('en-IN', { minimumFractionDigits: 2 })}{' '}
              + {formData.gstRate}% GST (₹
              {taxAmount.toLocaleString('en-IN', {
                minimumFractionDigits: 2,
              })}
              ) ={' '}
              <strong>
                ₹
                {totalWithTax.toLocaleString('en-IN', {
                  minimumFractionDigits: 2,
                })}
              </strong>{' '}
              total per unit
            </div>
          </div>
        )}

        <Alert
          message="Changing the currency applies to the whole invoice, not just this item."
          type="warning"
          showIcon
          style={{
            backgroundColor: '#FFF9E6',
            border: '1px solid #FFE58F',
            borderRadius: '8px',
          }}
        />

        {/* Description */}
        <div>
          <label
            className="block mb-2"
            style={{ color: '#555555', fontSize: '14px', fontWeight: 600 }}
          >
            Description
          </label>
          <TextArea
            value={formData.description}
            onChange={handleInput('description')}
            placeholder="Brief description shown on the invoice"
            rows={3}
            style={{
              backgroundColor: '#FAFAFA',
              borderColor: '#D0D0D0',
              color: '#333333',
            }}
          />
        </div>

        {/* HSN Code */}
        <div>
          <label
            className="block mb-2"
            style={{ color: '#555555', fontSize: '14px', fontWeight: 600 }}
          >
            HSN / SAC Code
          </label>
          <Select
            value={formData.hsnCode || undefined}
            onChange={(value) =>
              setFormData((prev) => ({ ...prev, hsnCode: value }))
            }
            placeholder="Search and select HSN/SAC code"
            showSearch
            allowClear
            filterOption={(input, option) =>
              (option?.label?.toString().toLowerCase() ?? '').includes(
                input.toLowerCase(),
              ) || (option?.value?.toString() ?? '').includes(input)
            }
            style={{ width: '100%' }}
            size="large"
            options={FINANCE_HSN_CODES.map((hsn) => ({
              label: `${hsn.code} — ${hsn.description}`,
              value: hsn.code,
            }))}
          />
          <div style={{ fontSize: '12px', color: '#999999', marginTop: '4px' }}>
            Required for GST-registered merchants. Select the appropriate
            HSN/SAC code for tax reporting.
          </div>
        </div>

        <Button
          type="primary"
          htmlType="submit"
          size="large"
          style={{
            width: '100%',
            background: 'linear-gradient(135deg, var(--secondary), var(--primary))',
            border: 'none',
            color: '#FFFFFF',
            fontWeight: 700,
            height: '48px',
            fontSize: '16px',
            borderRadius: '8px',
          }}
        >
          {editItem ? 'Update Item' : 'Add Item'}
        </Button>
      </form>
    </Modal>
  );
};
