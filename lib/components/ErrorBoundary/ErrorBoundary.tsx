'use client';

import React, { Component, ReactNode, ErrorInfo } from 'react';
import { Card, CardBody } from '@heroui/react';
import { Button } from '@heroui/button';
import { logError } from '@/lib/utils/error-handler';

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

/**
 * Global Error Boundary Component
 * Catches JavaScript errors anywhere in the child component tree
 *
 * @example
 * ```tsx
 * <ErrorBoundary>
 *   <YourApp />
 * </ErrorBoundary>
 * ```
 */
export class ErrorBoundary extends Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    // Update state so the next render will show the fallback UI
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    // Log error to error reporting service
    logError(error, 'Error Boundary');

    // Log component stack trace
    console.error('Error Boundary caught an error:', {
      error,
      errorInfo,
      componentStack: errorInfo.componentStack,
    });

    // Update state with error info
    this.setState({ errorInfo });

    // Call custom error handler if provided
    this.props.onError?.(error, errorInfo);
  }

  handleReset = (): void => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
  };

  handleReload = (): void => {
    window.location.reload();
  };

  render(): ReactNode {
    if (this.state.hasError) {
      // Custom fallback UI if provided
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Default error UI
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
          <Card className="max-w-2xl w-full">
            <CardBody className="p-8">
              <div className="text-center">
                {/* Error Icon */}
                <div className="mb-6">
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
                      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                    />
                  </svg>
                </div>

                {/* Error Title */}
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                  Oops! Something went wrong
                </h1>

                {/* Error Message */}
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  We encountered an unexpected error. Don't worry, we've logged
                  this issue and will look into it.
                </p>

                {/* Error Details (Development only) */}
                {process.env.NODE_ENV === 'development' && this.state.error && (
                  <div className="mb-6 text-left">
                    <details className="bg-gray-100 dark:bg-gray-800 rounded-lg p-4">
                      <summary className="cursor-pointer font-semibold text-gray-700 dark:text-gray-300 mb-2">
                        Error Details (Development Only)
                      </summary>
                      <pre className="text-xs text-red-600 dark:text-red-400 overflow-auto">
                        {this.state.error.toString()}
                      </pre>
                      {this.state.errorInfo && (
                        <pre className="text-xs text-gray-600 dark:text-gray-400 overflow-auto mt-2">
                          {this.state.errorInfo.componentStack}
                        </pre>
                      )}
                    </details>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex gap-4 justify-center">
                  <Button
                    color="primary"
                    onClick={this.handleReset}
                    className="bg-purple-600 hover:bg-purple-700"
                  >
                    Try Again
                  </Button>
                  <Button variant="bordered" onClick={this.handleReload}>
                    Reload Page
                  </Button>
                  <Button variant="light" onClick={() => window.history.back()}>
                    Go Back
                  </Button>
                </div>

                {/* Contact Support */}
                <p className="mt-8 text-sm text-gray-500 dark:text-gray-400">
                  If this problem persists, please{' '}
                  <a
                    href="mailto:support@rupeeflow.in"
                    className="text-purple-600 hover:text-purple-700 underline"
                  >
                    contact support
                  </a>
                </p>
              </div>
            </CardBody>
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
}

/**
 * Hook-based error boundary wrapper for functional components
 */
export const withErrorBoundary = <P extends object>(
  Component: React.ComponentType<P>,
  fallback?: ReactNode,
): React.FC<P> => {
  const WrappedComponent: React.FC<P> = (props) => (
    <ErrorBoundary fallback={fallback}>
      <Component {...props} />
    </ErrorBoundary>
  );

  WrappedComponent.displayName = `withErrorBoundary(${Component.displayName || Component.name})`;

  return WrappedComponent;
};
