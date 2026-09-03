import {
  CheckoutPagePayload,
  CheckoutPageRecord,
  CheckoutPagesListResponse,
} from '@/lib/interfaces/checkout-page.interface';
import { safeAny } from '@/lib/interfaces/global.interface';
import {
  CHECKOUT_PAGES,
  CHECKOUT_PAGES_BY_ID,
  CHECKOUT_PAGES_PUBLISH,
  CHECKOUT_PAGES_LOGO_UPLOAD_URL,
  CHECKOUT_PAGES_PUBLIC,
  CHECKOUT_PAGES_PAY,
} from '@/lib/constants/apiConstants/apiConstants';
import { resolvePBApi } from '@/lib/utils/common-utils';
import axios from '@/app/api/axios';

const baseUrl = process.env.NEXT_PUBLIC_DEV_PB_BASE_URL;

export const getCheckoutPages = async (
  page: number,
  limit: number,
  search?: string,
  status?: string,
): Promise<
  [CheckoutPagesListResponse | CheckoutPageRecord[] | null, safeAny]
> => {
  const [response, error] = await resolvePBApi<CheckoutPagesListResponse>(
    () => {
      const params: Record<string, string | number> = { page, limit };
      if (search) params.search = search;
      if (status) params.status = status;
      return axios.get<CheckoutPagesListResponse>(
        `${baseUrl}/${CHECKOUT_PAGES}`,
        {
          params,
        },
      );
    },
    false,
    true,
    false,
  );
  return [response ?? null, error];
};

/** Backend may return { data: { id, ... } } or { data: { data: { id, ... } } } or the record directly. */
function normalizeRecordResponse(
  response:
    | CheckoutPageRecord
    | { data?: CheckoutPageRecord | { data?: CheckoutPageRecord } }
    | null,
): CheckoutPageRecord | null {
  if (!response || typeof response !== 'object') return null;
  const d = (response as { data?: unknown }).data;
  const record =
    (d && typeof d === 'object' && (d as { data?: CheckoutPageRecord }).data) ??
    (d as CheckoutPageRecord) ??
    (response as CheckoutPageRecord);
  if (!record || typeof record !== 'object') return null;
  return record as CheckoutPageRecord;
}

export const getCheckoutPageById = async (
  id: string,
): Promise<[CheckoutPageRecord | null, safeAny]> => {
  const [response, error] = await resolvePBApi<
    CheckoutPageRecord | { data?: CheckoutPageRecord }
  >(
    () =>
      axios.get<CheckoutPageRecord | { data?: CheckoutPageRecord }>(
        `${baseUrl}/${CHECKOUT_PAGES_BY_ID}/${id}`,
      ),
    false,
    true,
    false,
  );
  return [normalizeRecordResponse(response ?? null), error];
};

export const createCheckoutPage = async (
  payload: CheckoutPagePayload,
): Promise<[CheckoutPageRecord | null, safeAny]> => {
  const [response, error] = await resolvePBApi<
    CheckoutPageRecord | { data?: CheckoutPageRecord }
  >(
    () =>
      axios.post<CheckoutPageRecord | { data?: CheckoutPageRecord }>(
        `${baseUrl}/${CHECKOUT_PAGES}`,
        payload,
      ),
    false,
    true,
    false,
  );
  return [normalizeRecordResponse(response ?? null), error];
};

export const updateCheckoutPage = async (
  id: string,
  payload: CheckoutPagePayload,
): Promise<[CheckoutPageRecord | null, safeAny]> => {
  const [response, error] = await resolvePBApi<
    CheckoutPageRecord | { data?: CheckoutPageRecord }
  >(
    () =>
      axios.put<CheckoutPageRecord | { data?: CheckoutPageRecord }>(
        `${baseUrl}/${CHECKOUT_PAGES_BY_ID}/${id}`,
        payload,
      ),
    false,
    true,
    false,
  );
  return [normalizeRecordResponse(response ?? null), error];
};

/** Public endpoint — no auth needed. Returns only PUBLISHED pages. */
export const getPublicCheckoutPage = async (
  id: string,
): Promise<[CheckoutPageRecord | null, safeAny]> => {
  const [response, error] = await resolvePBApi<
    CheckoutPageRecord | { data?: CheckoutPageRecord }
  >(
    () =>
      axios.get<CheckoutPageRecord | { data?: CheckoutPageRecord }>(
        `${baseUrl}/${CHECKOUT_PAGES_PUBLIC}/${id}/public`,
      ),
    false,
    true,
    false,
  );
  return [normalizeRecordResponse(response ?? null), error];
};

export interface CheckoutPagePayBody {
  name: string;
  email: string;
  mobile: string;
  amount?: number;
  address?: string;
  customFieldValues?: Record<string, string>;
}

export interface CheckoutPagePayResponse {
  checkoutId: string;
  checkoutUrl: string;
  message: string;
}

/** Public endpoint — submits the customer form and returns the payment gateway URL. */
export const payCheckoutPage = async (
  id: string,
  body: CheckoutPagePayBody,
): Promise<{ checkoutUrl: string }> => {
  const response = await axios.post<{ data: CheckoutPagePayResponse }>(
    `${baseUrl}/${CHECKOUT_PAGES_PAY}/${id}/pay`,
    body,
  );
  return { checkoutUrl: response.data.data.checkoutUrl };
};

export const getLogoUploadUrl = async (
  fileName: string,
  fileType: string,
): Promise<{ presignedUrl: string; fileUrl: string }> => {
  const response = await axios.post<{
    data: { presignedUrl: string; fileUrl: string };
  }>(`${baseUrl}/${CHECKOUT_PAGES_LOGO_UPLOAD_URL}`, { fileName, fileType });
  return response.data.data;
};

export const publishCheckoutPage = async (
  id: string,
): Promise<[CheckoutPageRecord | null, safeAny]> => {
  const [response, error] = await resolvePBApi<
    CheckoutPageRecord | { data?: CheckoutPageRecord }
  >(
    () =>
      axios.post<CheckoutPageRecord | { data?: CheckoutPageRecord }>(
        `${baseUrl}/${CHECKOUT_PAGES_PUBLISH}/${id}/publish`,
        {},
      ),
    false,
    true,
    false,
  );
  return [normalizeRecordResponse(response ?? null), error];
};
