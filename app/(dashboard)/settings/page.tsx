'use client';
import { useRouter, usePathname } from 'next/navigation';
import React, { useEffect } from 'react';

const Settings = () => {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (pathname === '/settings') {
      router.push('/settings/profile');
    }
  }, [pathname]);

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <p>Redirecting to profile settings...</p> {/* Optional loading message */}
    </div>
  );
};

export default Settings;
