import { Card, CardBody } from '@heroui/react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { Data } from '@/lib/interfaces/dashboard.interface';

const generateChartData = (
  data: Data,
  type: 'payin' | 'payout' | 'settlement',
) => {
  const totalAmount = data[type].totalAmount ?? 0;
  const successAmount = data[type].successAmount ?? 0;
  const failedAmount = data[type].failedAmount ?? 0;

  return [
    {
      name: 'Jan',
      Total: totalAmount,
      Success: successAmount,
      Failed: failedAmount,
    },
    {
      name: 'Feb',
      Total: totalAmount * 0.9,
      Success: successAmount * 0.9,
      Failed: failedAmount * 0.9,
    },
    {
      name: 'Mar',
      Total: totalAmount * 1.1,
      Success: successAmount * 1.1,
      Failed: failedAmount * 1.1,
    },
    {
      name: 'Apr',
      Total: totalAmount * 1.2,
      Success: successAmount * 1.2,
      Failed: failedAmount * 1.2,
    },
  ];
};

interface AnalyticsChartProps {
  data: Data;
  type: 'payin' | 'payout' | 'settlement';
  title: string;
}

export const AnalyticsChart = ({ data, type, title }: AnalyticsChartProps) => {
  const chartData = generateChartData(data, type);

  return (
    <Card className="w-full p-4 bg-surface-dark">
      <CardBody>
        <h3 className="text-xl font-semibold mb-4 text-primary-mint">
          {title}
        </h3>
        <div className="w-full h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.1} />
                  <stop offset="95%" stopColor="var(--primary)" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorSuccess" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#0DD25F" stopOpacity={0.1} />
                  <stop offset="95%" stopColor="#0DD25F" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorFailed" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#D51C44" stopOpacity={0.1} />
                  <stop offset="95%" stopColor="#D51C44" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid
                strokeDasharray="3 3"
                opacity={0.1}
                stroke="#95A19D"
              />
              <XAxis dataKey="name" stroke="#95A19D" />
              <YAxis stroke="#95A19D" />
              <Tooltip />
              <Area
                type="monotone"
                dataKey="Total"
                stroke="var(--primary)"
                fillOpacity={1}
                fill="url(#colorTotal)"
              />
              <Area
                type="monotone"
                dataKey="Success"
                stroke="#0DD25F"
                fillOpacity={1}
                fill="url(#colorSuccess)"
              />
              <Area
                type="monotone"
                dataKey="Failed"
                stroke="#D51C44"
                fillOpacity={1}
                fill="url(#colorFailed)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardBody>
    </Card>
  );
};
