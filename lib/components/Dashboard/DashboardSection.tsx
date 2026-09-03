import { Card } from '@heroui/react';
import Simmer from '@/app/(dashboard)/home/components/Simmer';
import SummaryCard from '@/app/(dashboard)/home/components/SummaryCard';
import SummaryCountCard from '@/app/(dashboard)/home/components/SummaryCountCard';

/**
 * Data structure for dashboard metrics
 */
export interface DashboardMetrics {
  totalAmount: number | null;
  successAmount: number | null;
  failedAmount: number | null;
  totalCount: number;
  successCount: number;
  failedCount: number;
}

/**
 * Props for DashboardSection component
 */
export interface DashboardSectionProps {
  title: string;
  data: DashboardMetrics;
  isLoading: boolean;
  className?: string;
}

/**
 * Reusable Dashboard Section Component
 * Displays financial metrics with loading states
 *
 * @example
 * ```tsx
 * <DashboardSection
 *   title="Total Collections (PayIn)"
 *   data={payinData}
 *   isLoading={isLoading}
 * />
 * ```
 */
export function DashboardSection({
  title,
  data,
  isLoading,
  className = '',
}: DashboardSectionProps) {
  return (
    <Card className={`w-full px-8 py-8 ${className}`}>
      <h1 className="text-2xl font-bold mb-2 text-purple-600">{title}</h1>
      <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-5">
        {isLoading ? (
          <>
            <Simmer />
            <Simmer />
            <Simmer />
            <Simmer />
            <Simmer />
            <Simmer />
          </>
        ) : (
          <>
            <SummaryCard
              title="Total initiated volume"
              amount={data.totalAmount ?? 0}
            />
            <SummaryCard
              title="Total success Volume"
              amount={data.successAmount ?? 0}
            />
            <SummaryCard
              title="Total failed Volume"
              amount={data.failedAmount ?? 0}
            />
            <SummaryCountCard
              title="Total Initiated count"
              count={data.totalCount ?? 0}
            />
            <SummaryCountCard
              title="Total success count"
              count={data.successCount ?? 0}
            />
            <SummaryCountCard
              title="Total failed count"
              count={data.failedCount ?? 0}
            />
          </>
        )}
      </div>
    </Card>
  );
}
