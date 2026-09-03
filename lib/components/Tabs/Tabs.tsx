'use client';
import React, { useEffect, useState } from 'react';
import { Tabs, Tab } from '@heroui/react';
import { useRouter, usePathname } from 'next/navigation';

import { useRole } from '@/lib/components/Role/RoleContext';
import { SettingsTabsProps } from '@/lib/constants/SettingsConstants/SettingsConstants';
interface TabsComponentProps {
  tabsData: SettingsTabsProps[];
}

export default function TabsComponent({ tabsData }: TabsComponentProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [selectedTab, setSelectedTab] = useState(pathname);
  const { role } = useRole();

  useEffect(() => {
    if (selectedTab !== pathname && selectedTab !== null) {
      router.push(selectedTab);
    }
  }, [selectedTab, pathname, router]);

  const filteredTabs = tabsData.filter((tab) => tab.roles.includes(role));

  return (
    <div className="flex w-full flex-col">
      <Tabs
        aria-label="Dynamic tabs"
        classNames={{
          base: 'px-4',
          tabContent:
            'group-data-[selected=true]:text-secondary dark:group-data-[selected=true]:text-primary',
        }}
        fullWidth={true}
        items={filteredTabs}
        selectedKey={selectedTab}
        onSelectionChange={(key) => setSelectedTab(key as string)}
      >
        {(item) => (
          <Tab key={item.id} className="py-6" title={item.label}></Tab>
        )}
      </Tabs>
    </div>
  );
}
