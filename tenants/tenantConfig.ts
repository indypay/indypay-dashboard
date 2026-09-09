/**
 * tenantConfig.ts — White-label tenant registry
 *
 * Add a tenant here; nothing else needs changing.
 * Every color token is injected as a CSS custom property on :root by TenantContext,
 * so the entire dashboard (sidebar, header, buttons, dividers) updates instantly.
 */

export interface TenantColors {
  // Core brand
  primary: string;
  secondary: string;
  accent: string;

  // Surfaces
  background: string;   // page / panel bg
  surface: string;      // card / sidebar bg

  // Text
  text: string;
  textMuted: string;

  // Borders & dividers
  border: string;

  // Sidebar-specific (computed rgba values for hover/active states)
  sidebarHoverBg: string;       // rgba at ~6% opacity
  sidebarActiveBg: string;      // light tinted active background
  sidebarActiveBorder: string;  // active item border
  sidebarActiveText: string;    // active item text (usually secondary)
  sidebarSubmenuBg: string;     // submenu container bg
  sidebarSubmenuBorder: string; // submenu border
  sidebarSubmenuConnector: string; // connecting line colour
  sidebarIconColor: string;     // inactive icon / text
  sidebarSubmenuItemSelected: string; // selected submenu item bg
}

export interface TenantLogoDimensions {
  /** Expanded wordmark — height in px */
  fullHeight?: number;
  /** Expanded wordmark — max width in px */
  fullMaxWidth?: number;
  /** Extra scale for assets with heavy padding (e.g. square PNG wordmarks) */
  fullScale?: number;
}

export interface TenantConfig {
  tenantId: string;
  name: string;
  logoFull: string;    // expanded sidebar logo
  logoIcon: string;    // collapsed sidebar icon
  favicon: string;
  /** Optional overrides when default Logo.tsx sizing looks too small */
  logoDimensions?: TenantLogoDimensions;
  domains: string[];   // production hostnames that auto-activate this tenant
  colors: TenantColors;
  menuLabelOverrides: Record<string, string>;
  antdPrimary: string; // Ant Design colorPrimary token
}

// ─────────────────────────────────────────────────────────────────────────────
// Tenant 1 – RupeeFlow (default — your company)
// ─────────────────────────────────────────────────────────────────────────────
export const rupeeflowTenant: TenantConfig = {
  tenantId: 'rupeeflow',
  name: 'RupeeFlow',
  logoFull: '/logos/rupeeflow-logo-full.svg',  // fallback; Logo.tsx uses native SVG component
  logoIcon: '/logos/rupeeflow-logo-icon.svg',
  favicon: '/RupeeFlowIcon.svg',
  domains: ['merchant.rupeeflow.co', 'app.rupeeflow.co', 'dashboard.rupeeflow.co'],
  colors: {
    primary:    '#00875A',
    secondary:  '#006B4F',
    accent:     '#2AB871',
    background: '#F4F8F6',
    surface:    '#FFFFFF',
    text:       '#3D5C4A',
    textMuted:  '#6B8A78',
    border:     '#D0E8DA',

    sidebarHoverBg:       'rgba(0, 135, 90, 0.06)',
    sidebarActiveBg:      '#E8F5EF',
    sidebarActiveBorder:  '#B8DACC',
    sidebarActiveText:    '#006B4F',
    sidebarSubmenuBg:     '#F7FBF9',
    sidebarSubmenuBorder: 'rgba(0, 135, 90, 0.12)',
    sidebarSubmenuConnector: 'rgba(0, 135, 90, 0.2)',
    sidebarIconColor:     '#5A7A6A',
    sidebarSubmenuItemSelected: '#E0F2EA',
  },
  menuLabelOverrides: {},
  antdPrimary: '#00875A',
};

// ─────────────────────────────────────────────────────────────────────────────
// Tenant 2 – Indypay (teal + blue + black brand palette)
// ─────────────────────────────────────────────────────────────────────────────
export const indypayTenant: TenantConfig = {
  tenantId: 'indypay',
  name: 'Indypay',
  logoFull: '/logos/Indypay full logo.svg',
  logoIcon: '/logos/indypay-icon2.svg',
  favicon: '/logos/indypay-icon2.svg',
  logoDimensions: {
    fullHeight: 60,
    fullMaxWidth: 200,
    fullScale: 1.5,
  },

  domains: ['merchant.indypay.in', 'app.indypay.in', 'dashboard.indypay.in'],
  colors: {
    primary:    '#08B6AE',   // brand teal
    secondary:  '#055CF5',   // brand blue
    accent:     '#3D9EFF',
    background: '#F5FCFB',
    surface:    '#FFFFFF',
    text:       '#000000',
    textMuted:  '#525252',
    border:     '#C5EEEB',

    sidebarHoverBg:       'rgba(8, 182, 174, 0.06)',
    sidebarActiveBg:      '#E8FAF9',
    sidebarActiveBorder:  '#7ED9D4',
    sidebarActiveText:    '#055CF5',
    sidebarSubmenuBg:     '#F5FCFB',
    sidebarSubmenuBorder: 'rgba(8, 182, 174, 0.12)',
    sidebarSubmenuConnector: 'rgba(5, 92, 245, 0.2)',
    sidebarIconColor:     '#5C6B73',
    sidebarSubmenuItemSelected: '#E8FAF9',
  },
  menuLabelOverrides: {
    '/summary/overview': 'Dashboard',
    '/transactions': 'Payments',
    '/payout': 'Disbursements',
    '/summary/analytics/business-trends': 'Insights',
    '/operations/platform-billing': 'Billing',
    '/reports': 'Reports',
    '/settings': 'Settings',
    '/payment-pages': 'Hosted Pages',
    '/payment-button': 'Pay Button',
    '/payment-links': 'Pay Links',
    '/checkout-pages': 'Checkout',
    '/qr-codes': 'QR Codes',
    '/invoices': 'Invoices',
    '/rupeeflow-link': 'Indypay.link',
    '/prepaid-cards': 'Cards',
    '/users': 'Customers',
    '/api-reference': 'API Docs',
    '/developer/api-requests': 'API Requests',
    '/developer/traffic-logs': 'Logs',
    '/apps-deals': 'Marketplace',
    '/ums': 'Team Management',
    '/settlement/settlement-transactions': 'Settlements',
  },
  antdPrimary: '#08B6AE',
};

// ─────────────────────────────────────────────────────────────────────────────
// Tenant 3 – CloseXPay  (bold red-coral — high-energy fintech)
// ─────────────────────────────────────────────────────────────────────────────
export const closexpayTenant: TenantConfig = {
  tenantId: 'closexpay',
  name: 'CloseXPay',
  logoFull: '/logos/closexpay-logo-full.svg',
  logoIcon: '/logos/closexpay-logo-icon.svg',
  favicon: '/logos/closexpay-favicon.svg',
  domains: ['merchant.closexpay.com', 'app.closexpay.com'],
  colors: {
    primary:    '#E53935',
    secondary:  '#C62828',
    accent:     '#FF6659',
    background: '#FFF5F5',
    surface:    '#FFFFFF',
    text:       '#4A1515',
    textMuted:  '#8C4040',
    border:     '#FFCDD2',

    sidebarHoverBg:       'rgba(229, 57, 53, 0.06)',
    sidebarActiveBg:      '#FFEBEE',
    sidebarActiveBorder:  '#FFCDD2',
    sidebarActiveText:    '#C62828',
    sidebarSubmenuBg:     '#FFF5F5',
    sidebarSubmenuBorder: 'rgba(229, 57, 53, 0.12)',
    sidebarSubmenuConnector: 'rgba(229, 57, 53, 0.2)',
    sidebarIconColor:     '#A05050',
    sidebarSubmenuItemSelected: '#FFCDD2',
  },
  menuLabelOverrides: {
    '/ums': 'Team Management',
    '/rupeeflow-link': 'CloseXPay.link',
  },
  antdPrimary: '#E53935',
};

// ─────────────────────────────────────────────────────────────────────────────
// Tenant 4 – iServu  (teal SaaS — clean, trustworthy)
// ─────────────────────────────────────────────────────────────────────────────
export const iservuTenant: TenantConfig = {
  tenantId: 'iservu',
  name: 'iServu',
  logoFull: '/logos/iservu-logo-full.svg',
  logoIcon: '/logos/iservu-logo-icon.svg',
  favicon: '/logos/iservu-favicon.svg',
  domains: ['merchant.iservu.com', 'app.iservu.com'],
  colors: {
    primary:    '#0D9488',
    secondary:  '#0F766E',
    accent:     '#2DD4BF',
    background: '#F0FDFA',
    surface:    '#FFFFFF',
    text:       '#134E4A',
    textMuted:  '#4A7C76',
    border:     '#99F6E4',

    sidebarHoverBg:       'rgba(13, 148, 136, 0.06)',
    sidebarActiveBg:      '#CCFBF1',
    sidebarActiveBorder:  '#99F6E4',
    sidebarActiveText:    '#0F766E',
    sidebarSubmenuBg:     '#F0FDFA',
    sidebarSubmenuBorder: 'rgba(13, 148, 136, 0.12)',
    sidebarSubmenuConnector: 'rgba(13, 148, 136, 0.2)',
    sidebarIconColor:     '#4A9B93',
    sidebarSubmenuItemSelected: '#CCFBF1',
  },
  menuLabelOverrides: {
    '/ums': 'Team Management',
    '/rupeeflow-link': 'iServu.link',
    '/apps-deals': 'Integrations',
  },
  antdPrimary: '#0D9488',
};

// ─────────────────────────────────────────────────────────────────────────────
// Tenant 5 – BranchX  (deep violet — premium / enterprise)
// ─────────────────────────────────────────────────────────────────────────────
export const branchxTenant: TenantConfig = {
  tenantId: 'branchx',
  name: 'BranchX',
  logoFull: '/logos/branchx-logo-full.svg',
  logoIcon: '/logos/branchx-logo-icon.svg',
  favicon: '/logos/branchx-favicon.svg',
  domains: ['merchant.branchx.com', 'app.branchx.com'],
  colors: {
    primary:    '#6D28D9',
    secondary:  '#5B21B6',
    accent:     '#A78BFA',
    background: '#F5F3FF',
    surface:    '#FFFFFF',
    text:       '#2E1065',
    textMuted:  '#6B5FA0',
    border:     '#DDD6FE',

    sidebarHoverBg:       'rgba(109, 40, 217, 0.06)',
    sidebarActiveBg:      '#EDE9FE',
    sidebarActiveBorder:  '#C4B5FD',
    sidebarActiveText:    '#5B21B6',
    sidebarSubmenuBg:     '#F5F3FF',
    sidebarSubmenuBorder: 'rgba(109, 40, 217, 0.12)',
    sidebarSubmenuConnector: 'rgba(109, 40, 217, 0.2)',
    sidebarIconColor:     '#7C6BA8',
    sidebarSubmenuItemSelected: '#EDE9FE',
  },
  menuLabelOverrides: {
    '/ums': 'Team Management',
    '/rupeeflow-link': 'BranchX.link',
    '/apps-deals': 'Ecosystem',
  },
  antdPrimary: '#6D28D9',
};

// ─────────────────────────────────────────────────────────────────────────────
// Registry — add new tenants here only
// ─────────────────────────────────────────────────────────────────────────────
export const TENANT_REGISTRY: Record<string, TenantConfig> = {
  [rupeeflowTenant.tenantId]:  rupeeflowTenant,
  [indypayTenant.tenantId]:    indypayTenant,
  [closexpayTenant.tenantId]:  closexpayTenant,
  [iservuTenant.tenantId]:     iservuTenant,
  [branchxTenant.tenantId]:    branchxTenant,
};

export const DEFAULT_TENANT_ID = indypayTenant.tenantId;

// Flat map: hostname → tenantId — built automatically from each tenant's domains array.
// Add new domains only in the tenant object above; this map stays in sync automatically.
export const HOSTNAME_TENANT_MAP: Record<string, string> = Object.values(
  TENANT_REGISTRY,
).reduce<Record<string, string>>((acc, tenant) => {
  tenant.domains.forEach((domain) => {
    acc[domain] = tenant.tenantId;
  });
  return acc;
}, {});

const LS_KEY = 'rf_tenant_id';
export const ADMIN_TENANT_PREVIEW_KEY = 'rf_admin_tenant_preview';
export const TENANT_CHANGE_EVENT = 'rf-tenant-change';

export function clearAdminTenantPreview(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(ADMIN_TENANT_PREVIEW_KEY);
  window.dispatchEvent(new Event(TENANT_CHANGE_EVENT));
}

const isLocalDevHost = (hostname: string) =>
  hostname === 'localhost' || hostname === '127.0.0.1';

/** True when the active hostname maps to a tenant (production white-label domains). */
export function isTenantLockedToHostname(hostname?: string): boolean {
  const host =
    hostname ??
    (typeof window !== 'undefined' ? window.location.hostname : '');
  return Boolean(host && HOSTNAME_TENANT_MAP[host]);
}

/**
 * Resolve tenant from hostname first; dev-only overrides on localhost.
 * Merchants on production domains always get the domain tenant.
 */
export function resolveTenantIdFromWindow(): string {
  if (typeof window === 'undefined') return DEFAULT_TENANT_ID;

  const adminPreview = localStorage.getItem(ADMIN_TENANT_PREVIEW_KEY);
  if (adminPreview && TENANT_REGISTRY[adminPreview]) return adminPreview;

  const hostname = window.location.hostname;
  const hostTenant = HOSTNAME_TENANT_MAP[hostname];
  if (hostTenant) return hostTenant;

  if (process.env.NODE_ENV === 'development' && isLocalDevHost(hostname)) {
    const urlTenant = new URLSearchParams(window.location.search).get('tenant');
    if (urlTenant && TENANT_REGISTRY[urlTenant]) return urlTenant;
    const saved = localStorage.getItem(LS_KEY);
    if (saved && TENANT_REGISTRY[saved]) return saved;
  }

  return DEFAULT_TENANT_ID;
}

/** Keep ?tenant= when linking between auth pages on localhost. */
export function appendTenantQueryParam(path: string): string {
  if (typeof window === 'undefined') return path;

  const hostname = window.location.hostname;
  if (process.env.NODE_ENV !== 'development' || !isLocalDevHost(hostname)) {
    return path;
  }

  const tenant = new URLSearchParams(window.location.search).get('tenant');
  if (!tenant || !TENANT_REGISTRY[tenant]) return path;

  const [pathname, search = ''] = path.split('?');
  const params = new URLSearchParams(search);
  params.set('tenant', tenant);
  const qs = params.toString();
  return qs ? `${pathname}?${qs}` : pathname;
}
