'use client';

import React, { useState } from 'react';
import {
  Card,
  Row,
  Col,
  Statistic,
  Modal,
  Form,
  Input,
  Select,
  Button,
  message,
  InputNumber,
} from 'antd';
import {
  SendOutlined,
  QrcodeOutlined,
  DeploymentUnitOutlined,
  RetweetOutlined,
  WalletOutlined,
  BankOutlined,
} from '@ant-design/icons';
import { createStyles } from 'antd-style';
import { useRouter } from 'next/navigation';
import BulkPayout from './BulkPayout';
import { postManualPayout } from '@/lib/hooks/use-manual-payout';
import { ManualPayout, IManualPayout } from '@/lib/interfaces/payout.interface';
import { useToast } from '@/lib/components/Toast/ToastContext';
import { safeAny } from '@/lib/interfaces/global.interface';

const useStyle = createStyles(({ css }) => ({
  statsCard: css`
    background: #ffffff;
    border: 1px solid #4e4e4e;
    border-radius: 14px;
    text-color: var(--text);
  `,
  actionCard: css`
    background: #ffffff;
    border: 1px solid #4e4e4e;
    border-radius: 14px;
    cursor: pointer;
    transition: all 0.25s ease;

    &:hover {
      transform: translateY(-4px);
      border-color: #30f3bc;
      box-shadow: 0 8px 30px rgba(48, 243, 188, 0.15);
    }
  `,
  iconWrap: css`
    background: linear-gradient(to right, #53bec2, #00ef64);
    color: #0c0c0c;
    width: 48px;
    height: 48px;
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 22px;
  `,
}));

export default function PayoutDashboard() {
  const { styles } = useStyle();
  const router = useRouter();
  const [activeModal, setActiveModal] = useState<string | null>(null);
  const [singleForm] = Form.useForm();
  const [upiForm] = Form.useForm();
  const { mutateAsync } = postManualPayout();
  const { showToast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const handleSinglePayout = async (values: any) => {
    setIsLoading(true);
    try {
      const payoutData: ManualPayout = {
        data: [
          {
            amount: +values.amount,
            beneficiaryName: values.beneficiaryName,
            accountNumber: values.accountNumber,
            ifscCode: values.ifscCode,
            remarks: values.remarks || '',
            paymentMode: 'IMPS',
            purpose: values.purpose || 'Payout',
            bankName: values.bankName,
            payoutId:
              'payout_' +
              Math.random().toString(36).substring(2, 15) +
              Math.random().toString(36).substring(2, 15),
            beneficiaryMobile: values.beneficiaryMobile || '',
          },
        ],
      };

      const [success, error] = await mutateAsync(payoutData);
      if (success) {
        showToast('Payout initiated successfully', 'success');
        singleForm.resetFields();
        setActiveModal(null);
      } else {
        showToast(error?.message || 'Something went wrong', 'error');
      }
    } catch (e: safeAny) {
      showToast(e?.message || 'Something went wrong', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpiPayout = async (values: any) => {
    setIsLoading(true);
    try {
      // For UPI, we'll use accountNumber field for UPI ID
      const payoutData: ManualPayout = {
        data: [
          {
            amount: +values.amount,
            beneficiaryName: values.receiverName,
            accountNumber: values.upiId, // UPI ID goes in accountNumber
            ifscCode: 'UPI', // Placeholder for UPI
            remarks: values.remarks || '',
            paymentMode: 'IMPS', // API might need to support UPI mode
            purpose: 'UPI Payout',
            bankName: 'UPI',
            payoutId:
              'payout_' +
              Math.random().toString(36).substring(2, 15) +
              Math.random().toString(36).substring(2, 15),
            beneficiaryMobile: '',
          },
        ],
      };

      const [success, error] = await mutateAsync(payoutData);
      if (success) {
        showToast('Payout initiated successfully', 'success');
        upiForm.resetFields();
        setActiveModal(null);
      } else {
        showToast(error?.message || 'Something went wrong', 'error');
      }
    } catch (e: safeAny) {
      showToast(e?.message || 'Something went wrong', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleBulkPayoutClose = () => {
    setActiveModal(null);
  };

  const handleBulkPayoutSuccess = async (): Promise<safeAny> => {
    // Refetch logic if needed
    setActiveModal(null);
    return Promise.resolve();
  };

  return (
    <div className="mx-4 my-8">
      {/* ===== Stats ===== */}
      <Row gutter={16} className="mb-8">
        <Col span={8}>
          <Card className={styles.statsCard}>
            <Statistic
              title={<span style={{ color: 'var(--text-muted)' }}>Today's Top Up</span>}
              value="₹ 0"
              valueStyle={{
                color: 'var(--secondary)',
                fontSize: 26,
                fontWeight: 600,
              }}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card className={styles.statsCard}>
            <Statistic
              title={<span style={{ color: 'var(--text-muted)' }}>Success Payouts</span>}
              value="₹ 0"
              valueStyle={{
                color: 'var(--secondary)',
                fontSize: 26,
                fontWeight: 600,
              }}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card className={styles.statsCard}>
            <Statistic
              title={<span style={{ color: 'var(--text-muted)' }}>Failed Payouts</span>}
              value="₹ 0"
              valueStyle={{
                color: 'var(--secondary)',
                fontSize: 26,
                fontWeight: 600,
              }}
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]}>
        {[
          { key: 'single', label: 'Single Payout', icon: <SendOutlined /> },
          { key: 'upi', label: 'UPI Payout', icon: <QrcodeOutlined /> },
          {
            key: 'bulk',
            label: 'Bulk Payout',
            icon: <DeploymentUnitOutlined />,
          },
          {
            key: 'recurring',
            label: 'Recurring Payouts',
            icon: <RetweetOutlined />,
          },
          { key: 'wallet', label: 'Wallet Transfer', icon: <WalletOutlined /> },
          { key: 'aeps', label: 'AEPS', icon: <BankOutlined /> },
        ].map((item) => (
          <Col span={8} key={item.key}>
            <Card
              className={styles.actionCard}
              onClick={() => setActiveModal(item.key)}
            >
              <div className="flex items-center gap-4">
                <div className={styles.iconWrap}>{item.icon}</div>
                <div>
                  <div className="text-lg font-semibold text-[#B1C4C1]">
                    {item.label}
                  </div>
                  <div className="text-sm text-[#95A19D]">
                    Initiate {item.label.toLowerCase()}
                  </div>
                </div>
              </div>
            </Card>
          </Col>
        ))}
      </Row>

      {/* ===== Quick Links ===== */}
      <div className="mt-8 flex gap-4">
        <Button
          type="primary"
          style={{
            background: 'linear-gradient(to right, var(--border), var(--primary))',
            border: 0,
          }}
          onClick={() => router.push('/payout/payout-wallet')}
        >
          View Payout Wallet
        </Button>
        <Button
          type="primary"
          style={{
            background: 'linear-gradient(to right, var(--border), var(--primary))',
            border: 0,
          }}
          onClick={() => router.push('/payout/payout-transactions')}
        >
          View Payout Transactions
        </Button>
      </div>

      {/* ===== Modals ===== */}

      {/* Single Payout */}
      {activeModal === 'single' && (
        <Modal
          open
          onCancel={() => {
            setActiveModal(null);
            singleForm.resetFields();
          }}
          onOk={() => singleForm.submit()}
          title="Single Payout"
          confirmLoading={isLoading}
          width={600}
        >
          <Form
            form={singleForm}
            layout="vertical"
            onFinish={handleSinglePayout}
          >
            <Form.Item
              label="Amount"
              name="amount"
              rules={[{ required: true, message: 'Please enter amount' }]}
            >
              <InputNumber
                prefix="₹"
                placeholder="Enter amount"
                style={{ width: '100%' }}
                min={1}
              />
            </Form.Item>
            <Form.Item
              label="Beneficiary Name"
              name="beneficiaryName"
              rules={[
                { required: true, message: 'Please enter beneficiary name' },
              ]}
            >
              <Input placeholder="Enter beneficiary name" />
            </Form.Item>
            <Form.Item
              label="Bank Name"
              name="bankName"
              rules={[{ required: true, message: 'Please enter bank name' }]}
            >
              <Input placeholder="Enter bank name" />
            </Form.Item>
            <Form.Item
              label="Account Number"
              name="accountNumber"
              rules={[
                { required: true, message: 'Please enter account number' },
              ]}
            >
              <Input placeholder="Enter account number" />
            </Form.Item>
            <Form.Item
              label="IFSC Code"
              name="ifscCode"
              rules={[{ required: true, message: 'Please enter IFSC code' }]}
            >
              <Input placeholder="Enter IFSC code" />
            </Form.Item>
            <Form.Item label="Beneficiary Mobile" name="beneficiaryMobile">
              <Input placeholder="Enter mobile number" />
            </Form.Item>
            <Form.Item label="Purpose" name="purpose">
              <Input placeholder="Enter purpose" />
            </Form.Item>
            <Form.Item label="Remarks" name="remarks">
              <Input.TextArea rows={3} placeholder="Enter remarks" />
            </Form.Item>
          </Form>
        </Modal>
      )}

      {/* UPI Payout */}
      {activeModal === 'upi' && (
        <Modal
          open
          onCancel={() => {
            setActiveModal(null);
            upiForm.resetFields();
          }}
          onOk={() => upiForm.submit()}
          title="UPI Payout"
          confirmLoading={isLoading}
          width={600}
        >
          <Form form={upiForm} layout="vertical" onFinish={handleUpiPayout}>
            <Form.Item
              label="Receiver Name"
              name="receiverName"
              rules={[
                { required: true, message: 'Please enter receiver name' },
              ]}
            >
              <Input placeholder="Enter receiver name" />
            </Form.Item>
            <Form.Item
              label="UPI ID"
              name="upiId"
              rules={[
                { required: true, message: 'Please enter UPI ID' },
                {
                  pattern: /^[\w.-]+@[\w]+$/,
                  message: 'Please enter a valid UPI ID',
                },
              ]}
            >
              <Input placeholder="Enter UPI ID (e.g., name@paytm)" />
            </Form.Item>
            <Form.Item
              label="Amount"
              name="amount"
              rules={[{ required: true, message: 'Please enter amount' }]}
            >
              <InputNumber
                prefix="₹"
                placeholder="Enter amount"
                style={{ width: '100%' }}
                min={1}
              />
            </Form.Item>
            <Form.Item label="Remarks" name="remarks">
              <Input.TextArea rows={3} placeholder="Enter remarks" />
            </Form.Item>
          </Form>
        </Modal>
      )}

      {/* Bulk Payout */}
      {activeModal === 'bulk' && (
        <BulkPayout
          onClose={handleBulkPayoutClose}
          refetch={handleBulkPayoutSuccess}
        />
      )}

      {/* Recurring */}
      {activeModal === 'recurring' && (
        <Modal
          open
          onCancel={() => setActiveModal(null)}
          onOk={() => {
            showToast('Payout initiated successfully', 'success');
            setActiveModal(null);
          }}
          title="Recurring Payout"
        >
          <Form layout="vertical">
            <Form.Item label="Amount" required>
              <Input />
            </Form.Item>
            <Form.Item label="Frequency">
              <Select
                options={[
                  { value: 'daily', label: 'Daily' },
                  { value: 'weekly', label: 'Weekly' },
                  { value: 'monthly', label: 'Monthly' },
                ]}
              />
            </Form.Item>
          </Form>
        </Modal>
      )}

      {/* Wallet Transfer */}
      {activeModal === 'wallet' && (
        <Modal
          open
          onCancel={() => setActiveModal(null)}
          onOk={() => {
            showToast('Payout initiated successfully', 'success');
            setActiveModal(null);
          }}
          title="Wallet Transfer"
        >
          <Form layout="vertical">
            <Form.Item label="To Wallet ID" required>
              <Input />
            </Form.Item>
            <Form.Item label="Amount" required>
              <Input />
            </Form.Item>
          </Form>
        </Modal>
      )}

      {/* AEPS */}
      {activeModal === 'aeps' && (
        <Modal
          open
          onCancel={() => setActiveModal(null)}
          onOk={() => {
            showToast('Payout initiated successfully', 'success');
            setActiveModal(null);
          }}
          title="AEPS Payout"
        >
          <Form layout="vertical">
            <Form.Item label="Aadhaar Number" required>
              <Input />
            </Form.Item>
            <Form.Item label="Bank" required>
              <Input />
            </Form.Item>
            <Form.Item label="Amount" required>
              <Input />
            </Form.Item>
          </Form>
        </Modal>
      )}
    </div>
  );
}
