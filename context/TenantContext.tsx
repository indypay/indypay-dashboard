'use client';

/**
 * TenantContext.tsx
 *
 * Detection priority:
 *   Production domain → tenant from HOSTNAME_TENANT_MAP (cannot be overridden)
 *   localhost (dev only) → ?tenant= → localStorage → default "rupeeflow"
 *
 * Merchants never see the tenant switcher; admins can preview any tenant theme.
 *
 * On every switch:
 *  1. Sets CSS custom properties on :root (var(--primary) etc.)
 *  2. Injects / updates a <style id="tenant-dynamic"> tag appended to <head>.
 *     Being the LAST style tag in <head>, its rules win the cascade over
 *     antd-style injected blocks and <style jsx global> blocks — even when
 *     those use !important — because equal-specificity !important rules
 *     resolve by source order (last wins).
 *  3. Updates document.title and favicon.
 */

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useSyncExternalStore,
} from 'react';
import { usePathname } from 'next/navigation';
import {
  DEFAULT_TENANT_ID,
  ADMIN_TENANT_PREVIEW_KEY,
  TENANT_CHANGE_EVENT,
  resolveTenantIdFromWindow,
  TENANT_REGISTRY,
  TenantConfig,
} from '@/tenants/tenantConfig';

// ─── Context ──────────────────────────────────────────────────────────────────

interface TenantContextValue {
  tenantConfig: TenantConfig;
  activeTenantId: string;
  setTenant: (tenantId: string) => void;
}

const TenantContext = createContext<TenantContextValue>({
  tenantConfig: TENANT_REGISTRY[DEFAULT_TENANT_ID],
  activeTenantId: DEFAULT_TENANT_ID,
  setTenant: () => {},
});

// ─── CSS variable injection ───────────────────────────────────────────────────

function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const normalized = hex.replace('#', '').trim();
  if (normalized.length !== 6) return null;
  const r = parseInt(normalized.slice(0, 2), 16);
  const g = parseInt(normalized.slice(2, 4), 16);
  const b = parseInt(normalized.slice(4, 6), 16);
  if ([r, g, b].some((n) => Number.isNaN(n))) return null;
  return { r, g, b };
}

function injectCssVariables(config: TenantConfig) {
  const root = document.documentElement;
  const c = config.colors;

  root.style.setProperty('--primary',   c.primary);
  root.style.setProperty('--secondary', c.secondary);
  root.style.setProperty('--accent',    c.accent);
  root.style.setProperty('--background', c.background);
  root.style.setProperty('--surface',    c.surface);
  root.style.setProperty('--text',       c.text);
  root.style.setProperty('--text-muted', c.textMuted);
  root.style.setProperty('--border',     c.border);

  root.style.setProperty('--primary-soft-bg', c.sidebarActiveBg);
  root.style.setProperty('--primary-soft-border', c.sidebarActiveBorder);
  root.style.setProperty(
    '--cta-gradient-135',
    `linear-gradient(135deg, ${c.secondary}, ${c.primary})`,
  );

  const rgb = hexToRgb(c.primary);
  if (rgb) {
    root.style.setProperty(
      '--primary-shadow-soft',
      `0 1px 4px rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.06)`,
    );
    root.style.setProperty(
      '--primary-shadow-card',
      `0 4px 24px rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.08)`,
    );
  }

  root.style.setProperty(
    '--primary-icon-gradient',
    `linear-gradient(135deg, ${c.sidebarActiveBg}, ${c.border})`,
  );

  root.style.setProperty('--sidebar-hover-bg',          c.sidebarHoverBg);
  root.style.setProperty('--sidebar-active-bg',         c.sidebarActiveBg);
  root.style.setProperty('--sidebar-active-border',     c.sidebarActiveBorder);
  root.style.setProperty('--sidebar-active-text',       c.sidebarActiveText);
  root.style.setProperty('--sidebar-submenu-bg',        c.sidebarSubmenuBg);
  root.style.setProperty('--sidebar-submenu-border',    c.sidebarSubmenuBorder);
  root.style.setProperty('--sidebar-submenu-connector', c.sidebarSubmenuConnector);
  root.style.setProperty('--sidebar-icon-color',        c.sidebarIconColor);
  root.style.setProperty('--sidebar-item-selected',     c.sidebarSubmenuItemSelected);
  root.style.setProperty('--cta-gradient', `linear-gradient(to right, ${c.secondary}, ${c.primary})`);
}

// ─── Dynamic style tag injection ──────────────────────────────────────────────
// This <style> is appended to <head> AFTER antd-style and jsx global blocks,
// so its rules win the cascade. We write actual hex values (not var()) so
// inline-style overrides also get replaced where possible, and so specificity
// tricks work in edge cases.

function injectDynamicStyles(config: TenantConfig) {
  const c = config.colors;

  const css = `
    /* ── TABLE wrapper gradient border ──────────────────────────────── */
    .ant-table-wrapper,
    [class*="customTable"] .ant-table-wrapper {
      background: linear-gradient(to right, ${c.border}, ${c.primary}) !important;
    }

    /* ── TABLE head ─────────────────────────────────────────────────── */
    .ant-table-thead > tr > th,
    .ant-table-thead > tr > td {
      background: ${c.background} !important;
      color: ${c.textMuted} !important;
      border-bottom: 1px solid ${c.border} !important;
    }

    /* ── TABLE body rows ────────────────────────────────────────────── */
    .ant-table-tbody > tr > td {
      border-bottom: 1px solid ${c.border} !important;
    }
    .ant-table-tbody > tr:hover > td,
    .ant-table-tbody > tr.ant-table-row-selected > td {
      background: ${c.background} !important;
    }

    /* ── Sticky cells ───────────────────────────────────────────────── */
    .ant-table-cell-fix-left,
    .ant-table-cell-fix-right {
      background: ${c.surface} !important;
    }
    .ant-table-thead .ant-table-cell-fix-left,
    .ant-table-thead .ant-table-cell-fix-right {
      background: ${c.background} !important;
    }
    .ant-table-tbody > tr:hover .ant-table-cell-fix-left,
    .ant-table-tbody > tr:hover .ant-table-cell-fix-right {
      background: ${c.background} !important;
    }

    /* ── CARD head border ────────────────────────────────────────────── */
    .ant-card-head {
      border-bottom: 1px solid ${c.border} !important;
      background: ${c.surface} !important;
    }
    .ant-card {
      background: ${c.surface} !important;
    }

    /* ── Metric / gradient-border cards ────────────────────────────── */
    /* MetricCard outer wrapper */
    .tenant-card-border {
      background: linear-gradient(135deg, ${c.border}, ${c.primary}) !important;
    }

    /* ── Recent Transactions card wrapper ───────────────────────────── */
    .recent-transactions-table-wrap {
      background: linear-gradient(135deg, ${c.border}, ${c.primary}) !important;
    }
    .recent-transactions-table .ant-table-thead > tr > th {
      background: ${c.background} !important;
      color: ${c.textMuted} !important;
      border-bottom: 1px solid ${c.border} !important;
    }
    .recent-transactions-table .ant-table-tbody > tr:hover > td {
      background: ${c.background} !important;
    }
    .recent-transactions-table .ant-table-tbody > tr > td {
      border-bottom: 1px solid ${c.border} !important;
    }
    .recent-transactions-table .ant-card-head {
      background: ${c.surface} !important;
      border-bottom: 1px solid ${c.border} !important;
    }

    /* ── PAGINATION ──────────────────────────────────────────────────── */
    .ant-pagination-item-active {
      background: linear-gradient(to right, ${c.secondary}, ${c.primary}) !important;
      border-color: transparent !important;
    }
    .ant-pagination-item-active a {
      color: #ffffff !important;
    }
    .ant-pagination-item {
      background: ${c.surface} !important;
      border-color: ${c.border} !important;
    }
    .ant-pagination-item:hover {
      border-color: ${c.primary} !important;
    }
    .ant-pagination-prev .ant-pagination-item-link,
    .ant-pagination-next .ant-pagination-item-link {
      background: ${c.surface} !important;
      border-color: ${c.border} !important;
    }
    .ant-pagination-prev:hover .ant-pagination-item-link,
    .ant-pagination-next:hover .ant-pagination-item-link {
      border-color: ${c.primary} !important;
    }

    /* ── INPUTS / SELECT ─────────────────────────────────────────────── */
    .ant-input:hover,
    .ant-input-affix-wrapper:hover {
      border-color: ${c.primary} !important;
    }
    .ant-input:focus,
    .ant-input-focused,
    .ant-input-affix-wrapper-focused,
    .ant-input-affix-wrapper:focus-within {
      border-color: ${c.primary} !important;
      box-shadow: 0 0 0 2px ${c.primary}33 !important;
    }
    .ant-select-focused .ant-select-selector,
    .ant-select-open .ant-select-selector {
      border-color: ${c.primary} !important;
      box-shadow: 0 0 0 2px ${c.primary}33 !important;
    }

    /* ── PRIMARY BUTTON ──────────────────────────────────────────────── */
    .ant-btn-primary {
      background: ${c.primary} !important;
      border-color: ${c.primary} !important;
      color: #ffffff !important;
    }
    .ant-btn-primary:hover {
      background: ${c.secondary} !important;
      border-color: ${c.secondary} !important;
    }

    /* ── TABS ────────────────────────────────────────────────────────── */
    .ant-tabs-tab-active .ant-tabs-tab-btn {
      color: ${c.primary} !important;
    }
    .ant-tabs-ink-bar {
      background: ${c.primary} !important;
    }

    /* ── PROGRESS / STEPS ────────────────────────────────────────────── */
    .ant-progress-bg,
    .ant-progress-success-bg {
      background: ${c.primary} !important;
    }
    .ant-steps-item-process .ant-steps-item-icon {
      background: ${c.primary} !important;
      border-color: ${c.primary} !important;
    }
    .ant-steps-item-finish .ant-steps-item-icon {
      border-color: ${c.primary} !important;
    }
    .ant-steps-item-finish .ant-steps-item-icon .ant-steps-icon {
      color: ${c.primary} !important;
    }

    /* ── CHECKBOX / RADIO / SWITCH ───────────────────────────────────── */
    .ant-checkbox-checked .ant-checkbox-inner,
    .ant-radio-checked .ant-radio-inner {
      background: ${c.primary} !important;
      border-color: ${c.primary} !important;
    }
    .ant-switch-checked {
      background: ${c.primary} !important;
    }

    /* ── SPINNER ──────────────────────────────────────────────────────── */
    .ant-spin-dot-item { background: ${c.primary} !important; }

    /* ── LINKS / ANCHORS ─────────────────────────────────────────────── */
    .ant-typography a,
    a.ant-typography {
      color: ${c.primary} !important;
    }

    /* ── DIVIDER ─────────────────────────────────────────────────────── */
    .tenant-divider {
      border-color: ${c.primary} !important;
    }

    /* ── DATE PICKER (calendar popup) ───────────────────────────────── */
    .ant-picker-dropdown,
    .ant-picker-panel-container { background: ${c.surface} !important; }
    .ant-picker-header {
      background: ${c.surface} !important;
      border-bottom: 1px solid ${c.border} !important;
      color: ${c.text} !important;
    }
    .ant-picker-header button { color: ${c.text} !important; }
    .ant-picker-header button:hover { color: ${c.primary} !important; }
    .ant-picker-content th { color: ${c.textMuted} !important; }
    .ant-picker-cell { color: ${c.text} !important; }
    .ant-picker-cell:hover:not(.ant-picker-cell-selected):not(.ant-picker-cell-range-start):not(.ant-picker-cell-range-end):not(.ant-picker-cell-disabled) .ant-picker-cell-inner {
      background: ${c.background} !important;
    }
    .ant-picker-cell-in-view.ant-picker-cell-selected .ant-picker-cell-inner,
    .ant-picker-cell-in-view.ant-picker-cell-range-start .ant-picker-cell-inner,
    .ant-picker-cell-in-view.ant-picker-cell-range-end .ant-picker-cell-inner {
      background: linear-gradient(to right, ${c.border}, ${c.primary}) !important;
      color: #ffffff !important;
      font-weight: 600;
    }
    .ant-picker-cell-in-view.ant-picker-cell-in-range::before { background: ${c.background} !important; }
    .ant-picker-footer {
      background: ${c.surface} !important;
      border-top: 1px solid ${c.border} !important;
    }
    .ant-picker-footer .ant-picker-ranges .ant-picker-preset > .ant-tag {
      background: ${c.background} !important;
      border: 1px solid ${c.border} !important;
      color: ${c.text} !important;
      padding: 4px 12px;
      border-radius: 6px;
    }
    .ant-picker-footer .ant-picker-ranges .ant-picker-preset > .ant-tag:hover {
      background: linear-gradient(to right, ${c.secondary}, ${c.primary}) !important;
      border-color: ${c.primary} !important;
      color: #ffffff !important;
    }
    .ant-picker-input > input { color: ${c.text} !important; }
    .ant-picker-input > input::placeholder { color: ${c.textMuted} !important; }
    .ant-picker-range-separator { color: ${c.text} !important; }
    .ant-picker-active-bar { background: linear-gradient(to right, ${c.border}, ${c.primary}) !important; }
    .ant-picker-today-btn { color: ${c.primary} !important; }
    .ant-picker-today-btn:hover { color: ${c.secondary} !important; }

    /* ── SEGMENTED control ───────────────────────────────────────────── */
    .ant-segmented { background: ${c.background} !important; }
    .ant-segmented-item { color: ${c.text} !important; }
    .ant-segmented-item:hover { background: ${c.surface} !important; color: ${c.primary} !important; }
    .ant-segmented-item-selected {
      background: linear-gradient(to right, ${c.border}, ${c.primary}) !important;
      color: #ffffff !important;
      font-weight: 600;
    }

    /* ── Background surfaces via Tailwind class overrides ────────────── */
    .bg-surface-dark       { background-color: ${c.surface}     !important; }
    .bg-surface-dark-deep  { background-color: ${c.background}  !important; }
    .border-border-light   { border-color: ${c.border}          !important; }

    /* ── KYC onboarding flow ───────────────────────────────────────── */
    .kyc-flow {
      background-color: ${c.background} !important;
      color: ${c.text} !important;
    }
    .kyc-flow .ant-input,
    .kyc-flow .ant-input-affix-wrapper,
    .kyc-flow .ant-select-selector,
    .kyc-flow .ant-picker {
      border-color: ${c.border} !important;
      color: ${c.text} !important;
    }
    .kyc-flow .ant-input:hover,
    .kyc-flow .ant-input-affix-wrapper:hover,
    .kyc-flow .ant-select-selector:hover {
      border-color: ${c.primary} !important;
    }
    .kyc-flow .ant-input:focus,
    .kyc-flow .ant-input-focused,
    .kyc-flow .ant-input-affix-wrapper-focused,
    .kyc-flow .ant-select-focused .ant-select-selector {
      border-color: ${c.primary} !important;
      box-shadow: 0 0 0 2px ${c.primary}33 !important;
    }
    .kyc-flow .ant-btn-primary {
      background: ${c.primary} !important;
      border-color: ${c.primary} !important;
    }
    .kyc-flow .ant-btn-primary:hover {
      background: ${c.secondary} !important;
      border-color: ${c.secondary} !important;
    }
    .kyc-flow .kyc-gradient-btn {
      background: linear-gradient(to right, ${c.secondary}, ${c.primary}) !important;
      border: none !important;
      color: #ffffff !important;
    }
    .kyc-flow .kyc-gradient-btn:hover {
      opacity: 0.92;
    }
    .kyc-flow .kyc-upload-zone:hover {
      border-color: ${c.primary} !important;
    }
  `;

  // Append / update the override tag so it's always LAST in <head>
  let el = document.getElementById('tenant-dynamic') as HTMLStyleElement | null;
  if (!el) {
    el = document.createElement('style');
    el.id = 'tenant-dynamic';
    document.head.appendChild(el);  // LAST position = highest cascade priority
  }
  el.textContent = css;
}

// ─── Meta helpers ─────────────────────────────────────────────────────────────

function updateFavicon(href: string) {
  let link = document.querySelector<HTMLLinkElement>("link[rel~='icon']");
  if (!link) {
    link = document.createElement('link');
    link.rel = 'icon';
    document.head.appendChild(link);
  }
  link.href = href;
}

function subscribeTenant(onStoreChange: () => void) {
  if (typeof window === 'undefined') return () => {};
  const handler = () => onStoreChange();
  window.addEventListener(TENANT_CHANGE_EVENT, handler);
  window.addEventListener('storage', handler);
  return () => {
    window.removeEventListener(TENANT_CHANGE_EVENT, handler);
    window.removeEventListener('storage', handler);
  };
}

function getTenantSnapshot(): string {
  if (typeof window === 'undefined') return DEFAULT_TENANT_ID;
  return resolveTenantIdFromWindow();
}

// ─── Provider ─────────────────────────────────────────────────────────────────

export function TenantProvider({ children }: { children: React.ReactNode }) {
  const activeTenantId = useSyncExternalStore(
    subscribeTenant,
    getTenantSnapshot,
    () => DEFAULT_TENANT_ID,
  );
  const pathname = usePathname();

  useEffect(() => {
    const config = TENANT_REGISTRY[activeTenantId];
    if (!config) return;
    injectCssVariables(config);
    injectDynamicStyles(config);
    document.title = `${config.name} Dashboard`;
    updateFavicon(config.favicon);
  }, [activeTenantId]);

  const setTenant = useCallback((tenantId: string) => {
    if (!TENANT_REGISTRY[tenantId]) return;
    localStorage.setItem(ADMIN_TENANT_PREVIEW_KEY, tenantId);
    window.dispatchEvent(new Event(TENANT_CHANGE_EVENT));
  }, []);

  // Next.js metadata updates can overwrite title/favicon during client-side
  // navigation (e.g., logout -> sign-in). Re-apply tenant branding each route change.
  useEffect(() => {
    const config = TENANT_REGISTRY[activeTenantId];
    if (!config) return;
    document.title = `${config.name} Dashboard`;
    updateFavicon(config.favicon);
  }, [activeTenantId, pathname]);

  const tenantConfig =
    TENANT_REGISTRY[activeTenantId] ?? TENANT_REGISTRY[DEFAULT_TENANT_ID];

  return (
    <TenantContext.Provider value={{ tenantConfig, activeTenantId, setTenant }}>
      {children}
    </TenantContext.Provider>
  );
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useTenant(): TenantContextValue {
  const ctx = useContext(TenantContext);
  if (!ctx) throw new Error('useTenant must be used inside <TenantProvider>');
  return ctx;
}
