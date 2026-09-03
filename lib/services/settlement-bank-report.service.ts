import axios from '@/app/api/axios';
import { resolvePBApi } from '../utils/common-utils';
import { safeAny } from '../interfaces/global.interface';
import { SETTLEMENTS_BANK_REPORT_BASE } from '../constants/apiConstants/apiConstants';
import type {
  BankReportFormatItem,
  BankReportFormatsResponse,
  BankReportFormatRegisterResponse,
  BankReportImportResponse,
} from '../interfaces/settlement-bank-report.interface';

const baseUrl = process.env.NEXT_PUBLIC_DEV_PB_BASE_URL;

export type SettlementBankMatchKeyBody = {
  matchKey: string;
  providerCode?: string;
};

/** Supports flat `{ formats }` or wrapped `{ data: { formats } }` (common Nest envelope). */
function extractFormatsList(payload: safeAny): BankReportFormatItem[] {
  if (payload == null || typeof payload !== 'object') return [];
  if (Array.isArray(payload.formats)) {
    return payload.formats as BankReportFormatItem[];
  }
  const inner = payload.data;
  if (inner != null && typeof inner === 'object' && Array.isArray(inner.formats)) {
    return inner.formats as BankReportFormatItem[];
  }
  if (
    inner != null &&
    typeof inner === 'object' &&
    inner.data != null &&
    typeof inner.data === 'object' &&
    Array.isArray((inner.data as { formats?: unknown }).formats)
  ) {
    return (inner.data as { formats: BankReportFormatItem[] }).formats;
  }
  return [];
}

/** GET …/bank-report/formats */
export const callListBankReportFormats = async (): Promise<
  [BankReportFormatsResponse | null, safeAny]
> => {
  const [response, error] = await resolvePBApi<safeAny>(
    () =>
      axios.get<safeAny>(`${baseUrl}/${SETTLEMENTS_BANK_REPORT_BASE}/formats`),
    false,
    true,
    false,
  );
  if (error || response == null) return [null, error];
  return [{ formats: extractFormatsList(response) }, null];
};

/** POST …/bank-report/formats — register or replace custom format (JSON body). */
export const callRegisterBankReportFormat = async (
  definition: safeAny,
): Promise<[BankReportFormatRegisterResponse | null, safeAny]> => {
  const [response, error] = await resolvePBApi<BankReportFormatRegisterResponse>(
    () =>
      axios.post<BankReportFormatRegisterResponse>(
        `${baseUrl}/${SETTLEMENTS_BANK_REPORT_BASE}/formats`,
        definition,
        { headers: { 'Content-Type': 'application/json' } },
      ),
    false,
    true,
    false,
  );
  return [response, error];
};

/** PATCH …/users/:userId/match-key */
export const callSetSettlementBankMatchKey = async (
  userId: string,
  body: SettlementBankMatchKeyBody,
): Promise<[safeAny | null, safeAny]> => {
  const [response, error] = await resolvePBApi<safeAny>(
    () =>
      axios.patch<safeAny>(
        `${baseUrl}/${SETTLEMENTS_BANK_REPORT_BASE}/users/${encodeURIComponent(userId)}/match-key`,
        body,
      ),
    false,
    true,
    false,
  );
  return [response, error];
};

/**
 * POST …/import
 *
 * Wire format: multipart/form-data (not JSON). Single part named `file` — the raw CSV
 * `File` from the browser (bytes as on disk; typically text/csv). `formatId` and optional
 * `dryRun` are sent as axios `params` (query string). Set `Content-Type: multipart/form-data`
 * on the request so the shared axios default (`application/json`) does not override FormData
 * (same approach as `callUploadBankStatement` in platform-billing-service).
 *
 * This differs from bulk payout: payout XLSX is parsed in the browser (xlsx → JSON) and
 * the API receives JSON `{ data: [...] }`. Here the server must parse the CSV using the
 * selected format definition, so the file must be uploaded as multipart.
 */
export const callImportSettlementBankReport = async (
  file: File,
  formatId: string,
  dryRun: boolean,
): Promise<[BankReportImportResponse | null, safeAny]> => {
  const formData = new FormData();
  formData.append('file', file, file.name);
  const [response, error] = await resolvePBApi<BankReportImportResponse>(
    () =>
      axios.post<BankReportImportResponse>(
        `${baseUrl}/${SETTLEMENTS_BANK_REPORT_BASE}/import`,
        formData,
        {
          params: {
            formatId,
            ...(dryRun ? { dryRun: 'true' } : {}),
          },
          headers: { 'Content-Type': 'multipart/form-data' },
        },
      ),
    false,
    true,
    false,
  );
  return [response, error];
};
