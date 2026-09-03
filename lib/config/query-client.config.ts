import { QueryClient, DefaultOptions } from '@tanstack/react-query';
import { logError } from '../utils/error-handler';

/**
 * Default options for React Query
 */
const queryConfig: DefaultOptions = {
  queries: {
    // Refetch data when the window regains focus
    refetchOnWindowFocus: true,

    // Data is considered fresh for 5 minutes
    staleTime: 5 * 60 * 1000, // 5 minutes

    // Cache data for 10 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes (formerly cacheTime)

    // Retry failed requests up to 2 times
    retry: 2,

    // Exponential backoff for retries
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),

    // Don't refetch on mount if data is still fresh
    refetchOnMount: false,

    // Refetch on reconnect
    refetchOnReconnect: true,
  },
  mutations: {
    // Retry mutations once on failure
    retry: 1,

    // Error handling for mutations
    onError: (error) => {
      logError(error, 'Mutation Error');
    },
  },
};

/**
 * Create and configure QueryClient instance
 */
export const createQueryClient = () => {
  return new QueryClient({
    defaultOptions: queryConfig,
  });
};

/**
 * Singleton QueryClient instance
 * Use this for client-side components
 */
export const queryClient = createQueryClient();

/**
 * Query keys factory for consistent query key management
 */
export const queryKeys = {
  // Dashboard
  dashboard: {
    merchant: (startDate: string, endDate: string) =>
      ['dashboard', 'merchant', startDate, endDate] as const,
    admin: (startDate: string, endDate: string) =>
      ['dashboard', 'admin', startDate, endDate] as const,
    channelPartner: (startDate: string, endDate: string) =>
      ['dashboard', 'channel-partner', startDate, endDate] as const,
  },

  // Transactions
  transactions: {
    all: ['transactions'] as const,
    merchant: () => ['transactions', 'merchant'] as const,
    admin: () => ['transactions', 'admin'] as const,
    details: (id: string, role: 'merchant' | 'admin') =>
      ['transactions', 'details', id, role] as const,
  },

  // Analytics
  analytics: {
    all: ['analytics'] as const,
    businessTrends: (role: string, startDate: string, endDate: string) =>
      ['analytics', 'business-trends', role, startDate, endDate] as const,
    conversionRate: (role: string, startDate: string, endDate: string) =>
      ['analytics', 'conversion-rate', role, startDate, endDate] as const,
    paymentFailure: (role: string, startDate: string, endDate: string) =>
      ['analytics', 'payment-failure', role, startDate, endDate] as const,
    paymentSuccess: (role: string, startDate: string, endDate: string) =>
      ['analytics', 'payment-success', role, startDate, endDate] as const,
  },

  // User
  user: {
    profile: () => ['user', 'profile'] as const,
    role: () => ['user', 'role'] as const,
  },

  // Commissions
  commissions: {
    all: () => ['commissions'] as const,
    byId: (id: string) => ['commissions', id] as const,
    userMapping: (userId: string) => ['commissions', 'user', userId] as const,
  },

  // AI Commission Recommendations
  aiCommission: {
    all: () => ['ai-commission'] as const,
    merchantLatest: (merchantId: string) =>
      ['ai-commission', 'merchant', merchantId] as const,
  },
} as const;
