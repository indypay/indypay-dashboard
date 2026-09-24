'use client';

import { useState } from 'react';
import {
  Modal,
  Form,
  Input,
  InputNumber,
  Switch,
  Collapse,
  Button,
  DatePicker,
  Select,
  Space,
} from 'antd';
import {
  DownOutlined,
  SettingOutlined,
  DollarOutlined,
  FileTextOutlined,
  ClockCircleOutlined,
  UserOutlined,
  CheckOutlined,
} from '@ant-design/icons';
import dayjs, { Dayjs } from 'dayjs';
import { createStyles } from 'antd-style';
import { useToast } from '@/lib/components/Toast/ToastContext';
import { createNewPaymentLink } from '@/lib/services/payment-link-new-service';

const { Panel } = Collapse;
const { TextArea } = Input;

const useStyles = createStyles(({ css }) => ({
  modalContent: css`
    .ant-modal-content {
      background: #ffffff;
      border-radius: 16px;
    }
    .ant-modal-header {
      background: #ffffff;
      border-bottom: 1px solid var(--border);
      padding: 24px;
      border-radius: 16px 16px 0 0;
    }
    .ant-modal-body {
      padding: 24px;
      background: #ffffff;
    }
    .ant-modal-title {
      color: var(--text);
      font-size: 24px;
      font-weight: 700;
    }
  `,
  formItem: css`
    .ant-form-item-label > label {
      color: var(--text) !important;
      font-weight: 600 !important;
      font-size: 14px !important;
    }
    .ant-form-item-label
      > label.ant-form-item-required:not(
        .ant-form-item-required-mark-optional
      )::before {
      color: #d51c44 !important;
    }
  `,
  input: css`
    background: #ffffff !important;
    border-color: var(--border) !important;
    color: var(--text) !important;
    border-radius: 8px !important;
    height: 44px !important;

    &:hover {
      border-color: var(--primary) !important;
    }

    &:focus,
    &.ant-input-focused {
      border-color: var(--primary) !important;
      box-shadow: 0 0 0 2px rgba(0, 135, 90, 0.1) !important;
    }
  `,
  switch: css`
    .ant-switch-checked {
      background: var(--primary) !important;
    }
  `,
  collapse: css`
    background: var(--background) !important;
    border: 1px solid var(--border) !important;
    border-radius: 8px !important;

    .ant-collapse-header {
      color: var(--text) !important;
      font-weight: 600 !important;
      padding: 12px 16px !important;
    }

    .ant-collapse-content {
      background: #ffffff !important;
      border-top: 1px solid var(--border) !important;
    }
  `,
  submitButton: css`
    background: linear-gradient(to right, var(--secondary), var(--primary)) !important;
    border: none !important;
    color: #ffffff !important;
    font-weight: 600 !important;
    height: 48px !important;
    border-radius: 12px !important;

    &:hover {
      box-shadow: 0 4px 12px rgba(0, 135, 90, 0.3) !important;
    }
  `,
}));

interface PaymentLinkCreateModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess: (link: any) => void;
}

export default function PaymentLinkCreateModal({
  open,
  onClose,
  onSuccess,
}: PaymentLinkCreateModalProps) {
  const { styles } = useStyles();
  const { showToast } = useToast();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (values: any) => {
    setLoading(true);

    try {
      const expiresAt = values.expiry
        ? values.expiry.toISOString()
        : undefined;

      const payload = {
        amount: Number(values.amount),
        name: values.name ? String(values.name).trim() : '',
        email: values.email ? String(values.email).trim() : '',
        mobile: values.mobile ? String(values.mobile).trim() : '',
        note: values.purpose ? String(values.purpose).trim() : undefined,
        notifyOnEmail: !!values.notifyOnEmail,
        notifyOnNumber: !!values.notifyOnNumber,
        expiresAt,
        allowPartialPayment: !!values.allowPartialPayment,
        minimumAmount:
          values.allowPartialPayment && values.minimumAmount != null
            ? Number(values.minimumAmount)
            : undefined,
      };

      const [response, error] = await createNewPaymentLink(payload);

      if (error || !response) {
        const message =
          error?.message || 'Failed to create payment link';

        showToast(message, 'error');
        return;
      }

      const linkUrl =
        response.paymentLinkUrl ||
        response.linkUrl ||
        '';

      onSuccess({
        ...response,
        id: response.linkId,
        linkId: response.linkId,
        linkUrl,
        paymentLinkUrl: response.paymentLinkUrl || linkUrl,
        amount: payload.amount,
        purpose: payload.note,
        description: payload.note,
        createdAt: new Date().toISOString(),
        status: 'pending',
        expiry: expiresAt,
        expiresAt: response.expiresAt ?? response.expiryTime ?? expiresAt ?? null,
        qr: response.qr,
        whatsappShareUrl: response.whatsappShareUrl,
        allowPartialPayment: payload.allowPartialPayment,
        minimumAmount: payload.minimumAmount,
      });

      form.resetFields();
    } catch (error: any) {
      console.error('Payment link creation failed:', error);

      showToast(
        error?.response?.data?.message ||
          error?.message ||
          'Failed to create payment link',
        'error',
      );
    } finally {
      setLoading(false);
    }
  };

  const disabledDate = (current: Dayjs) => {
    return current && current < dayjs().startOf('day');
  };

  return (
    <Modal
      title={
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary-mint to-primary-green flex items-center justify-center">
            <DollarOutlined style={{ color: '#FFFFFF', fontSize: '20px' }} />
          </div>
          <span>Create Payment Link</span>
        </div>
      }
      open={open}
      onCancel={onClose}
      footer={null}
      width={640}
      className={styles.modalContent}
      destroyOnClose
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        initialValues={{
          expiry: dayjs().add(24, 'hour'),
          collectCustomerDetails: true,
          allowPartialPayment: false,
        }}
        className={styles.formItem}
      >
        {/* Required Fields */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <Form.Item
            name="name"
            label={
              <span className="flex items-center gap-2">
                <UserOutlined style={{ color: 'var(--primary)' }} />
                Customer Name
              </span>
            }
            rules={[
              { required: true, message: 'Please enter customer name' },
            ]}
          >
            <Input
              className={styles.input}
              placeholder="Enter customer name"
              size="large"
            />
          </Form.Item>

          <Form.Item
            name="email"
            label="Customer Email"
            rules={[
              { required: true, message: 'Please enter customer email' },
              { type: 'email', message: 'Please enter a valid email' },
            ]}
          >
            <Input
              className={styles.input}
              placeholder="customer@example.com"
              size="large"
            />
          </Form.Item>

          <Form.Item
            name="mobile"
            label="Customer Mobile"
            rules={[
              { required: true, message: 'Please enter customer mobile' },
            ]}
          >
            <Input
              className={styles.input}
              placeholder="Enter mobile number"
              size="large"
            />
          </Form.Item>

          <Form.Item
            name="amount"
            label={
              <span className="flex items-center gap-2">
                <DollarOutlined style={{ color: 'var(--primary)' }} />
                Amount
              </span>
            }
            rules={[
              { required: true, message: 'Please enter amount' },
              {
                type: 'number',
                min: 1,
                message: 'Amount must be greater than 0',
              },
            ]}
          >
            <InputNumber
              className={styles.input}
              style={{ width: '100%' }}
              prefix="₹"
              placeholder="Enter amount"
              size="large"
              min={1}
              formatter={(value) =>
                `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
              }
              // parser={(value) => value!.replace(/\$\s?|(,*)/g, '')}
            />
          </Form.Item>

          <Form.Item
            name="purpose"
            label={
              <span className="flex items-center gap-2">
                <FileTextOutlined style={{ color: 'var(--primary)' }} />
                Purpose
              </span>
            }
            rules={[{ required: true, message: 'Please enter purpose' }]}
          >
            <TextArea
              className={styles.input}
              rows={3}
              placeholder="e.g., Invoice payment, Service fee, Product purchase"
              maxLength={200}
              showCount
            />
          </Form.Item>

          <Form.Item
            name="expiry"
            label={
              <span className="flex items-center gap-2">
                <ClockCircleOutlined style={{ color: 'var(--primary)' }} />
                Expiry (Default: 24 hours)
              </span>
            }
            rules={[
              { required: true, message: 'Please select expiry date and time' },
            ]}
          >
            <DatePicker
              showTime
              format="YYYY-MM-DD HH:mm"
              disabledDate={disabledDate}
              className={styles.input}
              style={{ width: '100%' }}
              size="large"
              placeholder="Select expiry date and time"
            />
          </Form.Item>

          {/* Toggle Options */}
          <div
            style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}
          >


            <Form.Item
              name="allowPartialPayment"
              valuePropName="checked"
              className="mb-0"
            >
              <div
                className="flex items-center justify-between p-4 rounded-lg border"
                style={{ background: 'var(--background)', borderColor: 'var(--border)' }}
              >
                <div className="flex items-center gap-3">
                  <CheckOutlined
                    style={{ color: 'var(--primary)', fontSize: '18px' }}
                  />
                  <div>
                    <div className="font-semibold text-primary-dark-green">
                      Allow Partial Payment
                    </div>
                    <div className="text-sm text-muted">
                      Let customers pay in installments
                    </div>
                  </div>
                </div>
                <Switch className={styles.switch} />
              </div>
            </Form.Item>
          </div>

          {/* Advanced Settings */}
          <Collapse
            ghost
            expandIcon={({ isActive }) => (
              <DownOutlined rotate={isActive ? 180 : 0} />
            )}
            className={styles.collapse}
          >
            <Panel
              header={
                <span className="flex items-center gap-2">
                  <SettingOutlined style={{ color: 'var(--primary)' }} />
                  Advanced Settings
                </span>
              }
              key="advanced"
            >
              <div className="space-y-4 pt-2">


                <Form.Item
                  name="minimumAmount"
                  label="Minimum Payment Amount"
                  tooltip="Set minimum amount for partial payments"
                >
                  <InputNumber
                    className={styles.input}
                    style={{ width: '100%' }}
                    prefix="₹"
                    placeholder="Enter minimum amount"
                    size="large"
                    min={1}
                  />
                </Form.Item>




              </div>
            </Panel>
          </Collapse>
        </div>

        {/* Form Actions */}
        <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-E0EDE6">
          <Button
            size="large"
            onClick={onClose}
            style={{
              height: '48px',
              padding: '0 24px',
              borderRadius: '12px',
              borderColor: 'var(--border)',
              color: 'var(--text)',
            }}
          >
            Cancel
          </Button>
          <Button
            type="primary"
            htmlType="submit"
            size="large"
            loading={loading}
            className={styles.submitButton}
          >
            Create Payment Link
          </Button>
        </div>
      </Form>
    </Modal>
  );
}
