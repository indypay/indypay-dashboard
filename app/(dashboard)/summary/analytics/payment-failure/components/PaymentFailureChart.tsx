'use client';

import React from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

interface PaymentFailureChartProps {
  failedPercentage: number;
}

const PaymentFailureChart: React.FC<PaymentFailureChartProps> = ({
  failedPercentage,
}) => {
  // Mock data for the area chart - you can replace this with real data later
  const data = [
    { name: '0%', value: 0 },
    { name: '1%', value: failedPercentage },
    { name: '2%', value: failedPercentage },
    { name: '3%', value: failedPercentage },
    { name: '4%', value: failedPercentage },
    { name: '5%', value: failedPercentage },
    { name: '6%', value: failedPercentage },
  ];

  return (
    <div className="bg-gradient-to-r from-gradient-bright-from to-gradient-bright-to z-10 border-0 rounded-xl p-[2px]">
      <div className="bg-surface-dark rounded-xl p-6">
        <h3 className="text-lg font-semibold mb-6 text-primary-dark-green">
          Payment Failure Insight
        </h3>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={data}
              margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
            >
              <defs>
                <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#D51C44" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#D51C44" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#95A19D" />
              <XAxis dataKey="name" stroke="#95A19D" />
              <YAxis stroke="#95A19D" />
              <Tooltip />
              <Area
                type="monotone"
                dataKey="value"
                stroke="#D51C44"
                fillOpacity={1}
                fill="url(#colorValue)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default PaymentFailureChart;
