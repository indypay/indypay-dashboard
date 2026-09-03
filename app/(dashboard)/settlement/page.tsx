'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';

const SettlementTransactions = () => {
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== 'undefined') {
      router.push('/settlement/settlement-transactions');
    }
  }, [router]);
  return <div>Redirecting...</div>; // or any loading component
};

export default SettlementTransactions;
