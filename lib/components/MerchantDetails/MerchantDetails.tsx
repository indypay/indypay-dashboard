import React, { useEffect, useState } from 'react';
import { Modal } from 'antd';
import { UseQueryResult } from '@tanstack/react-query';
import { Skeleton } from 'antd';

import {
  getAdminCollectionDetailsByPayInId,
  // getChannelPartnerCollectionDetailsByPayInId,
} from '@/lib/hooks/use-collections';
import { MerchantDetailsRes } from '@/lib/interfaces/transactions.interface';
import { safeAny } from '@/lib/interfaces/global.interface';
import {
  formatAmount,
  formatStatus,
  getFormattedTime,
} from '@/lib/utils/utils';

const MerchantDetails = ({
  userId,
  onClose,
}: {
  userId: string;
  onClose: () => void;
}) => {
  const [merchantDetails, setMerchantDetails] = useState<safeAny>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const merchantData = getAdminCollectionDetailsByPayInId(
    userId,
  ) as UseQueryResult<[MerchantDetailsRes | null, safeAny], Error>;

  useEffect(() => {
    setIsLoading(true);

    merchantData.refetch().then((res) => {
      const data = res.data;
      if (Array.isArray(data) && data.length > 0) {
        setMerchantDetails(data[0]?.data || []);
      } else {
        setMerchantDetails([]);
      }
      setIsLoading(false);
    });
  }, [userId]);

  const {
    amount,
    createdAt,
    orderId,
    status,
    name,
    email,
    mobile,
    txnRefId,
    netPayableAmount,
    user,
  } = merchantDetails || {};

  const InfoSection = ({
    title,
    data,
  }: {
    title: string;
    data: { label: string; value: string }[];
  }) => (
    <div
      className="p-6 mb-6"
      style={{
        background: '#FFFFFF',
        borderRadius: '12px',
        border: '1px solid #4E4E4E',
      }}
    >
      <h3 className="text-xl font-semibold mb-4" style={{ color: 'var(--secondary)' }}>
        {title}
      </h3>
      <div className="grid grid-cols-2 gap-6">
        {data.map((item, index) => (
          <div key={index}>
            <p
              className="text-sm font-medium mb-1"
              style={{ color: 'var(--text-muted)' }}
            >
              {item.label || '-'}
            </p>
            <p className="text-base font-medium" style={{ color: 'var(--text)' }}>
              {item.value || '-'}
            </p>
          </div>
        ))}
      </div>
    </div>
  );

  const SkeletonSection = ({ count }: { count: number }) => (
    <div
      className="p-6 mb-6"
      style={{
        background: '#FFFFFF',
        borderRadius: '12px',
        border: '1px solid #4E4E4E',
      }}
    >
      <Skeleton.Input
        active
        style={{
          width: '200px',
          marginBottom: '16px',
          background: 'var(--background)',
        }}
      />
      <div className="grid grid-cols-2 gap-6">
        {[...Array(count)].map((_, index) => (
          <div key={index}>
            <Skeleton.Input
              active
              size="small"
              style={{
                width: '100px',
                marginBottom: '8px',
                background: 'var(--background)',
              }}
            />
            <Skeleton.Input
              active
              style={{
                width: '180px',
                background: 'var(--background)',
              }}
            />
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
        {/* Header */}
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
              className="text-3xl font-bold text-center"
              style={{ color: 'var(--secondary)' }}
            >
              {isLoading ? (
                <Skeleton.Input
                  active
                  style={{ width: '400px', background: 'var(--background)' }}
                />
              ) : (
                `Transaction Details ${orderId}`
              )}
            </h2>
          </div>
        </div>

        {/* Body */}
        <div>
          {isLoading ? (
            <>
              <SkeletonSection count={4} />
              <SkeletonSection count={5} />
            </>
          ) : (
            <>
              {user && (
                <InfoSection
                  title="User Information"
                  data={[
                    { label: 'Name', value: name },
                    { label: 'Email', value: email },
                    { label: 'Mobile', value: mobile },
                    {
                      label: 'Account Status',
                      value:
                        user.accountStatus === 1
                          ? 'Active'
                          : user.accountStatus === 2
                            ? 'Inactive'
                            : user.accountStatus === 3
                              ? 'Suspended'
                              : user.accountStatus === 4
                                ? 'Blocked'
                                : user.accountStatus === 5
                                  ? 'Deleted'
                                  : user.accountStatus === 6
                                    ? 'Pending'
                                    : '-',
                    },
                  ]}
                />
              )}
              <InfoSection
                title="Payment Information"
                data={[
                  {
                    label: 'Transaction created at',
                    value: getFormattedTime(new Date(createdAt)),
                  },
                  { label: 'Amount', value: formatAmount(amount) },
                  { label: 'Order Id', value: orderId },
                  { label: 'Status', value: formatStatus(status) },
                  {
                    label: 'Net Payable Amount',
                    value: formatAmount(netPayableAmount),
                  },
                ]}
              />
            </>
          )}
        </div>

        {/* Footer */}
        <div
          style={{
            background: 'linear-gradient(to right, var(--border), var(--primary))',
            borderRadius: '12px',
            padding: '2px',
            marginTop: '24px',
          }}
        >
          <div
            style={{
              background: '#FFFFFF',
              borderRadius: '10px',
              padding: '16px',
            }}
          >
            <button
              onClick={onClose}
              className="w-full py-3 rounded-lg font-semibold transition-colors"
              style={{
                background: 'linear-gradient(to right, var(--border), var(--primary))',
                color: 'var(--background)',
                border: 'none',
                cursor: 'pointer',
                fontWeight: 600,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.opacity = '0.9';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.opacity = '1';
              }}
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default MerchantDetails;
