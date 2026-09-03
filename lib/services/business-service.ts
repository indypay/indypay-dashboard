import { IManualPayoutResponse } from '../hooks/use-manual-payout';
import { resolvePBApi } from '../utils/common-utils';
import { ADD_MERCHNAT_BUSINESS_DETAILS } from '../constants/apiConstants/apiConstants';
import { IBusinessDetails } from '../interfaces/business-details.interface';
import { safeAny } from '../interfaces/global.interface';

import axios from '@/app/api/axios';

const baseUrl = process.env.NEXT_PUBLIC_DEV_PB_BASE_URL;

export const addBusinessDetails = async (
  businessDetails: IBusinessDetails,
): Promise<[IManualPayoutResponse | null, safeAny]> => {
  const [response, error] = await resolvePBApi<IManualPayoutResponse>(
    () =>
      axios.post<IManualPayoutResponse>(
        `${baseUrl}/${ADD_MERCHNAT_BUSINESS_DETAILS}`,
        businessDetails,
      ),
    false,
    true,
    false,
  );
  return [response, error];
};
