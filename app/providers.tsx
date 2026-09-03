'use client';

/**
 * providers.tsx
 *
 * Root provider tree. TenantProvider is the outermost client provider so that
 * every child — including Ant Design's ConfigProvider — can read the active
 * tenant and react to switches without a page reload.
 *
 * Provider order (outer → inner):
 *   TenantProvider          ← tenant colours / labels / logo
 *   QueryClientProvider     ← React Query
 *   AntdTenantConfig        ← Ant Design tokens keyed to active tenant
 *   NextThemesProvider      ← light/dark (locked to "light")
 *   children
 */

import * as React from 'react';
import { ThemeProvider as NextThemesProvider } from 'next-themes';
import { ThemeProviderProps } from 'next-themes/dist/types';
import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { ConfigProvider } from 'antd';
import { queryClient } from '@/lib/config/query-client.config';
import { TenantProvider, useTenant } from '@/context/TenantContext';

export interface ProvidersProps {
  children: React.ReactNode;
  themeProps?: ThemeProviderProps;
}

// ─── Ant Design config bridge ─────────────────────────────────────────────────
// Reads the active tenant from context and feeds its primary colour into
// Ant Design's design-token system. Lives inside TenantProvider so it can
// call useTenant().
function AntdTenantConfig({ children }: { children: React.ReactNode }) {
  const { tenantConfig } = useTenant();

  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: tenantConfig.antdPrimary,
          colorLink: tenantConfig.antdPrimary,
          borderRadius: 8,
        },
      }}
    >
      {children}
    </ConfigProvider>
  );
}

// ─── Root providers ───────────────────────────────────────────────────────────

export function Providers({ children, themeProps }: ProvidersProps) {
  return (
    <TenantProvider>
      <QueryClientProvider client={queryClient}>
        <AntdTenantConfig>
          <NextThemesProvider defaultTheme="light" {...themeProps}>
            {children}
          </NextThemesProvider>
        </AntdTenantConfig>
        {/* React Query Devtools - only shows in development */}
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </TenantProvider>
  );
}
