'use client';

import { Modal, Input, Button, Select } from 'antd';
import { CloseOutlined } from '@ant-design/icons';
import { useState, useEffect } from 'react';

interface BillingAddressModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (address: string) => void;
  initialAddress?: string;
}

const indianStates = [
  'Andhra Pradesh',
  'Arunachal Pradesh',
  'Assam',
  'Bihar',
  'Chhattisgarh',
  'Goa',
  'Gujarat',
  'Haryana',
  'Himachal Pradesh',
  'Jharkhand',
  'Karnataka',
  'Kerala',
  'Madhya Pradesh',
  'Maharashtra',
  'Manipur',
  'Meghalaya',
  'Mizoram',
  'Nagaland',
  'Odisha',
  'Punjab',
  'Rajasthan',
  'Sikkim',
  'Tamil Nadu',
  'Telangana',
  'Tripura',
  'Uttar Pradesh',
  'Uttarakhand',
  'West Bengal',
];

export const BillingAddressModal = ({
  isOpen,
  onClose,
  onSubmit,
  initialAddress,
}: BillingAddressModalProps) => {
  const [billingAddressData, setBillingAddressData] = useState({
    addressLine1: '',
    addressLine2: '',
    pincode: '',
    city: '',
    state: '',
    country: 'India',
  });

  useEffect(() => {
    if (initialAddress && isOpen) {
      // Parse the initial address if provided
      const parts = initialAddress.split(', ');
      if (parts.length >= 6) {
        setBillingAddressData({
          addressLine1: parts[0] || '',
          addressLine2: parts[1] || '',
          pincode: parts[2] || '',
          city: parts[3] || '',
          state: parts[4] || '',
          country: parts[5] || 'India',
        });
      }
    }
  }, [initialAddress, isOpen]);

  const handleBillingAddressSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const fullAddress = `${billingAddressData.addressLine1}, ${billingAddressData.addressLine2}, ${billingAddressData.pincode}, ${billingAddressData.city}, ${billingAddressData.state}, ${billingAddressData.country}`;
    onSubmit(fullAddress);
    resetForm();
  };

  const resetForm = () => {
    setBillingAddressData({
      addressLine1: '',
      addressLine2: '',
      pincode: '',
      city: '',
      state: '',
      country: 'India',
    });
    onClose();
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
          {initialAddress ? 'Edit Billing Address' : 'Add Billing Address'}
        </h3>
      }
      open={isOpen}
      onCancel={resetForm}
      footer={null}
      width={600}
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
      <form
        onSubmit={(e) => handleBillingAddressSubmit(e)}
        className="space-y-5"
      >
        <h4
          style={{
            color: '#666666',
            fontSize: '14px',
            fontWeight: 600,
            marginBottom: '16px',
          }}
        >
          Enter a new Address
        </h4>

        <div>
          <label
            className="block mb-2"
            style={{ color: '#555555', fontSize: '14px', fontWeight: 600 }}
          >
            Address Line 1
          </label>
          <Input
            value={billingAddressData.addressLine1}
            onChange={(e) =>
              setBillingAddressData({
                ...billingAddressData,
                addressLine1: e.target.value,
              })
            }
            placeholder="Address line 1 (minimum 10 characters)"
            required
            minLength={10}
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
            Address Line 2 (Optional)
          </label>
          <Input
            value={billingAddressData.addressLine2}
            onChange={(e) =>
              setBillingAddressData({
                ...billingAddressData,
                addressLine2: e.target.value,
              })
            }
            placeholder="Address line 2 (Optional, minimum 10 characters)"
            size="large"
            style={{
              backgroundColor: '#FAFAFA',
              borderColor: '#D0D0D0',
              color: '#333333',
            }}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label
              className="block mb-2"
              style={{ color: '#555555', fontSize: '14px', fontWeight: 600 }}
            >
              PIN Code
            </label>
            <Input
              value={billingAddressData.pincode}
              onChange={(e) =>
                setBillingAddressData({
                  ...billingAddressData,
                  pincode: e.target.value,
                })
              }
              placeholder="PIN Code"
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
              City
            </label>
            <Input
              value={billingAddressData.city}
              onChange={(e) =>
                setBillingAddressData({
                  ...billingAddressData,
                  city: e.target.value,
                })
              }
              placeholder="City"
              required
              size="large"
              style={{
                backgroundColor: '#FAFAFA',
                borderColor: '#D0D0D0',
                color: '#333333',
              }}
            />
          </div>
        </div>

        <div>
          <label
            className="block mb-2"
            style={{ color: '#555555', fontSize: '14px', fontWeight: 600 }}
          >
            State
          </label>
          <Select
            value={billingAddressData.state || undefined}
            onChange={(value) =>
              setBillingAddressData({
                ...billingAddressData,
                state: value,
              })
            }
            placeholder="State"
            size="large"
            style={{ width: '100%' }}
            options={indianStates.map((state) => ({
              label: state,
              value: state,
            }))}
          />
        </div>

        <div>
          <label
            className="block mb-2"
            style={{ color: '#555555', fontSize: '14px', fontWeight: 600 }}
          >
            Country
          </label>
          <Input
            value={billingAddressData.country}
            disabled
            placeholder="Country"
            size="large"
            style={{
              backgroundColor: '#F5F5F5',
              borderColor: '#D0D0D0',
              color: '#999999',
            }}
          />
        </div>

        <Button
          type="primary"
          htmlType="submit"
          size="large"
          style={{
            width: '100%',
            background: 'var(--secondary)',
            border: 'none',
            color: '#FFFFFF',
            fontWeight: 600,
            height: '48px',
            fontSize: '16px',
          }}
        >
          Add Address
        </Button>
      </form>
    </Modal>
  );
};
