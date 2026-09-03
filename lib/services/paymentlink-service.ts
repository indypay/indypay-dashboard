import axios from 'axios';

import {
  IPaymentLink,
  IPaymentLinkData,
} from '../interfaces/payment-link.interface';
import { safeAny } from '../interfaces/global.interface';
import {
  GET_PAYMENT_LINK_BY_ID,
  GET_PAYMENT_LINKS,
  INITIATE_PAYIN_PAYMENT,
} from '../constants/apiConstants/apiConstants';
import { resolvePBApi } from '../utils/common-utils';

import axios2 from '@/app/api/axios';

const baseUrl = process.env.NEXT_PUBLIC_DEV_PB_BASE_URL;

export const createPaymentLink = async (
  paymentLink: IPaymentLink,
  auth: string,
): Promise<[IPaymentLink | null, safeAny]> => {
  const [response, error] = await resolvePBApi<IPaymentLink>(
    () =>
      axios.post<IPaymentLink>(
        `${baseUrl}/${INITIATE_PAYIN_PAYMENT}`,
        paymentLink,
        {
          withCredentials: true,
          headers: {
            Authorization: auth,
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
        },
      ),
    false,
    true,
    false,
  );
  return [response, error];
};

export const getPaymentLinks = async (
  page: number,
  limit: number,
  search: string,
  status: string,
): Promise<[IPaymentLinkData | null, safeAny]> => {
  const [response, error] = await resolvePBApi<IPaymentLinkData>(
    () => {
      const params = {
        page,
        limit,
        ...(search && { search }),
        ...(status && { status }),
      };
      return axios2.get<IPaymentLinkData>(`${baseUrl}/${GET_PAYMENT_LINKS}`, {
        params,
      });
    },
    false,
    true,
    false,
  );
  return [response, error];
};

export const getPaymentLinkById = async (
  id: string,
): Promise<[IPaymentLinkData | null, safeAny]> => {
  const [response, error] = await resolvePBApi<IPaymentLinkData>(
    () =>
      axios2.get<IPaymentLinkData>(
        `${baseUrl}/${GET_PAYMENT_LINK_BY_ID}/${id}`,
      ),
    false,
    true,
    false,
  );
  return [response, error];
};
