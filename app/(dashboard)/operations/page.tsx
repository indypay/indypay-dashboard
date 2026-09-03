'use client';
import { useRouter } from 'next/navigation';
import React, { useEffect } from 'react';

const Operations = () => {
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== 'undefined') {
      router.push('/operations/unsettled');
    }
  }, [router]);

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <p>Redirecting to operations unsettled...</p>{' '}
      {/* Optional loading message */}
    </div>
  );
};

export default Operations;
