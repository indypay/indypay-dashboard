import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  getCheckoutPages,
  getCheckoutPageById,
  createCheckoutPage,
  updateCheckoutPage,
  publishCheckoutPage,
} from '@/lib/services/checkout-page.service';
import type { CheckoutPagePayload } from '@/lib/interfaces/checkout-page.interface';

const QUERY_KEY = 'checkout-pages';

export const useGetCheckoutPages = (params: {
  page: number;
  limit: number;
  search?: string;
  status?: string;
}) => {
  return useQuery({
    queryKey: [
      QUERY_KEY,
      'list',
      params.page,
      params.limit,
      params.search,
      params.status,
    ],
    queryFn: () =>
      getCheckoutPages(
        params.page,
        params.limit,
        params.search ?? '',
        params.status ?? '',
      ),
  });
};

export const useGetCheckoutPageById = (id: string | null) => {
  return useQuery({
    queryKey: [QUERY_KEY, 'detail', id],
    queryFn: () => getCheckoutPageById(id!),
    enabled: !!id,
  });
};

export const useCreateCheckoutPage = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CheckoutPagePayload) => createCheckoutPage(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY] });
    },
  });
};

export const useUpdateCheckoutPage = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: CheckoutPagePayload;
    }) => updateCheckoutPage(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY] });
    },
  });
};

export const usePublishCheckoutPage = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => publishCheckoutPage(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY] });
    },
  });
};
