'use client';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

import { isOps } from '@/lib/utils/utils';
import { useRole } from '@/lib/components/Role/RoleContext';

const page = () => {
  const router = useRouter();
  const { role } = useRole();
  useEffect(() => {
    if (isOps(role)) {
      router.push('/operations/unsettled');
    } else {
      router.push('/summary/overview');
    }
  }, [router]);
  return null;
};

export default page;
