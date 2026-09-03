'use client';

import React from 'react';
import { useRouter } from 'next/navigation';

import { Accordion } from './components/Accordion';
import { OnboardingBanner } from './components/OnboardingBanner';

import { getUserProfiles } from '@/lib/hooks/user-profile';
import { ONBOARDING_STATUS } from '@/lib/enum';
import { useLogout } from '@/lib/hooks/auth-verification';

const faqItems = [
  {
    question: 'How long does it take for my account to be approved?',
    answer:
      "Account approval typically takes 1-2 business days. We'll notify you via email once the review is complete.",
  },
  {
    question: 'Is RupeeFlow a Payment Gateway?',
    answer:
      'Yes, RupeeFlow is a Payment Gateway. We work with established financial institutions to ensure your funds are secure.',
  },
  {
    question:
      'Are there fees for using Cash Invoices or Cash Management accounts?',
    answer:
      'We offer transparent pricing with no hidden charges. Specific fee structures depend on your account type and usage. But you can generate upto 5 Invoices as per our free plan',
  },
  {
    question: 'Is there any onboarding fee for Payment Gateway?',
    answer:
      'There is no  onboarding fee for Payment Gateway. You just need to verify your KYC details.',
  },
  {
    question: 'How long does it take to activate my account?',
    answer: 'Mostly it will take 3-4 business days.',
  },
];

const statusConfig = {
  [ONBOARDING_STATUS.SIGN_UP]: {
    text: 'Pending Approval',
    className: 'bg-yellow-50 text-yellow-600',
    cursor: 'disabled',
  },
  [ONBOARDING_STATUS.KYC_PENDING]: {
    text: 'Pending Approval',
    className: 'bg-yellow-50 text-yellow-600',
    cursor: 'disabled',
  },
  [ONBOARDING_STATUS.KYC_VERIFIED]: {
    text: 'Approved',
    className: 'bg-green-50 text-green-600',
    cursor: 'pointer',
  },
  [ONBOARDING_STATUS.KYC_ON_HOLD]: {
    text: 'On Hold',
    className: 'bg-orange-50 text-orange-600',
    cursor: 'disabled',
  },
  [ONBOARDING_STATUS.KYC_REJECTED]: {
    text: 'Rejected',
    className: 'bg-red-50 text-red-600',
    cursor: 'disabled',
  },
};

const PendingApproval = () => {
  const router = useRouter();
  const { data } = getUserProfiles();
  const [profile] = data || [];
  const { mutateAsync: logout } = useLogout();
  const status =
    statusConfig[profile?.data?.onboardingStatus as keyof typeof statusConfig];

  const handleInvoiceClick = () => {
    router.replace('https://invoices.RupeeFlow.in/login');
  };

  const handlePgClick = async () => {
    try {
      logout(undefined, {
        onSuccess: () => {
          router.push('/sign-in');
        },
      });
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Add the OnboardingBanner at the top */}
      <OnboardingBanner />

      <div className="flex gap-8">
        <div className="flex-1">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">
              Welcome, {profile?.data?.firstName} {profile?.data?.lastName}
            </h1>
            <p className="text-gray-600">
              Thank you for signing up with RupeeFlow. We are reviewing your{' '}
              <span className="text-purple">KYC</span> application and will
              notify you once the review is complete. In the meantime,
              here&apos;s what you can explore in our{' '}
              <span className="text-purple">Invoices</span>.
            </p>
          </div>

          <div className="grid gap-6 mb-12">
            <div
              className={`p-6 bg-white rounded-lg shadow-sm border border-gray-100 cursor-${status?.cursor} hover:bg-gray-50`}
              onClick={() => handlePgClick()}
            >
              <div className="flex items-start gap-4">
                <div className="p-2 bg-teal-50 rounded">
                  <svg
                    className="w-6 h-6 text-teal-700"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M19 5H5v2h14V5zM5 19h14v-2H5v2zm9-8.5c0-1.1-.9-2-2-2H8v4h4c1.1 0 2-.9 2-2zM8 7h7c2.21 0 4 1.79 4 4s-1.79 4-4 4H8v4H6V7h2z"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Payment Gateway</h3>
                  <p className="text-gray-600">
                    Make the payment process more simplified and easy with
                    RupeeFlow
                  </p>
                </div>
                <span
                  className={`ml-auto px-3 py-1 text-sm rounded-full ${status?.className}`}
                >
                  {status?.text}
                </span>
              </div>
            </div>

            <div
              onClick={() => handleInvoiceClick()}
              className="p-6 bg-white rounded-lg shadow-sm border border-gray-100 cursor-pointer hover:bg-gray-50"
            >
              <div className="flex items-start gap-4">
                <div className="p-2 bg-amber-50 rounded">
                  <svg
                    className="w-6 h-6 text-amber-700"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M14 2H6C5.46957 2 4.96086 2.21071 4.58579 2.58579C4.21071 2.96086 4 3.46957 4 4V20C4 20.5304 4.21071 21.0391 4.58579 21.4142C4.96086 21.7893 5.46957 22 6 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V8L14 2Z"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M14 2V8H20"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M16 13H8"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M16 17H8"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M10 9H8"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Invoices</h3>
                  <p className="text-gray-600">
                    Generate Invoices for your customers and collect payments.
                  </p>
                </div>
                <span className="ml-auto px-3 py-1 text-sm rounded-full bg-green-50 text-green-600">
                  Approved
                </span>
              </div>
            </div>

            <div className="p-6 bg-white rounded-lg shadow-sm border border-gray-100">
              <div className="flex items-start gap-4">
                <div className="p-2 bg-amber-50 rounded">
                  <svg
                    className="w-6 h-6 text-amber-700"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M17 21V19C17 17.9391 16.5786 16.9217 15.8284 16.1716C15.0783 15.4214 14.0609 15 13 15H5C3.93913 15 2.92172 15.4214 2.17157 16.1716C1.42143 16.9217 1 17.9391 1 19V21"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M9 11C11.2091 11 13 9.20914 13 7C13 4.79086 11.2091 3 9 3C6.79086 3 5 4.79086 5 7C5 9.20914 6.79086 11 9 11Z"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M23 21V19C22.9993 18.1137 22.7044 17.2528 22.1614 16.5523C21.6184 15.8519 20.8581 15.3516 20 15.13"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M16 3.13C16.8604 3.35031 17.623 3.85071 18.1676 4.55232C18.7122 5.25392 19.0078 6.11683 19.0078 7.005C19.0078 7.89318 18.7122 8.75608 18.1676 9.45769C17.623 10.1593 16.8604 10.6597 16 10.88"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold mb-1">HRMS</h3>
                  <p className="text-gray-600 text-wrap">
                    {' '}
                    HRMS integration with RupeeFlow, ease payroll processing,
                    employee management, and more.
                  </p>
                </div>
                <span className="ml-auto px-3 py-1 text-sm rounded-full bg-red-50 text-red-600">
                  Pending approval
                </span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
            <h2 className="text-2xl font-bold mb-6">
              Frequently asked questions
            </h2>
            <Accordion items={faqItems} />
          </div>
        </div>

        {/* Guidance Card - Right Side */}
        <div className="w-80 shrink-0">
          <div className="bg-gray-50 rounded-lg p-6 sticky top-8">
            <h2 className="text-xl font-semibold mb-4">Need some guidance?</h2>
            <p className="text-gray-600 mb-6">
              Connect with a member of our team right away.
            </p>

            {/* Support Team Avatars */}
            <div className="flex -space-x-2 mb-6">
              <div className="w-10 h-10 rounded-full bg-purple-100 border-2 border-white"></div>
              <div className="w-10 h-10 rounded-full bg-blue-100 border-2 border-white"></div>
              <div className="w-10 h-10 rounded-full bg-green-100 border-2 border-white"></div>
            </div>

            <button className="w-full bg-white text-blue-600 font-medium py-2 px-4 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
              Send us a message →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PendingApproval;
