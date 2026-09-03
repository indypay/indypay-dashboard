/**
 * Performance Monitoring Hooks
 *
 * Hooks for measuring and optimizing component performance.
 */

import { useEffect, useRef, useState, useCallback } from 'react';

/**
 * Hook to measure component render performance
 *
 * @example
 * ```tsx
 * function MyComponent() {
 *   const { renderCount, renderTime } = useRenderPerformance('MyComponent');
 *
 *   return <div>Renders: {renderCount}, Last render: {renderTime}ms</div>;
 * }
 * ```
 */
export function useRenderPerformance(
  componentName: string,
  enabled = process.env.NODE_ENV === 'development',
) {
  const renderCount = useRef(0);
  const [renderTime, setRenderTime] = useState(0);
  const startTime = useRef(performance.now());

  useEffect(() => {
    if (!enabled) return;

    renderCount.current += 1;
    const endTime = performance.now();
    const duration = endTime - startTime.current;
    setRenderTime(duration);

    if (duration > 16) {
      // Warn if render takes longer than 1 frame (16ms)
      console.warn(
        `[Performance] ${componentName} render took ${duration.toFixed(2)}ms (render #${renderCount.current})`,
      );
    }

    startTime.current = performance.now();
  });

  return {
    renderCount: renderCount.current,
    renderTime,
  };
}

/**
 * Hook to detect unnecessary re-renders
 *
 * Logs which prop changes caused a re-render.
 *
 * @example
 * ```tsx
 * function MyComponent({ user, data, config }) {
 *   useWhyDidYouUpdate('MyComponent', { user, data, config });
 *   // ...
 * }
 * ```
 */
export function useWhyDidYouUpdate(
  componentName: string,
  props: Record<string, any>,
  enabled = process.env.NODE_ENV === 'development',
) {
  const previousProps = useRef<Record<string, any>>();

  useEffect(() => {
    if (!enabled) return;

    if (previousProps.current) {
      const allKeys = Object.keys({ ...previousProps.current, ...props });
      const changedProps: Record<string, { from: any; to: any }> = {};

      allKeys.forEach((key) => {
        if (previousProps.current![key] !== props[key]) {
          changedProps[key] = {
            from: previousProps.current![key],
            to: props[key],
          };
        }
      });

      if (Object.keys(changedProps).length > 0) {
        console.log(`[WhyDidYouUpdate] ${componentName}`, changedProps);
      }
    }

    previousProps.current = props;
  });
}

/**
 * Hook to measure async operation performance
 *
 * @example
 * ```tsx
 * const { measure, metrics } = useAsyncPerformance();
 *
 * const fetchData = async () => {
 *   await measure('fetchTransactions', async () => {
 *     return await getTransactions();
 *   });
 * };
 * ```
 */
export function useAsyncPerformance() {
  const [metrics, setMetrics] = useState<
    Record<string, { count: number; totalTime: number; avgTime: number }>
  >({});

  const measure = useCallback(
    async <T>(
      operationName: string,
      operation: () => Promise<T>,
    ): Promise<T> => {
      const startTime = performance.now();
      try {
        const result = await operation();
        const endTime = performance.now();
        const duration = endTime - startTime;

        setMetrics((prev) => {
          const existing = prev[operationName] || {
            count: 0,
            totalTime: 0,
            avgTime: 0,
          };
          const newCount = existing.count + 1;
          const newTotalTime = existing.totalTime + duration;

          return {
            ...prev,
            [operationName]: {
              count: newCount,
              totalTime: newTotalTime,
              avgTime: newTotalTime / newCount,
            },
          };
        });

        if (duration > 1000) {
          console.warn(
            `[Performance] ${operationName} took ${duration.toFixed(2)}ms`,
          );
        }

        return result;
      } catch (error) {
        const endTime = performance.now();
        const duration = endTime - startTime;
        console.error(
          `[Performance] ${operationName} failed after ${duration.toFixed(2)}ms`,
          error,
        );
        throw error;
      }
    },
    [],
  );

  const reset = useCallback(() => {
    setMetrics({});
  }, []);

  return { measure, metrics, reset };
}

/**
 * Hook to track component mount/unmount lifecycle
 *
 * @example
 * ```tsx
 * function MyComponent() {
 *   useComponentLifecycle('MyComponent', {
 *     onMount: () => console.log('Mounted'),
 *     onUnmount: () => console.log('Unmounted'),
 *   });
 * }
 * ```
 */
export function useComponentLifecycle(
  componentName: string,
  {
    onMount,
    onUnmount,
    logLifecycle = process.env.NODE_ENV === 'development',
  }: {
    onMount?: () => void;
    onUnmount?: () => void;
    logLifecycle?: boolean;
  } = {},
) {
  useEffect(() => {
    const mountTime = performance.now();
    if (logLifecycle) {
      console.log(`[Lifecycle] ${componentName} mounted`);
    }
    onMount?.();

    return () => {
      const unmountTime = performance.now();
      const lifetime = unmountTime - mountTime;
      if (logLifecycle) {
        console.log(
          `[Lifecycle] ${componentName} unmounted (lifetime: ${lifetime.toFixed(2)}ms)`,
        );
      }
      onUnmount?.();
    };
  }, []);
}

/**
 * Hook to debounce a value
 *
 * Useful for search inputs to reduce API calls.
 *
 * @example
 * ```tsx
 * const [search, setSearch] = useState('');
 * const debouncedSearch = useDebounce(search, 500);
 *
 * useEffect(() => {
 *   // This only runs when user stops typing for 500ms
 *   fetchData(debouncedSearch);
 * }, [debouncedSearch]);
 * ```
 */
export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

/**
 * Hook to throttle a function
 *
 * Useful for scroll handlers and resize events.
 *
 * @example
 * ```tsx
 * const handleScroll = useThrottle((event) => {
 *   console.log('Scrolled', event);
 * }, 200);
 *
 * <div onScroll={handleScroll} />
 * ```
 */
export function useThrottle<T extends (...args: any[]) => any>(
  callback: T,
  delay: number,
): T {
  const lastRan = useRef(Date.now());

  return useCallback(
    ((...args) => {
      if (Date.now() - lastRan.current >= delay) {
        callback(...args);
        lastRan.current = Date.now();
      }
    }) as T,
    [callback, delay],
  );
}

/**
 * Hook to measure time between user interactions
 *
 * @example
 * ```tsx
 * const { recordInteraction, getTimeSinceLastInteraction } = useInteractionTracking();
 *
 * <button onClick={() => {
 *   recordInteraction('button_click');
 *   console.log('Time since last interaction:', getTimeSinceLastInteraction());
 * }}>
 * ```
 */
export function useInteractionTracking() {
  const lastInteractionTime = useRef<number>(Date.now());
  const interactions = useRef<
    Array<{ type: string; timestamp: number; timeSinceLast: number }>
  >([]);

  const recordInteraction = useCallback((type: string) => {
    const now = Date.now();
    const timeSinceLast = now - lastInteractionTime.current;

    interactions.current.push({
      type,
      timestamp: now,
      timeSinceLast,
    });

    lastInteractionTime.current = now;

    // Keep only last 50 interactions
    if (interactions.current.length > 50) {
      interactions.current = interactions.current.slice(-50);
    }
  }, []);

  const getTimeSinceLastInteraction = useCallback(() => {
    return Date.now() - lastInteractionTime.current;
  }, []);

  const getInteractionHistory = useCallback(() => {
    return interactions.current;
  }, []);

  const clearHistory = useCallback(() => {
    interactions.current = [];
    lastInteractionTime.current = Date.now();
  }, []);

  return {
    recordInteraction,
    getTimeSinceLastInteraction,
    getInteractionHistory,
    clearHistory,
  };
}

/**
 * Hook for lazy loading heavy components
 *
 * Only loads component when it becomes visible.
 *
 * @example
 * ```tsx
 * const { ref, isVisible } = useLazyLoad();
 *
 * return (
 *   <div ref={ref}>
 *     {isVisible ? <HeavyComponent /> : <LoadingSpinner />}
 *   </div>
 * );
 * ```
 */
export function useLazyLoad(options?: IntersectionObserverInit) {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      {
        threshold: 0.1,
        ...options,
      },
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      observer.disconnect();
    };
  }, [options]);

  return { ref, isVisible };
}
