import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  callGetRoles,
  callGetPermissions,
  callGetRolePermissions,
  callUpdateRolePermission,
  callBulkUpdatePermissions,
  callAssignRole,
  callRevokeRole,
  callGetUserRoles,
  callGetUserPermissions,
  callCreateTenant,
  callGetTenants,
  callUpdateTenant,
  callAddTenantMember,
  callGetTenantMembers,
  callRevokeSession,
  callRevokeAllSessions,
  callGetUserSessions,
  callGetAuditLogs,
} from '../services/ums.service';
import {
  IAssignRoleRequest,
  IRevokeRoleRequest,
  IUpdateRolePermissionRequest,
  ICreateTenantRequest,
  IUpdateTenantRequest,
  IAddTenantMemberRequest,
} from '../interfaces/ums.interface';

// ─────────────────────────────────────────────
// ROLES
// ─────────────────────────────────────────────

export const useGetRoles = () =>
  useQuery({
    queryKey: ['ums-roles'],
    queryFn: () => callGetRoles(),
    staleTime: 5 * 60 * 1000,
  });

export const useGetPermissions = () =>
  useQuery({
    queryKey: ['ums-permissions'],
    queryFn: () => callGetPermissions(),
    staleTime: 5 * 60 * 1000,
  });

export const useGetRolePermissions = (roleCode: string) =>
  useQuery({
    queryKey: ['ums-role-permissions', roleCode],
    queryFn: () => callGetRolePermissions(roleCode),
    enabled: !!roleCode,
  });

export const useUpdateRolePermission = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (dto: IUpdateRolePermissionRequest) =>
      callUpdateRolePermission(dto),
    onSuccess: () =>
      qc.invalidateQueries({ queryKey: ['ums-role-permissions'] }),
  });
};

export const useBulkUpdatePermissions = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (permissions: IUpdateRolePermissionRequest[]) =>
      callBulkUpdatePermissions(permissions),
    onSuccess: () =>
      qc.invalidateQueries({ queryKey: ['ums-role-permissions'] }),
  });
};

// ─────────────────────────────────────────────
// USER ROLES
// ─────────────────────────────────────────────

export const useGetUserRoles = (userId: string) =>
  useQuery({
    queryKey: ['ums-user-roles', userId],
    queryFn: () => callGetUserRoles(userId),
    enabled: !!userId,
  });

export const useGetUserPermissions = (userId: string) =>
  useQuery({
    queryKey: ['ums-user-permissions', userId],
    queryFn: () => callGetUserPermissions(userId),
    enabled: !!userId,
  });

export const useAssignRole = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (dto: IAssignRoleRequest) => callAssignRole(dto),
    onSuccess: (_data, vars) =>
      qc.invalidateQueries({ queryKey: ['ums-user-roles', vars.userId] }),
  });
};

export const useRevokeRole = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (dto: IRevokeRoleRequest) => callRevokeRole(dto),
    onSuccess: (_data, vars) =>
      qc.invalidateQueries({ queryKey: ['ums-user-roles', vars.userId] }),
  });
};

// ─────────────────────────────────────────────
// TENANTS
// ─────────────────────────────────────────────

export const useGetTenants = (page = 1, limit = 20) =>
  useQuery({
    queryKey: ['ums-tenants', page, limit],
    queryFn: () => callGetTenants(page, limit),
  });

export const useCreateTenant = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (dto: ICreateTenantRequest) => callCreateTenant(dto),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['ums-tenants'] }),
  });
};

export const useUpdateTenant = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      tenantId,
      dto,
    }: {
      tenantId: string;
      dto: IUpdateTenantRequest;
    }) => callUpdateTenant(tenantId, dto),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['ums-tenants'] }),
  });
};

export const useGetTenantMembers = (tenantId: string) =>
  useQuery({
    queryKey: ['ums-tenant-members', tenantId],
    queryFn: () => callGetTenantMembers(tenantId),
    enabled: !!tenantId,
  });

export const useAddTenantMember = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (dto: IAddTenantMemberRequest) => callAddTenantMember(dto),
    onSuccess: (_data, vars) =>
      qc.invalidateQueries({ queryKey: ['ums-tenant-members', vars.tenantId] }),
  });
};

// ─────────────────────────────────────────────
// SESSIONS
// ─────────────────────────────────────────────

export const useGetUserSessions = (userId: string) =>
  useQuery({
    queryKey: ['ums-user-sessions', userId],
    queryFn: () => callGetUserSessions(userId),
    enabled: !!userId,
  });

export const useRevokeSession = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ jti, reason }: { jti: string; reason?: string }) =>
      callRevokeSession(jti, reason),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['ums-user-sessions'] }),
  });
};

export const useRevokeAllSessions = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (userId: string) => callRevokeAllSessions(userId),
    onSuccess: (_data, userId) =>
      qc.invalidateQueries({ queryKey: ['ums-user-sessions', userId] }),
  });
};

// ─────────────────────────────────────────────
// AUDIT LOGS
// ─────────────────────────────────────────────

export const useGetAuditLogs = (params: {
  actorId?: string;
  tenantId?: string;
  action?: string;
  resource?: string;
  from?: string;
  to?: string;
  page?: number;
  limit?: number;
}) =>
  useQuery({
    queryKey: ['ums-audit-logs', params],
    queryFn: () => callGetAuditLogs(params),
    keepPreviousData: true,
  } as Parameters<typeof useQuery>[0]);
