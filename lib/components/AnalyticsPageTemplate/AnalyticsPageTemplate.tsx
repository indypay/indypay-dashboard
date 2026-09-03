import { ReactNode, useEffect, useState } from 'react';
import { UseQueryResult } from '@tanstack/react-query';
import { LoadingSpinner } from '../LoadingSpinner';
import { EmptyState } from '../EmptyState';
import { ApiError } from '@/lib/types/api.types';

export interface AnalyticsPageTemplateProps<T> {
  /**
   * Query result from Tanstack Query
   */
  queryResult: UseQueryResult<[T | null, unknown], Error>;

  /**
   * Function to render the analytics content when data is loaded
   */
  renderContent: (data: T) => ReactNode;

  /**
   * Optional custom loading component
   */
  loadingComponent?: ReactNode;

  /**
   * Optional custom error component
   */
  errorComponent?: ReactNode;

  /**
   * Optional empty state configuration
   */
  emptyState?: {
    title?: string;
    description?: string;
    onAction?: () => void;
    actionLabel?: string;
  };

  /**
   * Optional callback when data changes
   */
  onDataChange?: (data: T | null) => void;

  /**
   * Additional className for the wrapper
   */
  className?: string;
}

/**
 * Reusable Analytics Page Template
 * Handles loading, error, and empty states consistently
 *
 * @example
 * ```tsx
 * const queryResult = useBusinessTrends(role, startDate, endDate);
 *
 * <AnalyticsPageTemplate
 *   queryResult={queryResult}
 *   renderContent={(data) => (
 *     <>
 *       <BusinessTrendsChart data={data} />
 *       <BusinessTrendsTable data={data} />
 *     </>
 *   )}
 * />
 * ```
 */
export function AnalyticsPageTemplate<T>({
  queryResult,
  renderContent,
  loadingComponent,
  errorComponent,
  emptyState,
  onDataChange,
  className = '',
}: AnalyticsPageTemplateProps<T>) {
  const { data, isLoading, error, refetch } = queryResult;
  const [extractedData, setExtractedData] = useState<T | null>(null);
  const [apiError, setApiError] = useState<ApiError | null>(null);

  // Extract data from tuple response format [data, error]
  useEffect(() => {
    if (data) {
      const [responseData, responseError] = data as [T | null, ApiError | null];

      if (responseError) {
        setApiError(responseError);
        setExtractedData(null);
      } else {
        setExtractedData(responseData);
        setApiError(null);
      }

      // Notify parent component of data changes
      onDataChange?.(responseData);
    }
  }, [data, onDataChange]);

  // Handle loading state
  if (isLoading) {
    return loadingComponent || <LoadingSpinner label="Loading analytics..." />;
  }

  // Handle error state
  if (error || apiError) {
    if (errorComponent) {
      return <>{errorComponent}</>;
    }

    return (
      <EmptyState
        title="Failed to load analytics"
        description={
          apiError?.message ||
          (error as Error)?.message ||
          'An error occurred while fetching the data'
        }
        actionLabel="Retry"
        onAction={() => refetch()}
        icon={
          <svg
            className="mx-auto h-16 w-16 text-red-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        }
      />
    );
  }

  // Handle empty data state
  if (!extractedData) {
    return (
      <EmptyState
        title={emptyState?.title || 'No data available'}
        description={
          emptyState?.description ||
          'There is no data to display for the selected period'
        }
        actionLabel={emptyState?.actionLabel}
        onAction={emptyState?.onAction}
      />
    );
  }

  // Render content with data
  return <div className={className}>{renderContent(extractedData)}</div>;
}

/**
 * Simplified version for basic analytics pages
 */
export function SimpleAnalyticsPage<T>({
  queryResult,
  children,
}: {
  queryResult: UseQueryResult<[T | null, unknown], Error>;
  children: (data: T) => ReactNode;
}) {
  return (
    <AnalyticsPageTemplate queryResult={queryResult} renderContent={children} />
  );
}
