'use client';

import { Modal, Input, Alert } from 'antd';
import { CloseOutlined } from '@ant-design/icons';
import { useState, useEffect } from 'react';
import { ICustomerDetails } from '@/lib/interfaces/customer.interface';

interface EditCustomerModalProps {
  isOpen: boolean;
  onClose: () => void;
  customer: ICustomerDetails | null;
  onUpdate: (customerId: string, data: Partial<ICustomerDetails>) => void;
}

export const EditCustomerModal = ({
  isOpen,
  onClose,
  customer,
  onUpdate,
}: EditCustomerModalProps) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    contactNumber: '',
    gstin: '',
  });

  useEffect(() => {
    if (customer && isOpen) {
      setFormData({
        name: customer.name || '',
        email: customer.email || '',
        contactNumber: customer.contactNumber || '',
        gstin: customer.gstin || '',
      });
    }
  }, [customer, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (customer?.id) {
      onUpdate(customer.id, formData);
      onClose();
    }
  };

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
          Edit Customer
        </h3>
      }
      open={isOpen}
      onCancel={onClose}
      footer={null}
      width={700}
      closeIcon={
        <CloseOutlined style={{ color: '#999999', fontSize: '16px' }} />
      }
      style={{ top: 20 }}
      styles={{
        content: {
          background: '#FFFFFF',
          borderRadius: '12px',
        },
        header: {
          background: '#FFFFFF',
          borderBottom: '1px solid #E0E0E0',
          padding: '20px 24px',
        },
        body: {
          background: '#FFFFFF',
          padding: '24px',
        },
      }}
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label
            className="block mb-2"
            style={{ color: '#555555', fontSize: '14px', fontWeight: 600 }}
          >
            Company/Individual Name
          </label>
          <Input
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="Customer Name"
            required
            size="large"
            style={{
              backgroundColor: '#FAFAFA',
              borderColor: '#D0D0D0',
              color: '#333333',
            }}
          />
        </div>

        <div>
          <label
            className="block mb-2"
            style={{ color: '#555555', fontSize: '14px', fontWeight: 600 }}
          >
            Email
          </label>
          <Input
            type="email"
            value={formData.email}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
            placeholder="Email Address"
            required
            size="large"
            style={{
              backgroundColor: '#FAFAFA',
              borderColor: '#D0D0D0',
              color: '#333333',
            }}
          />
        </div>

        <div>
          <label
            className="block mb-2"
            style={{ color: '#555555', fontSize: '14px', fontWeight: 600 }}
          >
            Contact No.
          </label>
          <Input
            type="tel"
            value={formData.contactNumber}
            onChange={(e) =>
              setFormData({ ...formData, contactNumber: e.target.value })
            }
            placeholder="Contact Number"
            required
            size="large"
            style={{
              backgroundColor: '#FAFAFA',
              borderColor: '#D0D0D0',
              color: '#333333',
            }}
          />
        </div>

        <div>
          <label
            className="block mb-2"
            style={{ color: '#555555', fontSize: '14px', fontWeight: 600 }}
          >
            GSTIN
          </label>
          <Input
            value={formData.gstin}
            onChange={(e) =>
              setFormData({ ...formData, gstin: e.target.value })
            }
            placeholder="e.g 22AAAAA0000A1Z5"
            size="large"
            style={{
              backgroundColor: '#FAFAFA',
              borderColor: '#D0D0D0',
              color: '#333333',
            }}
          />
        </div>

        <Alert
          message="Note: The updated customer details will be reflected everywhere in the future."
          type="info"
          showIcon
          style={{
            backgroundColor: '#E8F7EE',
            border: '1px solid #8FD3A8',
            borderRadius: '8px',
            color: '#555555',
          }}
        />

        <button
          type="submit"
          style={{
            width: '100%',
            background: 'var(--secondary)',
            border: 'none',
            color: '#FFFFFF',
            fontWeight: 600,
            height: '48px',
            fontSize: '16px',
            borderRadius: '6px',
            cursor: 'pointer',
          }}
        >
          Update Customer
        </button>
      </form>
    </Modal>
  );
};
