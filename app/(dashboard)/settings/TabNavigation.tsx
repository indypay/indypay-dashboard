'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

import SettingsTabs from '@/lib/constants/SettingsConstants/SettingsConstants';
import { useRole } from '@/lib/components/Role/RoleContext';

const TabNavigation = () => {
  const pathname = usePathname();
  const [userRole, setUserRole] = useState<string>('');

  useEffect(() => {
    const { role } = useRole();
    setUserRole(role || '');
  }, []);

  const isTabVisible = (tab: (typeof SettingsTabs)[0]) => {
    if (!tab.roles) return true;
    return tab.roles.includes(userRole);
  };

  return (
    <nav>
      {SettingsTabs.filter(isTabVisible).map((tab) => (
        <Link
          key={tab.id}
          href={`/settings${tab.value}`}
          className={pathname?.includes(tab.value) ? 'active' : ''}
        >
          {tab.label}
        </Link>
      ))}
    </nav>
  );
};

export default TabNavigation;
