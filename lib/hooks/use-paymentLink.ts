import { useMutation, useQuery } from '@tanstack/react-query';

import {
  createPaymentLink,
  getPaymentLinks,
} from '../services/paymentlink-service';
import { IPaymentLink } from '../interfaces/payment-link.interface';

interface PaymentLinkRequest {
  data: IPaymentLink;
  clientId: string;
  clientSecret: string;
}

export const usePaymentLink = () => {
  return useMutation({
    mutationFn: ({ data, clientId, clientSecret }: PaymentLinkRequest) => {
      const basicAuth = btoa(`${clientId}:${clientSecret}`);
      return createPaymentLink(data, `Basic ${basicAuth}`);
    },
  });
};

export const useGetPaymentLinks = ({
  page,
  limit,
  search,
  status,
}: {
  page: number;
  limit: number;
  search: string;
  status: string;
  startDate: string;
  endDate: string;
}) => {
  return useQuery({
    queryKey: ['payment-links'],
    queryFn: () => getPaymentLinks(page, limit, search, status),
  });
};
