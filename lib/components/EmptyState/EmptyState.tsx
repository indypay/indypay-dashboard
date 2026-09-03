import { Button } from '@heroui/button';
import { Card, CardBody } from '@heroui/react';
import { ReactNode } from 'react';

export interface EmptyStateProps {
  title: string;
  description?: string;
  icon?: ReactNode;
  actionLabel?: string;
  onAction?: () => void;
  secondaryActionLabel?: string;
  onSecondaryAction?: () => void;
  className?: string;
}

/**
 * Reusable Empty State Component
 * Shows when there's no data to display
 *
 * @example
 * ```tsx
 * <EmptyState
 *   title="No transactions found"
 *   description="Start by creating your first transaction"
 *   actionLabel="Create Transaction"
 *   onAction={() => router.push('/transactions/new')}
 * />
 * ```
 */
export function EmptyState({
  title,
  description,
  icon,
  actionLabel,
  onAction,
  secondaryActionLabel,
  onSecondaryAction,
  className = '',
}: EmptyStateProps) {
  const defaultIcon = (
    <svg
      className="mx-auto h-16 w-16 text-gray-400"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
        d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
      />
    </svg>
  );

  return (
    <Card className={`w-full ${className}`}>
      <CardBody className="flex items-center justify-center p-12">
        <div className="text-center max-w-md">
          {/* Icon */}
          <div className="mb-6">{icon || defaultIcon}</div>

          {/* Title */}
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            {title}
          </h3>

          {/* Description */}
          {description && (
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              {description}
            </p>
          )}

          {/* Actions */}
          {(actionLabel || secondaryActionLabel) && (
            <div className="flex gap-3 justify-center">
              {actionLabel && onAction && (
                <Button
                  color="primary"
                  onClick={onAction}
                  className="bg-purple-600 hover:bg-purple-700"
                >
                  {actionLabel}
                </Button>
              )}
              {secondaryActionLabel && onSecondaryAction && (
                <Button variant="bordered" onClick={onSecondaryAction}>
                  {secondaryActionLabel}
                </Button>
              )}
            </div>
          )}
        </div>
      </CardBody>
    </Card>
  );
}

/**
 * Simple Empty State (minimal design)
 */
export function SimpleEmptyState({
  message = 'No data available',
  className = '',
}: {
  message?: string;
  className?: string;
}) {
  return (
    <div className={`text-center py-12 ${className}`}>
      <p className="text-gray-500 dark:text-gray-400 text-lg">{message}</p>
    </div>
  );
}

/**
 * Empty State for search/filter results
 */
export function NoResultsFound({
  searchTerm,
  onClearFilters,
  className = '',
}: {
  searchTerm?: string;
  onClearFilters?: () => void;
  className?: string;
}) {
  return (
    <EmptyState
      title={
        searchTerm ? `No results found for "${searchTerm}"` : 'No results found'
      }
      description="Try adjusting your search or filters to find what you're looking for."
      icon={
        <svg
          className="mx-auto h-16 w-16 text-gray-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
      }
      actionLabel={onClearFilters ? 'Clear Filters' : undefined}
      onAction={onClearFilters}
      className={className}
    />
  );
}
