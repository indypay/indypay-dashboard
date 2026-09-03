import { Card, CardBody } from '@heroui/react';

interface ProgressCardProps {
  title: string;
  current: number;
  total: number;
  earning: string;
  icon: string;
}

export const ProgressCard = ({
  title,
  current,
  total,
  earning,
  icon,
}: ProgressCardProps) => {
  const progress = (current / total) * 100;

  return (
    <Card className="w-full">
      <CardBody className="p-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">{title}</h3>
          <span className="text-2xl">{icon}</span>
        </div>
        <div className="flex items-center gap-2 mb-2">
          <span className="text-sm text-muted">
            {current} of {total} members
          </span>
          <span className="text-sm text-muted">Earning: {earning} / month</span>
        </div>
        <div className="w-full h-2 bg-muted/20 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-gradient-bright-from to-gradient-bright-to rounded-full"
            style={{ width: `${progress}%` }}
          />
        </div>
      </CardBody>
    </Card>
  );
};
