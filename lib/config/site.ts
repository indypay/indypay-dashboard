import { VscHistory } from 'react-icons/vsc';
import { GrTransaction } from 'react-icons/gr';
import { PiHandDepositBold } from 'react-icons/pi';
import { CgFileDocument } from 'react-icons/cg';
import { GiReceiveMoney } from 'react-icons/gi';
import { CiSettings } from 'react-icons/ci';
import { FaMoneyBillTransfer, FaUserShield } from 'react-icons/fa6';
import {
  FaFileAlt,
  FaHandshake,
  FaQrcode,
  FaCode,
  FaShoppingCart,
  FaGift,
  FaMobileAlt,
  FaMousePointer,
  FaLayerGroup,
  FaFileInvoice,
} from 'react-icons/fa';
import { SiPicpay } from 'react-icons/si';
import { FaUsers } from 'react-icons/fa';
import { FaStore } from 'react-icons/fa';
import { FaCogs } from 'react-icons/fa';
import { WalletIcon } from '@heroicons/react/24/outline';
import AnalyticsIcon from '@/public/assests/Icon/AnalyticsIcon';
import { TbBrandGoogleAnalytics, TbFileImport } from 'react-icons/tb';
import { LiaFileInvoiceSolid } from 'react-icons/lia';
import PayoutSVG from '@/public/assests/Icon/PayoutSVG';
import { HiCode, HiServer } from 'react-icons/hi';
import { MdApi, MdAnalytics, MdOutlineReportProblem, MdSpaceDashboard } from 'react-icons/md';

export type SiteConfig = typeof siteConfig;

export type NavSection =
  | 'main'
  | 'payment-products'
  | 'cards'
  | 'lending'
  | 'customers'
  | 'developer-zone'
  | 'others'
  | 'ums';

export interface NavItem {
  label: string;
  href: string;
  icon: React.ComponentType<any>;
  subMenu?: Array<{
    label: string;
    href: string;
    icon?: React.ComponentType<any>;
  }>;
  section: NavSection;
}

export const siteConfig = {
  name: 'RupeeFlow PG',
  description: 'RupeeFlow PG',
  navItems: [
    // Main Section
    {
      label: 'Home',
      href: '/summary/overview',
      icon: MdSpaceDashboard,
      section: 'main' as NavSection,
    },
    // {
    //   label: 'DashBoard',
    //   href: '/home',
    //   icon: RxDashboard,
    // },
    {
      label: 'Transactions',
      href: '/transactions',
      icon: GrTransaction,
      section: 'main' as NavSection,
      subMenu: [
        {
          label: 'Collections',
          href: '/transactions',
          icon: GrTransaction,
        },
        {
          label: 'Payouts',
          href: '/payout',
          icon: PayoutSVG,
        },
      ],
    },
    {
      label: 'Disputes',
      href: '/disputes',
      icon: MdOutlineReportProblem,
      section: 'main' as NavSection,
    },
    // {
    //   label: 'Payouts',
    //   href: '/payout',
    //   icon: PayoutSVG,
    //   subMenu: [
    //     {
    //       label: 'Dashboard',
    //       href: '/payout',
    //     },
    //     {
    //       label: 'Payout Wallet',
    //       href: '/payout/payout-wallet',
    //       icon: WalletIcon,
    //     },
    //   {
    //     label: 'Manual Payout',
    //     href: '/payout/manual-payout',
    //     icon: PiHandDepositBold,
    //   },
    // {
    //   label: 'Bulk Payout',
    //   href: '/payout/bulk-payout',
    //   icon: FaMoneyBillTransfer,
    // },
    //   {
    //     label: 'Payout Transactions',
    //     href: '/payout/payout-transactions',
    //     icon: GrTransaction,
    //   },
    // ],
    // },
    {
      label: 'Analytics',
      href: '/summary/analytics/business-trends',
      icon: TbBrandGoogleAnalytics,
      section: 'main' as NavSection,
    },
    {
      label: 'Platform Billing',
      href: '/operations/platform-billing',
      icon: LiaFileInvoiceSolid,
      section: 'main' as NavSection,
    },
    {
      label: 'Bank report import',
      href: '/operations/bank-report-import',
      icon: TbFileImport,
      section: 'main' as NavSection,
    },
    {
      label: 'Reports',
      href: '/reports',
      icon: FaFileAlt,
      section: 'main' as NavSection,
    },
    {
      label: 'Account & Settings',
      href: '/settings',
      icon: CiSettings,
      section: 'main' as NavSection,
    },
    // Payment Products Section
    // {
    //   label: 'Payment Pages',
    //   href: '/payment-pages',
    //   icon: FaLayerGroup,
    //   section: 'payment-products' as NavSection,
    // },
    {
      label: 'Payment Button',
      href: '/payment-button',
      icon: FaMousePointer,
      section: 'payment-products' as NavSection,
    },
    {
      label: 'Payment Links',
      href: '/payment-links',
      icon: FaHandshake,
      section: 'payment-products' as NavSection,
    },
    {
      label: 'Checkout Pages',
      href: '/checkout-pages',
      icon: FaShoppingCart,
      section: 'payment-products' as NavSection,
    },
    {
      label: 'QR Codes',
      href: '/qr-codes',
      icon: FaQrcode,
      section: 'payment-products' as NavSection,
    },
    {
      label: 'Invoices',
      href: '/invoices',
      icon: FaFileInvoice,
      section: 'payment-products' as NavSection,
    },
    // {
    //   label: 'Rupeeflow.link',
    //   href: '/rupeeflow-link',
    //   icon: FaLink,
    //   section: 'payment-products' as NavSection,
    // },
    // Cards Section
    {
      label: 'Prepaid Cards',
      href: '/prepaid-cards',
      icon: FaLayerGroup,
      section: 'cards' as NavSection,
    },
    // Customers Section
    {
      label: 'Customers',
      href: '/users',
      icon: FaUsers,
      section: 'customers' as NavSection,
    },
    {
      label: 'Offers',
      href: '/offers',
      icon: FaGift,
      section: 'customers' as NavSection,
    },
    // Developer Zone Section
    {
      label: 'API Reference',
      href: '/api-reference',
      icon: HiCode,
      section: 'developer-zone' as NavSection,
    },
    {
      label: 'API Requests',
      href: '/developer/api-requests',
      icon: MdApi,
      section: 'developer-zone' as NavSection,
    },
    {
      label: 'Traffic & Logs',
      href: '/developer/traffic-logs',
      icon: MdAnalytics,
      section: 'developer-zone' as NavSection,
    },
    // Others Section
    {
      label: 'Apps & Deals',
      href: '/apps-deals',
      icon: FaMobileAlt,
      section: 'others' as NavSection,
    },
    // UMS Section
    {
      label: 'User Management',
      href: '/ums',
      icon: FaUserShield,
      section: 'ums' as NavSection,
    },
    // Legacy items (for ops/admin roles - can be filtered)
    {
      label: 'Settlements',
      href: '/settlement/settlement-transactions',
      icon: FaMoneyBillTransfer,
      section: 'main' as NavSection,
    },
    // {
    //   label: 'Users',
    //   href: '/users',
    //   icon: FaUsers,
    //   section: 'customers' as NavSection,
    //   subMenu: [
    //     {
    //       label: 'Merchants',
    //       href: '/users/merchants',
    //       icon: FaStore,
    //     },
    //     {
    //       label: 'Channel Partners',
    //       href: '/users/channel-partners',
    //       icon: FaHandshake,
    //     },
    //     {
    //       label: 'Operations',
    //       href: '/users/operations',
    //       icon: FaCogs,
    //     },
    //   ],
    // },
    // {
    //   label: "Account",
    //   href: "/account",
    //   icon: RxAvatar,
    // },
    // {
    //   label: "Sign Out",
    //   href: "/logout",
    //   icon: TbLogout,
    // },
  ],
  navMenuItems: [
    {
      label: 'Profile',
      href: '/profile',
    },
    {
      label: 'Dashboard',
      href: '/dashboard',
    },
    {
      label: 'Projects',
      href: '/projects',
    },
    {
      label: 'Team',
      href: '/team',
    },
    {
      label: 'Calendar',
      href: '/calendar',
    },
    {
      label: 'Settings',
      href: '/settings',
    },
    {
      label: 'Help & Feedback',
      href: '/help-feedback',
    },
  ],
};
