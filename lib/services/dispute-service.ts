import axios from '@/app/api/axios';
import { resolvePBApi } from '@/lib/utils/common-utils';
import { safeAny } from '@/lib/interfaces/global.interface';
import {
  TRANSACTION_DISPUTES_ADMIN_BASE,
  TRANSACTION_DISPUTES_MERCHANT_BASE,
} from '@/lib/constants/apiConstants/apiConstants';
import type {
  ChargebackDecisionDto,
  CreateTransactionDisputeDto,
  CyberLegalLayerDto,
  CyberNocDto,
  DisputesPaginatedPayload,
  TransactionDispute,
} from '@/lib/interfaces/dispute.interface';

const baseUrl = process.env.NEXT_PUBLIC_DEV_PB_BASE_URL;

function unwrapInner<T>(payload: safeAny): T | null {
  if (payload == null || typeof payload !== 'object') return null;
  if ('data' in payload && payload.data !== undefined) {
    return payload.data as T;
  }
  return payload as T;
}

/** Backend list shape: `{ items, total, page, limit }` inside envelope `data`. */
function isItemsPagePayload(inner: safeAny): boolean {
  return (
    inner != null &&
    typeof inner === 'object' &&
    Array.isArray(inner.items) &&
    (typeof inner.total === 'number' || inner.total === undefined)
  );
}

/**
 * Maps API dispute rows (payInOrderId + payInOrder) to the UI model (transactionId + transaction).
 */
export function mapDisputeRow(raw: safeAny): TransactionDispute {
  const payIn = raw?.payInOrder;
  let transactionId =
    raw?.transactionId != null ? String(raw.transactionId) : '';
  if (!transactionId && payIn?.id != null) {
    transactionId = String(payIn.id);
  }
  if (!transactionId && raw?.payInOrderId != null) {
    transactionId = String(raw.payInOrderId);
  }

  const transaction =
    raw?.transaction ??
    (payIn
      ? {
          id: String(payIn.id),
          user: payIn.user
            ? {
                id: String(payIn.user.id),
                fullName: payIn.user.fullName as string | undefined,
              }
            : undefined,
          payInOrder: {
            id: String(payIn.id),
            orderId: payIn.orderId as string | undefined,
            amount:
              payIn.amount != null ? String(payIn.amount) : undefined,
          },
        }
      : undefined);

  return {
    ...raw,
    transactionId,
    ...(transaction ? { transaction } : {}),
  } as TransactionDispute;
}

function normalizePaginated(
  inner: safeAny,
): DisputesPaginatedPayload | null {
  if (inner == null) return null;
  if (isItemsPagePayload(inner)) {
    const data = (inner.items as safeAny[]).map((row) => mapDisputeRow(row));
    return {
      data,
      pagination: {
        totalItems:
          typeof inner.total === 'number' ? inner.total : data.length,
        page: typeof inner.page === 'number' ? inner.page : 1,
        limit: typeof inner.limit === 'number' ? inner.limit : data.length,
      },
    };
  }
  if (Array.isArray(inner)) {
    return {
      data: (inner as safeAny[]).map((row) => mapDisputeRow(row)),
      pagination: {
        totalItems: inner.length,
        page: 1,
        limit: inner.length,
      },
    };
  }
  if (Array.isArray(inner.data) && inner.pagination) {
    const rows = inner.data as safeAny[];
    return {
      data: rows.map((row) => mapDisputeRow(row)),
      pagination: {
        totalItems: inner.pagination.totalItems ?? rows.length,
        page: inner.pagination.page ?? 1,
        limit: inner.pagination.limit ?? rows.length,
      },
    };
  }
  if (Array.isArray(inner.data) && !inner.pagination) {
    const rows = inner.data as safeAny[];
    return {
      data: rows.map((row) => mapDisputeRow(row)),
      pagination: {
        totalItems: rows.length,
        page: 1,
        limit: rows.length,
      },
    };
  }
  if (
    inner.data &&
    typeof inner.data === 'object' &&
    Array.isArray(inner.data.data)
  ) {
    return {
      data: (inner.data.data as safeAny[]).map((row) => mapDisputeRow(row)),
      pagination: inner.data.pagination || {
        totalItems: inner.data.data.length,
        page: 1,
        limit: inner.data.data.length,
      },
    };
  }
  if (
    inner.data &&
    typeof inner.data === 'object' &&
    isItemsPagePayload(inner.data)
  ) {
    return normalizePaginated(inner.data);
  }
  return null;
}

function normalizeSingleDispute(inner: safeAny): TransactionDispute | null {
  if (inner == null) return null;
  const raw =
    inner.id &&
    (inner.transactionId != null ||
      inner.payInOrderId != null ||
      inner.payInOrder != null)
      ? inner
      : inner.data?.id != null
        ? inner.data
        : null;
  if (!raw) return null;
  return mapDisputeRow(raw);
}

export type AdminDisputesListParams = {
  page: number;
  limit: number;
  sort?: string;
  order?: 'ASC' | 'DESC';
  /** Optional server-side filter; ignored if backend does not support it */
  merchantUserId?: string;
};

export const callAdminListDisputes = async (
  params: AdminDisputesListParams,
): Promise<[DisputesPaginatedPayload | null, safeAny]> => {
  const search = new URLSearchParams({
    page: String(params.page),
    limit: String(params.limit),
  });
  if (params.sort) search.set('sort', params.sort);
  if (params.order) search.set('order', params.order);
  if (params.merchantUserId?.trim()) {
    search.set('merchantUserId', params.merchantUserId.trim());
  }

  const [response, error] = await resolvePBApi<safeAny>(
    () =>
      axios.get(
        `${baseUrl}/${TRANSACTION_DISPUTES_ADMIN_BASE}/disputes?${search.toString()}`,
      ),
    false,
    true,
    false,
  );
  if (error || response == null) return [null, error];
  const inner = unwrapInner<safeAny>(response);
  const normalized = normalizePaginated(inner ?? response);
  return [normalized, null];
};

export const callAdminGetDisputeById = async (
  disputeId: string,
): Promise<[TransactionDispute | null, safeAny]> => {
  const [response, error] = await resolvePBApi<safeAny>(
    () =>
      axios.get(
        `${baseUrl}/${TRANSACTION_DISPUTES_ADMIN_BASE}/disputes/${encodeURIComponent(disputeId)}`,
      ),
    false,
    true,
    false,
  );
  if (error || response == null) return [null, error];
  const inner = unwrapInner<safeAny>(response);
  return [normalizeSingleDispute(inner ?? response), null];
};

export const callAdminGetDisputeByTransactionId = async (
  transactionId: string,
): Promise<[TransactionDispute | null, safeAny]> => {
  const [response, error] = await resolvePBApi<safeAny>(
    () =>
      axios.get(
        `${baseUrl}/${TRANSACTION_DISPUTES_ADMIN_BASE}/${encodeURIComponent(transactionId)}/disputes`,
      ),
    false,
    true,
    false,
  );
  if (error || response == null) return [null, error];
  const inner = unwrapInner<safeAny>(response);
  return [normalizeSingleDispute(inner ?? response), null];
};

export const callAdminCreateDispute = async (
  transactionId: string,
  body: CreateTransactionDisputeDto,
): Promise<[TransactionDispute | null, safeAny]> => {
  const [response, error] = await resolvePBApi<safeAny>(
    () =>
      axios.post(
        `${baseUrl}/${TRANSACTION_DISPUTES_ADMIN_BASE}/${encodeURIComponent(transactionId)}/disputes`,
        body,
      ),
    false,
    false,
    false,
  );
  if (error || response == null) return [null, error];
  const inner = unwrapInner<safeAny>(response);
  return [normalizeSingleDispute(inner ?? response), null];
};

export const callAdminPatchCyberLegalLayer = async (
  disputeId: string,
  body: CyberLegalLayerDto,
): Promise<[TransactionDispute | null, safeAny]> => {
  const [response, error] = await resolvePBApi<safeAny>(
    () =>
      axios.patch(
        `${baseUrl}/${TRANSACTION_DISPUTES_ADMIN_BASE}/disputes/${encodeURIComponent(disputeId)}/cyber-legal-layer`,
        body,
      ),
    false,
    false,
    false,
  );
  if (error || response == null) return [null, error];
  const inner = unwrapInner<safeAny>(response);
  return [normalizeSingleDispute(inner ?? response), null];
};

export type MerchantDisputesListParams = {
  page: number;
  limit: number;
  sort?: string;
  order?: 'ASC' | 'DESC';
};

export const callMerchantListDisputes = async (
  params: MerchantDisputesListParams,
): Promise<[DisputesPaginatedPayload | null, safeAny]> => {
  const search = new URLSearchParams({
    page: String(params.page),
    limit: String(params.limit),
  });
  if (params.sort) search.set('sort', params.sort);
  if (params.order) search.set('order', params.order);

  const [response, error] = await resolvePBApi<safeAny>(
    () =>
      axios.get(
        `${baseUrl}/${TRANSACTION_DISPUTES_MERCHANT_BASE}/disputes?${search.toString()}`,
      ),
    false,
    true,
    false,
  );
  if (error || response == null) return [null, error];
  const inner = unwrapInner<safeAny>(response);
  const normalized = normalizePaginated(inner ?? response);
  return [normalized, null];
};

export const callMerchantGetDisputeById = async (
  disputeId: string,
): Promise<[TransactionDispute | null, safeAny]> => {
  const [response, error] = await resolvePBApi<safeAny>(
    () =>
      axios.get(
        `${baseUrl}/${TRANSACTION_DISPUTES_MERCHANT_BASE}/disputes/${encodeURIComponent(disputeId)}`,
      ),
    false,
    true,
    false,
  );
  if (error || response == null) return [null, error];
  const inner = unwrapInner<safeAny>(response);
  return [normalizeSingleDispute(inner ?? response), null];
};

export const callMerchantGetDisputeByTransactionId = async (
  transactionId: string,
): Promise<[TransactionDispute | null, safeAny]> => {
  const [response, error] = await resolvePBApi<safeAny>(
    () =>
      axios.get(
        `${baseUrl}/${TRANSACTION_DISPUTES_MERCHANT_BASE}/${encodeURIComponent(transactionId)}/disputes`,
      ),
    false,
    true,
    false,
  );
  if (error || response == null) return [null, error];
  const inner = unwrapInner<safeAny>(response);
  return [normalizeSingleDispute(inner ?? response), null];
};

export const callMerchantChargebackDecision = async (
  disputeId: string,
  body: ChargebackDecisionDto,
): Promise<[TransactionDispute | null, safeAny]> => {
  const [response, error] = await resolvePBApi<safeAny>(
    () =>
      axios.patch(
        `${baseUrl}/${TRANSACTION_DISPUTES_MERCHANT_BASE}/disputes/${encodeURIComponent(disputeId)}/chargeback-decision`,
        body,
      ),
    false,
    false,
    false,
  );
  if (error || response == null) return [null, error];
  const inner = unwrapInner<safeAny>(response);
  return [normalizeSingleDispute(inner ?? response), null];
};

export const callMerchantCyberNoc = async (
  disputeId: string,
  body: CyberNocDto,
): Promise<[TransactionDispute | null, safeAny]> => {
  const [response, error] = await resolvePBApi<safeAny>(
    () =>
      axios.patch(
        `${baseUrl}/${TRANSACTION_DISPUTES_MERCHANT_BASE}/disputes/${encodeURIComponent(disputeId)}/cyber-noc`,
        body,
      ),
    false,
    false,
    false,
  );
  if (error || response == null) return [null, error];
  const inner = unwrapInner<safeAny>(response);
  return [normalizeSingleDispute(inner ?? response), null];
};
