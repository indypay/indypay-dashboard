import React from 'react';
import { Modal, Skeleton } from 'antd';

import { getMerchantPayoutByPayoutId } from '@/lib/hooks/use-payout';
import {
  formatAmount,
  formatStatus,
  getFormattedTime,
} from '@/lib/utils/utils';
import { MerchantPayoutData } from '@/lib/interfaces/payout.interface';

const PayoutMerchantDetails = ({
  payoutId,
  onClose,
}: {
  payoutId: string;
  onClose: () => void;
}) => {
  const {
    data: merchantData,
    isLoading,
    isFetching,
    isError,
  } = getMerchantPayoutByPayoutId(payoutId);

  const merchantDetails = merchantData?.[0]?.data as
    | MerchantPayoutData
    | undefined;

  const { amount, createdAt, orderId, transferId, user, status } =
    merchantDetails || {};

  const InfoSection = ({
    title,
    data,
  }: {
    title: string;
    data: { label: string; value: string }[];
  }) => (
    <div
      style={{
        background: '#FFFFFF',
        padding: '20px',
        borderRadius: '12px',
        marginBottom: '16px',
      }}
    >
      <h3
        style={{
          fontSize: '20px',
          fontWeight: 600,
          color: 'var(--secondary)',
          marginBottom: '16px',
        }}
      >
        {title}
      </h3>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: '16px',
        }}
      >
        {data.map((item, index) => (
          <div key={index}>
            <p
              style={{
                fontSize: '14px',
                fontWeight: 500,
                color: 'var(--text-muted)',
                marginBottom: '4px',
              }}
            >
              {item.label || '-'}
            </p>
            <p
              style={{
                fontSize: '16px',
                color: 'var(--text)',
              }}
            >
              {item.value || '-'}
            </p>
          </div>
        ))}
      </div>
    </div>
  );

  const SkeletonSection = ({ count }: { title: string; count: number }) => (
    <div
      style={{
        background: '#FFFFFF',
        padding: '20px',
        borderRadius: '12px',
        marginBottom: '16px',
      }}
    >
      <Skeleton.Input
        active
        style={{ width: '33%', height: '24px', marginBottom: '16px' }}
      />
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: '16px',
        }}
      >
        {[...Array(count)].map((_, index) => (
          <div key={index}>
            <Skeleton.Input
              active
              style={{ width: '50%', height: '16px', marginBottom: '4px' }}
            />
            <Skeleton.Input active style={{ width: '75%', height: '20px' }} />
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <Modal
      open={true}
      onCancel={onClose}
      footer={null}
      width={1000}
      centered
      closable={false}
      styles={{
        body: { padding: 0, background: 'var(--background)' },
        mask: { background: 'rgba(12, 12, 12, 0.75)' },
      }}
    >
      <div style={{ background: 'var(--background)', padding: '32px' }}>
        {/* Header with gradient border */}
        <div
          style={{
            background: 'linear-gradient(to right, var(--border), var(--primary))',
            borderRadius: '12px',
            padding: '2px',
            marginBottom: '24px',
          }}
        >
          <div
            style={{
              background: '#FFFFFF',
              borderRadius: '10px',
              padding: '16px',
            }}
          >
            <h2
              style={{
                fontSize: '28px',
                fontWeight: 700,
                color: 'var(--secondary)',
                textAlign: 'center',
                margin: 0,
              }}
            >
              {isLoading ? (
                <Skeleton.Input
                  active
                  style={{ width: '75%', height: '32px' }}
                />
              ) : (
                `Transaction Details ${transferId || ''}`
              )}
            </h2>
          </div>
        </div>

        {/* Content */}
        <div style={{ marginTop: '24px' }}>
          {isLoading ? (
            <>
              <SkeletonSection title="User Information" count={4} />
              <SkeletonSection title="Payment Information" count={5} />
            </>
          ) : (
            <>
              {user && (
                <InfoSection
                  title="User Information"
                  data={[
                    { label: 'Name', value: user.fullName || '-' },
                    { label: 'Email', value: user.email || '-' },
                  ]}
                />
              )}
              <InfoSection
                title="Payment Information"
                data={[
                  {
                    label: 'Transaction created at',
                    value: createdAt
                      ? getFormattedTime(new Date(createdAt))
                      : '-',
                  },
                  {
                    label: 'Amount',
                    value: amount ? formatAmount(amount) : '-',
                  },
                  { label: 'Order Id', value: orderId || '-' },
                  {
                    label: 'Status',
                    value: formatStatus(status || '') || '-',
                  },
                  { label: 'Transfer Id', value: transferId || '-' },
                ]}
              />
            </>
          )}
        </div>

        {/* Footer with gradient border */}
        <div
          style={{
            background: 'linear-gradient(to right, var(--border), var(--primary))',
            borderRadius: '12px',
            padding: '2px',
            marginTop: '24px',
          }}
        >
          <button
            onClick={onClose}
            style={{
              width: '100%',
              background: '#FFFFFF',
              color: 'var(--secondary)',
              padding: '12px',
              borderRadius: '10px',
              border: 'none',
              fontSize: '16px',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'opacity 0.2s',
            }}
            onMouseOver={(e) => (e.currentTarget.style.opacity = '0.8')}
            onMouseOut={(e) => (e.currentTarget.style.opacity = '1')}
          >
            Close
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default PayoutMerchantDetails;
