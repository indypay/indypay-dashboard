import axios from 'axios';

import { safeAny } from '../interfaces/global.interface';
import { INITIATE_PAYIN_PAYMENT } from '../constants/apiConstants/apiConstants';
import { resolvePBApi } from '../utils/common-utils';
import { IPaymentLink } from '../interfaces/paymentLink.interface';

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
          headers: {
            Authorization: auth,
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
          withCredentials: true, // Changed to false since we're using Basic Auth
        },
      ),
    false,
    true,
    false,
  );
  return [response, error];
};
