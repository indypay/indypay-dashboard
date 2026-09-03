import {
  IInvoice,
  IInvoiceItem,
  IInvoiceItems,
} from '@/lib/interfaces/invoice.interface';

function coerceBooleanFlag(value: unknown): boolean {
  if (value === true || value === 1) return true;
  if (typeof value === 'string') {
    const normalized = value.trim().toLowerCase();
    return normalized === 'true' || normalized === '1' || normalized === 'yes';
  }
  return false;
}

/** Whether to show Rupeeflow bank transfer details on the invoice. */
export function shouldShowInvoiceBankDetails(
  invoice: Partial<IInvoice> | Record<string, unknown>,
): boolean {
  const record = invoice as Record<string, unknown>;
  const raw =
    record.includeBankDetails ??
    record.include_bank_details ??
    record.showBankDetails ??
    record.show_bank_details;

  return coerceBooleanFlag(raw);
}

export function normalizeInvoiceFromApi(invoice: IInvoice): IInvoice {
  return {
    ...invoice,
    includeBankDetails: shouldShowInvoiceBankDetails(invoice),
  };
}

export type InvoiceLineItemDisplay = {
  name: string;
  description: string;
  price: number;
  quantity: number;
  hsnCode: string;
};

export function escapeInvoiceHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

/** Resolve display fields for a single invoice line item (UI + PDF). */
export function getInvoiceLineItemDisplay(
  invoiceItem: IInvoiceItem,
  index: number,
): InvoiceLineItemDisplay {
  const item = invoiceItem.item;
  const name =
    item?.name?.trim() ||
    (invoiceItem as IInvoiceItem & { name?: string }).name?.trim() ||
    `Item ${index + 1}`;

  const description =
    invoiceItem.description?.trim() || item?.description?.trim() || '';

  const price = Number(item?.price ?? invoiceItem.rate ?? 0) || 0;
  const quantity = Number(invoiceItem.quantity) || 1;
  const hsnCode = item?.hsnCode?.trim() || '-';

  return { name, description, price, quantity, hsnCode };
}

/** Item name + optional description for PDF/HTML invoice tables. */
export function renderInvoiceItemNameCellHtml(
  name: string,
  description?: string,
): string {
  const desc =
    description?.trim() ?
      `<div class="item-desc">${escapeInvoiceHtml(description.trim())}</div>`
    : '';
  return `<div class="item-name">${escapeInvoiceHtml(name)}</div>${desc}`;
}

/** Coerce invoice line items to numeric fields expected by the API. */
export function normalizeInvoiceItemsForApi(
  items: IInvoiceItems[],
): IInvoiceItems[] {
  return items.map((item) => ({
    id: item.id,
    ...(item.invoiceItemId ? { invoiceItemId: item.invoiceItemId } : {}),
    quantity: Number(item.quantity) || 0,
    price: Number(item.price) || 0,
    ...(item.gstRate != null && item.gstRate !== undefined
      ? { gstRate: Number(item.gstRate) }
      : {}),
    ...(item.total != null && item.total !== undefined
      ? { total: Number(item.total) }
      : {}),
  }));
}
