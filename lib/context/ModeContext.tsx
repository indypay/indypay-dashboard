'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { getUserProfiles } from '@/lib/hooks/user-profile';
import { ONBOARDING_STATUS } from '@/lib/enum';

export type Mode = 'test' | 'live';

interface ModeContextType {
  mode: Mode;
  setMode: (mode: Mode) => void;
  isLoading: boolean;
  isTestModeLocked: boolean; // True if KYC is verified and test mode should be disabled
}

const ModeContext = createContext<ModeContextType | undefined>(undefined);

export function ModeProvider({ children }: { children: React.ReactNode }) {
  const { data: profileData, isLoading } = getUserProfiles();
  const [mode, setModeState] = useState<Mode>('test');
  const [isInitialized, setIsInitialized] = useState(false);
  const [isTestModeLocked, setIsTestModeLocked] = useState(false);

  // Check onboarding status and set mode accordingly
  useEffect(() => {
    if (profileData && !isInitialized) {
      const onboardingStatus = profileData[0]?.data?.onboardingStatus;

      // If KYC is verified, automatically set to live mode and lock test mode
      if (onboardingStatus === ONBOARDING_STATUS.KYC_VERIFIED) {
        setModeState('live');
        setIsTestModeLocked(true);
      } else {
        setIsTestModeLocked(false);
        // Try to load saved mode from localStorage (only if not KYC verified)
        const savedMode = localStorage.getItem('app-mode') as Mode | null;
        if (savedMode && (savedMode === 'test' || savedMode === 'live')) {
          setModeState(savedMode);
        }
      }

      setIsInitialized(true);
    }
  }, [profileData, isInitialized]);

  // Save mode to localStorage when it changes (only if not KYC verified)
  useEffect(() => {
    if (isInitialized && profileData) {
      const onboardingStatus = profileData[0]?.data?.onboardingStatus;
      if (onboardingStatus !== ONBOARDING_STATUS.KYC_VERIFIED) {
        localStorage.setItem('app-mode', mode);
      }
    }
  }, [mode, isInitialized, profileData]);

  const setMode = (newMode: Mode) => {
    if (profileData) {
      const onboardingStatus = profileData[0]?.data?.onboardingStatus;
      // If KYC is verified, force live mode
      if (
        onboardingStatus === ONBOARDING_STATUS.KYC_VERIFIED &&
        newMode === 'test'
      ) {
        return; // Don't allow switching to test mode if KYC is verified
      }
    }
    setModeState(newMode);
  };

  return (
    <ModeContext.Provider
      value={{ mode, setMode, isLoading, isTestModeLocked }}
    >
      {children}
    </ModeContext.Provider>
  );
}

export function useMode() {
  const context = useContext(ModeContext);
  if (context === undefined) {
    throw new Error('useMode must be used within a ModeProvider');
  }
  return context;
}
