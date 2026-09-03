import { useMemo } from 'react';
import { useTenant } from '@/context/TenantContext';
import type { TenantColors } from '@/tenants/tenantConfig';

function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const normalized = hex.replace('#', '').trim();
  if (normalized.length !== 6) return null;
  const r = parseInt(normalized.slice(0, 2), 16);
  const g = parseInt(normalized.slice(2, 4), 16);
  const b = parseInt(normalized.slice(4, 6), 16);
  if ([r, g, b].some((n) => Number.isNaN(n))) return null;
  return { r, g, b };
}

export interface TenantPageTheme {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  backgroundBase: string;
  cardShadow: string;
  cardShadowHover: string;
  gradientButton: string;
  gradientHero: string;
  radialGlow: string;
  radialGlowSoft: string;
  surfaceTint: string;
  borderSubtle: string;
  borderLight: string;
  borderMedium: string;
  borderStrong: string;
  buttonShadow: string;
  buttonShadowLg: string;
  primaryAlpha: (opacity: number) => string;
}

export function getTenantPageTheme(c: TenantColors): TenantPageTheme {
  const rgb = hexToRgb(c.primary) ?? { r: 0, g: 135, b: 90 };
  const primaryAlpha = (opacity: number) =>
    `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${opacity})`;

  return {
    primary: c.primary,
    secondary: c.secondary,
    accent: c.accent,
    background: c.background,
    backgroundBase: `linear-gradient(165deg, ${c.background} 0%, ${c.border} 28%, ${c.sidebarActiveBg} 55%, ${c.border} 78%, ${c.background} 100%)`,
    cardShadow: `0 4px 6px -1px rgba(0,0,0,0.06), 0 12px 32px -4px ${primaryAlpha(0.14)}, 0 0 0 1px ${primaryAlpha(0.06)}`,
    cardShadowHover: `0 8px 16px -2px rgba(0,0,0,0.08), 0 20px 40px -6px ${primaryAlpha(0.18)}, 0 0 0 1px ${primaryAlpha(0.08)}`,
    gradientButton: `linear-gradient(135deg, ${c.primary} 0%, ${c.secondary} 100%)`,
    gradientHero: `linear-gradient(135deg, ${c.accent} 0%, ${c.primary} 50%, ${c.secondary} 100%)`,
    radialGlow: `radial-gradient(circle, ${primaryAlpha(0.12)} 0%, transparent 70%)`,
    radialGlowSoft: `radial-gradient(circle, ${primaryAlpha(0.08)} 0%, transparent 70%)`,
    surfaceTint: `linear-gradient(145deg, ${c.background} 0%, ${c.sidebarActiveBg} 100%)`,
    borderSubtle: primaryAlpha(0.12),
    borderLight: primaryAlpha(0.08),
    borderMedium: primaryAlpha(0.15),
    borderStrong: primaryAlpha(0.2),
    buttonShadow: `0 4px 14px ${primaryAlpha(0.4)}`,
    buttonShadowLg: `0 12px 32px ${primaryAlpha(0.4)}, 0 0 0 4px ${primaryAlpha(0.12)}`,
    primaryAlpha,
  };
}

export function useTenantPageTheme(): TenantPageTheme {
  const { tenantConfig } = useTenant();
  return useMemo(
    () => getTenantPageTheme(tenantConfig.colors),
    [tenantConfig],
  );
}
