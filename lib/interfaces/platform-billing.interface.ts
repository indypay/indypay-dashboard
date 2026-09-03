export type PlatformInvoiceStatus = 'DRAFT' | 'SENT' | 'PAID' | 'DISPUTED' | 'CANCELLED';
export type ReconMatchStatus = 'MATCHED' | 'PARTIAL' | 'UNMATCHED' | 'EXCESS';

export interface IPlatformLineItem {
  id: string;
  type: 'PAYIN_COMMISSION' | 'PAYOUT_COMMISSION' | 'PLATFORM_FEE';
  description: string;
  sacCode: string;
  txnCount: number;
  taxableAmount: number;
  gstRate: number;
  cgstAmount: number;
  sgstAmount: number;
  igstAmount: number;
  totalAmount: number;
}

export interface IPlatformInvoice {
  id: string;
  invoiceNumber: string;
  merchantId: string;
  billingMonth: string;
  subtotalAmount: number;
  cgstAmount: number;
  sgstAmount: number;
  igstAmount: number;
  totalTaxAmount: number;
  totalAmount: number;
  status: PlatformInvoiceStatus;
  pdfS3Key: string | null;
  aiSummary: string | null;
  sentAt: string | null;
  paidAt: string | null;
  lineItems?: IPlatformLineItem[];
  merchant?: {
    id: string;
    fullName: string;
    email: string;
    businessDetails?: { businessName: string; gstin: string };
    address?: { address: string; city: string; state: string; pincode: string };
  };
  createdAt: string;
  updatedAt: string;
}

export interface IPlatformInvoiceListResponse {
  data: IPlatformInvoice[];
  total: number;
  page: number;
  limit: number;
}

export interface IPlatformMonthlySummary {
  DRAFT?: { count: number; total: number };
  SENT?: { count: number; total: number };
  PAID?: { count: number; total: number };
  DISPUTED?: { count: number; total: number };
  CANCELLED?: { count: number; total: number };
  grandTotal?: number;
}

export interface IChargesPreview {
  payinCommission: number;
  payinGst: number;
  payinTxnCount: number;
  payoutCommission: number;
  payoutGst: number;
  payoutTxnCount: number;
  subtotal: number;
  totalGst: number;
  total: number;
  isInterState: boolean;
}

export interface IBankEntry {
  id: string;
  billingMonth: string;
  valueDate: string;
  description: string;
  credit: number;
  debit: number;
  balance: number | null;
  utr: string | null;
  createdAt: string;
}

export interface IReconResult {
  id: string;
  billingMonth: string;
  platformInvoiceId: string | null;
  bankEntryId: string | null;
  matchStatus: ReconMatchStatus;
  invoiceAmount: number | null;
  bankAmount: number | null;
  difference: number;
  confidenceScore: number;
  aiExplanation: string | null;
  resolvedAt: string | null;
  invoice?: IPlatformInvoice | null;
  bankEntry?: IBankEntry | null;
  createdAt: string;
}
