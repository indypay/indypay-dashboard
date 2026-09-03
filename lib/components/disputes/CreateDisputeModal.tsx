'use client';

import React, { useEffect } from 'react';
import { Form, Input, Modal, Radio, Space } from 'antd';

import type { CreateTransactionDisputeDto } from '@/lib/interfaces/dispute.interface';
import { useCreateAdminDispute } from '@/lib/hooks/use-disputes';
import { useToast } from '@/lib/components/Toast/ToastContext';

type Props = {
  open: boolean;
  transactionId: string | null;
  onClose: () => void;
  onCreated?: () => void;
};

const CreateDisputeModal: React.FC<Props> = ({
  open,
  transactionId,
  onClose,
  onCreated,
}) => {
  const [form] = Form.useForm<CreateTransactionDisputeDto>();
  const { showToast } = useToast();
  const { mutateAsync, isPending } = useCreateAdminDispute();

  useEffect(() => {
    if (open) {
      form.resetFields();
      form.setFieldsValue({
        disputeType: 'CHARGEBACK',
      });
    }
  }, [open, form]);

  const handleOk = async () => {
    if (!transactionId) return;
    try {
      const values = await form.validateFields();
      const body: CreateTransactionDisputeDto = {
        acknowledgementNumber: values.acknowledgementNumber.trim(),
        disputeType: values.disputeType,
      };
      const c = values.complainantDetails;
      if (
        c &&
        (c.name ||
          c.phone ||
          c.email ||
          c.relationship ||
          c.notes)
      ) {
        body.complainantDetails = {
          name: c.name?.trim() || undefined,
          phone: c.phone?.trim() || undefined,
          email: c.email?.trim() || undefined,
          relationship: c.relationship?.trim() || undefined,
          notes: c.notes?.trim() || undefined,
        };
      }
      const [, err] = await mutateAsync({ transactionId, body });
      if (err) {
        const msg =
          (err as { message?: string })?.message || 'Could not create dispute';
        showToast(msg, 'error');
        return;
      }
      showToast('Dispute created', 'success');
      onCreated?.();
      onClose();
    } catch {
      /* validation */
    }
  };

  return (
    <Modal
      title="Open transaction dispute"
      open={open}
      onCancel={onClose}
      onOk={handleOk}
      okText="Create"
      confirmLoading={isPending}
      destroyOnClose
      width={560}
    >
      <Form form={form} layout="vertical" className="mt-2">
        <Form.Item
          name="acknowledgementNumber"
          label="Acknowledgement number"
          rules={[{ required: true, message: 'Required' }]}
        >
          <Input placeholder="Bank / portal acknowledgement reference" />
        </Form.Item>
        <Form.Item
          name="disputeType"
          label="Dispute type"
          rules={[{ required: true }]}
        >
          <Radio.Group>
            <Radio value="CHARGEBACK">Chargeback</Radio>
            <Radio value="CYBER_COMPLAINT">Cyber complaint</Radio>
          </Radio.Group>
        </Form.Item>
        <div className="text-sm text-gray-600 mb-2">
          Complainant details (optional)
        </div>
        <Space direction="vertical" className="w-full" size="small">
          <Form.Item name={['complainantDetails', 'name']} label="Name">
            <Input />
          </Form.Item>
          <Form.Item name={['complainantDetails', 'phone']} label="Phone">
            <Input />
          </Form.Item>
          <Form.Item name={['complainantDetails', 'email']} label="Email">
            <Input />
          </Form.Item>
          <Form.Item
            name={['complainantDetails', 'relationship']}
            label="Relationship"
          >
            <Input placeholder="e.g. payer, authorized person" />
          </Form.Item>
          <Form.Item name={['complainantDetails', 'notes']} label="Notes">
            <Input.TextArea rows={2} />
          </Form.Item>
        </Space>
      </Form>
    </Modal>
  );
};

export default CreateDisputeModal;
