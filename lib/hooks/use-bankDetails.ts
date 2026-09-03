import { useMutation, useQuery, UseQueryResult } from '@tanstack/react-query';

import {
  addBankDetails,
  callGetAllBankListByMerchantId,
} from '../services/bank-service';
import { IBankDetails } from '../interfaces/bank-details.interface';
import { safeAny } from '../interfaces/global.interface';
import { BankListResponse } from '../interfaces/banks.interface';

export const callAddBankDetails = () => {
  return useMutation({
    mutationKey: ['add-bank-details'],
    mutationFn: (bankDetails: IBankDetails) => addBankDetails(bankDetails),
  });
};

export const getBankList = (): UseQueryResult<
  [BankListResponse | null, safeAny],
  Error
> => {
  return useQuery({
    queryKey: ['list-of-bank-details'],
    queryFn: () => callGetAllBankListByMerchantId(),
    refetchOnWindowFocus: true,
  });
};
