import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { UseQueryResult, UseMutationResult } from '@tanstack/react-query';
import { queryKeys } from '@/lib/config/query-client.config';
import {
  getAllCommissions,
  getCommissionById,
  createCommission,
  updateCommission,
  deleteCommission,
  addSlab,
  updateSlab,
  deleteSlab,
  getUserCommissionMapping,
  assignCommissionToUser,
} from '@/lib/services/commission.service';
import type {
  CommissionPlan,
  CreateCommissionDto,
  UpdateCommissionDto,
  CreateCommissionSlabDto,
  UpdateCommissionSlabDto,
  AssignCommissionToUserDto,
  UserCommissionMapping,
} from '@/lib/interfaces/commission.interface';
import type { safeAny } from '@/lib/interfaces/global.interface';

export function useCommissions(): UseQueryResult<
  [CommissionPlan[] | null, safeAny],
  Error
> {
  return useQuery({
    queryKey: queryKeys.commissions.all(),
    queryFn: () => getAllCommissions(),
  });
}

export function useCommissionById(
  id: string | null,
  enabled = true,
): UseQueryResult<[CommissionPlan | null, safeAny], Error> {
  return useQuery({
    queryKey: queryKeys.commissions.byId(id ?? ''),
    queryFn: () => getCommissionById(id!),
    enabled: !!id && enabled,
  });
}

export function useUserCommissionMapping(
  userId: string | null,
  enabled = true,
): UseQueryResult<[UserCommissionMapping | null, safeAny], Error> {
  return useQuery({
    queryKey: queryKeys.commissions.userMapping(userId ?? ''),
    queryFn: () => getUserCommissionMapping(userId!),
    enabled: !!userId && enabled,
  });
}

export function useCreateCommission(): UseMutationResult<
  [CommissionPlan | null, safeAny],
  Error,
  CreateCommissionDto
> {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (body: CreateCommissionDto) => createCommission(body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.commissions.all() });
    },
  });
}

export function useUpdateCommission(): UseMutationResult<
  [CommissionPlan | null, safeAny],
  Error,
  { id: string; body: UpdateCommissionDto }
> {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, body }: { id: string; body: UpdateCommissionDto }) =>
      updateCommission(id, body),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.commissions.all() });
      queryClient.invalidateQueries({
        queryKey: queryKeys.commissions.byId(id),
      });
    },
  });
}

export function useDeleteCommission(): UseMutationResult<
  [unknown | null, safeAny],
  Error,
  string
> {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteCommission(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.commissions.all() });
    },
  });
}

export function useAddSlab(): UseMutationResult<
  [CommissionPlan | null, safeAny],
  Error,
  { commissionId: string; body: CreateCommissionSlabDto }
> {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      commissionId,
      body,
    }: {
      commissionId: string;
      body: CreateCommissionSlabDto;
    }) => addSlab(commissionId, body),
    onSuccess: (_, { commissionId }) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.commissions.all() });
      queryClient.invalidateQueries({
        queryKey: queryKeys.commissions.byId(commissionId),
      });
    },
  });
}

export function useUpdateSlab(): UseMutationResult<
  [unknown | null, safeAny],
  Error,
  { slabId: string; body: UpdateCommissionSlabDto }
> {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      slabId,
      body,
    }: {
      slabId: string;
      body: UpdateCommissionSlabDto;
    }) => updateSlab(slabId, body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.commissions.all() });
    },
  });
}

export function useDeleteSlab(): UseMutationResult<
  [unknown | null, safeAny],
  Error,
  string
> {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (slabId: string) => deleteSlab(slabId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.commissions.all() });
    },
  });
}

export function useAssignCommissionToUser(): UseMutationResult<
  [UserCommissionMapping | null, safeAny],
  Error,
  { userId: string; body: AssignCommissionToUserDto }
> {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      userId,
      body,
    }: {
      userId: string;
      body: AssignCommissionToUserDto;
    }) => assignCommissionToUser(userId, body),
    onSuccess: (_, { userId }) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.commissions.all() });
      queryClient.invalidateQueries({
        queryKey: queryKeys.commissions.userMapping(userId),
      });
    },
  });
}
