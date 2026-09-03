import httpClient from '@/app/api/axios';
import { safeAny } from '../interfaces/global.interface';
import {
  GET_PAYIN_REPORTS,
  GET_PAYOUT_REPORTS,
  GET_SETTLEMENT_REPORTS,
  GET_DOWNLOAD_HISTORY,
  GET_PAYIN_PAYOUT_REPORTS,
GET_COMBINED_REPORTS,
GET_PAYMENT_LINK_REPORTS,
GET_CHECKOUT_REPORTS,
GET_CHECKOUT_PAGE_REPORTS,
GET_INVOICE_REPORTS,
} from '../constants/apiConstants/apiConstants';

export const postDownloadReports = async (
  userId: string | null,
  search?: string,
  startDate?: string,
  endDate?: string,
  status?: string,
  from?: number,
  count?: number,
): Promise<[ArrayBuffer | null, safeAny]> => {
  const params: Record<string, safeAny> = {};
  if (search) {
    params.search = search;
  }
  if (startDate) {
    params.startDate = startDate;
  }
  if (endDate) {
    params.endDate = endDate;
  }
  if (status) {
    params.status = status.toUpperCase();
  }
  if (from) {
    params.from = from;
  }
  if (count) {
    params.count = count;
  }
  try {
    const response = await httpClient.post(
      `${GET_PAYIN_REPORTS}`,
      {
        userId,
        ...params,
      },
      {
        responseType: 'arraybuffer',
      },
    );

    return [response.data, null];
  } catch (error) {
    return [null, error];
  }
};

export const postDownloadReportsPayout = async (
  userId: string | null,
  search?: string,
  startDate?: string,
  endDate?: string,
  status?: string,
  from?: number,
  count?: number,
): Promise<[ArrayBuffer | null, safeAny]> => {
  const params: Record<string, safeAny> = {};

  if (search) {
    params.search = search;
  }
  if (startDate) {
    params.startDate = startDate;
  }
  if (endDate) {
    params.endDate = endDate;
  }

  if (status) {
    params.status = status;
  }
  if (from) {
    params.from = from;
  }
  if (count) {
    params.count = count;
  }
  try {
    const response = await httpClient.post(
      `${GET_PAYOUT_REPORTS}`,
      {
        userId,
        ...params,
      },
      {
        responseType: 'arraybuffer',
      },
    );
    return [response.data, null];
  } catch (error) {
    return [null, error];
  }
};

export const postDownloadReportsSettlement = async (
  userId: string | null,
  search?: string,
  startDate?: string,
  endDate?: string,
  status?: string,
  from?: number,
  count?: number,
): Promise<[ArrayBuffer | null, safeAny]> => {
  const params: Record<string, safeAny> = {};

  if (search) {
    params.search = search;
  }
  if (startDate) {
    params.startDate = startDate;
  }
  if (endDate) {
    params.endDate = endDate;
  }

  if (status) {
    params.status = status;
  }
  if (from) {
    params.from = from;
  }
  if (count) {
    params.count = count;
  }
  try {
    const response = await httpClient.post(
      `${GET_SETTLEMENT_REPORTS}`,
      {
        userId,
        ...params,
      },
      {
        responseType: 'arraybuffer',
      },
    );
    return [response.data, null];
  } catch (error) {
    return [null, error];
  }
};
export const getDownloadHistory = async (
  userId?: string | null,
): Promise<[safeAny, safeAny]> => {
  try {
    const response = await httpClient.get(GET_DOWNLOAD_HISTORY, {
      params: userId ? { userId } : {},
    });
    return [response.data, null];
  } catch (error) {
    return [null, error];
  }
};
const postGenericReport = async (
  endpoint: string,
  userId: string | null,
  search?: string,
  startDate?: string,
  endDate?: string,
  status?: string,
  from?: number,
  count?: number,
): Promise<[ArrayBuffer | null, safeAny]> => {
  const params: Record<string, safeAny> = {};

  if (search) params.search = search;
  if (startDate) params.startDate = startDate;
  if (endDate) params.endDate = endDate;
  if (status) params.status = status;
  if (from) params.from = from;
  if (count) params.count = count;

  try {
    const response = await httpClient.post(
      endpoint,
      {
        userId,
        ...params,
      },
      {
        responseType: 'arraybuffer',
      },
    );

    return [response.data, null];
  } catch (error) {
    return [null, error];
  }
};
export const postDownloadPayinPayoutReports = (
  userId: string | null,
  search?: string,
  startDate?: string,
  endDate?: string,
  status?: string,
  from?: number,
  count?: number,
) =>
  postGenericReport(
    GET_PAYIN_PAYOUT_REPORTS,
    userId,
    search,
    startDate,
    endDate,
    status,
    from,
    count,
  );

export const postDownloadCombinedReports = (
  userId: string | null,
  search?: string,
  startDate?: string,
  endDate?: string,
  status?: string,
  from?: number,
  count?: number,
) =>
  postGenericReport(
    GET_COMBINED_REPORTS,
    userId,
    search,
    startDate,
    endDate,
    status,
    from,
    count,
  );

export const postDownloadPaymentLinkReports = (
  userId: string | null,
  search?: string,
  startDate?: string,
  endDate?: string,
  status?: string,
  from?: number,
  count?: number,
) =>
  postGenericReport(
    GET_PAYMENT_LINK_REPORTS,
    userId,
    search,
    startDate,
    endDate,
    status,
    from,
    count,
  );

export const postDownloadCheckoutReports = (
  userId: string | null,
  search?: string,
  startDate?: string,
  endDate?: string,
  status?: string,
  from?: number,
  count?: number,
) =>
  postGenericReport(
    GET_CHECKOUT_REPORTS,
    userId,
    search,
    startDate,
    endDate,
    status,
    from,
    count,
  );

export const postDownloadCheckoutPageReports = (
  userId: string | null,
  search?: string,
  startDate?: string,
  endDate?: string,
  status?: string,
  from?: number,
  count?: number,
) =>
  postGenericReport(
    GET_CHECKOUT_PAGE_REPORTS,
    userId,
    search,
    startDate,
    endDate,
    status,
    from,
    count,
  );

export const postDownloadInvoiceReports = (
  userId: string | null,
  search?: string,
  startDate?: string,
  endDate?: string,
  status?: string,
  from?: number,
  count?: number,
) =>
  postGenericReport(
    GET_INVOICE_REPORTS,
    userId,
    search,
    startDate,
    endDate,
    status,
    from,
    count,
  );
  