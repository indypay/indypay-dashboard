import { Card, CardBody } from '@heroui/react';

interface StatCardProps {
  title: string;
  value: string | number;
  trend: {
    value: number;
    isPositive: boolean;
  };
  bgColor?: string;
}

export const StatCard = ({
  title,
  value,
  trend,
  bgColor = 'bg-yellow-50',
}: StatCardProps) => {
  return (
    <Card className={`${bgColor} border-none shadow-sm`}>
      <CardBody className="p-4">
        <p className="text-sm text-gray-600 mb-1">{title}</p>
        <div className="flex items-center justify-between">
          <p className="text-2xl font-semibold">{value}</p>
          <p
            className={`text-sm flex items-center gap-1 ${trend.isPositive ? 'text-green-600' : 'text-red-600'}`}
          >
            {trend.isPositive ? '↑' : '↓'} {trend.value}%
          </p>
        </div>
      </CardBody>
    </Card>
  );
};
