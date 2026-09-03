'use client';

import { Card, Button } from 'antd';
import { CloseOutlined, WalletOutlined } from '@ant-design/icons';
import { useState } from 'react';
import { PricingModal } from './PricingModal';

export const PricingBanner = () => {
  const [isVisible, setIsVisible] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  if (!isVisible) return null;

  return (
    <>
      <div
        style={{
          background: 'var(--cta-gradient)',
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
                Charges
              </span>
              <span style={{ color: 'var(--background)', fontSize: '14px' }}>
                A reminder on how you&apos;ll be charged for Invoices
                transactions
              </span>
            </div>
            <Button
              size="small"
              onClick={() => setIsModalOpen(true)}
              style={{
                background: '#FFFFFF',
                border: 'none',
                color: 'var(--text)',
                fontWeight: 600,
              }}
            >
              View Pricing
            </Button>
          </div>
          <Button
            type="text"
            icon={<CloseOutlined />}
            onClick={() => setIsVisible(false)}
            style={{ color: 'var(--background)' }}
          />
        </div>
      </div>
      <PricingModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
};
