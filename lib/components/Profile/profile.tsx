'use client';
import React, { useState } from 'react';
import { Avatar, Popover, Tooltip, Button, Divider } from 'antd';
import { useRouter } from 'next/navigation';
import {
  FileTextOutlined,
  LogoutOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { unstable_noStore } from 'next/cache';
import { getUserProfiles } from '@/lib/hooks/user-profile';

export default function Profile() {
  unstable_noStore();
  const [open, setOpen] = useState(false);
  const { data } = getUserProfiles();
  const [profile] = data || [];
  const router = useRouter();

  const fullName: string = profile?.data?.fullName || '';
  const email: string = profile?.data?.email || '';
  const initial = fullName ? (
    fullName.charAt(0).toUpperCase()
  ) : (
    <UserOutlined />
  );

  const menuItem = (
    icon: React.ReactNode,
    label: string,
    onClick: () => void,
  ) => (
    <button
      type="button"
      onClick={onClick}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        padding: '10px 8px',
        borderRadius: '8px',
        border: 'none',
        background: 'none',
        cursor: 'pointer',
        width: '100%',
        fontSize: '14px',
        color: 'var(--text)',
        fontWeight: 500,
        transition: 'background 0.15s',
        textAlign: 'left',
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLButtonElement).style.background = 'var(--sidebar-active-bg)';
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLButtonElement).style.background = 'none';
      }}
    >
      <span
        style={{
          fontSize: '16px',
          color: 'var(--text-muted)',
          display: 'flex',
          alignItems: 'center',
        }}
      >
        {icon}
      </span>
      {label}
    </button>
  );

  const popoverContent = (
    <div style={{ width: 290 }}>
      {/* Section label */}
      <div
        style={{
          fontSize: '11px',
          fontWeight: 700,
          color: 'var(--text-muted)',
          textTransform: 'uppercase',
          letterSpacing: '0.8px',
          marginBottom: '14px',
        }}
      >
        Profile
      </div>

      {/* Avatar + name + email */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '14px',
          marginBottom: '16px',
        }}
      >
        <Avatar
          size={52}
          style={{
            background: 'linear-gradient(135deg, var(--secondary), var(--primary))',
            color: '#FFFFFF',
            fontWeight: 700,
            fontSize: '22px',
            flexShrink: 0,
          }}
        >
          {initial}
        </Avatar>
        <div style={{ minWidth: 0 }}>
          <div
            style={{
              fontWeight: 700,
              fontSize: '15px',
              color: 'var(--text)',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}
          >
            {fullName || 'User'}
          </div>
          <div
            style={{
              fontSize: '13px',
              color: 'var(--text-muted)',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              marginTop: '2px',
            }}
          >
            {email}
          </div>
        </div>
      </div>

      {/* Manage profile button */}
      <Button
        block
        onClick={() => {
          setOpen(false);
          router.push('/settings/profile');
        }}
        style={{
          border: '1.5px solid var(--primary)',
          color: 'var(--secondary)',
          fontWeight: 600,
          fontSize: '14px',
          height: '42px',
          borderRadius: '8px',
          background: '#FFFFFF',
        }}
      >
        Manage your profile
      </Button>

      <Divider style={{ margin: '14px 0', borderColor: 'var(--border)' }} />

      {/* Menu items */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
        {menuItem(<FileTextOutlined />, 'Invoice', () => {
          setOpen(false);
          router.push('/invoices');
        })}
        {menuItem(<LogoutOutlined />, 'Sign Out', () => {
          setOpen(false);
          router.push('/logout');
        })}
      </div>
    </div>
  );

  return (
    <Popover
      content={popoverContent}
      trigger="click"
      open={open}
      onOpenChange={setOpen}
      placement="bottomRight"
      overlayInnerStyle={{
        padding: '18px',
        borderRadius: '14px',
        border: '1px solid var(--border)',
        boxShadow: '0 8px 32px rgba(0,107,79,0.14)',
        background: '#FFFFFF',
      }}
      overlayStyle={{ padding: 0 }}
    >
      <Tooltip
        title={
          fullName ? (
            <div>
              <div style={{ fontWeight: 700, fontSize: '13px' }}>
                {fullName}
              </div>
              <div style={{ fontSize: '12px', opacity: 0.8 }}>{email}</div>
            </div>
          ) : undefined
        }
        placement="bottomRight"
        color="var(--text)"
      >
        <Avatar
          size={36}
          style={{
            background: 'linear-gradient(135deg, var(--secondary), var(--primary))',
            color: '#FFFFFF',
            fontWeight: 700,
            fontSize: '16px',
            cursor: 'pointer',
            flexShrink: 0,
            userSelect: 'none',
          }}
        >
          {initial}
        </Avatar>
      </Tooltip>
    </Popover>
  );
}
