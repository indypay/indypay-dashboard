'use client';

import React from 'react';
import { Dropdown, Button } from 'antd';
import { SwapOutlined, CheckOutlined } from '@ant-design/icons';
import { useTenant } from '@/context/TenantContext';
import { TENANT_REGISTRY } from '@/tenants/tenantConfig';

export function TenantSwitcher() {
  const { activeTenantId, tenantConfig, setTenant } = useTenant();

  const menuItems = Object.values(TENANT_REGISTRY).map((tenant) => ({
    key: tenant.tenantId,
    label: (
      <div className="flex items-center justify-between gap-6 py-0.5 min-w-[140px]">
        <span className="font-medium">{tenant.name}</span>
        {tenant.tenantId === activeTenantId && (
          <CheckOutlined
            style={{ color: tenantConfig.colors.primary, fontSize: 12 }}
          />
        )}
      </div>
    ),
    onClick: () => setTenant(tenant.tenantId),
  }));

  return (
    <Dropdown
      menu={{ items: menuItems }}
      trigger={['click']}
      placement="bottomRight"
    >
      <Button
        icon={<SwapOutlined style={{ fontSize: 13 }} />}
        style={{
          borderColor: tenantConfig.colors.border,
          color: tenantConfig.colors.primary,
          background: tenantConfig.colors.background,
          fontWeight: 600,
          fontSize: 13,
          height: 32,
          paddingInline: '12px',
          borderRadius: '8px',
          display: 'flex',
          alignItems: 'center',
          gap: 6,
        }}
      >
        <span className="hidden sm:inline">{tenantConfig.name}</span>
      </Button>
    </Dropdown>
  );
}
