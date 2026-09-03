import React from 'react';

export const OnboardingBanner = () => {
  return (
    <div className="bg-purple-50 rounded-2xl p-8 mb-8 relative overflow-hidden">
      <div className="flex items-center gap-6">
        {/* Left side - Celebration Icon */}
        <div className="relative">
          <div className="w-24 h-24 bg-purple-100 rounded-full flex items-center justify-center relative">
            <svg
              className="w-12 h-12 text-purple-600"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M12 15C13.6569 15 15 13.6569 15 12C15 10.3431 13.6569 9 12 9C10.3431 9 9 10.3431 9 12C9 13.6569 10.3431 15 12 15Z"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M12 5V3"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M12 21V19"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M5 12H3"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M21 12H19"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M17 7L18.5 5.5"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M5.5 18.5L7 17"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M17 17L18.5 18.5"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M5.5 5.5L7 7"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>

            {/* Decorative elements */}
            <div className="absolute -top-1 -right-1 w-4 h-4 bg-purple-400 rounded-full animate-pulse"></div>
            <div className="absolute bottom-2 -left-2 w-3 h-3 bg-purple-300 rounded-full animate-bounce"></div>
          </div>
        </div>

        {/* Right side - Text Content */}
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-purple-900 mb-2">
            Almost there!
          </h1>
          <p className="text-purple-700">
            We&apos;re reviewing your application. Get ready to experience
            seamless payments and invoicing.
          </p>
        </div>
      </div>

      {/* Decorative background elements */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-purple-100 rounded-full -translate-y-1/2 translate-x-1/2 opacity-50"></div>
      <div className="absolute bottom-0 right-12 w-16 h-16 bg-purple-200 rounded-full translate-y-1/3 opacity-40"></div>
    </div>
  );
};
