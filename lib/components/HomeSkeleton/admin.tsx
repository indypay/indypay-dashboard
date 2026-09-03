import React from 'react';

const HSkeleton = () => {
  return (
    // overall layout
    <div className="flex flex-col w-screen max-h-screen">
      {/* Sidebar skeleton */}
      <div className="w-24 bg-gray-300 animate-pulse h-screen z-10">
        <div className="flex flex-col">
          <div className="absolute bg-gray-200 animate-pulse w-10 h-16 top-5 left-5 rounded-md"></div>
          <div className="flex flex-col bg-gray-300 animate-pulse w-10 max-h-[800px] translate-y-28 translate-x-5 rounded-md gap-5">
            <div className="bg-gray-200 animate-pulse w-10 h-10 rounded-md"></div>
            <div className="bg-gray-200 animate-pulse w-10 h-10 rounded-md"></div>
            <div className="bg-gray-200 animate-pulse w-10 h-10 rounded-md"></div>
            <div className="bg-gray-200 animate-pulse w-10 h-10 rounded-md"></div>
            <div className="bg-gray-200 animate-pulse w-10 h-10 rounded-md"></div>
            <div className="bg-gray-200 animate-pulse w-10 h-10 rounded-md"></div>
            <div className="bg-gray-200 animate-pulse w-10 h-10 rounded-md"></div>
            <div className="bg-gray-200 animate-pulse w-10 h-10 rounded-md"></div>
            <div className="bg-gray-200 animate-pulse w-10 h-10 rounded-md"></div>
            <div className="bg-gray-200 animate-pulse w-10 h-10 rounded-md"></div>
            <div className="bg-gray-200 animate-pulse w-10 h-10 rounded-md"></div>
          </div>
        </div>
      </div>

      <div className="flex flex-col">
        {/* Header skeleton */}
        <div
          className="absolute h-24 top-0 bg-gray-300 animate-pulse"
          style={{ left: '6rem', width: 'calc(100% - 6rem)' }}
        >
          <div className="relative">
            <div className="absolute bg-gray-200 animate-pulse w-40 h-12 left-2 top-7 rounded-md"></div>
            <div className="absolute bg-gray-200 animate-pulse w-36 h-10 top-7 right-5 rounded-md"></div>
            <div className="absolute bg-gray-200 animate-pulse w-10 h-10 top-7 right-44 rounded-md"></div>
          </div>
        </div>

        {/* Content skeleton */}
        <div className="absolute left-28 top-32">
          <div className="flex flex-col gap-8">
            {/* Skeleton box */}
            <div className="bg-gray-300 animate-pulse w-[500px] h-28 rounded-lg">
              <div className="bg-gray-200 animate-pulse w-[400px] h-10 rounded-md m-8"></div>
            </div>

            {/* Skeleton row with nested elements */}
            <div className="flex flex-col items-center">
              {/* Outer container with responsive max-width */}
              <div className="grid grid-cols-3 max-w-[1900px] mt-9">
                {/* Column 1 */}
                <div>
                  <div className="bg-gray-300 animate-pulse p-4 w-full h-80">
                    <div className="bg-gray-200 animate-pulse w-[200px] h-10 rounded-md mt-2"></div>
                    <div className="bg-gray-200 animate-pulse w-[500px] h-28 rounded-md mt-2"></div>
                    <div className="bg-gray-200 animate-pulse w-[500px] h-28 rounded-md mt-2"></div>
                  </div>
                </div>

                {/* Column 2 */}
                <div className="space-y-4">
                  <div className="bg-gray-300 animate-pulse p-4 w-full h-80">
                    <div className="bg-gray-200 animate-pulse w-[500px] h-28 rounded-md mt-14"></div>
                    <div className="bg-gray-200 animate-pulse w-[500px] h-28 rounded-md mt-2"></div>
                  </div>
                </div>

                {/* Column 3 */}
                <div className="space-y-4">
                  <div className="bg-gray-300 animate-pulse p-4 w-full h-80">
                    <div className="bg-gray-200 animate-pulse w-[520px] h-28 rounded-md mt-14"></div>
                    <div className="bg-gray-200 animate-pulse w-[520px] h-28 rounded-md mt-2"></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Another skeleton box */}
            <div className="grid grid-cols-3 max-w-[1900px] mt-2">
              {/* Column 1 */}
              <div className="bg-gray-300 animate-pulse p-4 w-full h-80">
                <div className="bg-gray-200 animate-pulse w-full h-10 rounded-md mt-2"></div>
                <div className="bg-gray-200 animate-pulse w-full h-28 rounded-md mt-2"></div>
                <div className="bg-gray-200 animate-pulse w-full h-28 rounded-md mt-2"></div>
              </div>

              {/* Column 2 */}
              <div className="space-y-4">
                <div className="bg-gray-300 animate-pulse p-4 w-full h-80">
                  <div className="bg-gray-200 animate-pulse w-[500px] h-28 rounded-md mt-14"></div>
                  <div className="bg-gray-200 animate-pulse w-[500px] h-28 rounded-md mt-2"></div>
                </div>
              </div>

              {/* Column 3 */}
              <div className="space-y-4">
                <div className="bg-gray-300 animate-pulse p-4 w-full h-80">
                  <div className="bg-gray-200 animate-pulse w-[500px] h-28 rounded-md mt-14"></div>
                  <div className="bg-gray-200 animate-pulse w-[500px] h-28 rounded-md mt-2"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HSkeleton;
