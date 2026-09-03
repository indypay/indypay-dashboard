import { safeAny } from '@/lib/interfaces/global.interface';

export interface BankReportFormatItem {
  id: string;
  displayName: string;
}

export interface BankReportFormatsResponse {
  formats: BankReportFormatItem[];
}

export interface BankReportFormatRegisterResponse {
  ok: boolean;
  id: string;
  displayName: string;
}

export interface BankReportMatchKeyResponse {
  ok: boolean;
  userId: string;
  providerCode: string;
  externalUserKey: string;
}

export interface BankReportImportErrorRow {
  line: number;
  message: string;
}

export interface BankReportImportUnmatchedSample {
  line?: number;
  apiUser?: string;
  clientReferenceId?: string;
  amount?: number;
  [key: string]: safeAny;
}

export interface BankReportImportResponse {
  formatId: string;
  dryRun: boolean;
  rowsRead: number;
  created: number;
  skippedNoAmount: number;
  skippedDuplicate: number;
  skippedMissingUser: number;
  errors: BankReportImportErrorRow[];
  unmatchedSamples: BankReportImportUnmatchedSample[];
}
