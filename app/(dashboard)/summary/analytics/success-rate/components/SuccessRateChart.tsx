'use client';

import React, { useState } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

interface SuccessRateChartProps {
  data: Array<{
    date: string;
    successRate: number;
  }>;
}

const SuccessRateChart: React.FC<SuccessRateChartProps> = ({ data }) => {
  const [selectedPaymentMode, setSelectedPaymentMode] = useState('UPI');
  const [includeUserDeclined, setIncludeUserDeclined] = useState(false);

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-primary-dark-green">
          Transaction Success Rate
        </h2>
        <div className="flex items-center gap-4">
          <select
            value={selectedPaymentMode}
            onChange={(e) => setSelectedPaymentMode(e.target.value)}
            className="border border-sage rounded-md px-3 py-1.5 text-sm bg-white text-primary-dark-green"
          >
            <option value="UPI">UPI</option>
            <option value="CARDS">Cards</option>
            <option value="NETBANKING">Netbanking</option>
          </select>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="includeUserDeclined"
              checked={includeUserDeclined}
              onChange={(e) => setIncludeUserDeclined(e.target.checked)}
              className="rounded"
            />
            <label
              htmlFor="includeUserDeclined"
              className="text-sm text-primary-dark-green"
            >
              Include User Declined Transactions
            </label>
          </div>
          <button className="bg-gradient-to-r from-gradient-bright-from to-gradient-bright-to hover:opacity-90 text-primary-dark-green px-4 py-1.5 rounded-md text-sm">
            Explore
          </button>
        </div>
      </div>
      <div className="h-[400px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={data}
            margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#95A19D" />
            <XAxis dataKey="date" stroke="#95A19D" />
            <YAxis
              tickFormatter={(value) => `${value}%`}
              domain={[0, 6]}
              ticks={[0, 1, 2, 3, 4, 5, 6]}
              stroke="#95A19D"
            />
            <Tooltip formatter={(value) => `${Number(value).toFixed(2)}%`} />
            <Line
              type="monotone"
              dataKey="successRate"
              stroke="#30F3BC"
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default SuccessRateChart;
