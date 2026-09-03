'use client';

/**
 * Logo.tsx
 *
 * Renders the correct brand logo for the active tenant.
 *
 * isCollapsed=false → full-width wordmark  (logoFull)
 * isCollapsed=true  → small icon mark      (logoIcon)
 *
 * RupeeFlow uses its native SVG React components (zero visual regression).
 * Every other tenant uses a Next.js <Image> pointing at the path in tenantConfig.
 */

import React from 'react';
import { useTenant } from '@/context/TenantContext';
import RupeeflowHeaderIcon from '@/public/assests/Icon/RupeeFlowHeaderIcon';
import RupeeFlowShortSvg from '@/public/assests/Icon/RupeeFlowShortSvg';

interface LogoProps {
  isCollapsed: boolean;
  onClick?: () => void;
  className?: string;
  /** Smaller sizing for embedded contexts (e.g. invoice preview) */
  compact?: boolean;
}

export function Logo({ isCollapsed, onClick, className = '', compact = false }: LogoProps) {
  const { tenantConfig, activeTenantId } = useTenant();

  // Keep RupeeFlow's hand-crafted SVG components untouched
  if (activeTenantId === 'rupeeflow') {
    return isCollapsed ? (
      <RupeeFlowShortSvg
        className={`cursor-pointer ${className}`}
        onClick={onClick}
      />
    ) : (
      <RupeeflowHeaderIcon
        className={`cursor-pointer ${className}`}
        onClick={onClick}
      />
    );
  }

  const src = isCollapsed ? tenantConfig.logoIcon : tenantConfig.logoFull;
  const dims = tenantConfig.logoDimensions;
  const fullHeight = compact ? 36 : (dims?.fullHeight ?? 56);
  const fullMaxWidth = compact ? 120 : (dims?.fullMaxWidth ?? 180);
  const fullScale = compact ? 1 : (dims?.fullScale ?? 1);

  return (
    // eslint-disable-next-line jsx-a11y/click-events-have-key-events
    <div
      className={`cursor-pointer flex items-center ${className}`}
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && onClick?.()}
    >
      {/* Plain <img> — bypasses next/image optimization, works for all local tenant logos */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt={`${tenantConfig.name} logo`}
        style={{
          width: isCollapsed ? 36 : 'auto',
          height: isCollapsed ? 36 : fullHeight,
          maxWidth: isCollapsed ? 36 : fullMaxWidth,
          objectFit: 'contain',
          transform: !isCollapsed && fullScale !== 1 ? `scale(${fullScale})` : undefined,
          transformOrigin: 'left center',
        }}
      />
    </div>
  );
}
