import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { safeAny } from '../interfaces/global.interface';
import {
  IPlatformInvoice,
  IPlatformInvoiceListResponse,
  IPlatformMonthlySummary,
  IReconResult,
} from '../interfaces/platform-billing.interface';
import {
  callGetPlatformInvoices,
  callGetPlatformInvoice,
  callGetMonthlySummary,
  callGetReconciliationResults,
} from '../services/platform-billing-service';

export const usePlatformInvoices = (
  billingMonth?: string,
  status?: string,
  merchantId?: string,
  page = 1,
  limit = 20,
): UseQueryResult<[IPlatformInvoiceListResponse | null, safeAny], Error> => {
  return useQuery({
    queryKey: ['platform-invoices', billingMonth, status, merchantId, page, limit],
    queryFn: () => callGetPlatformInvoices(billingMonth, status, merchantId, page, limit),
    refetchOnWindowFocus: true,
  });
};

export const usePlatformInvoice = (
  id: string,
): UseQueryResult<[IPlatformInvoice | null, safeAny], Error> => {
  return useQuery({
    queryKey: ['platform-invoice', id],
    queryFn: () => callGetPlatformInvoice(id),
    refetchOnWindowFocus: true,
    enabled: !!id,
  });
};

export const useMonthlySummary = (
  billingMonth: string,
): UseQueryResult<[IPlatformMonthlySummary | null, safeAny], Error> => {
  return useQuery({
    queryKey: ['platform-billing-summary', billingMonth],
    queryFn: () => callGetMonthlySummary(billingMonth),
    refetchOnWindowFocus: true,
    enabled: !!billingMonth,
  });
};

export const useReconciliationResults = (
  billingMonth: string,
): UseQueryResult<[IReconResult[] | null, safeAny], Error> => {
  return useQuery({
    queryKey: ['reconciliation-results', billingMonth],
    queryFn: () => callGetReconciliationResults(billingMonth),
    refetchOnWindowFocus: true,
    enabled: !!billingMonth,
  });
};
