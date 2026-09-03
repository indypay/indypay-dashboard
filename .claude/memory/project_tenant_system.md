---
name: Multi-Tenant Theming System
description: White-label multi-tenant system built for RupeeFlow + Indypay. Key files and architecture.
type: project
---

Built a complete white-label multi-tenant theming system.

**Key files:**
- `tenants/tenantConfig.ts` — Tenant registry (RupeeFlow + Indypay configs: colors, logo paths, menuLabelOverrides)
- `context/TenantContext.tsx` — Context + TenantProvider + useTenant() hook; injects CSS vars on :root on switch
- `lib/components/Logo.tsx` — Dynamic logo (uses existing SVG for RupeeFlow, <img> for others)
- `lib/components/TenantSwitcher.tsx` — Dropdown switcher, rendered in Header for isOps() roles only
- `app/providers.tsx` — TenantProvider wraps everything; AntdTenantConfig bridge reads tenant for antd tokens
- `styles/globals.scss` — :root CSS vars (--primary, --secondary, --accent, --background, --surface, --text, --text-muted, --border)
- `public/logos/` — SVG placeholder logos for both tenants

**Tenant detection priority:** URL ?tenant=xxx → localStorage rf_tenant_id → default rupeeflow

**Tenant IDs:** "rupeeflow" (default, green #00875A) | "indypay" (blue #2563EB)

**How it works:**
- TenantContext calls document.documentElement.style.setProperty() for instant CSS var swap
- Ant Design ConfigProvider inside AntdTenantConfig reads tenantConfig.antdPrimary dynamically
- Sidebar reads tenantConfig.menuLabelOverrides (href → label map) to rename menu items per tenant
- Logo component switches between RupeeFlow's native SVG components vs <img> for other tenants

**Why:** Client asked for white-label theming to serve Indypay as a SaaS client while keeping RupeeFlow branding for internal use.

**How to apply:** When adding new tenants, add to TENANT_REGISTRY in tenantConfig.ts. No other file changes needed.
