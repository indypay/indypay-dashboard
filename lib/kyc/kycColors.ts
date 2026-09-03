/**
 * KYC UI tokens — reference CSS variables from TenantProvider (:root).
 */
export const kyc = {
  primary: 'var(--primary)',
  secondary: 'var(--secondary)',
  accent: 'var(--accent)',
  border: 'var(--border)',
  text: 'var(--text)',
  textMuted: 'var(--text-muted)',
  surface: 'var(--surface)',
  background: 'var(--background)',
  softBg: 'var(--primary-soft-bg)',
  softBorder: 'var(--primary-soft-border)',
  ctaGradient: 'var(--cta-gradient)',
  ctaGradient135: 'var(--cta-gradient-135)',
  shadowCard: 'var(--primary-shadow-card)',
  shadowHeader: 'var(--primary-shadow-soft)',
  iconGradient: 'var(--primary-icon-gradient)',
  /** Neutral field underline when empty */
  fieldEmpty: '#E0EDE6',
  fieldPending: '#94A3B8',
} as const;
