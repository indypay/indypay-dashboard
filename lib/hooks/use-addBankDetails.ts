import { useMutation } from '@tanstack/react-query';

import { addBankDetails } from '../services/bank-service';
import { IBankDetails } from '../interfaces/banks.interface';

// export const getAddBankDetails  = (userId: string): UseQueryResult<[BankListResponse | null, safeAny], Error> => {
//     return useQuery({
//       queryKey: ["add-list-of-banks"],
//       queryFn: () => callGetAllBankList(userId),
//       refetchOnWindowFocus: true, // Refetch when the window is focuse
//     });
// }

export const useAddBankDetails = () => {
  return useMutation({
    mutationFn: (data: IBankDetails) => {
      return addBankDetails(data);
    },
  });
};

//   export const useDeleteBankDetails = () =>{
//     return useMutation({
//       mutationFn: (data: string) => {
//         return callDeleteBankDetails(data);
//       }
//     })
//   }
