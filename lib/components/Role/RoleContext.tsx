'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { getUserProfiles } from '@/lib/hooks/user-profile';
import { unstable_noStore } from 'next/cache';
import { isAdmin } from '@/lib/utils/utils';
import { clearAdminTenantPreview } from '@/tenants/tenantConfig';

interface RoleContextType {
  role: string;
  onboardingStatus: number;
  isLoading: boolean;
}

const RoleContext = createContext<RoleContextType | undefined>(undefined);

export function RoleProvider({ children }: { children: React.ReactNode }) {
  unstable_noStore();
  const { data: profileData, isLoading } = getUserProfiles();
  const [role, setRole] = useState('');
  const [onboardingStatus, setOnboardingStatus] = useState<number>(0);

  useEffect(() => {
    if (profileData) {
      const userRole = profileData[0]?.data?.role?.toString() || '';
      const userOnboardingStatus = profileData[0]?.data?.onboardingStatus || 0;
      if (userRole) {
        setRole(userRole);
        if (!isAdmin(userRole)) {
          clearAdminTenantPreview();
        }
      }
      setOnboardingStatus(userOnboardingStatus);
    }
  }, [profileData]);

  return (
    <RoleContext.Provider value={{ role, onboardingStatus, isLoading }}>
      {children}
    </RoleContext.Provider>
  );
}

export function useRole() {
  const context = useContext(RoleContext);
  if (!context) {
    throw new Error('useRole must be used within a RoleProvider');
  }
  return context;
}
