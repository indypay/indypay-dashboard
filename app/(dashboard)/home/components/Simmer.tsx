import { Card, CardBody } from '@heroui/react';
import { Skeleton } from '@heroui/react';

const Simmer = () => {
  return (
    <Card className="min-w-[280px] w-full px-4 py-2 bg-zinc-50 dark:bg-default-100 rounded-md">
      <CardBody>
        <div className="flex items-center justify-between mb-4">
          <Skeleton className="w-24 h-6 rounded-md dark:bg-default-200" />
          <Skeleton className="w-5 h-6 rounded-md dark:bg-default-200" />
        </div>
      </CardBody>
    </Card>
  );
};

export default Simmer;
