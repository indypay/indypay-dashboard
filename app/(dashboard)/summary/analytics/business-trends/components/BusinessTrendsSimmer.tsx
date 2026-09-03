'use client';

import React from 'react';

const BusinessTrendsSimmer = () => {
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg p-6 space-y-4">
        <div className="flex justify-between items-center">
          <div className="animate-pulse h-6 w-24 bg-gray-200 rounded"></div>
          <div className="animate-pulse h-8 w-20 bg-gray-200 rounded"></div>
        </div>

        <div className="h-[200px] w-full relative">
          <div className="animate-pulse absolute inset-0 bg-gray-200 rounded"></div>
          <div className="absolute bottom-0 w-full flex justify-between px-4">
            {Array(12)
              .fill(0)
              .map((_, i) => (
                <div
                  key={i}
                  className="animate-pulse h-4 w-8 bg-gray-300 rounded"
                ></div>
              ))}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg p-6 space-y-4">
        <div className="flex justify-between items-center">
          <div className="animate-pulse h-6 w-48 bg-gray-200 rounded"></div>
          <div className="animate-pulse h-8 w-24 bg-gray-200 rounded"></div>
        </div>

        <div className="h-[100px] w-full relative">
          <div className="animate-pulse absolute inset-0 bg-gray-200 rounded"></div>
          <div className="absolute bottom-0 w-full flex justify-between px-4">
            {Array(12)
              .fill(0)
              .map((_, i) => (
                <div
                  key={i}
                  className="animate-pulse h-4 w-8 bg-gray-300 rounded"
                ></div>
              ))}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg p-6 space-y-4">
        <div className="animate-pulse h-6 w-32 bg-gray-200 rounded mb-4"></div>
        <div className="space-y-3">
          {Array(4)
            .fill(0)
            .map((_, i) => (
              <div key={i} className="flex justify-between items-center">
                <div className="animate-pulse h-5 w-40 bg-gray-200 rounded"></div>
                <div className="animate-pulse h-5 w-24 bg-gray-200 rounded"></div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default BusinessTrendsSimmer;
