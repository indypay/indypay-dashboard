import axios from '@/app/api/axios';
import { resolvePBApi } from '../utils/common-utils';
import { safeAny } from '../interfaces/global.interface';
import {
  IPlatformInvoice,
  IPlatformInvoiceListResponse,
  IPlatformMonthlySummary,
  IChargesPreview,
  IReconResult,
} from '../interfaces/platform-billing.interface';
import {
  PLATFORM_BILLING_INVOICES,
  PLATFORM_BILLING_SUMMARY,
  PLATFORM_BILLING_PREVIEW,
  PLATFORM_BILLING_GENERATE,
  PLATFORM_BILLING_SEND,
  PLATFORM_BILLING_RECONCILE_UPLOAD,
  PLATFORM_BILLING_RECONCILE_RUN,
  PLATFORM_BILLING_RECONCILE_GET,
  PLATFORM_BILLING_RECONCILE_TAX_INVOICES,
} from '../constants/apiConstants/apiConstants';

const baseUrl = process.env.NEXT_PUBLIC_DEV_PB_BASE_URL;

export const callGetPlatformInvoices = async (
  billingMonth?: string,
  status?: string,
  merchantId?: string,
  page = 1,
  limit = 20,
): Promise<[IPlatformInvoiceListResponse | null, safeAny]> => {
  const params = new URLSearchParams();
  params.set('page', String(page));
  params.set('limit', String(limit));
  if (billingMonth) params.set('billingMonth', billingMonth);
  if (status) params.set('status', status);
  if (merchantId) params.set('merchantId', merchantId);

  const [response, error] = await resolvePBApi<IPlatformInvoiceListResponse>(
    () => axios.get<IPlatformInvoiceListResponse>(`${baseUrl}/${PLATFORM_BILLING_INVOICES}?${params}`),
    false, true, false,
  );
  return [response, error];
};

export const callGetPlatformInvoice = async (
  id: string,
): Promise<[IPlatformInvoice | null, safeAny]> => {
  const [response, error] = await resolvePBApi<IPlatformInvoice>(
    () => axios.get<IPlatformInvoice>(`${baseUrl}/${PLATFORM_BILLING_INVOICES}/${id}`),
    false, true, false,
  );
  return [response, error];
};

export const callGetMonthlySummary = async (
  billingMonth: string,
): Promise<[IPlatformMonthlySummary | null, safeAny]> => {
  const [response, error] = await resolvePBApi<IPlatformMonthlySummary>(
    () => axios.get<IPlatformMonthlySummary>(`${baseUrl}/${PLATFORM_BILLING_SUMMARY}/${billingMonth}`),
    false, true, false,
  );
  return [response, error];
};

export const callGetChargesPreview = async (
  merchantId: string,
  year: number,
  month: number,
): Promise<[IChargesPreview | null, safeAny]> => {
  const [response, error] = await resolvePBApi<IChargesPreview>(
    () => axios.get<IChargesPreview>(
      `${baseUrl}/${PLATFORM_BILLING_PREVIEW}?merchantId=${merchantId}&year=${year}&month=${month}`,
    ),
    false, true, false,
  );
  return [response, error];
};

export const callGenerateInvoices = async (
  year: number,
  month: number,
  merchantId?: string,
): Promise<[safeAny | null, safeAny]> => {
  const [response, error] = await resolvePBApi<safeAny>(
    () => axios.post<safeAny>(`${baseUrl}/${PLATFORM_BILLING_GENERATE}`, { year, month, merchantId }),
    false, true, false,
  );
  return [response, error];
};

export const callSendInvoice = async (
  invoiceId: string,
): Promise<[safeAny | null, safeAny]> => {
  const [response, error] = await resolvePBApi<safeAny>(
    () => axios.post<safeAny>(`${baseUrl}/${PLATFORM_BILLING_SEND}/${invoiceId}/send`, {}),
    false, true, false,
  );
  return [response, error];
};

export const callUploadBankStatement = async (
  billingMonth: string,
  file: File,
): Promise<[{ count: number } | null, safeAny]> => {
  const formData = new FormData();
  formData.append('file', file);
  const [response, error] = await resolvePBApi<{ count: number }>(
    () => axios.post<{ count: number }>(
      `${baseUrl}/${PLATFORM_BILLING_RECONCILE_UPLOAD}/${billingMonth}/upload`,
      formData,
      { headers: { 'Content-Type': 'multipart/form-data' } },
    ),
    false, true, false,
  );
  return [response, error];
};

export const callRunReconciliation = async (
  billingMonth: string,
): Promise<[{ summary: safeAny; totalResults: number } | null, safeAny]> => {
  const [response, error] = await resolvePBApi<{ summary: safeAny; totalResults: number }>(
    () => axios.post<safeAny>(`${baseUrl}/${PLATFORM_BILLING_RECONCILE_RUN}/${billingMonth}/run`, {}),
    false, true, false,
  );
  return [response, error];
};

export const callGenerateTaxInvoices = async (
  billingMonth: string,
): Promise<[{ generated: number; skipped: number; errors: number } | null, safeAny]> => {
  const [response, error] = await resolvePBApi<{ generated: number; skipped: number; errors: number }>(
    () => axios.post<safeAny>(
      `${baseUrl}/${PLATFORM_BILLING_RECONCILE_TAX_INVOICES}/${billingMonth}/generate-tax-invoices`,
      {},
    ),
    false, true, false,
  );
  return [response, error];
};

export const callGetReconciliationResults = async (
  billingMonth: string,
): Promise<[IReconResult[] | null, safeAny]> => {
  const [response, error] = await resolvePBApi<IReconResult[]>(
    () => axios.get<IReconResult[]>(`${baseUrl}/${PLATFORM_BILLING_RECONCILE_GET}/${billingMonth}`),
    false, true, false,
  );
  return [response, error];
};
