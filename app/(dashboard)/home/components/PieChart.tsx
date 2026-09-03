import { Card, CardBody } from '@heroui/react';
import {
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
} from 'recharts';

interface PieChartProps {
  data: any[];
  title: string;
  totalLabel?: string;
  totalValue?: string | number;
  colors?: string[];
}

export const PieChart = ({
  data,
  title,
  totalLabel = 'Total Revenue',
  totalValue,
  colors = ['#EAB308', '#10B981', '#EC4899'],
}: PieChartProps) => {
  return (
    <Card className="w-full">
      <CardBody>
        <h3 className="text-lg font-semibold mb-4">{title}</h3>
        <div className="flex justify-between items-start">
          <div className="h-[200px] w-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <RechartsPieChart>
                <Pie
                  data={data}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  fill="#8884d8"
                  paddingAngle={5}
                  dataKey="value"
                >
                  {data.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={colors[index % colors.length]}
                    />
                  ))}
                </Pie>
                <Legend />
              </RechartsPieChart>
            </ResponsiveContainer>
          </div>
          {totalValue && (
            <div className="text-right">
              <p className="text-sm text-gray-600">{totalLabel}</p>
              <p className="text-2xl font-semibold">{totalValue}</p>
            </div>
          )}
        </div>
      </CardBody>
    </Card>
  );
};
