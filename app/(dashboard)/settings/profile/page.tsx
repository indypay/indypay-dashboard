'use client';

import React, { useEffect, useState } from 'react';
import { Card, Avatar, Divider, Skeleton, Tag } from 'antd';
import {
  UserOutlined,
  LinkOutlined,
  CalendarOutlined,
  PhoneOutlined,
  MailOutlined,
} from '@ant-design/icons';
import { unstable_noStore } from 'next/cache';

import { getUserProfiles } from '@/lib/hooks/user-profile';
import { ACCOUNT_STATUS } from '@/lib/enum/auth';
import BusinessDetailsCard from '@/lib/components/BusinessDetailsCard/BusinessDetailsCard';
import { formatOnboardingStatus } from '@/lib/utils/utils';
import { ONBOARDING_STATUS } from '@/lib/enum/index';

// Skeleton component for loading state
const ProfileSkeleton = () => (
  <div
    style={{
      background: 'linear-gradient(to right, var(--border), var(--primary))',
      borderRadius: '12px',
      padding: '2px',
    }}
  >
    <Card
      style={{
        background: '#FFFFFF',
        borderRadius: '10px',
        border: 'none',
      }}
    >
      <Skeleton active avatar paragraph={{ rows: 4 }} />
    </Card>
  </div>
);

const getAccountStatusStyle = (status: string): React.CSSProperties => {
  if (status === 'Active') {
    return {
      backgroundColor: '#0DD25F15',
      color: '#0DD25F',
      border: '1px solid #0DD25F40',
      borderRadius: '6px',
      padding: '6px 16px',
      fontWeight: 600,
    };
  } else {
    return {
      backgroundColor: '#D51C4415',
      color: '#D51C44',
      border: '1px solid #D51C4440',
      borderRadius: '6px',
      padding: '6px 16px',
      fontWeight: 600,
    };
  }
};

const getOnboardingStatusStyle = (statusLabel: string): React.CSSProperties => {
  const baseStyle = {
    borderRadius: '6px',
    padding: '4px 12px',
    fontWeight: 500,
    border: 'none',
  };

  switch (statusLabel) {
    case 'KYC Verified':
      return {
        ...baseStyle,
        backgroundColor: '#0DD25F15',
        color: '#0DD25F',
        border: '1px solid #0DD25F40',
      };
    case 'KYC Pending':
      return {
        ...baseStyle,
        backgroundColor: '#F5A52415',
        color: '#F5A524',
        border: '1px solid #F5A52440',
      };
    default:
      return {
        ...baseStyle,
        backgroundColor: 'var(--primary)15',
        color: 'var(--secondary)',
        border: '1px solid var(--primary)40',
      };
  }
};

const ProfilePage = () => {
  unstable_noStore();

  const { data, isLoading } = getUserProfiles();
  const [profile] = data || [];

  const [isLoadingProfile, setIsLoadingProfile] = useState(true);

  useEffect(() => {
    if (!isLoading) {
      setIsLoadingProfile(false);
    }
  }, [isLoading]);

  const {
    fullName,
    email,
    image,
    createdAt,
    payInWebhookUrl,
    payOutWebhookUrl,
    role,
    updatedAt,
    mobile,
    kyc,
    onboardingStatus,
    accountStatus,
    businessDetails,
  } = profile?.data || {};

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const statusLabel =
    formatOnboardingStatus(onboardingStatus as ONBOARDING_STATUS)?.label || '-';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Profile Card */}
      {isLoadingProfile ? (
        <ProfileSkeleton />
      ) : (
        <div
          style={{
            background: 'linear-gradient(to right, var(--border), var(--primary))',
            borderRadius: '12px',
            padding: '2px',
          }}
        >
          <Card
            style={{
              background: '#FFFFFF',
              borderRadius: '10px',
              border: 'none',
            }}
          >
            {/* Header Section with Avatar */}
            <div className="flex flex-col md:flex-row items-center justify-between mb-6">
              <div className="flex items-center gap-4 mb-4 md:mb-0">
                <Avatar
                  size={80}
                  src={image || undefined}
                  icon={!image ? <UserOutlined /> : undefined}
                  style={{
                    background: image
                      ? 'transparent'
                      : 'linear-gradient(135deg, var(--secondary), var(--primary))',
                    border: '2px solid var(--border)',
                  }}
                />
                <div>
                  <h2
                    style={{
                      color: 'var(--text)',
                      fontSize: '1.5rem',
                      fontWeight: 700,
                      margin: 0,
                    }}
                  >
                    {fullName || 'User Name'}
                  </h2>
                  <p
                    style={{
                      color: 'var(--text-muted)',
                      fontSize: '0.875rem',
                      margin: '4px 0 0 0',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                    }}
                  >
                    <MailOutlined /> {email || 'email@example.com'}
                  </p>
                </div>
              </div>
              <Tag
                style={getAccountStatusStyle(
                  ACCOUNT_STATUS[accountStatus ?? 0],
                )}
                bordered={false}
              >
                {ACCOUNT_STATUS[accountStatus ?? 0]}
              </Tag>
            </div>

            <Divider style={{ borderColor: 'var(--border)', margin: '24px 0' }} />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InfoItem
                icon={<PhoneOutlined />}
                label="Mobile"
                value={mobile || '-'}
              />
              <InfoItem
                icon={<UserOutlined />}
                label="Onboarding Status"
                value={
                  <Tag
                    style={getOnboardingStatusStyle(statusLabel)}
                    bordered={false}
                  >
                    {statusLabel}
                  </Tag>
                }
              />
              <InfoItem
                icon={<CalendarOutlined />}
                label="Created At"
                value={createdAt ? formatDate(createdAt) : '-'}
              />
              <InfoItem
                icon={<CalendarOutlined />}
                label="Updated At"
                value={updatedAt ? formatDate(updatedAt) : '-'}
              />
            </div>

            <Divider style={{ borderColor: 'var(--border)', margin: '24px 0' }} />

            {/* Webhook URLs Section */}
            {/* <div>
              <h3 style={{ color: 'var(--text-muted)', fontSize: '0.875rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '16px' }}>
                <LinkOutlined style={{ marginRight: '8px' }} />
                Webhook URLs
              </h3>
              <div className="grid grid-cols-1 gap-3">
                <div
                  style={{
                    background: 'var(--background)',
                    border: '1px solid var(--border)',
                    borderRadius: '8px',
                    padding: '12px 16px',
                  }}
                >
                  <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px', display: 'block', marginBottom: '4px' }}>
                    Pay In Webhook
                  </span>
                  <span style={{ color: 'var(--secondary)', fontSize: '0.875rem', wordBreak: 'break-all' }}>
                    {payInWebhookUrl || 'Not configured'}
                  </span>
                </div>
                <div
                  style={{
                    background: 'var(--background)',
                    border: '1px solid var(--border)',
                    borderRadius: '8px',
                    padding: '12px 16px',
                  }}
                >
                  <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px', display: 'block', marginBottom: '4px' }}>
                    Pay Out Webhook
                  </span>
                  <span style={{ color: 'var(--secondary)', fontSize: '0.875rem', wordBreak: 'break-all' }}>
                    {payOutWebhookUrl || 'Not configured'}
                  </span>
                </div>
              </div>
            </div> */}
          </Card>
        </div>
      )}

      {/* Business Details Card */}
      {/* {isLoadingProfile ? (
        <ProfileSkeleton />
      ) : (
        <BusinessDetailsCard
          businessDetails={businessDetails}
          onUpdate={() => {
            //
          }}
          showEnterDetails={!businessDetails}
        />
      )} */}
    </div>
  );
};

const InfoItem = ({
  icon,
  label,
  value,
}: {
  icon?: React.ReactNode;
  label: string;
  value: React.ReactNode;
}) => (
  <div style={{ marginBottom: '8px' }}>
    <span
      style={{
        color: 'var(--text-muted)',
        fontSize: '0.75rem',
        fontWeight: 600,
        textTransform: 'uppercase',
        letterSpacing: '0.5px',
        display: 'flex',
        alignItems: 'center',
        gap: '6px',
        marginBottom: '4px',
      }}
    >
      {icon}
      {label}
    </span>
    <div style={{ color: 'var(--text)', fontSize: '0.875rem' }}>{value}</div>
  </div>
);

export default ProfilePage;
