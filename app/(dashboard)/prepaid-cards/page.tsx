'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Alert,
  Button,
  Card,
  Tooltip,
  Col,
  Row,
  Statistic,
  Table,
  Tag,
  Tabs,
  Typography,
  Empty,
} from 'antd';
import type { TableColumnsType } from 'antd';
import {
  CreditCardOutlined,
  PlusOutlined,
  WalletOutlined,
  StopOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  LockOutlined,
} from '@ant-design/icons';
import { formatAmount } from '@/lib/utils/utils';

const { Title, Text } = Typography;

type CardStatus = 'Active' | 'Blocked' | 'Expired';
type CardType = 'Virtual' | 'Physical';
type CardCategory = 'Personal' | 'Corporate' | 'Gift';
type CardFilter = 'all' | 'virtual' | 'physical' | 'corporate' | 'gift';

interface PrepaidCard {
  id: string;
  maskedNumber: string;
  cardholderName: string;
  cardType: CardType;
  cardCategory: CardCategory;
  balance: number;
  status: CardStatus;
  issuedDate: string;
}

const statusColor: Record<CardStatus, string> = {
  Active: 'green',
  Blocked: 'red',
  Expired: 'default',
};

const statusIcon: Record<CardStatus, React.ReactNode> = {
  Active: <CheckCircleOutlined />,
  Blocked: <StopOutlined />,
  Expired: <ClockCircleOutlined />,
};

const columns: TableColumnsType<PrepaidCard> = [
  {
    title: 'Card Number',
    dataIndex: 'maskedNumber',
    key: 'maskedNumber',
    render: (val) => (
      <Text className="font-mono tracking-widest text-sm">{val}</Text>
    ),
  },
  {
    title: 'Cardholder Name',
    dataIndex: 'cardholderName',
    key: 'cardholderName',
  },
  {
    title: 'Card Type',
    key: 'cardType',
    render: (_, r) => (
      <div className="flex flex-col gap-0.5">
        <Tag color="blue" bordered={false}>{r.cardType}</Tag>
        <Tag color="geekblue" bordered={false} style={{ fontSize: 10 }}>{r.cardCategory}</Tag>
      </div>
    ),
  },
  {
    title: 'Balance',
    dataIndex: 'balance',
    key: 'balance',
    render: (val) => (
      <Text strong style={{ color: 'var(--secondary)' }}>{formatAmount(val)}</Text>
    ),
  },
  {
    title: 'Status',
    dataIndex: 'status',
    key: 'status',
    render: (val: CardStatus) => (
      <Tag color={statusColor[val]} icon={statusIcon[val]} bordered={false}>
        {val}
      </Tag>
    ),
  },
  {
    title: 'Issued Date',
    dataIndex: 'issuedDate',
    key: 'issuedDate',
    render: (val) => <Text type="secondary">{val}</Text>,
  },
  {
    title: 'Actions',
    key: 'actions',
    render: () => (
      <div className="flex gap-2">
        <Button size="small" type="link" style={{ color: 'var(--secondary)' }}>View</Button>
        <Button size="small" type="link" danger>Block</Button>
        <Button size="small" type="link" style={{ color: 'var(--primary)' }}>Load</Button>
      </div>
    ),
  },
];

const filterTabs = [
  { key: 'all', label: 'All Cards' },
  { key: 'virtual', label: 'Virtual Cards' },
  { key: 'physical', label: 'Physical Cards' },
  { key: 'corporate', label: 'Corporate Cards' },
  { key: 'gift', label: 'Gift Cards' },
];

export default function PrepaidCardsPage() {
  const router = useRouter();
  const [activeFilter, setActiveFilter] = useState<CardFilter>('all');

  const data: PrepaidCard[] = [];

  const filtered = data.filter((c) => {
    if (activeFilter === 'all') return true;
    if (activeFilter === 'virtual') return c.cardType === 'Virtual';
    if (activeFilter === 'physical') return c.cardType === 'Physical';
    if (activeFilter === 'corporate') return c.cardCategory === 'Corporate';
    if (activeFilter === 'gift') return c.cardCategory === 'Gift';
    return true;
  });

  return (
    <div className="p-6 min-h-screen" style={{ background: 'var(--background)' }}>

      {/* Info Banner */}
      <Alert
        type="info"
        showIcon
        className="mb-6 rounded-xl"
        style={{
          background: 'linear-gradient(to right, #EFF6FF, #DBEAFE)',
          border: '1px solid #BFDBFE',
          borderRadius: 12,
        }}
        message={
          <Text strong style={{ color: '#1D4ED8' }}>
            Prepaid Card issuance is pending bank approval.
          </Text>
        }
        description={
          <Text style={{ color: '#3B82F6' }}>
            Features will be activated once Equitas Small Finance Bank API integration is complete.
            All configurations are ready and cards will be live upon approval.
          </Text>
        }
      />

      {/* Page Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <Title level={4} style={{ margin: 0, color: 'var(--secondary)' }}>
            <CreditCardOutlined className="mr-2" />
            Prepaid Card Management
          </Title>
          <Text type="secondary" className="text-sm">
            Powered by Equitas Small Finance Bank · RBI PPI Guidelines
          </Text>
        </div>
        <div className="flex gap-3">
          <Tooltip title="Pending bank approval — available once Equitas Small Finance Bank integration is complete">
            <Button
              icon={<StopOutlined />}
              disabled
              style={{ borderColor: 'var(--secondary)', color: 'var(--secondary)' }}
            >
              Block / Unfreeze Card
            </Button>
          </Tooltip>
          <Tooltip title="Pending bank approval — available once Equitas Small Finance Bank integration is complete">
            <Button
              icon={<WalletOutlined />}
              disabled
              style={{ borderColor: 'var(--secondary)', color: 'var(--secondary)' }}
            >
              Load Balance
            </Button>
          </Tooltip>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => router.push('/prepaid-cards/issue-card')}
            style={{
              background: 'linear-gradient(to right, var(--secondary), var(--primary))',
              border: 'none',
            }}
          >
            Issue New Card
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <Row gutter={[16, 16]} className="mb-6">
        {[
          {
            title: 'Total Cards Issued',
            value: 0,
            icon: <CreditCardOutlined style={{ fontSize: 24, color: 'var(--secondary)' }} />,
            suffix: '',
          },
          {
            title: 'Active Cards',
            value: 0,
            icon: <CheckCircleOutlined style={{ fontSize: 24, color: 'var(--primary)' }} />,
            suffix: '',
          },
          {
            title: 'Total Load Amount',
            value: '₹0',
            icon: <WalletOutlined style={{ fontSize: 24, color: 'var(--secondary)' }} />,
            isAmount: true,
          },
          {
            title: 'Blocked Cards',
            value: 0,
            icon: <StopOutlined style={{ fontSize: 24, color: '#D51C44' }} />,
            suffix: '',
          },
        ].map((stat, i) => (
          <Col xs={24} sm={12} lg={6} key={i}>
            <div
              style={{
                background: 'linear-gradient(to right, var(--border), var(--primary))',
                borderRadius: 12,
                padding: 2,
              }}
            >
              <Card
                bordered={false}
                style={{ borderRadius: 10, height: '100%' }}
                bodyStyle={{ padding: '20px 24px' }}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <Text type="secondary" className="text-xs uppercase tracking-wider">
                      {stat.title}
                    </Text>
                    <div className="mt-1">
                      {stat.isAmount ? (
                        <Text strong style={{ fontSize: 22, color: 'var(--secondary)' }}>
                          {stat.value}
                        </Text>
                      ) : (
                        <Statistic
                          value={stat.value as number}
                          valueStyle={{ fontSize: 22, color: 'var(--secondary)', fontWeight: 700 }}
                        />
                      )}
                    </div>
                  </div>
                  <div
                    style={{
                      background: '#F0FAF5',
                      borderRadius: 10,
                      padding: 10,
                    }}
                  >
                    {stat.icon}
                  </div>
                </div>
              </Card>
            </div>
          </Col>
        ))}
      </Row>

      {/* Card List Table */}
      <div
        style={{
          background: 'linear-gradient(to right, var(--border), var(--primary))',
          borderRadius: 12,
          padding: 2,
        }}
      >
        <Card bordered={false} style={{ borderRadius: 10 }} bodyStyle={{ padding: 0 }}>
          {/* Filter Tabs */}
          <div className="px-6 pt-4">
            <Tabs
              activeKey={activeFilter}
              onChange={(k) => setActiveFilter(k as CardFilter)}
              items={filterTabs.map((t) => ({ key: t.key, label: t.label }))}
              tabBarStyle={{ marginBottom: 0 }}
            />
          </div>

          <Table
            columns={columns}
            dataSource={filtered}
            rowKey="id"
            pagination={false}
            locale={{
              emptyText: (
                <Empty
                  image={
                    <CreditCardOutlined
                      style={{ fontSize: 56, color: 'var(--border)' }}
                    />
                  }
                  description={
                    <div className="text-center py-4">
                      <Text strong className="block text-base mb-1" style={{ color: 'var(--secondary)' }}>
                        No cards issued yet
                      </Text>
                      <Text type="secondary" className="text-sm">
                        Issue your first prepaid card to get started.
                        <br />
                        Cards are powered by Equitas Small Finance Bank.
                      </Text>
                      <div className="mt-4">
                        <Button
                          type="primary"
                          icon={<LockOutlined />}
                          onClick={() => router.push('/prepaid-cards/issue-card')}
                          style={{
                            background: 'linear-gradient(to right, var(--secondary), var(--primary))',
                            border: 'none',
                          }}
                        >
                          Issue New Card
                        </Button>
                      </div>
                    </div>
                  }
                  style={{ padding: '48px 0' }}
                />
              ),
            }}
          />
        </Card>
      </div>
    </div>
  );
}
