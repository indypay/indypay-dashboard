// /**
//  * Optimistic Update Hooks
//  *
//  * Provides hooks with optimistic updates for better UX.
//  * Updates UI immediately before server responds.
//  */

// import {
//   useMutation,
//   useQueryClient,
//   UseMutationOptions,
// } from '@tanstack/react-query';
// import { queryKeys } from '@/lib/config/query-client.config';
// import { logError } from '@/lib/utils/error-handler';

// /**
//  * Generic optimistic mutation hook
//  *
//  * @example
//  * ```tsx
//  * const mutation = useOptimisticMutation({
//  *   mutationFn: updateTransactionStatus,
//  *   queryKey: queryKeys.transactions.all,
//  *   updater: (oldData, variables) => {
//  *     return oldData.map(txn =>
//  *       txn.id === variables.id ? { ...txn, status: variables.status } : txn
//  *     );
//  *   },
//  * });
//  * ```
//  */
// export function useOptimisticMutation<TData, TVariables, TContext = unknown>({
//   mutationFn,
//   queryKey,
//   updater,
//   onSuccess,
//   onError,
//   ...options
// }: {
//   mutationFn: (variables: TVariables) => Promise<TData>;
//   queryKey: readonly unknown[];
//   updater: (oldData: any, variables: TVariables) => any;
// } & Omit<
//   UseMutationOptions<TData, Error, TVariables, TContext>,
//   'mutationFn' | 'onMutate' | 'onError' | 'onSettled'
// >) {
//   const queryClient = useQueryClient();

//   return useMutation<TData, Error, TVariables, { previousData: any }>({
//     mutationFn,

//     // Optimistic update
//     onMutate: async (variables) => {
//       // Cancel outgoing refetches
//       await queryClient.cancelQueries({ queryKey });

//       // Snapshot previous value
//       const previousData = queryClient.getQueryData(queryKey);

//       // Optimistically update
//       if (previousData) {
//         queryClient.setQueryData(queryKey, updater(previousData, variables));
//       }

//       return { previousData };
//     },

//     // On error, rollback
//     onError: (error, variables, context) => {
//       if (context?.previousData) {
//         queryClient.setQueryData(queryKey, context.previousData);
//       }
//       logError(error, 'Optimistic Mutation Failed');
//       onError?.(error, variables, context);
//     },

//     // On success
//     onSuccess: (data, variables, context) => {
//       onSuccess?.(data, variables, context);
//     },

//     // Always refetch after success/error
//     onSettled: () => {
//       queryClient.invalidateQueries({ queryKey });
//     },

//     ...options,
//   });
// }

// /**
//  * Optimistic mutation for updating item in a list
//  *
//  * @example
//  * ```tsx
//  * const { mutate } = useOptimisticListUpdate({
//  *   mutationFn: updateTransaction,
//  *   queryKey: queryKeys.transactions.all,
//  *   itemId: (variables) => variables.id,
//  *   itemUpdater: (item, variables) => ({ ...item, status: variables.status }),
//  * });
//  * ```
//  */
// export function useOptimisticListUpdate<TItem, TVariables>({
//   mutationFn,
//   queryKey,
//   itemId,
//   itemUpdater,
//   onSuccess,
//   onError,
// }: {
//   mutationFn: (variables: TVariables) => Promise<TItem>;
//   queryKey: readonly unknown[];
//   itemId: (variables: TVariables) => string | number;
//   itemUpdater: (item: TItem, variables: TVariables) => TItem;
//   onSuccess?: (data: TItem, variables: TVariables) => void;
//   onError?: (error: Error, variables: TVariables) => void;
// }) {
//   return useOptimisticMutation({
//     mutationFn,
//     queryKey,
//     updater: (oldData: TItem[], variables: TVariables) => {
//       const id = itemId(variables);
//       return oldData.map((item: any) =>
//         item.id === id ? itemUpdater(item, variables) : item,
//       );
//     },
//     onSuccess,
//     onError,
//   });
// }

// /**
//  * Optimistic mutation for adding item to a list
//  *
//  * @example
//  * ```tsx
//  * const { mutate } = useOptimisticListAdd({
//  *   mutationFn: createTransaction,
//  *   queryKey: queryKeys.transactions.all,
//  *   itemCreator: (variables) => ({
//  *     id: 'temp-' + Date.now(),
//  *     ...variables,
//  *     status: 'pending',
//  *   }),
//  * });
//  * ```
//  */
// export function useOptimisticListAdd<TItem, TVariables>({
//   mutationFn,
//   queryKey,
//   itemCreator,
//   position = 'start',
//   onSuccess,
//   onError,
// }: {
//   mutationFn: (variables: TVariables) => Promise<TItem>;
//   queryKey: readonly unknown[];
//   itemCreator: (variables: TVariables) => TItem;
//   position?: 'start' | 'end';
//   onSuccess?: (data: TItem, variables: TVariables) => void;
//   onError?: (error: Error, variables: TVariables) => void;
// }) {
//   return useOptimisticMutation({
//     mutationFn,
//     queryKey,
//     updater: (oldData: TItem[], variables: TVariables) => {
//       const newItem = itemCreator(variables);
//       return position === 'start'
//         ? [newItem, ...oldData]
//         : [...oldData, newItem];
//     },
//     onSuccess,
//     onError,
//   });
// }

// /**
//  * Optimistic mutation for removing item from a list
//  *
//  * @example
//  * ```tsx
//  * const { mutate } = useOptimisticListRemove({
//  *   mutationFn: deleteTransaction,
//  *   queryKey: queryKeys.transactions.all,
//  *   itemId: (variables) => variables.id,
//  * });
//  * ```
//  */
// export function useOptimisticListRemove<TItem, TVariables>({
//   mutationFn,
//   queryKey,
//   itemId,
//   onSuccess,
//   onError,
// }: {
//   mutationFn: (variables: TVariables) => Promise<void>;
//   queryKey: readonly unknown[];
//   itemId: (variables: TVariables) => string | number;
//   onSuccess?: (data: void, variables: TVariables) => void;
//   onError?: (error: Error, variables: TVariables) => void;
// }) {
//   return useOptimisticMutation({
//     mutationFn,
//     queryKey,
//     updater: (oldData: TItem[], variables: TVariables) => {
//       const id = itemId(variables);
//       return oldData.filter((item: any) => item.id !== id);
//     },
//     onSuccess,
//     onError,
//   });
// }

// /**
//  * Hook for prefetching data before navigation
//  *
//  * @example
//  * ```tsx
//  * const prefetch = usePrefetchQuery();
//  *
//  * <TableRow
//  *   onMouseEnter={() => prefetch(
//  *     queryKeys.transactions.detail(txn.id),
//  *     () => getTransactionDetails(txn.id)
//  *   )}
//  * >
//  * ```
//  */
// export function usePrefetchQuery() {
//   const queryClient = useQueryClient();

//   return <TData>(
//     queryKey: readonly unknown[],
//     queryFn: () => Promise<TData>,
//     staleTime = 5 * 60 * 1000,
//   ) => {
//     queryClient.prefetchQuery({
//       queryKey,
//       queryFn,
//       staleTime,
//     });
//   };
// }

// /**
//  * Hook for manually invalidating queries
//  *
//  * @example
//  * ```tsx
//  * const invalidate = useInvalidateQueries();
//  *
//  * // Invalidate specific query
//  * invalidate(queryKeys.transactions.all);
//  *
//  * // Invalidate all transactions queries
//  * invalidate({ queryKey: ['transactions'] });
//  *
//  * // Invalidate multiple related queries
//  * invalidate({
//  *   predicate: (query) =>
//  *     query.queryKey[0] === 'transactions' || query.queryKey[0] === 'dashboard'
//  * });
//  * ```
//  */
// export function useInvalidateQueries() {
//   const queryClient = useQueryClient();

//   return (filters: Parameters<typeof queryClient.invalidateQueries>[0]) => {
//     queryClient.invalidateQueries(filters);
//   };
// }

// /**
//  * Hook for batch mutations with progress tracking
//  *
//  * @example
//  * ```tsx
//  * const { mutateAsync, progress } = useBatchMutation({
//  *   mutationFn: updateTransaction,
//  *   onProgress: (completed, total) => {
//  *     console.log(`${completed}/${total} completed`);
//  *   },
//  * });
//  *
//  * await mutateAsync([item1, item2, item3]);
//  * ```
//  */
// export function useBatchMutation<TData, TVariables>({
//   mutationFn,
//   onProgress,
//   onSuccess,
//   onError,
// }: {
//   mutationFn: (variables: TVariables) => Promise<TData>;
//   onProgress?: (completed: number, total: number) => void;
//   onSuccess?: (results: TData[]) => void;
//   onError?: (error: Error, failedItem: TVariables) => void;
// }) {
//   return {
//     mutateAsync: async (items: TVariables[]) => {
//       const results: TData[] = [];
//       let completed = 0;

//       for (const item of items) {
//         try {
//           const result = await mutationFn(item);
//           results.push(result);
//           completed++;
//           onProgress?.(completed, items.length);
//         } catch (error) {
//           logError(error, 'Batch Mutation Failed');
//           onError?.(error as Error, item);
//         }
//       }

//       onSuccess?.(results);
//       return results;
//     },
//   };
// }
