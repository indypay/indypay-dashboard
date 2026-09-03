import axios from '@/app/api/axios';
import { resolvePBApi } from '@/lib/utils/common-utils';
import { API_CONFIG } from '../config/api.config';
import { safeAny } from '../interfaces/global.interface';
import {
  IUmsRole,
  IUmsPermission,
  IUmsRolePermission,
  IUmsUserRole,
  IUmsTenant,
  IUmsTenantUser,
  IUmsAuditLog,
  IUmsSession,
  IUserPermissions,
  IPaginatedResponse,
  IAssignRoleRequest,
  IRevokeRoleRequest,
  IUpdateRolePermissionRequest,
  ICreateTenantRequest,
  IUpdateTenantRequest,
  IAddTenantMemberRequest,
} from '../interfaces/ums.interface';
import {
  UMS_ROLES,
  UMS_PERMISSIONS,
  UMS_ASSIGN_ROLE,
  UMS_REVOKE_ROLE,
  UMS_USER_ROLES,
  UMS_USER_PERMISSIONS,
  UMS_UPDATE_ROLE_PERMISSION,
  UMS_BULK_UPDATE_PERMISSIONS,
  UMS_TENANTS,
  UMS_TENANT_MEMBERS,
  UMS_SESSIONS_REVOKE,
  UMS_USER_SESSIONS,
  UMS_AUDIT_LOGS,
} from '../constants/apiConstants/apiConstants';

const base = API_CONFIG.baseURL;

// All backend responses are wrapped by ResponseHandlerInterceptor:
// { statusCode, message, success, data: T }
// So we type the generic as { data: T } and unwrap before returning.

// ─────────────────────────────────────────────
// ROLES
// ─────────────────────────────────────────────

export const callGetRoles = async (): Promise<[IUmsRole[] | null, safeAny]> => {
  const [res, err] = await resolvePBApi<{ data: IUmsRole[] }>(
    () => axios.get(`${base}/${UMS_ROLES}`),
    false,
    true,
    false,
  );
  return [res?.data ?? null, err];
};

export const callGetRolePermissions = async (
  roleCode: string,
): Promise<[IUmsRolePermission[] | null, safeAny]> => {
  const [res, err] = await resolvePBApi<{ data: IUmsRolePermission[] }>(
    () => axios.get(`${base}/${UMS_ROLES}/${roleCode}/permissions`),
    false,
    true,
    false,
  );
  return [res?.data ?? null, err];
};

export const callUpdateRolePermission = async (
  dto: IUpdateRolePermissionRequest,
): Promise<[IUmsRolePermission | null, safeAny]> => {
  const [res, err] = await resolvePBApi<{ data: IUmsRolePermission }>(
    () => axios.patch(`${base}/${UMS_UPDATE_ROLE_PERMISSION}`, dto),
    false,
    true,
    false,
  );
  return [res?.data ?? null, err];
};

export const callBulkUpdatePermissions = async (
  permissions: IUpdateRolePermissionRequest[],
): Promise<[IUmsRolePermission[] | null, safeAny]> => {
  const [res, err] = await resolvePBApi<{ data: IUmsRolePermission[] }>(
    () =>
      axios.patch(`${base}/${UMS_BULK_UPDATE_PERMISSIONS}`, { permissions }),
    false,
    true,
    false,
  );
  return [res?.data ?? null, err];
};

// ─────────────────────────────────────────────
// PERMISSIONS
// ─────────────────────────────────────────────

export const callGetPermissions = async (): Promise<
  [IUmsPermission[] | null, safeAny]
> => {
  const [res, err] = await resolvePBApi<{ data: IUmsPermission[] }>(
    () => axios.get(`${base}/${UMS_PERMISSIONS}`),
    false,
    true,
    false,
  );
  return [res?.data ?? null, err];
};

// ─────────────────────────────────────────────
// USER ROLES
// ─────────────────────────────────────────────

export const callAssignRole = async (
  dto: IAssignRoleRequest,
): Promise<[IUmsUserRole | null, safeAny]> => {
  const [res, err] = await resolvePBApi<{ data: IUmsUserRole }>(
    () => axios.post(`${base}/${UMS_ASSIGN_ROLE}`, dto),
    false,
    true,
    false,
  );
  return [res?.data ?? null, err];
};

export const callRevokeRole = async (
  dto: IRevokeRoleRequest,
): Promise<[null, safeAny]> => {
  const [, err] = await resolvePBApi<{ data: null }>(
    () => axios.post(`${base}/${UMS_REVOKE_ROLE}`, dto),
    false,
    true,
    false,
  );
  return [null, err];
};

export const callGetUserRoles = async (
  userId: string,
  tenantId?: string,
): Promise<[IUmsUserRole[] | null, safeAny]> => {
  const [res, err] = await resolvePBApi<{ data: IUmsUserRole[] }>(
    () =>
      axios.get(`${base}/${UMS_USER_ROLES}/${userId}/roles`, {
        params: tenantId ? { tenantId } : {},
      }),
    false,
    true,
    false,
  );
  return [res?.data ?? null, err];
};

export const callGetUserPermissions = async (
  userId: string,
  tenantId?: string,
): Promise<[IUserPermissions | null, safeAny]> => {
  const [res, err] = await resolvePBApi<{ data: IUserPermissions }>(
    () =>
      axios.get(`${base}/${UMS_USER_PERMISSIONS}/${userId}/permissions`, {
        params: tenantId ? { tenantId } : {},
      }),
    false,
    true,
    false,
  );
  return [res?.data ?? null, err];
};

// ─────────────────────────────────────────────
// TENANTS
// ─────────────────────────────────────────────

export const callCreateTenant = async (
  dto: ICreateTenantRequest,
): Promise<[IUmsTenant | null, safeAny]> => {
  const [res, err] = await resolvePBApi<{ data: IUmsTenant }>(
    () => axios.post(`${base}/${UMS_TENANTS}`, dto),
    false,
    true,
    false,
  );
  return [res?.data ?? null, err];
};

export const callGetTenants = async (
  page = 1,
  limit = 20,
): Promise<[IPaginatedResponse<IUmsTenant> | null, safeAny]> => {
  const [res, err] = await resolvePBApi<{
    data: IPaginatedResponse<IUmsTenant>;
  }>(
    () => axios.get(`${base}/${UMS_TENANTS}`, { params: { page, limit } }),
    false,
    true,
    false,
  );
  return [res?.data ?? null, err];
};

export const callGetTenantById = async (
  tenantId: string,
): Promise<[IUmsTenant | null, safeAny]> => {
  const [res, err] = await resolvePBApi<{ data: IUmsTenant }>(
    () => axios.get(`${base}/${UMS_TENANTS}/${tenantId}`),
    false,
    true,
    false,
  );
  return [res?.data ?? null, err];
};

export const callUpdateTenant = async (
  tenantId: string,
  dto: IUpdateTenantRequest,
): Promise<[IUmsTenant | null, safeAny]> => {
  const [res, err] = await resolvePBApi<{ data: IUmsTenant }>(
    () => axios.patch(`${base}/${UMS_TENANTS}/${tenantId}`, dto),
    false,
    true,
    false,
  );
  return [res?.data ?? null, err];
};

export const callAddTenantMember = async (
  dto: IAddTenantMemberRequest,
): Promise<[IUmsTenantUser | null, safeAny]> => {
  const [res, err] = await resolvePBApi<{ data: IUmsTenantUser }>(
    () => axios.post(`${base}/${UMS_TENANT_MEMBERS}`, dto),
    false,
    true,
    false,
  );
  return [res?.data ?? null, err];
};

export const callGetTenantMembers = async (
  tenantId: string,
): Promise<[IUmsTenantUser[] | null, safeAny]> => {
  const [res, err] = await resolvePBApi<{ data: IUmsTenantUser[] }>(
    () => axios.get(`${base}/${UMS_TENANTS}/${tenantId}/members`),
    false,
    true,
    false,
  );
  return [res?.data ?? null, err];
};

// ─────────────────────────────────────────────
// SESSIONS
// ─────────────────────────────────────────────

export const callRevokeSession = async (
  jti: string,
  reason?: string,
): Promise<[null, safeAny]> => {
  const [, err] = await resolvePBApi<{ data: null }>(
    () => axios.post(`${base}/${UMS_SESSIONS_REVOKE}`, { jti, reason }),
    false,
    true,
    false,
  );
  return [null, err];
};

export const callRevokeAllSessions = async (
  userId: string,
): Promise<[{ revoked: number } | null, safeAny]> => {
  const [res, err] = await resolvePBApi<{ data: { revoked: number } }>(
    () =>
      axios.post(`${base}/api/v1/ums/sessions/revoke-all/${userId}`, {
        reason: 'admin_revoke',
      }),
    false,
    true,
    false,
  );
  return [res?.data ?? null, err];
};

export const callGetUserSessions = async (
  userId: string,
): Promise<[IUmsSession[] | null, safeAny]> => {
  const [res, err] = await resolvePBApi<{ data: IUmsSession[] }>(
    () => axios.get(`${base}/${UMS_USER_SESSIONS}/${userId}`),
    false,
    true,
    false,
  );
  return [res?.data ?? null, err];
};

// ─────────────────────────────────────────────
// AUDIT LOGS
// ─────────────────────────────────────────────

export const callGetAuditLogs = async (params: {
  actorId?: string;
  tenantId?: string;
  action?: string;
  resource?: string;
  from?: string;
  to?: string;
  page?: number;
  limit?: number;
}): Promise<[IPaginatedResponse<IUmsAuditLog> | null, safeAny]> => {
  const [res, err] = await resolvePBApi<{
    data: IPaginatedResponse<IUmsAuditLog>;
  }>(
    () => axios.get(`${base}/${UMS_AUDIT_LOGS}`, { params }),
    false,
    true,
    false,
  );
  return [res?.data ?? null, err];
};
