import { Spinner } from '@heroui/react';

export interface LoadingSpinnerProps {
  label?: string;
  size?: 'sm' | 'md' | 'lg';
  color?:
    | 'default'
    | 'primary'
    | 'secondary'
    | 'success'
    | 'warning'
    | 'danger';
  fullScreen?: boolean;
  className?: string;
}

/**
 * Reusable Loading Spinner Component
 *
 * @example
 * ```tsx
 * // Simple spinner
 * <LoadingSpinner />
 *
 * // Full screen loading
 * <LoadingSpinner fullScreen label="Loading data..." />
 *
 * // Custom styled
 * <LoadingSpinner size="lg" color="primary" />
 * ```
 */
export function LoadingSpinner({
  label = 'Loading',
  size = 'lg',
  color = 'secondary',
  fullScreen = false,
  className = '',
}: LoadingSpinnerProps) {
  const labelColorProp = color === 'default' ? 'foreground' : color;

  if (fullScreen) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-white/80 dark:bg-gray-900/80 z-50">
        <Spinner
          label={label}
          color={color}
          size={size}
          labelColor={labelColorProp}
          classNames={{
            circle1: 'border-primary-mint',
            circle2: 'border-primary-green',
          }}
        />
      </div>
    );
  }

  return (
    <div className={`flex items-center justify-center p-8 ${className}`}>
      <Spinner
        label={label}
        color={color}
        size={size}
        labelColor={labelColorProp}
        classNames={{
          circle1: 'border-primary-mint',
          circle2: 'border-primary-green',
        }}
      />
    </div>
  );
}

/**
 * Centered Loading Spinner (for absolute positioning)
 */
export function CenteredLoadingSpinner({
  label = 'Loading',
  size = 'lg',
  color = 'secondary',
}: Omit<LoadingSpinnerProps, 'fullScreen' | 'className'>) {
  const labelColorProp = color === 'default' ? 'foreground' : color;

  return (
    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
      <Spinner
        label={label}
        color={color}
        size={size}
        labelColor={labelColorProp}
        classNames={{
          circle1: 'border-primary-mint',
          circle2: 'border-primary-green',
        }}
      />
    </div>
  );
}
