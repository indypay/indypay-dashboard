'use client';

import { Modal, Input, Button, Select, Checkbox } from 'antd';
import { CloseOutlined, LeftOutlined } from '@ant-design/icons';
import { useState, useEffect } from 'react';
import { safeAny } from '@/lib/interfaces/global.interface';
import { useHandleForm } from '@/lib/formHandler/useHandleForm';
import { customerSchema } from '../utils/customerSchema';

interface CustomerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (customer: safeAny) => void;
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

export const CustomerModal = ({
  isOpen,
  onClose,
  onSubmit,
}: CustomerModalProps) => {
  const [showBillingAddress, setShowBillingAddress] = useState(false);
  const [addBillingAddress, setAddBillingAddress] = useState(false);

const { handleSubmit, errors, setValue, validate, values, reset } = useHandleForm({    schema: customerSchema,
    initialValues: {
      name: '',
      email: '',
      contactNumber: '',
      gstin: '',
      addressLine1: '',
      addressLine2: '',
      pincode: '',
      city: '',
      state: '',
      country: 'India',
    },
  });

useEffect(() => {
    if (isOpen) {
      reset({
        name: '',
        email: '',
        contactNumber: '',
        gstin: '',
        addressLine1: '',
        addressLine2: '',
        pincode: '',
        city: '',
        state: '',
        country: 'India',
      });
      setShowBillingAddress(false);
      setAddBillingAddress(false);
    }
  }, [isOpen, reset]);

  const onFormSubmit = (data: safeAny) => {    onSubmit(data);
    onClose();
  };

  return (
    <Modal
      title={
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {showBillingAddress && (
              <Button
                type="text"
                icon={<LeftOutlined />}
                onClick={() => setShowBillingAddress(false)}
                style={{ color: '#666666', padding: 0 }}
              />
            )}
            <h3
              style={{
                color: '#333333',
                fontSize: '20px',
                fontWeight: 600,
                margin: 0,
              }}
            >
              Add Customer
            </h3>
          </div>
        </div>
      }
      open={isOpen}
      onCancel={onClose}
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
      <div>
        {!showBillingAddress ? (
          <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-5">
            <div>
              <label
                className="block mb-2"
                style={{ color: '#555555', fontSize: '14px', fontWeight: 600 }}
              >
                Company/Individual Name
              </label>
              <Input
                value={values.name}
                onChange={(e) => setValue('name', e.target.value)}
                onBlur={() => validate('name')}
                status={errors.name ? 'error' : undefined}
                placeholder="Customer Name"
                size="large"
                style={{
                  backgroundColor: '#FAFAFA',
                  borderColor: errors.name ? '#D51C44' : '#D0D0D0',
                  color: '#333333',
                }}
              />
              {errors.name && (
                <div className="text-sm mt-1" style={{ color: '#D51C44' }}>
                  {errors.name.message}
                </div>
              )}
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
                value={values.email}
                onChange={(e) => setValue('email', e.target.value)}
                onBlur={() => validate('email')}
                status={errors.email ? 'error' : undefined}
                placeholder="Email Address"
                size="large"
                style={{
                  backgroundColor: '#FAFAFA',
                  borderColor: errors.email ? '#D51C44' : '#D0D0D0',
                  color: '#333333',
                }}
              />
              {errors.email && (
                <div className="text-sm mt-1" style={{ color: '#D51C44' }}>
                  {errors.email.message}
                </div>
              )}
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
                value={values.contactNumber}
                onChange={(e) => setValue('contactNumber', e.target.value)}
                onBlur={() => validate('contactNumber')}
                status={errors.contactNumber ? 'error' : undefined}
                placeholder="Contact Number"
                size="large"
                style={{
                  backgroundColor: '#FAFAFA',
                  borderColor: errors.contactNumber ? '#D51C44' : '#D0D0D0',
                  color: '#333333',
                }}
              />
              {errors.contactNumber && (
                <div className="text-sm mt-1" style={{ color: '#D51C44' }}>
                  {errors.contactNumber.message}
                </div>
              )}
            </div>

            <div>
              <label
                className="block mb-2"
                style={{ color: '#555555', fontSize: '14px', fontWeight: 600 }}
              >
                GSTIN
              </label>
              <Input
                value={values.gstin}
                onChange={(e) => setValue('gstin', e.target.value)}
                onBlur={() => validate('gstin')}
                status={errors.gstin ? 'error' : undefined}
                placeholder="e.g 22AAAAA0000A1Z5"
                size="large"
                style={{
                  backgroundColor: '#FAFAFA',
                  borderColor: errors.gstin ? '#D51C44' : '#D0D0D0',
                  color: '#333333',
                }}
              />
              {errors.gstin && (
                <div className="text-sm mt-1" style={{ color: '#D51C44' }}>
                  {errors.gstin.message}
                </div>
              )}
            </div>

            <div className="pt-2">
              <Checkbox
                checked={addBillingAddress}
                onChange={(e) => setAddBillingAddress(e.target.checked)}
                style={{ fontSize: '14px', color: '#555555' }}
              >
                Add Billing Address
              </Checkbox>
            </div>

            {!addBillingAddress ? (
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
                Create Customer
              </Button>
            ) : (
              <Button
                size="large"
                onClick={() => setShowBillingAddress(true)}
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
                Next
              </Button>
            )}
          </form>
        ) : (
          <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-5">
            <h4
              style={{
                color: '#333333',
                fontSize: '16px',
                fontWeight: 600,
                marginBottom: '16px',
              }}
            >
              Shipping Address
            </h4>

            <div>
              <label
                className="block mb-2"
                style={{ color: '#555555', fontSize: '14px', fontWeight: 600 }}
              >
                Address Line 1
              </label>
              <Input
                value={values.addressLine1}
                onChange={(e) => setValue('addressLine1', e.target.value)}
                onBlur={() => validate('addressLine1')}
                status={errors.addressLine1 ? 'error' : undefined}
                placeholder="Enter address line 1"
                size="large"
                style={{
                  backgroundColor: '#FAFAFA',
                  borderColor: errors.addressLine1 ? '#D51C44' : '#D0D0D0',
                  color: '#333333',
                }}
              />
              {errors.addressLine1 && (
                <div className="text-sm mt-1" style={{ color: '#D51C44' }}>
                  {errors.addressLine1.message}
                </div>
              )}
            </div>

            <div>
              <label
                className="block mb-2"
                style={{ color: '#555555', fontSize: '14px', fontWeight: 600 }}
              >
                Address Line 2 (Optional)
              </label>
              <Input
                value={values.addressLine2}
                onChange={(e) => setValue('addressLine2', e.target.value)}
                placeholder="Enter address line 2"
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
                  style={{
                    color: '#555555',
                    fontSize: '14px',
                    fontWeight: 600,
                  }}
                >
                  PIN Code
                </label>
                <Input
                  value={values.pincode}
                  onChange={(e) => setValue('pincode', e.target.value)}
                  onBlur={() => validate('pincode')}
                  status={errors.pincode ? 'error' : undefined}
                  placeholder="Enter PIN code"
                  size="large"
                  style={{
                    backgroundColor: '#FAFAFA',
                    borderColor: errors.pincode ? '#D51C44' : '#D0D0D0',
                    color: '#333333',
                  }}
                />
                {errors.pincode && (
                  <div className="text-sm mt-1" style={{ color: '#D51C44' }}>
                    {errors.pincode.message}
                  </div>
                )}
              </div>
              <div>
                <label
                  className="block mb-2"
                  style={{
                    color: '#555555',
                    fontSize: '14px',
                    fontWeight: 600,
                  }}
                >
                  City
                </label>
                <Input
                  value={values.city}
                  onChange={(e) => setValue('city', e.target.value)}
                  onBlur={() => validate('city')}
                  status={errors.city ? 'error' : undefined}
                  placeholder="Enter city"
                  size="large"
                  style={{
                    backgroundColor: '#FAFAFA',
                    borderColor: errors.city ? '#D51C44' : '#D0D0D0',
                    color: '#333333',
                  }}
                />
                {errors.city && (
                  <div className="text-sm mt-1" style={{ color: '#D51C44' }}>
                    {errors.city.message}
                  </div>
                )}
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
                value={values.state}
                onChange={(value) => setValue('state', value)}
                onBlur={() => validate('state')}
                status={errors.state ? 'error' : undefined}
                placeholder="Select state"
                size="large"
                style={{ width: '100%' }}
                options={indianStates.map((state) => ({
                  label: state,
                  value: state,
                }))}
              />
              {errors.state && (
                <div className="text-sm mt-1" style={{ color: '#D51C44' }}>
                  {errors.state.message}
                </div>
              )}
            </div>

            <div>
              <label
                className="block mb-2"
                style={{ color: '#555555', fontSize: '14px', fontWeight: 600 }}
              >
                Country
              </label>
              <Input
                value={values.country}
                onChange={(e) => setValue('country', e.target.value)}
                size="large"
                disabled
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
              Create Customer
            </Button>
          </form>
        )}
      </div>
    </Modal>
  );
};
