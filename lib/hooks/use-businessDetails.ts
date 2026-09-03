import { useMutation } from '@tanstack/react-query';

import { addBusinessDetails } from '../services/business-service';
import { IBusinessDetails } from '../interfaces/business-details.interface';

export const useAddBusinessDetails = () => {
  return useMutation({
    mutationFn: (data: IBusinessDetails) => {
      return addBusinessDetails(data);
    },
  });
};
