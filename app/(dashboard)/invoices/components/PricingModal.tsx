'use client';

import { useState } from 'react';
import { Modal, Button, Row, Col } from 'antd';
import {
  CheckCircleOutlined,
  LinkOutlined,
  FileTextOutlined,
  ProfileOutlined,
  ArrowRightOutlined,
} from '@ant-design/icons';
import Image from 'next/image';
import { InvoicingProductSuite } from '@/lib/components/Pricing/InvoicingProductSuite';

interface PricingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PricingModal = ({ isOpen, onClose }: PricingModalProps) => {
  const [isProductSuiteOpen, setIsProductSuiteOpen] = useState(false);

  return (
    <Modal
      title={
        <h1
          style={{
            color: 'var(--text)',
            fontSize: '24px',
            fontWeight: 700,
            margin: 0,
          }}
        >
          Pricing for Links, Pages, Invoices
        </h1>
      }
      open={isOpen}
      onCancel={onClose}
      footer={null}
      width={900}
      style={{ top: 20 }}
      styles={{
        content: {
          background: '#FFFFFF',
          borderRadius: '12px',
        },
        header: {
          background: '#FFFFFF',
          borderBottom: '1px solid #4E4E4E',
        },
        body: {
          background: '#FFFFFF',
        },
      }}
    >
      <div style={{ padding: '24px 0' }}>
        <div
          style={{
            background: 'linear-gradient(to right, var(--border), var(--primary))',
            borderRadius: '12px',
            padding: '2px',
            marginBottom: '32px',
          }}
        >
          <div
            style={{
              background: 'var(--background)',
              borderRadius: '10px',
              padding: '20px 24px',
            }}
          >
            <p
              style={{
                color: 'var(--text)',
                fontSize: '16px',
                margin: 0,
                lineHeight: 1.6,
              }}
            >
              Transactions on Links, Pages, and Invoices incur a{' '}
              <span
                style={{ fontWeight: 700, fontSize: '20px', color: 'var(--secondary)' }}
              >
                2%
              </span>{' '}
              fee, billed only upon successful payment
            </p>
          </div>
        </div>

        <Row gutter={32}>
          <Col span={12}>
            <h3
              style={{
                color: 'var(--text-muted)',
                fontSize: '14px',
                fontWeight: 600,
                marginBottom: '16px',
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
              }}
            >
              Products Applicable
            </h3>
            <div className="space-y-3">
              <div
                style={{
                  background: 'var(--background)',
                  border: '1px solid #4E4E4E',
                  borderRadius: '8px',
                  padding: '12px 16px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                }}
              >
                <LinkOutlined style={{ fontSize: '20px', color: 'var(--primary)' }} />
                <span
                  style={{
                    color: 'var(--text)',
                    fontSize: '15px',
                    fontWeight: 500,
                  }}
                >
                  Payment Links
                </span>
              </div>
              <div
                style={{
                  background: 'var(--background)',
                  border: '1px solid #4E4E4E',
                  borderRadius: '8px',
                  padding: '12px 16px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                }}
              >
                <ProfileOutlined
                  style={{ fontSize: '20px', color: 'var(--primary)' }}
                />
                <span
                  style={{
                    color: 'var(--text)',
                    fontSize: '15px',
                    fontWeight: 500,
                  }}
                >
                  Payment Pages
                </span>
              </div>
              <div
                style={{
                  background: 'var(--background)',
                  border: '1px solid #4E4E4E',
                  borderRadius: '8px',
                  padding: '12px 16px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                }}
              >
                <FileTextOutlined
                  style={{ fontSize: '20px', color: 'var(--primary)' }}
                />
                <span
                  style={{
                    color: 'var(--text)',
                    fontSize: '15px',
                    fontWeight: 500,
                  }}
                >
                  Invoices
                </span>
              </div>
              <div
                style={{
                  background: 'var(--background)',
                  border: '1px solid #4E4E4E',
                  borderRadius: '8px',
                  padding: '12px 16px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                }}
              >
                <LinkOutlined style={{ fontSize: '20px', color: 'var(--primary)' }} />
                <span
                  style={{
                    color: 'var(--text)',
                    fontSize: '15px',
                    fontWeight: 500,
                  }}
                >
                  Brand Links
                </span>
              </div>
              <div
                style={{
                  background: 'var(--background)',
                  border: '1px solid #4E4E4E',
                  borderRadius: '8px',
                  padding: '12px 16px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                }}
              >
                <Image
                  src="/assests/images/storefront.png"
                  height={60}
                  width={60}
                  alt="Storefront"
                  className="rounded"
                />
                <span
                  style={{
                    color: 'var(--text)',
                    fontSize: '15px',
                    fontWeight: 500,
                  }}
                >
                  StoreFronts Pages
                </span>
              </div>
            </div>
          </Col>
          <Col span={12}>
            <h3
              style={{
                color: 'var(--text)',
                fontSize: '20px',
                fontWeight: 600,
                marginBottom: '20px',
              }}
            >
              What you&apos;ll get
            </h3>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <CheckCircleOutlined
                  style={{
                    fontSize: '24px',
                    color: 'var(--primary)',
                    flexShrink: 0,
                    marginTop: '2px',
                  }}
                />
                <p
                  style={{
                    color: 'var(--text)',
                    fontSize: '15px',
                    margin: 0,
                    lineHeight: 1.6,
                  }}
                >
                  Accept payments without any development or coding
                </p>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircleOutlined
                  style={{
                    fontSize: '24px',
                    color: 'var(--primary)',
                    flexShrink: 0,
                    marginTop: '2px',
                  }}
                />
                <p
                  style={{
                    color: 'var(--text)',
                    fontSize: '15px',
                    margin: 0,
                    lineHeight: 1.6,
                  }}
                >
                  Create website-like experience for your customers
                </p>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircleOutlined
                  style={{
                    fontSize: '24px',
                    color: 'var(--primary)',
                    flexShrink: 0,
                    marginTop: '2px',
                  }}
                />
                <p
                  style={{
                    color: 'var(--text)',
                    fontSize: '15px',
                    margin: 0,
                    lineHeight: 1.6,
                  }}
                >
                  Free hosting and SMS included
                </p>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircleOutlined
                  style={{
                    fontSize: '24px',
                    color: 'var(--primary)',
                    flexShrink: 0,
                    marginTop: '2px',
                  }}
                />
                <p
                  style={{
                    color: 'var(--text)',
                    fontSize: '15px',
                    margin: 0,
                    lineHeight: 1.6,
                  }}
                >
                  Free hosting and SMS included
                </p>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircleOutlined
                  style={{
                    fontSize: '24px',
                    color: 'var(--primary)',
                    flexShrink: 0,
                    marginTop: '2px',
                  }}
                />
                <p
                  style={{
                    color: 'var(--text)',
                    fontSize: '15px',
                    margin: 0,
                    lineHeight: 1.6,
                  }}
                >
                  Unlimited access to RupeeFlow APIs & custom integrations
                </p>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircleOutlined
                  style={{
                    fontSize: '24px',
                    color: 'var(--primary)',
                    flexShrink: 0,
                    marginTop: '2px',
                  }}
                />
                <p
                  style={{
                    color: 'var(--text)',
                    fontSize: '15px',
                    margin: 0,
                    lineHeight: 1.6,
                  }}
                >
                  Offer your customers a wide range of payment options,
                  including UPI, credit cards, net banking, wallets, and EMIs
                </p>
              </div>
            </div>
            <div
              className="flex items-center gap-3 top-4 mt-4 cursor-pointer"
              onClick={() => setIsProductSuiteOpen(true)}
            >
              <span className="text-[#B1C4C1]">View products benefits</span>{' '}
              <ArrowRightOutlined
                style={{ color: 'var(--primary)', marginLeft: '4px', width: '64px' }}
              />
            </div>
          </Col>
        </Row>

        <div style={{ marginTop: '32px', textAlign: 'center' }}>
          <Button
            type="primary"
            size="large"
            onClick={onClose}
            style={{
              background: 'var(--cta-gradient)',
              border: 'none',
              color: 'var(--background)',
              fontWeight: 600,
              height: '48px',
              paddingLeft: '48px',
              paddingRight: '48px',
            }}
          >
            Got it
          </Button>
        </div>
      </div>
      <InvoicingProductSuite
        open={isProductSuiteOpen}
        onClose={() => setIsProductSuiteOpen(false)}
      />
    </Modal>
  );
};
