'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import AnalyticsTabs from '@/lib/constants/AnalyticsConstants/AnalyticsConstants';
import { useRole } from '@/lib/components/Role/RoleContext';

const TabNavigation = () => {
  const pathname = usePathname();
  const [userRole, setUserRole] = useState<string>('');
  const { role } = useRole();

  useEffect(() => {
    setUserRole(role || '');
  }, [role]);

  const isTabVisible = (tab: (typeof AnalyticsTabs)[0]) => {
    if (!tab.roles) return true;
    return tab.roles.includes(userRole);
  };

  return (
    <div className="flex gap-6 border-b border-divider !border-sage">
      {AnalyticsTabs.filter(isTabVisible).map((tab) => (
        <Link
          key={tab.id}
          href={`/summary/analytics${tab.value}`}
          className={`pb-2 px-1 text-sm font-medium transition-all relative ${
            pathname?.includes(tab.value)
              ? 'text-primary-dark-green border-b-2 border-primary-mint'
              : 'text-muted hover:text-primary-mint'
          }`}
        >
          {tab.label}
        </Link>
      ))}
    </div>
  );
};

export default TabNavigation;
