import { AxiosError } from 'axios';
import Cookies from 'js-cookie';

import httpClient from '@/app/api/axios';
import { refreshAccessToken } from '@/lib/services/auth.service';

import type { ApiResponse as KycEnvelope } from '@/lib/services/kyc.service';

/** Pull access token from typical API envelopes after mobile confirm. */
export function pickAccessTokenFromBody(body: unknown): string | undefined {
  if (!body || typeof body !== 'object') return undefined;
  const b = body as Record<string, unknown>;

  if (typeof b.token === 'string') return b.token;

  const data = b.data;
  if (data && typeof data === 'object') {
    const d = data as Record<string, unknown>;
    if (typeof d.token === 'string') return d.token;
    const inner = d.data;
    if (inner && typeof inner === 'object' && 'token' in inner) {
      const t = (inner as { token?: unknown }).token;
      if (typeof t === 'string') return t;
    }
  }
  return undefined;
}

/**
 * After updating profile mobile, backend may issue a new JWT or invalidate cached claims.
 * Prefer a token returned on confirm; otherwise refresh the session cookie.
 * Full sign-in is only needed if both are unavailable or refresh fails.
 */
export async function syncSessionAfterMobileUpdate(
  confirmResponseBody: unknown,
): Promise<{ ok: boolean; errorMessage?: string }> {
  const fromConfirm = pickAccessTokenFromBody(confirmResponseBody);
  if (fromConfirm) {
    Cookies.set('rtk', fromConfirm, { secure: true, sameSite: 'lax' });
  }

  const [refreshPayload, refreshError] = await refreshAccessToken();

  if (refreshError && !fromConfirm) {
    return {
      ok: false,
      errorMessage:
        'Mobile updated but session could not be refreshed. Please sign in again.',
    };
  }

  // refreshAccessToken may set rtk from its own response
  const tokenFromRefresh = pickAccessTokenFromBody(refreshPayload);
  if (tokenFromRefresh) {
    Cookies.set('rtk', tokenFromRefresh, { secure: true, sameSite: 'lax' });
  }

  if (typeof window !== 'undefined') {
    window.dispatchEvent(new Event('rf:token-refreshed'));
  }

  return { ok: true };
}

export const profileMobileService = {
  requestOtp: async (
    mobile: string,
  ): Promise<KycEnvelope<{ message?: string }>> => {
    try {
      const response = await httpClient.post<KycEnvelope<{ message?: string }>>(
        '/api/v1/users/profile/mobile/request-otp',
        { mobile },
      );
      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError;
      console.error('Profile mobile request-otp error:', {
        message: axiosError.message,
        response: axiosError.response?.data,
      });
      throw error;
    }
  },

  confirm: async (
    mobile: string,
    otp: string,
  ): Promise<KycEnvelope<{ token?: string; message?: string }>> => {
    try {
      const response = await httpClient.post<
        KycEnvelope<{ token?: string; message?: string }>
      >('/api/v1/users/profile/mobile/confirm', { mobile, otp });
      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError;
      console.error('Profile mobile confirm error:', {
        message: axiosError.message,
        response: axiosError.response?.data,
      });
      throw error;
    }
  },
};
