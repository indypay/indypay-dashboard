import {
  useMutation,
  useQuery,
  useQueryClient,
  UseQueryResult,
} from '@tanstack/react-query';

import { safeAny } from '@/lib/interfaces/global.interface';
import type {
  ChargebackDecisionDto,
  CreateTransactionDisputeDto,
  CyberLegalLayerDto,
  CyberNocDto,
  DisputesPaginatedPayload,
  TransactionDispute,
} from '@/lib/interfaces/dispute.interface';
import {
  callAdminCreateDispute,
  callAdminGetDisputeById,
  callAdminGetDisputeByTransactionId,
  callAdminListDisputes,
  callAdminPatchCyberLegalLayer,
  type AdminDisputesListParams,
  callMerchantChargebackDecision,
  callMerchantCyberNoc,
  callMerchantGetDisputeById,
  callMerchantListDisputes,
  type MerchantDisputesListParams,
} from '@/lib/services/dispute-service';

const qk = {
  adminList: (p: AdminDisputesListParams) => ['disputes', 'admin', 'list', p] as const,
  adminOne: (id: string) => ['disputes', 'admin', id] as const,
  adminByTxn: (txnId: string) => ['disputes', 'admin', 'txn', txnId] as const,
  merchantList: (p: MerchantDisputesListParams) =>
    ['disputes', 'merchant', 'list', p] as const,
  merchantOne: (id: string) => ['disputes', 'merchant', id] as const,
  merchantByTxn: (txnId: string) => ['disputes', 'merchant', 'txn', txnId] as const,
};

export const useAdminDisputesList = (
  params: AdminDisputesListParams,
  enabled: boolean,
): UseQueryResult<[DisputesPaginatedPayload | null, safeAny], Error> => {
  return useQuery({
    queryKey: qk.adminList(params),
    queryFn: () => callAdminListDisputes(params),
    enabled,
    staleTime: 20_000,
    refetchOnWindowFocus: false,
  });
};

export const useAdminDisputeById = (
  disputeId: string | null,
  enabled: boolean,
): UseQueryResult<[TransactionDispute | null, safeAny], Error> => {
  return useQuery({
    queryKey: qk.adminOne(disputeId || ''),
    queryFn: () => callAdminGetDisputeById(disputeId!),
    enabled: Boolean(disputeId && enabled),
    staleTime: 15_000,
  });
};

export const useAdminDisputeByTransactionId = (
  transactionId: string | null,
  enabled: boolean,
): UseQueryResult<[TransactionDispute | null, safeAny], Error> => {
  return useQuery({
    queryKey: qk.adminByTxn(transactionId || ''),
    queryFn: () => callAdminGetDisputeByTransactionId(transactionId!),
    enabled: Boolean(transactionId && enabled),
    staleTime: 15_000,
  });
};

export const useMerchantDisputesList = (
  params: MerchantDisputesListParams,
  enabled: boolean,
): UseQueryResult<[DisputesPaginatedPayload | null, safeAny], Error> => {
  return useQuery({
    queryKey: qk.merchantList(params),
    queryFn: () => callMerchantListDisputes(params),
    enabled,
    staleTime: 20_000,
    refetchOnWindowFocus: false,
  });
};

export const useMerchantDisputeById = (
  disputeId: string | null,
  enabled: boolean,
): UseQueryResult<[TransactionDispute | null, safeAny], Error> => {
  return useQuery({
    queryKey: qk.merchantOne(disputeId || ''),
    queryFn: () => callMerchantGetDisputeById(disputeId!),
    enabled: Boolean(disputeId && enabled),
    staleTime: 15_000,
  });
};

export const useCreateAdminDispute = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      transactionId,
      body,
    }: {
      transactionId: string;
      body: CreateTransactionDisputeDto;
    }) => callAdminCreateDispute(transactionId, body),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['disputes'] });
    },
  });
};

export const useAdminCyberLegalLayer = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      disputeId,
      body,
    }: {
      disputeId: string;
      body: CyberLegalLayerDto;
    }) => callAdminPatchCyberLegalLayer(disputeId, body),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['disputes'] });
    },
  });
};

export const useMerchantChargebackDecision = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      disputeId,
      body,
    }: {
      disputeId: string;
      body: ChargebackDecisionDto;
    }) => callMerchantChargebackDecision(disputeId, body),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['disputes'] });
    },
  });
};

export const useMerchantCyberNoc = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      disputeId,
      body,
    }: {
      disputeId: string;
      body: CyberNocDto;
    }) => callMerchantCyberNoc(disputeId, body),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['disputes'] });
    },
  });
};
