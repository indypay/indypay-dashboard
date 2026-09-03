import { resolvePBApi } from '@/lib/utils/common-utils';
import { safeAny } from '@/lib/interfaces/global.interface';
import axios from '@/app/api/axios';
import { COMMISSIONS_BASE } from '@/lib/constants/apiConstants/apiConstants';
import type {
  CommissionPlan,
  CreateCommissionDto,
  UpdateCommissionDto,
  CreateCommissionSlabDto,
  UpdateCommissionSlabDto,
  AssignCommissionToUserDto,
  UserCommissionMapping,
} from '@/lib/interfaces/commission.interface';

const baseUrl = process.env.NEXT_PUBLIC_DEV_PB_BASE_URL;

function normalizePlans(
  response: CommissionPlan[] | { data?: CommissionPlan[] } | null,
): CommissionPlan[] {
  if (!response) return [];
  if (Array.isArray(response)) return response;
  return (response as { data?: CommissionPlan[] }).data ?? [];
}

export async function getAllCommissions(): Promise<
  [CommissionPlan[] | null, safeAny]
> {
  const [response, error] = await resolvePBApi<
    CommissionPlan[] | { data?: CommissionPlan[] }
  >(
    () =>
      axios.get<CommissionPlan[] | { data?: CommissionPlan[] }>(
        `${baseUrl}/${COMMISSIONS_BASE}`,
      ),
    false,
    true,
    false,
  );
  return [normalizePlans(response), error];
}

export async function getCommissionById(
  id: string,
): Promise<[CommissionPlan | null, safeAny]> {
  const [response, error] = await resolvePBApi<CommissionPlan>(
    () => axios.get<CommissionPlan>(`${baseUrl}/${COMMISSIONS_BASE}/${id}`),
    false,
    true,
    false,
  );
  return [response, error];
}

export async function createCommission(
  body: CreateCommissionDto,
): Promise<[CommissionPlan | null, safeAny]> {
  const [response, error] = await resolvePBApi<CommissionPlan>(
    () => axios.post<CommissionPlan>(`${baseUrl}/${COMMISSIONS_BASE}`, body),
    false,
    true,
    false,
  );
  return [response, error];
}

export async function updateCommission(
  id: string,
  body: UpdateCommissionDto,
): Promise<[CommissionPlan | null, safeAny]> {
  const [response, error] = await resolvePBApi<CommissionPlan>(
    () =>
      axios.put<CommissionPlan>(`${baseUrl}/${COMMISSIONS_BASE}/${id}`, body),
    false,
    true,
    false,
  );
  return [response, error];
}

export async function deleteCommission(
  id: string,
): Promise<[unknown | null, safeAny]> {
  const [response, error] = await resolvePBApi<unknown>(
    () => axios.delete(`${baseUrl}/${COMMISSIONS_BASE}/${id}`),
    false,
    true,
    false,
  );
  return [response, error];
}

export async function addSlab(
  commissionId: string,
  body: CreateCommissionSlabDto,
): Promise<[CommissionPlan | null, safeAny]> {
  const [response, error] = await resolvePBApi<CommissionPlan>(
    () =>
      axios.post<CommissionPlan>(
        `${baseUrl}/${COMMISSIONS_BASE}/${commissionId}/slabs`,
        body,
      ),
    false,
    true,
    false,
  );
  return [response, error];
}

export async function updateSlab(
  slabId: string,
  body: UpdateCommissionSlabDto,
): Promise<[unknown | null, safeAny]> {
  const [response, error] = await resolvePBApi<unknown>(
    () => axios.put(`${baseUrl}/${COMMISSIONS_BASE}/slabs/${slabId}`, body),
    false,
    true,
    false,
  );
  return [response, error];
}

export async function deleteSlab(
  slabId: string,
): Promise<[unknown | null, safeAny]> {
  const [response, error] = await resolvePBApi<unknown>(
    () => axios.delete(`${baseUrl}/${COMMISSIONS_BASE}/slabs/${slabId}`),
    false,
    true,
    false,
  );
  return [response, error];
}

export async function getUserCommissionMapping(
  userId: string,
): Promise<[UserCommissionMapping | null, safeAny]> {
  const [response, error] = await resolvePBApi<UserCommissionMapping>(
    () =>
      axios.get<UserCommissionMapping>(
        `${baseUrl}/${COMMISSIONS_BASE}/users/${userId}`,
      ),
    false,
    false,
    false,
  );
  return [response, error];
}

export async function assignCommissionToUser(
  userId: string,
  body: AssignCommissionToUserDto,
): Promise<[UserCommissionMapping | null, safeAny]> {
  const [response, error] = await resolvePBApi<UserCommissionMapping>(
    () =>
      axios.post<UserCommissionMapping>(
        `${baseUrl}/${COMMISSIONS_BASE}/users/${userId}/assign`,
        body,
      ),
    false,
    true,
    false,
  );
  return [response, error];
}
