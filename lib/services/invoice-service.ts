import axios from '@/app/api/axios';
import { IMerchantListResponse } from '../interfaces/merchant-list.interface';
import {
  ICustomerDetailsResponse,
  ICustomerList,
  ICustomerRequest,
  ICustomerResponse,
} from '../interfaces/customer.interface';
import { safeAny } from '../interfaces/global.interface';
import { resolvePBApi } from '../utils/common-utils';
import {
  GET_ALL_CUSTOMERS_ADMIN,
  GET_ALL_CUSTOMERS_MERCHANT,
  ADD_CUSTOMER,
  GET_CUSTOMER,
  CREATE_INVOICE,
  GET_INVOICES,
  GET_ITEMS,
  CREATE_ITEM,
  FINALIZE_INVOICE,
  MARK_INVOICE_PAID,
  SEND_INVOICE_REMINDER,
  MARK_INVOICE_VIEWED,
  UPDATE_INVOICE_ITEM_PRICE,
} from '../constants/apiConstants/apiConstants';
import {
  IItem,
  IInvoiceDetails,
  IInvoiceRequest,
  IInvoiceResponse,
  IItemResponse,
  IInvoiceFilters,
} from '../interfaces/invoice.interface';

const baseUrl = process.env.NEXT_PUBLIC_DEV_PB_BASE_URL;

// ─── Customers ────────────────────────────────────────────────────────────────

export const callGetAllCustomersMerchant = async (): Promise<
  [ICustomerList | null, safeAny]
> => {
  const [response, error] = await resolvePBApi<ICustomerList>(
    () => axios.get<ICustomerList>(`${baseUrl}/${GET_ALL_CUSTOMERS_MERCHANT}`),
    false,
    true,
    false,
  );
  return [response, error];
};

export const callGetAllCustomersAdmin = async (): Promise<
  [IMerchantListResponse | null, safeAny]
> => {
  const [response, error] = await resolvePBApi<IMerchantListResponse>(
    () =>
      axios.get<IMerchantListResponse>(`${baseUrl}/${GET_ALL_CUSTOMERS_ADMIN}`),
    false,
    true,
    false,
  );
  return [response, error];
};

export const callAddCustomer = async (
  data: ICustomerRequest,
): Promise<[ICustomerResponse | null, safeAny]> => {
  const [response, error] = await resolvePBApi<ICustomerResponse>(
    () => axios.post<ICustomerResponse>(`${baseUrl}/${ADD_CUSTOMER}`, data),
    false,
    true,
    false,
  );
  return [response, error];
};

export const callGetCustomer = async (
  customerId: string,
): Promise<[ICustomerDetailsResponse | null, safeAny]> => {
  if (!customerId?.trim()) {
    return [null, null];
  }
  const [response, error] = await resolvePBApi<ICustomerDetailsResponse>(
    () =>
      axios.get<ICustomerDetailsResponse>(
        `${baseUrl}/${GET_CUSTOMER}/${customerId}`,
      ),
    false,
    true,
    false,
  );
  return [response, error];
};

// ─── Invoices ─────────────────────────────────────────────────────────────────

export const callCreateInvoice = async (
  data: IInvoiceRequest,
): Promise<[IInvoiceResponse | null, safeAny]> => {
  const [response, error] = await resolvePBApi<IInvoiceResponse>(
    () => axios.post<IInvoiceResponse>(`${baseUrl}/${CREATE_INVOICE}`, data),
    false,
    true,
    false,
  );
  return [response, error];
};

export const callFinalizeInvoice = async (
  data: IInvoiceRequest,
): Promise<[IInvoiceResponse | null, safeAny]> => {
  const [response, error] = await resolvePBApi<IInvoiceResponse>(
    () => axios.post<IInvoiceResponse>(`${baseUrl}/${FINALIZE_INVOICE}`, data),
    false,
    true,
    false,
  );
  return [response, error];
};

export const callDeleteInvoice = async (
  invoiceId: string,
): Promise<[IInvoiceResponse | null, safeAny]> => {
  const [response, error] = await resolvePBApi<IInvoiceResponse>(
    () =>
      axios.delete<IInvoiceResponse>(`${baseUrl}/${GET_INVOICES}/${invoiceId}`),
    false,
    true,
    false,
  );
  return [response, error];
};

export const callGetInvoices = async (
  filters: IInvoiceFilters,
): Promise<[IInvoiceResponse | null, safeAny]> => {
  const params: Record<string, string | number | undefined> = {
    ...(filters.status && { status: filters.status }),
    ...(filters.date && { date: filters.date }),
    ...(filters.search && { search: filters.search }),
    page: filters.page ?? 1,
    limit: filters.limit ?? 10,
  };
  const [response, error] = await resolvePBApi<IInvoiceResponse>(
    () => axios.get<IInvoiceResponse>(`${baseUrl}/${GET_INVOICES}`, { params }),
    false,
    true,
    false,
  );
  return [response, error];
};

export const callGetInvoiceDetails = async (
  invoiceId: string,
): Promise<[IInvoiceDetails | null, safeAny]> => {
  const [response, error] = await resolvePBApi<IInvoiceDetails>(
    () => axios.get<IInvoiceDetails>(`${baseUrl}/${GET_INVOICES}/${invoiceId}`),
    false,
    true,
    false,
  );
  return [response, error];
};

/** Mark an invoice as paid. Only the owning merchant can call this. */
export const callMarkInvoicePaid = async (
  invoiceId: string,
): Promise<[{ message: string } | null, safeAny]> => {
  const [response, error] = await resolvePBApi<{ message: string }>(
    () =>
      axios.patch<{ message: string }>(
        `${baseUrl}/${MARK_INVOICE_PAID}/${invoiceId}/mark-paid`,
      ),
    false,
    true,
    false,
  );
  return [response, error];
};

/** Send a one-click payment reminder email to the customer. */
export const callSendInvoiceReminder = async (
  invoiceId: string,
): Promise<[{ message: string } | null, safeAny]> => {
  const [response, error] = await resolvePBApi<{ message: string }>(
    () =>
      axios.post<{ message: string }>(
        `${baseUrl}/${SEND_INVOICE_REMINDER}/${invoiceId}/send-reminder`,
      ),
    false,
    true,
    false,
  );
  return [response, error];
};

/**
 * Track that the customer has viewed the invoice.
 * Called from the email open-tracking pixel or the public invoice page.
 */
export const callMarkInvoiceViewed = async (
  invoiceId: string,
): Promise<[{ message: string } | null, safeAny]> => {
  const [response, error] = await resolvePBApi<{ message: string }>(
    () =>
      axios.post<{ message: string }>(
        `${baseUrl}/${MARK_INVOICE_VIEWED}/${invoiceId}/viewed`,
      ),
    false,
    true,
    false,
  );
  return [response, error];
};

// ─── Items ────────────────────────────────────────────────────────────────────

export const callGetItems = async (): Promise<
  [IItemResponse | null, safeAny]
> => {
  const [response, error] = await resolvePBApi<IItemResponse>(
    () => axios.get<IItemResponse>(`${baseUrl}/${GET_ITEMS}`),
    false,
    true,
    false,
  );
  return [response, error];
};

export const callGetItemById = async (
  id: string,
): Promise<[IItem | null, safeAny]> => {
  const [response, error] = await resolvePBApi<IItem>(
    () => axios.get<IItem>(`${baseUrl}/${GET_ITEMS}/${id}`),
    false,
    true,
    false,
  );
  return [response, error];
};

export const callCreateItem = async (
  data: IItem,
): Promise<[IItemResponse | null, safeAny]> => {
  const [response, error] = await resolvePBApi<IItemResponse>(
    () => axios.post<IItemResponse>(`${baseUrl}/${CREATE_ITEM}`, data),
    false,
    true,
    false,
  );
  return [response, error];
};

export const callDeleteItem = async (
  id: string,
): Promise<[IItemResponse | null, safeAny]> => {
  const [response, error] = await resolvePBApi<IItemResponse>(
    () => axios.delete<IItemResponse>(`${baseUrl}/${GET_ITEMS}/${id}`),
    false,
    true,
    false,
  );
  return [response, error];
};

export const callUpdateInvoiceItemPrice = async (
  invoiceId: string,
  invoiceItemId: string,
  price: number,
): Promise<[safeAny | null, safeAny]> => {
  const [response, error] = await resolvePBApi<safeAny>(
    () =>
      axios.patch<safeAny>(
        `${baseUrl}/${UPDATE_INVOICE_ITEM_PRICE}/${invoiceId}/items/${invoiceItemId}/price`,
        { price },
      ),
    false,
    true,
    false,
  );
  return [response, error];
};
