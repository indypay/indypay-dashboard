import { safeAny } from '../interfaces/global.interface';
import {
  IPaymentLinkCreateRequest,
  IPaymentLinkCreateResponse,
  IPaymentLinkDetailsResponse,
} from '../interfaces/payment-link.interface';
import {
  CREATE_PAYMENT_LINK_BACKEND,
  GET_PAYMENT_LINK_DETAILS,
} from '../constants/apiConstants/apiConstants';
import axios2 from '@/app/api/axios';

const baseUrl = process.env.NEXT_PUBLIC_DEV_PB_BASE_URL;

export const createNewPaymentLink = async (
  data: IPaymentLinkCreateRequest,
): Promise<[IPaymentLinkCreateResponse | null, safeAny]> => {
  try {
    const response = await axios2.post<
      IPaymentLinkCreateResponse | { data: IPaymentLinkCreateResponse }
    >(`${baseUrl}/${CREATE_PAYMENT_LINK_BACKEND}`, data, {
      headers: { 'Content-Type': 'application/json' },
    });

    const result = response?.data;
    if (!result) return [null, { message: 'Failed to create payment link' }];

    // Support both { linkId, linkUrl, expiryTime } and { data: { linkId, linkUrl, expiryTime } }
    const normalized: IPaymentLinkCreateResponse =
      'linkId' in result && result.linkId
        ? (result as IPaymentLinkCreateResponse)
        : (result as { data: IPaymentLinkCreateResponse }).data;

    if (!normalized?.linkId)
      return [null, { message: 'Invalid response from server' }];

    // Build full link URL if backend only returns id
    const linkUrl =
      normalized.linkUrl ||
      (typeof window !== 'undefined'
        ? `${window.location.origin}/payment-link/${normalized.linkId}`
        : '');

    return [{ ...normalized, linkUrl }, null];
  } catch (error: safeAny) {
    const msg =
      error?.response?.data?.message ||
      error?.response?.data?.error ||
      (error instanceof Error
        ? error.message
        : 'Failed to create payment link');
    return [null, { message: msg }];
  }
};

// ─── Analytics & Reminders ────────────────────────────────────────────────────

export interface ILinkAnalyticsResponse {
  linkId: string;
  totalOpens: number;
  uniqueVisitors: number;
  paidCount: number;
  conversionRate: number;
  peakHours: string;
  cityBreakdown: { city: string; count: number; percentage: number }[];
  hourlyActivity: { hour: number; count: number }[];
  recentActivity: {
    id: string;
    timestamp: string;
    city: string;
    action: 'opened' | 'paid' | 'abandoned';
  }[];
}

export interface ILinkRemindersResponse {
  linkId: string;
  autoRemindersEnabled: boolean;
  totalSent: number;
  delivered: number;
  failed: number;
  reminders: {
    id: string;
    sentAt: string;
    channel: 'whatsapp' | 'sms';
    status: 'sent' | 'delivered' | 'failed';
    recipient: string;
  }[];
}

export const getPaymentLinkAnalytics = async (
  linkId: string,
): Promise<[ILinkAnalyticsResponse | null, safeAny]> => {
  try {
    const response = await axios2.get<{ data: ILinkAnalyticsResponse }>(
      `${baseUrl}/api/v1/payments/payment-link/${linkId}/analytics`,
    );
    return [response.data.data, null];
  } catch (error: safeAny) {
    return [null, error];
  }
};

export const getPaymentLinkReminders = async (
  linkId: string,
): Promise<[ILinkRemindersResponse | null, safeAny]> => {
  try {
    const response = await axios2.get<{ data: ILinkRemindersResponse }>(
      `${baseUrl}/api/v1/payments/payment-link/${linkId}/reminders`,
    );
    return [response.data.data, null];
  } catch (error: safeAny) {
    return [null, error];
  }
};

export const toggleAutoReminders = async (
  linkId: string,
  enabled: boolean,
): Promise<
  [{ autoRemindersEnabled: boolean; message: string } | null, safeAny]
> => {
  try {
    const response = await axios2.patch<{
      data: { autoRemindersEnabled: boolean; message: string };
    }>(`${baseUrl}/api/v1/payments/payment-link/${linkId}/reminders/auto`, {
      enabled,
    });
    return [response.data.data, null];
  } catch (error: safeAny) {
    return [null, error];
  }
};

export const sendReminder = async (
  linkId: string,
  channel: 'whatsapp' | 'sms',
): Promise<[{ message: string; status: string } | null, safeAny]> => {
  try {
    const response = await axios2.post<{
      data: { message: string; status: string };
    }>(`${baseUrl}/api/v1/payments/payment-link/${linkId}/reminders/send`, {
      channel,
    });
    return [response.data.data, null];
  } catch (error: safeAny) {
    return [null, error];
  }
};

export const getPaymentLinkDetails = async (
  linkId: string,
): Promise<[IPaymentLinkDetailsResponse | null, safeAny]> => {
  try {
    const response = await fetch(`${GET_PAYMENT_LINK_DETAILS}/${linkId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      return [
        null,
        { message: errorData.error || 'Failed to get payment link details' },
      ];
    }

    const result = await response.json();
    return [result, null];
  } catch (error) {
    return [null, error];
  }
};
