'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Alert,
  Button,
  Card,
  Col,
  Divider,
  Form,
  Input,
  InputNumber,
  Radio,
  Row,
  Select,
  Steps,
  Switch,
  Tooltip,
  Typography,
  Checkbox,
} from 'antd';
import {
  ArrowLeftOutlined,
  ArrowRightOutlined,
  CheckCircleOutlined,
  CreditCardOutlined,
  LockOutlined,
  UserOutlined,
  SettingOutlined,
  FileProtectOutlined,
} from '@ant-design/icons';

const { Title, Text } = Typography;

interface CardholderDetails {
  merchantId: string;
  cardholderName: string;
  mobile: string;
  email: string;
  cardType: 'Virtual' | 'Physical';
  cardCategory: 'Personal' | 'Corporate' | 'Gift';
}

interface CardConfig {
  dailyLimit: number;
  monthlyLimit: number;
  internationalEnabled: boolean;
  onlineEnabled: boolean;
  atmEnabled: boolean;
  loadAmount: number;
}

interface FormData {
  step1: Partial<CardholderDetails>;
  step2: Partial<CardConfig>;
  rbiConsent: boolean;
}

const STEPS = [
  { title: 'Cardholder', icon: <UserOutlined /> },
  { title: 'Configuration', icon: <SettingOutlined /> },
  { title: 'Review & Confirm', icon: <FileProtectOutlined /> },
];

export default function IssueCardPage() {
  const router = useRouter();
  const [current, setCurrent] = useState(0);
  const [form1] = Form.useForm();
  const [form2] = Form.useForm();
  const [formData, setFormData] = useState<FormData>({
    step1: {},
    step2: {
      internationalEnabled: false,
      onlineEnabled: true,
      atmEnabled: false,
    },
    rbiConsent: false,
  });

  const gradientStyle = {
    background: 'linear-gradient(to right, var(--border), var(--primary))',
    borderRadius: 12,
    padding: 2,
  };

  const cardStyle = { borderRadius: 10, border: 'none' };

  const handleStep1Next = async () => {
    try {
      const values = await form1.validateFields();
      setFormData((prev) => ({ ...prev, step1: values }));
      setCurrent(1);
    } catch {}
  };

  const handleStep2Next = async () => {
    try {
      const values = await form2.validateFields();
      setFormData((prev) => ({ ...prev, step2: values }));
      setCurrent(2);
    } catch {}
  };

  const labelStyle: React.CSSProperties = {
    fontWeight: 600,
    color: '#374151',
    fontSize: 13,
  };

  const sectionTitle = (text: string) => (
    <Text strong style={{ color: 'var(--secondary)', fontSize: 13, letterSpacing: '0.05em', textTransform: 'uppercase' }}>
      {text}
    </Text>
  );

  // ─── Step 1: Cardholder Details ────────────────────────────────────────────
  const step1 = (
    <Form form={form1} layout="vertical" initialValues={formData.step1}>
      <div className="mb-4">{sectionTitle('Cardholder Information')}</div>
      <Divider style={{ margin: '8px 0 20px', borderColor: 'var(--border)' }} />

      <Row gutter={[20, 4]}>
        <Col xs={24} md={12}>
          <Form.Item
            name="merchantId"
            label={<span style={labelStyle}>Select Merchant</span>}
            rules={[{ required: true, message: 'Please select a merchant' }]}
          >
            <Select
              placeholder="Select KYC verified merchant"
              size="large"
              options={[]}
              notFoundContent={
                <Text type="secondary" className="text-xs">No KYC verified merchants found</Text>
              }
            />
          </Form.Item>
        </Col>

        <Col xs={24} md={12}>
          <Form.Item
            name="cardholderName"
            label={<span style={labelStyle}>Cardholder Full Name</span>}
            rules={[
              { required: true, message: 'Required' },
              { min: 3, message: 'Minimum 3 characters' },
            ]}
            extra="Enter name exactly as per Aadhaar card"
          >
            <Input size="large" placeholder="Full name as per Aadhaar" />
          </Form.Item>
        </Col>

        <Col xs={24} md={12}>
          <Form.Item
            name="mobile"
            label={<span style={labelStyle}>Mobile Number</span>}
            rules={[
              { required: true, message: 'Required' },
              { pattern: /^[6-9]\d{9}$/, message: 'Enter valid 10-digit mobile' },
            ]}
          >
            <Input size="large" placeholder="10-digit mobile number" maxLength={10} addonBefore="+91" />
          </Form.Item>
        </Col>

        <Col xs={24} md={12}>
          <Form.Item
            name="email"
            label={<span style={labelStyle}>Email Address</span>}
            rules={[
              { required: true, message: 'Required' },
              { type: 'email', message: 'Enter valid email' },
            ]}
          >
            <Input size="large" placeholder="cardholder@email.com" />
          </Form.Item>
        </Col>

        <Col xs={24}>
          <Divider style={{ margin: '4px 0 16px', borderColor: 'var(--border)' }} />
          {sectionTitle('Card Type')}
        </Col>

        <Col xs={24} md={12}>
          <Form.Item
            name="cardType"
            label={<span style={labelStyle}>Card Type</span>}
            rules={[{ required: true, message: 'Select card type' }]}
            initialValue="Virtual"
          >
            <Radio.Group size="large">
              <Radio.Button value="Virtual">
                <CreditCardOutlined className="mr-1" /> Virtual
              </Radio.Button>
              <Radio.Button value="Physical">
                <CreditCardOutlined className="mr-1" /> Physical
              </Radio.Button>
            </Radio.Group>
          </Form.Item>
        </Col>

        <Col xs={24} md={12}>
          <Form.Item
            name="cardCategory"
            label={<span style={labelStyle}>Card Category</span>}
            rules={[{ required: true, message: 'Select category' }]}
            initialValue="Personal"
          >
            <Radio.Group size="large">
              <Radio.Button value="Personal">Personal</Radio.Button>
              <Radio.Button value="Corporate">Corporate</Radio.Button>
              <Radio.Button value="Gift">Gift</Radio.Button>
            </Radio.Group>
          </Form.Item>
        </Col>
      </Row>
    </Form>
  );

  // ─── Step 2: Card Configuration ───────────────────────────────────────────
  const step2 = (
    <Form
      form={form2}
      layout="vertical"
      initialValues={{
        dailyLimit: 10000,
        monthlyLimit: 100000,
        loadAmount: 500,
        internationalEnabled: false,
        onlineEnabled: true,
        atmEnabled: false,
      }}
    >
      <div className="mb-4">{sectionTitle('Transaction Limits')}</div>
      <Divider style={{ margin: '8px 0 20px', borderColor: 'var(--border)' }} />

      <Row gutter={[20, 4]}>
        <Col xs={24} md={12}>
          <Form.Item
            name="dailyLimit"
            label={<span style={labelStyle}>Daily Transaction Limit (₹)</span>}
            rules={[
              { required: true, message: 'Required' },
              { type: 'number', max: 100000, message: 'Max ₹1,00,000 per day' },
              { type: 'number', min: 100, message: 'Min ₹100' },
            ]}
          >
            <InputNumber
              size="large"
              style={{ width: '100%' }}
              prefix="₹"
              min={100}
              max={100000}
              formatter={(v) => `${v}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
              placeholder="e.g. 10,000"
            />
          </Form.Item>
        </Col>

        <Col xs={24} md={12}>
          <Form.Item
            name="monthlyLimit"
            label={<span style={labelStyle}>Monthly Limit (₹)</span>}
            rules={[
              { required: true, message: 'Required' },
              { type: 'number', min: 100, message: 'Min ₹100' },
            ]}
          >
            <InputNumber
              size="large"
              style={{ width: '100%' }}
              prefix="₹"
              min={100}
              formatter={(v) => `${v}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
              placeholder="e.g. 1,00,000"
            />
          </Form.Item>
        </Col>

        <Col xs={24}>
          <Divider style={{ margin: '4px 0 16px', borderColor: 'var(--border)' }} />
          {sectionTitle('Feature Controls')}
        </Col>

        {[
          { name: 'internationalEnabled', label: 'International Transactions', desc: 'Allow usage outside India' },
          { name: 'onlineEnabled', label: 'Online Transactions', desc: 'Allow e-commerce & UPI' },
          { name: 'atmEnabled', label: 'ATM Withdrawals', desc: 'Allow cash withdrawal' },
        ].map((toggle) => (
          <Col xs={24} md={8} key={toggle.name}>
            <Form.Item name={toggle.name} valuePropName="checked">
              <div
                style={{
                  border: '1px solid var(--border)',
                  borderRadius: 10,
                  padding: '16px 20px',
                  background: 'var(--background)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: 12,
                }}
              >
                <div>
                  <Text strong style={{ display: 'block', fontSize: 13 }}>{toggle.label}</Text>
                  <Text type="secondary" style={{ fontSize: 12 }}>{toggle.desc}</Text>
                </div>
                <Form.Item name={toggle.name} valuePropName="checked" noStyle>
                  <Switch
                    style={{ background: 'var(--primary)' }}
                  />
                </Form.Item>
              </div>
            </Form.Item>
          </Col>
        ))}

        <Col xs={24}>
          <Divider style={{ margin: '4px 0 16px', borderColor: 'var(--border)' }} />
          {sectionTitle('Initial Load')}
        </Col>

        <Col xs={24} md={12}>
          <Form.Item
            name="loadAmount"
            label={<span style={labelStyle}>Load Amount at Issuance (₹)</span>}
            rules={[
              { required: true, message: 'Required' },
              { type: 'number', min: 100, message: 'Minimum ₹100 required' },
            ]}
            extra="Minimum ₹100 required to activate card"
          >
            <InputNumber
              size="large"
              style={{ width: '100%' }}
              prefix="₹"
              min={100}
              formatter={(v) => `${v}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
              placeholder="e.g. 500"
            />
          </Form.Item>
        </Col>
      </Row>
    </Form>
  );

  // ─── Step 3: Review & Confirm ─────────────────────────────────────────────
  const step3 = () => {
    const s1 = formData.step1;
    const s2 = formData.step2;

    const reviewRow = (label: string, value: string | number | undefined | boolean) => (
      <div
        key={label}
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '10px 0',
          borderBottom: '1px solid #F0FAF5',
        }}
      >
        <Text type="secondary" style={{ fontSize: 13 }}>{label}</Text>
        <Text strong style={{ fontSize: 13, color: '#1F2937' }}>
          {value === true ? 'Enabled' : value === false ? 'Disabled' : value ?? '—'}
        </Text>
      </div>
    );

    return (
      <div>
        <Row gutter={[20, 20]}>
          <Col xs={24} md={12}>
            <div style={gradientStyle}>
              <Card style={cardStyle} bodyStyle={{ padding: '20px 24px' }}>
                <div className="mb-3">{sectionTitle('Cardholder Details')}</div>
                {reviewRow('Cardholder Name', s1.cardholderName)}
                {reviewRow('Mobile', s1.mobile)}
                {reviewRow('Email', s1.email)}
                {reviewRow('Card Type', s1.cardType)}
                {reviewRow('Card Category', s1.cardCategory)}
              </Card>
            </div>
          </Col>

          <Col xs={24} md={12}>
            <div style={gradientStyle}>
              <Card style={cardStyle} bodyStyle={{ padding: '20px 24px' }}>
                <div className="mb-3">{sectionTitle('Card Configuration')}</div>
                {reviewRow('Daily Limit', s2.dailyLimit ? `₹${Number(s2.dailyLimit).toLocaleString('en-IN')}` : '—')}
                {reviewRow('Monthly Limit', s2.monthlyLimit ? `₹${Number(s2.monthlyLimit).toLocaleString('en-IN')}` : '—')}
                {reviewRow('Load Amount', s2.loadAmount ? `₹${Number(s2.loadAmount).toLocaleString('en-IN')}` : '—')}
                {reviewRow('International Txns', s2.internationalEnabled)}
                {reviewRow('Online Txns', s2.onlineEnabled)}
                {reviewRow('ATM Withdrawals', s2.atmEnabled)}
              </Card>
            </div>
          </Col>
        </Row>

        {/* RBI Compliance Checkbox */}
        <div
          style={{
            marginTop: 20,
            padding: '16px 20px',
            background: '#EFF6FF',
            border: '1px solid #BFDBFE',
            borderRadius: 10,
          }}
        >
          <Checkbox
            checked={formData.rbiConsent}
            onChange={(e) => setFormData((prev) => ({ ...prev, rbiConsent: e.target.checked }))}
          >
            <Text style={{ fontSize: 13 }}>
              Card issued under{' '}
              <Text strong>RBI Prepaid Payment Instrument guidelines</Text>
              {' '}via{' '}
              <Text strong>Equitas Small Finance Bank</Text>. I confirm the cardholder details are KYC verified and accurate.
            </Text>
          </Checkbox>
        </div>

        {/* Pending Bank API Alert */}
        <Alert
          type="warning"
          showIcon
          className="mt-4"
          style={{ borderRadius: 10 }}
          message="Bank API Integration Pending"
          description="Card issuance will be enabled once Equitas Small Finance Bank API activation is complete. You can save this configuration and it will be processed automatically upon activation."
        />
      </div>
    );
  };

  const stepContent = [step1, step2, step3()];

  return (
    <div className="p-6 min-h-screen" style={{ background: 'var(--background)' }}>

      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <Button
          icon={<ArrowLeftOutlined />}
          onClick={() => router.back()}
          style={{ borderColor: 'var(--secondary)', color: 'var(--secondary)' }}
        >
          Back
        </Button>
        <div>
          <Title level={4} style={{ margin: 0, color: 'var(--secondary)' }}>
            Issue New Prepaid Card
          </Title>
          <Text type="secondary" className="text-sm">
            Powered by Equitas Small Finance Bank · RBI PPI Guidelines
          </Text>
        </div>
      </div>

      {/* Steps Progress */}
      <div style={gradientStyle} className="mb-6">
        <Card style={cardStyle} bodyStyle={{ padding: '20px 32px' }}>
          <Steps
            current={current}
            items={STEPS.map((s) => ({ title: s.title, icon: s.icon }))}
            style={{ maxWidth: 600, margin: '0 auto' }}
          />
        </Card>
      </div>

      {/* Step Content */}
      <div style={gradientStyle} className="mb-6">
        <Card style={cardStyle} bodyStyle={{ padding: '28px 32px' }}>
          {stepContent[current]}
        </Card>
      </div>

      {/* Navigation Buttons */}
      <div className="flex justify-between">
        <Button
          size="large"
          icon={<ArrowLeftOutlined />}
          onClick={() => setCurrent((c) => c - 1)}
          disabled={current === 0}
          style={{ borderColor: 'var(--secondary)', color: 'var(--secondary)' }}
        >
          Previous
        </Button>

        {current < 2 && (
          <Button
            size="large"
            type="primary"
            icon={<ArrowRightOutlined />}
            iconPosition="end"
            onClick={current === 0 ? handleStep1Next : handleStep2Next}
            style={{
              background: 'linear-gradient(to right, var(--secondary), var(--primary))',
              border: 'none',
            }}
          >
            Next Step
          </Button>
        )}

        {current === 2 && (
          <Tooltip title="Pending bank API activation — card issuance will be enabled once Equitas Small Finance Bank integration is complete.">
            <Button
              size="large"
              type="primary"
              icon={<LockOutlined />}
              disabled
              style={{ opacity: 0.7, cursor: 'not-allowed' }}
            >
              Issue Card
            </Button>
          </Tooltip>
        )}
      </div>
    </div>
  );
}
