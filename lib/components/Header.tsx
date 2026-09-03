'use client';

import React, { useState, useMemo } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { Button, Dropdown, Input } from 'antd';
import { siteConfig } from '@/lib/config/site';
import { FiSearch } from 'react-icons/fi';
import { DownCircleOutlined } from '@ant-design/icons';
// import { Skeleton } from '@heroui/react';

import Profile from './Profile/profile';
import NotificationBell from './Notification/NotificationBell';
import { useMode } from '@/lib/context/ModeContext';
import { TenantSwitcher } from '@/lib/components/TenantSwitcher';
import { useRole } from '@/lib/components/Role/RoleContext';
import { isAdmin } from '@/lib/utils/utils';

// const Simmer = () => {
//   return (
//     <div className="flex items-center justify-between p-5 h-24">
//       <Skeleton className="w-32 h-12 rounded-md dark:bg-default-200" />
//       <Skeleton className="w-80 h-14 rounded-md dark:bg-default-200" />
//     </div>
//   );
// };

interface HeaderProps {
  isCollapsed: boolean;
}

const Header = ({ isCollapsed }: HeaderProps) => {
  const pathName = usePathname();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');

  // Flatten all nav pages (top-level + submenu) into a searchable list
  const allPages = useMemo(() => {
    const pages: { label: string; href: string }[] = [];
    siteConfig.navItems.forEach((item) => {
      if (item.label && item.href) {
        pages.push({ label: item.label, href: item.href });
      }
      item.subMenu?.forEach((sub) => {
        if (sub.label && sub.href) {
          pages.push({ label: sub.label, href: sub.href });
        }
      });
    });
    return pages;
  }, []);

  const searchResults = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return [];
    return allPages.filter((p) => p.label.toLowerCase().includes(q));
  }, [searchQuery, allPages]);

  const handleSelectPage = (href: string) => {
    setSearchQuery('');
    router.push(href);
  };
  const { mode, setMode, isLoading: modeLoading, isTestModeLocked } = useMode();
  const { role } = useRole();
  const showTenantSwitcher = Boolean(role) && isAdmin(role);
  // const [isLoading, setIsLoading] = useState(false);

  const getPageTitle = () => {
    if (pathName && /^\/summary\/analytics(\/[^/]+)?$/.test(pathName)) {
      return 'Analytics';
    }
    if (pathName && /^\/summary\/overview(\/[^/]+)?$/.test(pathName)) {
      return 'Overview';
    }
    if (pathName && /^\/transactions\/[^/]+$/.test(pathName)) {
      return 'Merchant Transactions';
    }
    if (pathName && /^\/payout\/[^/]+$/.test(pathName)) {
      return 'Merchant Payout Transactions';
    }
    if (
      pathName &&
      /^\/payout\/payout-transactions(\/[^/]+)?$/.test(pathName)
    ) {
      return 'Settlements Transactions Details';
    }
    if (pathName && /^\/payout\/manual-payout(\/[^/]+)?$/.test(pathName)) {
      return 'Settlements';
    }
    if (pathName && /^\/settings\/bank-details(\/[^/]+)?$/.test(pathName)) {
      return 'Bank Details';
    }
    if (pathName && /^\/settings\/business-details(\/[^/]+)?$/.test(pathName)) {
      return 'Merchant Business Details';
    }
    if (pathName && /^\/settings\/onboarding(\/[^/]+)?$/.test(pathName)) {
      return 'Merchant Onboarding';
    }
    if (pathName && /^\/settings\/address-details(\/[^/]+)?$/.test(pathName)) {
      return 'Address Details';
    }
    if (pathName && /^\/settings\/security(\/[^/]+)?$/.test(pathName)) {
      return 'Security';
    }
    if (pathName && /^\/settings\/developer(\/[^/]+)?$/.test(pathName)) {
      return 'Developer';
    }
    if (pathName && /^\/settings\/profile(\/[^/]+)?$/.test(pathName)) {
      return 'Profile';
    }
    if (pathName && /^\/users\/[^/]+\/[^/]+$/.test(pathName)) {
      return 'Users';
    }
    if (pathName && /^\/kyc-pending\/[^/]+\/[^/]+$/.test(pathName)) {
      return 'KYC Pending';
    }
    if (pathName && /^\/payout\/payout-wallet\/[^/]+$/.test(pathName)) {
      return 'Payout Wallet Transactions';
    }
    switch (pathName) {
      // case '/home':
      //   return 'Dashboard';
      case '/transactions':
        return 'Collections';
      case '/payout':
        return 'Payout';
      case '/payout/payout-wallet':
        return 'Payout Wallet';
      case '/payout/manual-payout':
        return 'Manual Payout';
      case '/settlement/settlement-transactions':
        return 'Settlements';
      case '/analytics':
        return 'Analytics';
      case '/invoices':
      case '/invoices/create':
        return 'Invoice';
      case '/payment-link/create':
        return 'Create Payment Link';
      case 'business-details':
        return 'Business Details';
      case '/payment-link':
        return 'Payment Link';
      case '/settlements/charges':
        return 'Settlements';
      case '/history':
        return 'History';
      case '/operations/bank-report-import':
        return 'Bank settlement import';
      case '/operations/unsettled':
      case '/operations/settled':
      case '/operations/failed':
        return 'Operations';
      case '/settings/profile':
      case '/settings/security':
      case '/settings/developer':
      case '/settings/pricing':
      case '/settings/api-reference':
        return 'Settings';
      case '/settings/bank-details':
        return 'Bank Details';
      case '/about':
        return 'About';
      case '/docs':
        return 'Docs';
      case '/docs/payin':
        return 'Payin Docs';
      case '/docs/payout':
        return 'Payout Docs';
      case '/account':
        return 'Account';
      case '/logout':
        return 'LogOut';
      case '/transactions/[id]':
        return 'Merchant Transactions';
      case '/users/merchants':
        return 'Merchants';
      case '/users/channel-partners':
        return 'Channel Partners';
      case '/users/operations':
        return 'Operations';
      case '/kyc-pending':
      case '/kyc-pending/[id]':
        return 'KYC Pending';
      default:
        return 'Feedback';
    }
  };

  return (
    <div className="px-2 md:px-4 py-4 bg-surface-dark border-b border-border-light">
      <div className="flex items-center justify-between gap-2 md:gap-6">
        <div className="flex-1 max-w-2xl ml-0 md:ml-8 relative">
          <Input
            placeholder="Search..."
            prefix={<FiSearch className="text-muted text-lg md:text-xl" />}
            className="h-10 md:h-12 text-xs md:text-sm"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onPressEnter={() => {
              if (searchResults.length > 0) {
                handleSelectPage(searchResults[0].href);
              }
            }}
            style={{
              backgroundColor: 'var(--background)',
              borderColor: 'var(--border)',
              borderRadius: '16px',
              color: 'var(--text)',
            }}
            styles={{
              input: {
                backgroundColor: 'var(--background)',
                color: 'var(--text)',
              },
            }}
          />
          {searchQuery.trim() && (
            <div
              className="absolute left-0 right-0 mt-2 z-50 rounded-xl overflow-hidden shadow-lg"
              style={{
                backgroundColor: 'var(--surface)',
                border: '1px solid var(--border)',
              }}
            >
              {searchResults.length > 0 ? (
                searchResults.map((p) => (
                  <div
                    key={p.href + p.label}
                    onClick={() => handleSelectPage(p.href)}
                    className="px-4 py-3 cursor-pointer text-sm"
                    style={{ color: 'var(--text)' }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.backgroundColor =
                        'var(--sidebar-active-bg, var(--background))')
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.backgroundColor = 'transparent')
                    }
                  >
                    {p.label}
                  </div>
                ))
              ) : (
                <div
                  className="px-4 py-3 text-sm text-center"
                  style={{ color: 'var(--text-muted)' }}
                >
                  No pages found
                </div>
              )}
            </div>
          )}
        </div>

        <div className="flex items-center gap-2 md:gap-6">
          {showTenantSwitcher && <TenantSwitcher />}

          <Dropdown
            menu={{
              items: [
                {
                  label: 'Test Mode',
                  key: 'test-mode',
                  disabled: isTestModeLocked, // Disable test mode if KYC is verified
                },
                {
                  label: 'Live Mode',
                  key: 'live-mode',
                },
              ],
              onClick: ({ key }) => {
                if (key === 'test-mode') {
                  setMode('test');
                } else if (key === 'live-mode') {
                  setMode('live');
                }
              },
            }}
            trigger={['click']}
          >
            <Button
              type="primary"
              style={{
                background: 'linear-gradient(to right, #53BEC2, #00EF64)',
                border: 0,
              }}
            >
              <span className="flex items-center gap-2">
                {mode === 'live' ? 'Live Mode' : 'Test Mode'}
                <DownCircleOutlined className="text-white" />
              </span>
            </Button>
          </Dropdown>
          <NotificationBell />

          <div className="h-6 md:h-8 w-px bg-borderColor-white" />

          <div className="flex items-center gap-2 md:gap-3">
            <Profile />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
