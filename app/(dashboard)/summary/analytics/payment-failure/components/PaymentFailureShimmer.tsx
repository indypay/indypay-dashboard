'use client';

import React from 'react';

const PaymentFailureShimmer = () => {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="grid grid-cols-12 gap-6">
        {/* Payment Failure Chart Shimmer */}
        <div className="col-span-12 lg:col-span-8">
          <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
            <div className="p-6">
              <div className="h-6 w-48 bg-gray-200 rounded mb-6"></div>
              <div className="h-[300px] bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>

        {/* Payment Failure Stats Shimmer */}
        <div className="col-span-12 lg:col-span-4">
          <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
            <div className="p-6">
              <div className="h-6 w-40 bg-gray-200 rounded mb-6"></div>
              <div className="space-y-4">
                <div className="h-20 bg-gray-200 rounded"></div>
                <div className="h-20 bg-gray-200 rounded"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Payment Failure Table Shimmer */}
        <div className="col-span-12">
          <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
            <div className="p-6">
              <div className="h-6 w-40 bg-gray-200 rounded mb-6"></div>
              <div className="space-y-4">
                <div className="h-10 bg-gray-200 rounded"></div>
                <div className="h-10 bg-gray-200 rounded"></div>
                <div className="h-10 bg-gray-200 rounded"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentFailureShimmer;
