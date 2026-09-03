import React, { useState } from 'react';
import { Modal, Select, Input, Button, Form } from 'antd';

import { TRANSFER_MODE } from '@/lib/constants/TransferMode/TransferMode.constant';
import { businessTypes } from '@/lib/constants/RegisterForm/RegisterForm.constants';
import {
  ACCOUNT_NUMBER_REGEX,
  EMAIL_REGEX,
  IFSC_REGEX,
  NAME_REGEX,
  PHONE_REGEX,
} from '@/shared/regular-expressions';

const Transfermode = ({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) => {
  const [form] = Form.useForm();

  const handleSubmit = () => {
    form
      .validateFields()
      .then((values) => {
        console.log('Form values:', values);
        // Handle form submission here
        onClose();
      })
      .catch((error) => {
        console.log('Validation failed:', error);
      });
  };

  return (
    <Modal
      title="New Contact"
      open={isOpen}
      onCancel={onClose}
      width={800}
      footer={null}
      styles={{
        body: { maxHeight: '80vh', overflowY: 'auto' },
      }}
    >
      <Form form={form} layout="vertical" className="space-y-4">
        <Form.Item
          label="Transfer Mode"
          name="transferMode"
          rules={[{ required: true, message: 'Please select transfer mode' }]}
        >
          <Select
            placeholder="Select transfer mode"
            options={TRANSFER_MODE.map((item) => ({
              label: item.label,
              value: item.key,
            }))}
            style={{
              backgroundColor: '#FFFFFF',
              borderColor: 'var(--text-muted)',
            }}
          />
        </Form.Item>

        <Form.Item
          label="Business Types"
          name="businessType"
          rules={[{ required: true, message: 'Please select business type' }]}
        >
          <Select
            placeholder="Select business type"
            options={businessTypes.map((item) => ({
              label: item.label,
              value: item.key,
            }))}
            style={{
              backgroundColor: '#FFFFFF',
              borderColor: 'var(--text-muted)',
            }}
          />
        </Form.Item>

        <div className="mt-6">
          <h2 className="text-2xl font-bold mb-4" style={{ color: 'var(--secondary)' }}>
            Beneficiary Details
          </h2>

          <Form.Item
            label="Bank Name"
            name="bankName"
            rules={[
              { required: true, message: 'Bank name is required' },
              {
                pattern: NAME_REGEX,
                message: 'Please enter a valid Bank Name',
              },
            ]}
          >
            <Input
              placeholder="Enter bank name"
              style={{
                backgroundColor: '#FFFFFF',
                borderColor: 'var(--text-muted)',
                color: 'var(--text)',
              }}
            />
          </Form.Item>

          <Form.Item
            label="Account Number"
            name="accountNumber"
            rules={[
              { required: true, message: 'Account number is required' },
              {
                pattern: ACCOUNT_NUMBER_REGEX,
                message: 'Please enter a valid Account Number',
              },
            ]}
          >
            <Input
              placeholder="Enter account number"
              style={{
                backgroundColor: '#FFFFFF',
                borderColor: 'var(--text-muted)',
                color: 'var(--text)',
              }}
            />
          </Form.Item>

          <Form.Item
            label="IFSC Code"
            name="ifscCode"
            rules={[
              { required: true, message: 'IFSC code is required' },
              {
                pattern: IFSC_REGEX,
                message: 'Please enter a valid IFSC Code',
              },
            ]}
          >
            <Input
              placeholder="Enter IFSC code"
              style={{
                backgroundColor: '#FFFFFF',
                borderColor: 'var(--text-muted)',
                color: 'var(--text)',
              }}
            />
          </Form.Item>

          <Form.Item
            label="Email"
            name="email"
            rules={[
              { required: true, message: 'Email is required' },
              { pattern: EMAIL_REGEX, message: 'Please enter a valid Email' },
            ]}
          >
            <Input
              placeholder="Enter email"
              type="email"
              style={{
                backgroundColor: '#FFFFFF',
                borderColor: 'var(--text-muted)',
                color: 'var(--text)',
              }}
            />
          </Form.Item>

          <Form.Item
            label="Mobile"
            name="mobile"
            rules={[
              { required: true, message: 'Mobile number is required' },
              {
                pattern: PHONE_REGEX,
                message: 'Please enter a valid Mobile Number',
              },
            ]}
          >
            <Input
              placeholder="Enter mobile number"
              style={{
                backgroundColor: '#FFFFFF',
                borderColor: 'var(--text-muted)',
                color: 'var(--text)',
              }}
            />
          </Form.Item>
        </div>

        <Form.Item className="mb-0 mt-6">
          <Button
            type="primary"
            onClick={handleSubmit}
            className="w-full"
            size="large"
          >
            Add Beneficiary
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default Transfermode;
