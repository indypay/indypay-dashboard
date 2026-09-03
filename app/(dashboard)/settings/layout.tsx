'use client';

import React, { useMemo } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import {
  UserOutlined,
  SafetyOutlined,
  CodeOutlined,
  BankOutlined,
  HomeOutlined,
  SettingOutlined,
  FileTextOutlined,
  PercentageOutlined,
  AuditOutlined,
  BellOutlined,
} from '@ant-design/icons';

import SettingsTabs from '@/lib/constants/SettingsConstants/SettingsConstants';
import { getUserProfiles } from '@/lib/hooks/user-profile';

const iconMap: Record<string, React.ReactNode> = {
  Profile: <UserOutlined />,
  Onboarding: <FileTextOutlined />,
  Security: <SafetyOutlined />,
  Developer: <CodeOutlined />,
  'Bank Details': <BankOutlined />,
  'Address Details': <HomeOutlined />,
  Commission: <PercentageOutlined />,
  Config: <SettingOutlined />,
  KYC: <AuditOutlined />,
  Notifications: <BellOutlined />,
};

export default function SettingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { data } = getUserProfiles();
  const userRole = data?.[0]?.data?.role?.toString() || '';

  const visibleTabs = useMemo(() => {
    return SettingsTabs.filter((tab) => tab.roles.includes(userRole));
  }, [userRole]);

  const selectedKey = pathname || '/settings/profile';

  return (
    <div style={{ minHeight: '100vh', background: 'var(--background)' }}>
      <div style={{ maxWidth: '1600px', margin: '0 auto', padding: '24px' }}>
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
              padding: '24px 32px',
            }}
          >
            <h1
              style={{
                fontSize: '2rem',
                fontWeight: 700,
                margin: 0,
                background: 'linear-gradient(135deg, var(--secondary), var(--primary))',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                letterSpacing: '-0.02em',
              }}
            >
              Settings
            </h1>
            <p
              style={{
                color: 'var(--text-muted)',
                fontSize: '0.875rem',
                marginTop: '8px',
                marginBottom: 0,
              }}
            >
              Manage your account settings and preferences
            </p>
          </div>
        </div>

        {/* Horizontal Tab Navigation */}
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
              background: 'var(--background)',
              borderRadius: '10px',
              padding: '4px 8px',
              display: 'flex',
              gap: '4px',
              overflowX: 'auto',
              scrollbarWidth: 'none',
            }}
          >
            {visibleTabs.map((tab) => {
              const isActive =
                selectedKey === tab.id || selectedKey.startsWith(tab.id);
              return (
                <button
                  key={tab.id}
                  onClick={() => router.push(tab.id)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '10px 20px',
                    borderRadius: '8px',
                    border: 'none',
                    cursor: 'pointer',
                    whiteSpace: 'nowrap',
                    fontSize: '0.875rem',
                    fontWeight: isActive ? 600 : 400,
                    transition: 'all 0.2s ease',
                    background: isActive ? 'var(--sidebar-active-bg)' : 'transparent',
                    color: isActive ? 'var(--secondary)' : '#5A7A6A',
                    boxShadow: isActive
                      ? 'inset 0 0 0 1px rgba(0, 135, 90, 0.3)'
                      : 'none',
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive) {
                      (e.currentTarget as HTMLButtonElement).style.background =
                        'rgba(0, 135, 90, 0.06)';
                      (e.currentTarget as HTMLButtonElement).style.color =
                        'var(--text)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive) {
                      (e.currentTarget as HTMLButtonElement).style.background =
                        'transparent';
                      (e.currentTarget as HTMLButtonElement).style.color =
                        '#5A7A6A';
                    }
                  }}
                >
                  <span
                    style={{
                      fontSize: '16px',
                      display: 'flex',
                      alignItems: 'center',
                    }}
                  >
                    {iconMap[tab.label]}
                  </span>
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Main Content */}
        <div>{children}</div>
      </div>

      <style jsx global>{`
        .settings-tab-bar::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
}
