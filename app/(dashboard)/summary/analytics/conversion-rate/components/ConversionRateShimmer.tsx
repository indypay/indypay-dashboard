'use client';

import React from 'react';

const ConversionRateShimmer = () => {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="grid grid-cols-12 gap-6">
        {/* Payment Funnel Report Shimmer */}
        <div className="col-span-12 lg:col-span-8">
          <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
            <div className="p-6">
              <div className="h-6 w-48 bg-gray-200 rounded mb-6"></div>
              <div className="flex justify-between space-x-4 h-[300px]">
                <div className="w-1/3 flex flex-col justify-end">
                  <div className="bg-gray-200 h-[60%] rounded-t-lg"></div>
                  <div className="h-4 w-20 bg-gray-200 rounded mt-2 mx-auto"></div>
                </div>
                <div className="w-1/3 flex flex-col justify-end">
                  <div className="bg-gray-200 h-[40%] rounded-t-lg"></div>
                  <div className="h-4 w-20 bg-gray-200 rounded mt-2 mx-auto"></div>
                </div>
                <div className="w-1/3 flex flex-col justify-end">
                  <div className="bg-gray-200 h-[20%] rounded-t-lg"></div>
                  <div className="h-4 w-20 bg-gray-200 rounded mt-2 mx-auto"></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Conversion Rate Chart Shimmer */}
        <div className="col-span-12 lg:col-span-4">
          <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
            <div className="p-6">
              <div className="h-6 w-36 bg-gray-200 rounded mb-6"></div>
              <div className="relative h-[300px] flex items-center justify-center">
                <div className="h-48 w-48 rounded-full bg-gray-200"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="h-8 w-24 bg-white rounded"></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Customer Insights Shimmer */}
        <div className="col-span-12">
          <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
            <div className="p-6">
              <div className="h-6 w-40 bg-gray-200 rounded mb-6"></div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="h-24 bg-gray-200 rounded"></div>
                <div className="h-24 bg-gray-200 rounded"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConversionRateShimmer;
