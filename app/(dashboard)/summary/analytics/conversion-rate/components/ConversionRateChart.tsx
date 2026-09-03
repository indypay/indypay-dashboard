'use client';

import React from 'react';
import { Card, CardBody, CardHeader } from '@heroui/react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

interface ConversionRateChartProps {
  ordersConversionRate: number;
}

const ConversionRateChart: React.FC<ConversionRateChartProps> = ({
  ordersConversionRate,
}) => {
  const data = [
    { name: 'Conversion', value: ordersConversionRate },
    { name: 'Remaining', value: 100 - ordersConversionRate },
  ];

  const COLORS = ['var(--secondary)', 'var(--text-muted)'];

  return (
    <Card className="bg-gradient-to-r from-gradient-bright-from to-gradient-bright-to z-10 border-0 rounded-xl p-[2px]">
      <div className="bg-white rounded-xl">
        <CardHeader className="px-6 pt-6">
          <h4 className="text-xl font-semibold text-primary-dark-green">
            Conversion Rate
          </h4>
        </CardHeader>
        <CardBody className="px-6 pb-6">
          <div className="h-[200px] relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={0}
                  dataKey="value"
                >
                  {data.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <div className="text-3xl font-bold text-primary-dark-green">
                  {ordersConversionRate.toFixed(2)}%
                </div>
              </div>
            </div>
          </div>
        </CardBody>
      </div>
    </Card>
  );
};

export default ConversionRateChart;
