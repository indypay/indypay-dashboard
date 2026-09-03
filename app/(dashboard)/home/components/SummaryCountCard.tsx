import { formatNumber } from '@/lib/utils/utils';
import { Card, CardBody } from '@heroui/react';
import React from 'react';

const SummaryCountCard = ({
  title,
  count,
}: {
  title: string;
  count: number | null;
}) => {
  return (
    <Card className="min-w-[280px] w-full px-4 py-2 bg-background dark:bg-default-100 rounded-md">
      <CardBody>
        <div className="flex items-center justify-between mb-4">
          <p className="font-normal text-secondary dark:text-primary">
            {title}
          </p>
          {/* <ShowShortMessage
              Icon={TbDots}
              header={title}
              content={formatNumber(count ?? 0)}
            /> */}
        </div>
        <p className="text-xl font-semibold">{formatNumber(count ?? 0)}</p>
      </CardBody>
    </Card>
  );
};

export default SummaryCountCard;
