import {
  useMutation,
  useQuery,
  useQueryClient,
  UseQueryResult,
} from '@tanstack/react-query';
import {
  ICustomerList,
  ICustomerRequest,
} from '../interfaces/customer.interface';
import { safeAny } from '../interfaces/global.interface';
import {
  callAddCustomer,
  callCreateInvoice,
  callCreateItem,
  callDeleteInvoice,
  callDeleteItem,
  callFinalizeInvoice,
  callGetAllCustomersMerchant,
  callGetCustomer,
  callGetInvoiceDetails,
  callGetInvoices,
  callGetItemById,
  callGetItems,
  callMarkInvoicePaid,
  callSendInvoiceReminder,
  callMarkInvoiceViewed,
  callUpdateInvoiceItemPrice,
} from '../services/invoice-service';
import {
  IInvoiceRequest,
  IItem,
  IInvoiceFilters,
} from '../interfaces/invoice.interface';

export const getCustomersList = (): UseQueryResult<
  [ICustomerList | null, safeAny],
  Error
> => {
  return useQuery({
    queryKey: ['customers-list'],
    queryFn: () => callGetAllCustomersMerchant(),
    refetchOnWindowFocus: true,
  });
};

export const addCustomer = () => {
  return useMutation({
    mutationKey: ['add-customer'],
    mutationFn: (customerDetails: ICustomerRequest) =>
      callAddCustomer(customerDetails),
  });
};

export const getCustomer = () => {
  return useMutation({
    mutationKey: ['customer'],
    mutationFn: (customerId: string) => callGetCustomer(customerId),
  });
};

export const createInvoice = () => {
  return useMutation({
    mutationKey: ['create-invoice'],
    mutationFn: (invoiceDetails: IInvoiceRequest) =>
      callCreateInvoice(invoiceDetails),
  });
};

export const finalizeInvoice = () => {
  return useMutation({
    mutationKey: ['finalize-invoice'],
    mutationFn: (invoiceDetails: IInvoiceRequest) =>
      callFinalizeInvoice(invoiceDetails),
  });
};

export const deleteInvoice = () => {
  return useMutation({
    mutationKey: ['delete-invoice'],
    mutationFn: (invoiceId: string) => callDeleteInvoice(invoiceId),
  });
};

export const getInvoices = (filters: IInvoiceFilters) => {
  return useQuery({
    queryKey: ['invoices', filters],
    queryFn: () => callGetInvoices(filters),
  });
};

export const getInvoiceDetails = (invoiceId: string) => {
  return useQuery({
    queryKey: ['invoice-details', invoiceId],
    queryFn: () => callGetInvoiceDetails(invoiceId),
  });
};

/** Mark an invoice as paid. Invalidates the invoices list on success. */
export const useMarkInvoicePaid = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ['mark-invoice-paid'],
    mutationFn: (invoiceId: string) => callMarkInvoicePaid(invoiceId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['invoices'] });
      queryClient.invalidateQueries({ queryKey: ['invoice-details'] });
    },
  });
};

/** Send a one-click payment reminder to the customer. */
export const useSendInvoiceReminder = () => {
  return useMutation({
    mutationKey: ['send-invoice-reminder'],
    mutationFn: (invoiceId: string) => callSendInvoiceReminder(invoiceId),
  });
};

/**
 * Track that the customer has viewed the invoice.
 * Call this on the public invoice page load.
 */
export const useMarkInvoiceViewed = () => {
  return useMutation({
    mutationKey: ['mark-invoice-viewed'],
    mutationFn: (invoiceId: string) => callMarkInvoiceViewed(invoiceId),
  });
};

export const getItems = () => {
  return useQuery({
    queryKey: ['items'],
    queryFn: () => callGetItems(),
  });
};

export const getItemById = (id: string) => {
  return useQuery({
    queryKey: ['item-by-id', id],
    queryFn: () => callGetItemById(id),
  });
};

export const createItem = () => {
  return useMutation({
    mutationKey: ['create-item'],
    mutationFn: (itemDetails: IItem) => callCreateItem(itemDetails),
  });
};

export const deleteItem = () => {
  return useMutation({
    mutationKey: ['delete-item'],
    mutationFn: (itemId: string) => callDeleteItem(itemId),
  });
};

export const updateInvoiceItemPrice = () => {
  return useMutation({
    mutationKey: ['update-invoice-item-price'],
    mutationFn: ({
      invoiceId,
      invoiceItemId,
      price,
    }: {
      invoiceId: string;
      invoiceItemId: string;
      price: number;
    }) => callUpdateInvoiceItemPrice(invoiceId, invoiceItemId, price),
  });
};
