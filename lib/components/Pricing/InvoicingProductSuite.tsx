'use client';

import { Modal, Collapse, Button } from 'antd';
import {
  ArrowLeftOutlined,
  CloseOutlined,
  DownOutlined,
  CheckCircleOutlined,
} from '@ant-design/icons';

const { Panel } = Collapse;

interface ProductBenefit {
  title: string;
  features: string[];
}

interface InvoicingProductSuiteProps {
  open: boolean;
  onClose: () => void;
}

const productBenefits: ProductBenefit[] = [
  {
    title: 'Payment Links',
    features: [
      'Create links to sell anywhere',
      'We handle SMS and email notifications',
      'Send links via WhatsApp Business account',
      'Integrate with ERP systems and other systems for automatic creation',
      'Send auto-reminders for unpaid Links to customers',
    ],
  },
  {
    title: 'RupeeFlow.me Link',
    features: [
      'Custom branded payment page for your business',
      'Accept payments with personalized link',
      'No coding required',
      'Mobile-optimized checkout',
      'Share your unique payment link anywhere',
    ],
  },
  {
    title: 'Payment Pages',
    features: [
      'Create beautiful payment pages without coding',
      'Pre-designed templates',
      'Customizable branding',
      'Multiple payment options',
      'Secure checkout experience',
    ],
  },
  {
    title: 'Storefront Pages',
    features: [
      'Build your online store and sell products',
      'Product catalog management',
      'Inventory tracking',
      'Order management',
      'Customer management',
    ],
  },
  {
    title: 'Invoices',
    features: [
      'Create GST-compliant invoices and get paid faster',
      'Auto-calculate taxes and generate professional invoices',
      'Send via email or SMS instantly',
      'Payment tracking and automated reminders',
      'Multiple invoice templates to choose from',
    ],
  },
];

export const InvoicingProductSuite = ({
  open,
  onClose,
}: InvoicingProductSuiteProps) => {
  return (
    <Modal
      open={open}
      onCancel={onClose}
      footer={null}
      width={900}
      closeIcon={null}
      styles={{
        body: {
          padding: 0,
          background: '#1F2726',
        },
      }}
      style={{
        top: 20,
      }}
    >
      <div
        style={{
          background: '#1F2726',
          minHeight: '500px',
          maxHeight: '80vh',
          overflow: 'auto',
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: '20px 24px',
            borderBottom: '1px solid #3A3F3E',
            position: 'sticky',
            top: 0,
            background: '#1F2726',
            zIndex: 10,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <Button
              type="text"
              icon={
                <ArrowLeftOutlined
                  style={{ color: 'var(--text)', fontSize: '18px' }}
                />
              }
              onClick={onClose}
              style={{
                border: 'none',
                background: 'transparent',
                padding: 0,
                height: 'auto',
              }}
            />
            <h2
              style={{
                fontSize: '24px',
                fontWeight: 600,
                color: 'var(--text)',
                margin: 0,
              }}
            >
              Product-wise Benefits
            </h2>
          </div>
          <Button
            type="text"
            icon={
              <CloseOutlined style={{ color: 'var(--text)', fontSize: '16px' }} />
            }
            onClick={onClose}
            style={{
              border: 'none',
              background: 'transparent',
              padding: 0,
              height: 'auto',
            }}
          />
        </div>

        {/* Product List */}
        <div style={{ padding: '24px' }}>
          <Collapse
            accordion
            bordered={false}
            expandIcon={({ isActive }) => (
              <DownOutlined
                rotate={isActive ? 180 : 0}
                style={{
                  color: '#7A8A87',
                  fontSize: '16px',
                  transition: 'transform 0.3s',
                }}
              />
            )}
            style={{
              background: 'transparent',
            }}
          >
            {productBenefits.map((product, index) => (
              <Panel
                header={
                  <span
                    style={{
                      fontSize: '20px',
                      fontWeight: 600,
                      color: '#E1E8E6',
                    }}
                  >
                    {product.title}
                  </span>
                }
                key={index}
                style={{
                  marginBottom: '12px',
                  background: '#FFFFFF',
                  border: '1px solid #3A3F3E',
                  borderRadius: '8px',
                  overflow: 'hidden',
                }}
              >
                <div style={{ padding: '20px 0 8px 0' }}>
                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '16px',
                    }}
                  >
                    {product.features.map((feature, idx) => (
                      <div
                        key={idx}
                        style={{
                          display: 'flex',
                          alignItems: 'flex-start',
                          gap: '12px',
                        }}
                      >
                        <CheckCircleOutlined
                          style={{
                            fontSize: '20px',
                            color: '#0DD25F',
                            flexShrink: 0,
                            marginTop: '2px',
                          }}
                        />
                        <span
                          style={{
                            color: 'var(--text)',
                            fontSize: '15px',
                            lineHeight: '1.6',
                          }}
                        >
                          {feature}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </Panel>
            ))}
          </Collapse>
        </div>

        {/* Footer Button */}
        <div
          style={{
            padding: '20px 24px',
            borderTop: '1px solid #3A3F3E',
            position: 'sticky',
            bottom: 0,
            background: '#1F2726',
            display: 'flex',
            justifyContent: 'flex-end',
          }}
        >
          <Button
            type="primary"
            onClick={onClose}
            style={{
              background: 'linear-gradient(135deg, #0DD25F, #0AA34D)',
              border: 'none',
              borderRadius: '6px',
              height: '44px',
              padding: '0 40px',
              fontSize: '15px',
              fontWeight: 600,
              color: 'var(--background)',
            }}
          >
            Okay, got it
          </Button>
        </div>
      </div>
    </Modal>
  );
};
