'use client';

import { useState } from 'react';
import { Card, Row, Col, Button } from 'antd';
import { CheckCircleOutlined, WalletOutlined } from '@ant-design/icons';
import Image from 'next/image';
import { InvoicingProductSuite } from '@/lib/components/Pricing/InvoicingProductSuite';

export const GetStartedBanner = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div
      style={{
        background: 'var(--cta-gradient)',
        borderRadius: '12px',
        padding: '2px',
        marginBottom: '24px',
      }}
    >
      <Card
        style={{
          background: '#FFFFFF',
          borderRadius: '10px',
          border: 'none',
        }}
        bodyStyle={{ padding: '24px' }}
      >
        <div className="flex items-start gap-8">
          <div style={{ width: '80px', flexShrink: 0 }}>
            <Image
              src="/assests/images/rfInvoicing.png"
              alt="Invoice Creation"
              width={400}
              height={400}
              // className="object-contain"
            />
          </div>
          <div style={{ flex: 1 }}>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '16px',
              }}
            >
              <h2
                style={{
                  fontSize: '16px',
                  fontWeight: 700,
                  color: 'var(--text-muted)',
                  margin: 0,
                  letterSpacing: '1px',
                }}
              >
                GET STARTED
              </h2>
              <Button
                type="link"
                onClick={() => setIsModalOpen(true)}
                style={{
                  color: 'var(--primary)',
                  fontSize: '14px',
                  fontWeight: 500,
                  padding: 0,
                  height: 'auto',
                }}
              >
                View Product Details
              </Button>
            </div>
            <Row gutter={32}>
              <Col span={12}>
                <div className="flex items-start gap-3 mb-2">
                  <div
                    style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '50%',
                      background: 'var(--cta-gradient)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#FFFFFF',
                      fontWeight: 600,
                      fontSize: '14px',
                      flexShrink: 0,
                    }}
                  >
                    1
                  </div>
                  <div>
                    <h3
                      style={{
                        fontWeight: 600,
                        color: 'var(--text)',
                        fontSize: '15px',
                        marginBottom: '4px',
                      }}
                    >
                      Invoice Created
                    </h3>
                    <p
                      style={{ color: 'var(--text-muted)', fontSize: '13px', margin: 0 }}
                    >
                      Create GST based invoices instantly and notify your
                      customer via sms or email.
                    </p>
                  </div>
                </div>
              </Col>
              <Col span={12}>
                <div className="flex items-start gap-3 mb-2">
                  <div
                    style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '50%',
                      background: 'var(--cta-gradient)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#FFFFFF',
                      fontWeight: 600,
                      fontSize: '14px',
                      flexShrink: 0,
                    }}
                  >
                    2
                  </div>
                  <div>
                    <h3
                      style={{
                        fontWeight: 600,
                        color: 'var(--text)',
                        fontSize: '15px',
                        marginBottom: '4px',
                      }}
                    >
                      Receive Payments
                    </h3>
                    <p
                      style={{ color: 'var(--text-muted)', fontSize: '13px', margin: 0 }}
                    >
                      Your customers can make payments directly via the invoice
                      link.
                    </p>
                  </div>
                </div>
              </Col>
            </Row>
          </div>
        </div>
      </Card>
      <InvoicingProductSuite
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
};
