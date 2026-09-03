'use client';
import clsx from 'clsx';
import { siteConfig, NavSection } from '@/lib/config/site';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState, useMemo } from 'react';
import { Menu, MenuProps, Divider, Button } from 'antd';
import type { MenuItemType } from 'antd/es/menu/interface';
import {
  isChannelPartner,
  isMerchant,
  isOps,
  viewOnlyAdmin,
} from '../utils/utils';
import { useRole } from './Role/RoleContext';
import { ONBOARDING_STATUS } from '@/lib/enum';
import { FaUpload } from 'react-icons/fa';
import { Logo } from '@/lib/components/Logo';
import { useTenant } from '@/context/TenantContext';

interface SidebarProps {
  isCollapsed: boolean;
  toggleNavbar: () => void;
}

import type { NavItem } from '@/lib/config/site';

const filterNavItemsByRole = (navItems: NavItem[], role: string) => {
  if (isMerchant(role)) {
    return navItems.filter(
      (item) =>
        item.label === 'Home' ||
        item.label === 'Transactions' ||
        item.label === 'Analytics' ||
        item.label === 'Reports' ||
        item.label === 'Settlements' ||
        item.label === 'Account & Settings' ||
        // Payment Products
        // item.label === 'Payment Pages' ||
        item.label === 'Payment Button' ||
        item.label === 'Payment Links' ||
        item.label === 'Invoices' ||
        item.label === 'QR Codes' ||
        item.label === 'Checkout Pages' ||
        // item.label === 'Rupeeflow.link' ||
        // Customers
        // item.label === 'Customers' ||
        item.label === 'Offers' ||
        // Cards
        item.label === 'Prepaid Cards' ||
        // Developer Zone
        item.label === 'API Reference' ||
        item.label === 'API Requests' ||
        item.label === 'Traffic & Logs' ||
        // Others
        item.label === 'Apps & Deals' ||
        // Legacy
        item.label === 'Payout Wallet' ||
        item.label === 'Payout Wallet Transactions' ||
        item.label === 'Disputes',
    );
  } else if (isOps(role)) {
    return navItems.filter(
      (item) =>
        item.label === 'Home' ||
        item.label === 'Transactions' ||
        item.label === 'Analytics' ||
        item.label === 'Platform Billing' ||
        item.label === 'Bank report import' ||
        item.label === 'Settlements' ||
        item.label === 'Reports' ||
        item.label === 'Account & Settings' ||
        item.label === 'Users' ||
        item.label === 'API Reference' ||
        item.label === 'Payout Transactions' ||
        item.label === 'Payout Wallet' ||
        item.label === 'Payout Wallet Transactions' ||
        item.label === 'Disputes',
    );
  } else if (isChannelPartner(role)) {
    return navItems.filter(
      (item) =>
        item.label === 'Summary' ||
        item.label === 'Overview' ||
        item.label === 'Collections' ||
        item.label === 'Payouts' ||
        // item.label === 'KYC'||
        // item.label === 'Invoices' ||
        // item.label === 'Payment Links' ||
        item.label === 'Settings',
      // item.label === 'Settlements'
    );
  } else if (viewOnlyAdmin(role)) {
    return navItems.filter(
      (item) =>
        item.label === 'Summary' ||
        item.label === 'Overview' ||
        item.label === 'Analytics' ||
        item.label === 'Platform Billing' ||
        item.label === 'Invoices' ||
        item.label === 'Disputes' ||
        item.label === 'Settings',
    );
  }
  return navItems;
};

export const Sidebar = ({ isCollapsed, toggleNavbar }: SidebarProps) => {
  const pathName = usePathname();
  const router = useRouter();
  const { role, onboardingStatus } = useRole();
  const [openKeys, setOpenKeys] = useState<string[]>([]);
  const { tenantConfig } = useTenant();

  const filteredNavItems = useMemo(
    () => filterNavItemsByRole(siteConfig.navItems, role),
    [role],
  );

  // Group items by section
  const itemsBySection = useMemo(() => {
    const sections: Record<NavSection, typeof filteredNavItems> = {
      main: [],
      'payment-products': [],
      cards: [],
      lending: [],
      customers: [],
      'developer-zone': [],
      others: [],
      ums: [],
    };

    filteredNavItems.forEach((item) => {
      if (item.section && sections[item.section]) {
        sections[item.section].push(item);
      }
    });

    return sections;
  }, [filteredNavItems]);

  const isKycVerified =
    onboardingStatus === ONBOARDING_STATUS.KYC_VERIFIED ||
    onboardingStatus === ONBOARDING_STATUS.FILLED_BUSINESS_DETAILS;

  // Auto-open submenu if current path matches a submenu item
  useEffect(() => {
    const openSubmenu: string[] = [];
    filteredNavItems.forEach((item) => {
      if (
        item.subMenu &&
        item.subMenu.some((sub) => pathName.startsWith(sub.href))
      ) {
        openSubmenu.push(item.href);
      }
    });
    setOpenKeys(openSubmenu);
  }, [pathName]);

  // Convert nav items to Ant Design Menu items.
  // Applies tenantConfig.menuLabelOverrides so each tenant can rename labels.
  const convertToMenuItems = (
    items: typeof filteredNavItems,
  ): MenuItemType[] => {
    const overrides = tenantConfig.menuLabelOverrides;

    return items.map((item) => {
      const hasSubMenu = item?.subMenu && item.subMenu.length > 0;
      const label = overrides[item.href] ?? item.label;

      if (hasSubMenu && item.subMenu) {
        return {
          key: item.href,
          icon: <item.icon className="h-[24px] w-[24px]" />,
          label,
          children: item.subMenu.map((sub) => ({
            key: sub.href,
            label: overrides[sub.href] ?? sub.label,
          })),
        };
      }

      return {
        key: item.href,
        icon: <item.icon className="h-[24px] w-[24px]" />,
        label,
      };
    });
  };

  const renderMenuSection = (
    items: typeof filteredNavItems,
    section: NavSection,
  ) => {
    const menuItems = convertToMenuItems(items);

    // Match the most specific menu key that is a prefix of the current path,
    // so sub-routes (e.g. /account-settings/profile) still highlight their
    // parent item (/account-settings).
    const allKeys: string[] = [];
    items.forEach((item) => {
      allKeys.push(item.href);
      item.subMenu?.forEach((sub) => allKeys.push(sub.href));
    });
    const activeKey =
      allKeys
        .filter((key) => pathName === key || pathName.startsWith(key + '/'))
        .sort((a, b) => b.length - a.length)[0] ?? pathName;

    return (
      <Menu
        mode="inline"
        selectedKeys={[activeKey]}
        openKeys={openKeys}
        onOpenChange={handleOpenChange}
        onClick={handleMenuClick}
        inlineCollapsed={isCollapsed}
        items={menuItems}
        className="bg-transparent border-none sidebar-menu"
      />
    );
  };

  const handleMenuClick: MenuProps['onClick'] = (e) => {
    router.push(e.key);
  };

  const handleOpenChange = (keys: string[]) => {
    setOpenKeys(keys);
  };

  return (
    <>
      <div
        className={clsx(
          'sidebar-container flex flex-col h-screen items-start justify-start bg-surface-dark transition-all duration-500 overflow-y-auto border-r border-border-light flex-shrink-0',
          {
            'w-24': isCollapsed,
            'w-64': !isCollapsed,
            hidden:
              isCollapsed &&
              typeof window !== 'undefined' &&
              window.innerWidth < 768,
          },
        )}
        style={{ scrollbarWidth: 'none' }}
      >
        {/* Logo Section — driven by TenantContext, no hardcoded brand assets */}
        <div className="flex py-5 items-center w-full justify-start px-5">
          <div className="flex flex-col items-center gap-x-4 h-8 w-full pb-5">
            <Logo isCollapsed={isCollapsed} onClick={toggleNavbar} className="absolute left-5 top-5" />
          </div>
        </div>

        {/* Menu Section */}
        <div className="w-full px-1 mt-2 flex-1 overflow-y-auto">
          {/* Account Activation Section */}
          {!isKycVerified && (
            <div className="px-2 mb-4">
              <Button
                type="primary"
                icon={<FaUpload className="h-4 w-4" />}
                onClick={() => router.push('/kyc')}
                block
                style={{
                  background: 'var(--cta-gradient)',
                  border: 'none',
                  color: '#ffffff',
                  fontWeight: 600,
                  height: '40px',
                }}
                className="mb-2"
              >
                {!isCollapsed && 'Upload KYC Documents'}
              </Button>
              <Divider
                className="my-3 opacity-20"
                style={{ borderColor: 'var(--primary)' }}
              />
            </div>
          )}

          {/* Main Section */}
          {itemsBySection.main.length > 0 && (
            <>
              {renderMenuSection(itemsBySection.main, 'main')}
              <Divider
                className="my-2 opacity-20"
                style={{ borderColor: 'var(--primary)' }}
              />
            </>
          )}

          {/* Payment Products Section */}
          {itemsBySection['payment-products'].length > 0 && (
            <>
              {!isCollapsed && (
                <div className="px-4 py-2 text-xs font-semibold text-primary-mint/60 uppercase tracking-wider">
                  Payment Products
                </div>
              )}
              {renderMenuSection(
                itemsBySection['payment-products'],
                'payment-products',
              )}
              <Divider
                className="my-2 opacity-20"
                style={{ borderColor: 'var(--primary)' }}
              />
            </>
          )}

          {/* Cards Section */}
          {itemsBySection.cards.length > 0 && (
            <>
              <Divider
                className="my-2 opacity-20"
                style={{ borderColor: 'var(--primary)' }}
              />
              {!isCollapsed && (
                <div className="px-4 py-2 text-xs font-semibold text-primary-mint/60 uppercase tracking-wider">
                  Cards
                </div>
              )}
              {renderMenuSection(itemsBySection.cards, 'cards')}
            </>
          )}

          {/* Lending Section */}
          {itemsBySection.lending.length > 0 && (
            <>
              <Divider
                className="my-2 opacity-20"
                style={{ borderColor: 'var(--primary)' }}
              />
              {!isCollapsed && (
                <div className="px-4 py-2 text-xs font-semibold text-primary-mint/60 uppercase tracking-wider">
                  Lending
                </div>
              )}
              {renderMenuSection(itemsBySection.lending, 'lending')}
            </>
          )}

          {/* Customers Section (Offers hidden) */}
          {itemsBySection.customers.filter((i) => i.label !== 'Offers').length >
            0 &&
            renderMenuSection(
              itemsBySection.customers.filter((i) => i.label !== 'Offers'),
              'customers',
            )}

          {/* Developer Zone Section */}
          {itemsBySection['developer-zone'].length > 0 && (
            <>
              <Divider
                className="my-2 opacity-20"
                style={{ borderColor: 'var(--primary)' }}
              />
              {!isCollapsed && (
                <div className="px-4 py-2 text-xs font-semibold text-primary-mint/60 uppercase tracking-wider">
                  Developer
                </div>
              )}
              {renderMenuSection(itemsBySection['developer-zone'], 'developer-zone')}
            </>
          )}

          {/* UMS Section */}
          {itemsBySection.ums.length > 0 && (
            <>
              <Divider
                className="my-2 opacity-20"
                style={{ borderColor: 'var(--primary)' }}
              />
              {!isCollapsed && (
                <div className="px-4 py-2 text-xs font-semibold text-primary-mint/60 uppercase tracking-wider">
                  User Management
                </div>
              )}
              {renderMenuSection(itemsBySection.ums, 'ums')}
            </>
          )}
        </div>
      </div>

      <style jsx global>{`
        .sidebar-container::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </>
  );
};
