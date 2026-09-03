import { INVOICE_STATUS } from '../enum';

// ─── Recurring invoice config ─────────────────────────────────────────────────

export type RecurringFrequency = 'WEEKLY' | 'MONTHLY' | 'QUARTERLY';

export interface RecurringConfig {
  frequency: RecurringFrequency;
  /** How many frequency-units between each invoice. */
  interval: number;
  endDate?: string;
  nextInvoiceDate?: string;
}

// ─── Request DTOs ─────────────────────────────────────────────────────────────

export interface IInvoiceRequest {
  id?: string;
  customerId: string;
  invoiceNumber: string;
  description: string;
  issueDate?: Date;
  expiryDate?: Date;
  totalAmount?: number;
  customerNotes: string;
  termsAndServices: string;
  billingAddress: string;
  items: IInvoiceItems[];
  isRecurring?: boolean;
  recurringConfig?: RecurringConfig;
  includeBankDetails?: boolean;
}

export interface IInvoiceItems {
  id: string;
  invoiceItemId?: string;
  quantity: number;
  price?: number;
  /** GST rate slab in % — 0 / 5 / 12 / 18 / 28 */
  gstRate?: number;
  total?: number;
}

// ─── Response — list / detail ─────────────────────────────────────────────────

export interface IInvoiceResponse {
  data: {
    data: IInvoice[];
    pagination: {
      totalItems: number;
    };
  };
}

export interface IInvoiceDetails {
  data: IInvoice;
}

// ─── Core models ──────────────────────────────────────────────────────────────

export interface IInvoice {
  id: string;
  createdAt: Date;
  /** Pre-tax subtotal (sum of rate × qty across all items). */
  subtotalAmount?: number;
  cgstAmount?: number;
  sgstAmount?: number;
  igstAmount?: number;
  totalTaxAmount?: number;
  totalAmount: number;
  status: INVOICE_STATUS;
  invoiceNumber: string;
  customer: ICustomer;
  description: string;
  issueDate: Date;
  expiryDate: Date;
  customerNotes: string;
  termsAndServices: string;
  billingAddress: string;
  paymentLink?: string;
  items: IInvoiceItem[];
  /** Set when the customer opens the invoice. */
  viewedAt?: Date | null;
  /** Set when the merchant marks the invoice as paid. */
  paidAt?: Date | null;
  /** Timestamp of the last reminder email sent. */
  reminderSentAt?: Date | null;
  isRecurring?: boolean;
  recurringConfig?: RecurringConfig | null;
  /** True when the invoice has been unpaid for 30+ days — returned by backend. */
  isFinancingEligible?: boolean;
  includeBankDetails?: boolean;
}

export interface IInvoiceItem {
  id: string;
  quantity: number;
  item: IItem;
  /** Unit price snapshot at invoice creation time. */
  rate?: number;
  /** GST slab applied — 0 / 5 / 12 / 18 / 28 */
  gstRate?: number;
  taxableAmount?: number;
  cgstAmount?: number;
  sgstAmount?: number;
  igstAmount?: number;
  totalAmount?: number;
  description?: string | null;
}

export interface ICustomer {
  id: string;
  name: string;
  email: string;
  contactNumber: string;
}

// ─── Item ─────────────────────────────────────────────────────────────────────

export interface IItem {
  id?: string;
  name: string;
  description: string;
  price: number;
  /** GST rate slab in % — 0 / 5 / 12 / 18 / 28 */
  gstRate: number;
  hsnCode?: string;
}

export interface IItemResponse {
  data: {
    data: IItem[];
    pagination: {
      totalItems: number;
    };
  };
}

// ─── Filters ──────────────────────────────────────────────────────────────────

export interface IInvoiceFilters {
  status?: string;
  date?: string;
  search?: string;
  page?: number;
  limit?: number;
}
