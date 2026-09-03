'use client';
import { ReactNode, useEffect } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000,
      refetchOnWindowFocus: false,
      refetchOnMount: false,
      refetchOnReconnect: false,
    },
  },
});

export function ReactQueryProvider({ children }: { children: ReactNode }) {
  useEffect(() => {
    const handleTokenRefresh = () => queryClient.invalidateQueries();
    window.addEventListener('rf:token-refreshed', handleTokenRefresh);
    return () => window.removeEventListener('rf:token-refreshed', handleTokenRefresh);
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}
