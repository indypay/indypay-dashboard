'use client';

import { Card, Button, Row, Col } from 'antd';
import {
  CloseOutlined,
  WalletOutlined,
  CheckCircleOutlined,
} from '@ant-design/icons';
import { useState, useRef } from 'react';
import Image from 'next/image';

interface PaymentProductBannerProps {
  productName: string;
  productDescription: string;
  pricingInfo?: {
    title: string;
    description: string;
    onViewPricing?: () => void;
  };
  getStartedSteps?: Array<{
    step: number;
    title: string;
    description: string;
  }>;
  onSkip?: () => void;
  onGetStarted?: () => void;
  scrollTargetId?: string;
}

export const PaymentProductBanner = ({
  productName,
  productDescription,
  pricingInfo,
  getStartedSteps,
  onSkip,
  onGetStarted,
  scrollTargetId = 'filters-section',
}: PaymentProductBannerProps) => {
  const [isPricingVisible, setIsPricingVisible] = useState(true);
  const [isGetStartedVisible, setIsGetStartedVisible] = useState(true);

  const handleSkip = () => {
    setIsPricingVisible(false);
    setIsGetStartedVisible(false);
    const targetElement = document.getElementById(scrollTargetId);
    if (targetElement) {
      targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    onSkip?.();
  };

  const handleGetStarted = () => {
    setIsPricingVisible(false);
    setIsGetStartedVisible(false);
    const targetElement = document.getElementById(scrollTargetId);
    if (targetElement) {
      targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    onGetStarted?.();
  };

  return (
    <div style={{ padding: '24px 32px 0 32px' }}>
      {/* Pricing Banner */}
      {pricingInfo && isPricingVisible && (
        <div
          style={{
            background: 'linear-gradient(to right, var(--border), var(--primary))',
            borderRadius: '12px',
            padding: '16px 24px',
            marginBottom: '16px',
            position: 'relative',
          }}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <WalletOutlined style={{ fontSize: '24px', color: 'var(--background)' }} />
              <div>
                <span
                  style={{
                    color: 'var(--background)',
                    fontWeight: 600,
                    fontSize: '14px',
                    marginRight: '12px',
                  }}
                >
                  {pricingInfo.title}
                </span>
                <span style={{ color: 'var(--background)', fontSize: '14px' }}>
                  {pricingInfo.description}
                </span>
              </div>
              {pricingInfo.onViewPricing && (
                <Button
                  size="small"
                  onClick={pricingInfo.onViewPricing}
                  style={{
                    background: '#FFFFFF',
                    border: 'none',
                    color: 'var(--text)',
                    fontWeight: 600,
                  }}
                >
                  View Pricing
                </Button>
              )}
            </div>
            <Button
              type="text"
              icon={<CloseOutlined />}
              onClick={() => setIsPricingVisible(false)}
              style={{ color: 'var(--background)' }}
            />
          </div>
        </div>
      )}

      {/* Get Started Banner */}
      {getStartedSteps && isGetStartedVisible && (
        <div
          style={{
            background: 'linear-gradient(to right, var(--border), var(--primary))',
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
                <div
                  style={{
                    width: '80px',
                    height: '80px',
                    borderRadius: '12px',
                    background: 'linear-gradient(135deg, var(--secondary), var(--primary))',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'var(--background)',
                    fontSize: '32px',
                    fontWeight: 700,
                  }}
                >
                  {productName.charAt(0)}
                </div>
              </div>
              <div style={{ flex: 1 }}>
                <div className="flex items-center justify-between mb-4">
                  <h2
                    style={{
                      fontSize: '16px',
                      fontWeight: 700,
                      color: 'var(--text-muted)',
                      letterSpacing: '1px',
                      margin: 0,
                    }}
                  >
                    GET STARTED
                  </h2>
                  <div className="flex gap-2">
                    <Button
                      size="small"
                      onClick={handleSkip}
                      style={{
                        background: 'var(--border)',
                        border: 'none',
                        color: 'var(--text)',
                        fontWeight: 600,
                      }}
                    >
                      Skip
                    </Button>
                    <Button
                      size="small"
                      onClick={handleGetStarted}
                      style={{
                        background:
                          'linear-gradient(to right, var(--border), var(--primary))',
                        border: 'none',
                        color: 'var(--background)',
                        fontWeight: 600,
                      }}
                    >
                      Get Started
                    </Button>
                  </div>
                </div>
                <Row gutter={32}>
                  {getStartedSteps.map((step, index) => (
                    <Col span={24 / getStartedSteps.length} key={step.step}>
                      <div className="flex items-start gap-3 mb-2">
                        <div
                          style={{
                            width: '32px',
                            height: '32px',
                            borderRadius: '50%',
                            background:
                              index === 0
                                ? 'linear-gradient(135deg, #0DD25F, #0AA34D)'
                                : 'linear-gradient(135deg, #53BEC2, #40A17F)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: '#FFFFFF',
                            fontWeight: 600,
                            fontSize: '14px',
                            flexShrink: 0,
                          }}
                        >
                          {step.step}
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
                            {step.title}
                          </h3>
                          <p
                            style={{
                              color: 'var(--text-muted)',
                              fontSize: '13px',
                              margin: 0,
                            }}
                          >
                            {step.description}
                          </p>
                        </div>
                      </div>
                    </Col>
                  ))}
                </Row>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};
