'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

import KycLayout from './components/KycLayout';
import { getUserProfiles } from '@/lib/hooks/user-profile';
import { ONBOARDING_STATUS } from '@/lib/enum';

export default function KYCPage() {
  const router = useRouter();
  const { data, isLoading } = getUserProfiles();
  const [profile] = data || [];
  const status = profile?.data?.onboardingStatus as
    | ONBOARDING_STATUS
    | undefined;

  useEffect(() => {
    if (isLoading || status === undefined) return;

    if (
      status === ONBOARDING_STATUS.KYC_PENDING ||
      status === ONBOARDING_STATUS.KYC_ON_HOLD ||
      status === ONBOARDING_STATUS.KYC_REJECTED
    ) {
      router.replace('/pending-approval');
    } else if (
      status === ONBOARDING_STATUS.KYC_VERIFIED ||
      status === ONBOARDING_STATUS.FILLED_BUSINESS_DETAILS
    ) {
      router.replace('/summary/overview');
    }
  }, [status, isLoading, router]);

  // Don't render the form until we know the user is allowed to be here
  if (
    isLoading ||
    (status !== undefined &&
      status !== ONBOARDING_STATUS.SIGN_UP &&
      status !== ONBOARDING_STATUS.NOT_STARTED)
  ) {
    return null;
  }

  return <KycLayout />;
}
