// ─────────────────────────────────────────────
// Enums (mirrored from backend)
// ─────────────────────────────────────────────

export enum UmsGrantType {
  FULL = 'FULL',
  PARTIAL = 'PARTIAL',
  WITH_APPROVAL = 'WITH_APPROVAL',
}

export enum UmsTenantType {
  PARTNER = 'PARTNER',
  RESELLER = 'RESELLER',
  AGGREGATOR = 'AGGREGATOR',
}

export enum UmsTenantStatus {
  ACTIVE = 'ACTIVE',
  SUSPENDED = 'SUSPENDED',
  PENDING = 'PENDING',
  TERMINATED = 'TERMINATED',
}

export enum UmsKybStatus {
  PENDING = 'PENDING',
  SUBMITTED = 'SUBMITTED',
  VERIFIED = 'VERIFIED',
  REJECTED = 'REJECTED',
}

export enum UmsAuditStatus {
  SUCCESS = 'SUCCESS',
  FAILURE = 'FAILURE',
  BLOCKED = 'BLOCKED',
}

// ─────────────────────────────────────────────
// Entities
// ─────────────────────────────────────────────

export interface IUmsRole {
  id: string;
  code: string;
  name: string;
  tier: string;
  level: string;
  description: string | null;
  riskLevel: string;
  isSystemRole: boolean;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface IUmsPermission {
  id: string;
  code: string;
  name: string;
  resource: string;
  action: string;
  scope: string;
  description: string | null;
  createdAt: string;
}

export interface IUmsRolePermission {
  id: string;
  roleId: string;
  permissionCode: string;
  grantType: UmsGrantType;
  createdAt: string;
}

export interface IUmsUserRole {
  id: string;
  userId: string;
  roleId: string;
  tenantId: string | null;
  assignedById: string | null;
  expiresAt: string | null;
  isActive: boolean;
  role: IUmsRole;
  createdAt: string;
}

export interface IUmsTenant {
  id: string;
  code: string;
  name: string;
  type: UmsTenantType;
  ownerId: string;
  parentTenantId: string | null;
  config: Record<string, unknown>;
  status: UmsTenantStatus;
  kybStatus: UmsKybStatus;
  apiRateLimit: number | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface IUmsTenantUser {
  id: string;
  tenantId: string;
  userId: string;
  designation: string | null;
  isPrimaryContact: boolean;
  isActive: boolean;
  createdAt: string;
}

export interface IUmsAuditLog {
  id: string;
  actorId: string | null;
  actorRole: string | null;
  tenantId: string | null;
  action: string;
  resource: string;
  resourceId: string | null;
  details: Record<string, unknown>;
  ipAddress: string | null;
  userAgent: string | null;
  status: UmsAuditStatus;
  createdAt: string;
}

export interface IUmsSession {
  id: string;
  userId: string;
  jti: string;
  isActive: boolean;
  ipAddress: string | null;
  userAgent: string | null;
  expiresAt: string;
  revokedAt: string | null;
  revokedReason: string | null;
  createdAt: string;
}

// ─────────────────────────────────────────────
// Computed
// ─────────────────────────────────────────────

export interface IUserPermissions {
  userId: string;
  roles: string[];
  permissions: Record<string, UmsGrantType>;
  tenantId: string | null;
  computedAt: string;
}

// ─────────────────────────────────────────────
// Request DTOs
// ─────────────────────────────────────────────

export interface IAssignRoleRequest {
  userId: string;
  roleCode: string;
  tenantId?: string;
  expiresAt?: string;
  assignedById?: string;
}

export interface IRevokeRoleRequest {
  userId: string;
  roleCode: string;
  tenantId?: string;
}

export interface IUpdateRolePermissionRequest {
  roleCode: string;
  permissionCode: string;
  grantType: UmsGrantType;
}

export interface ICreateTenantRequest {
  code: string;
  name: string;
  type: UmsTenantType;
  ownerId: string;
  parentTenantId?: string;
  apiRateLimit?: number;
}

export interface IUpdateTenantRequest {
  name?: string;
  apiRateLimit?: number;
  isActive?: boolean;
}

export interface IAddTenantMemberRequest {
  tenantId: string;
  userId: string;
  designation?: string;
  isPrimaryContact?: boolean;
}

// ─────────────────────────────────────────────
// Paginated response
// ─────────────────────────────────────────────

export interface IPaginatedResponse<T> {
  data: T[];
  total: number;
}
