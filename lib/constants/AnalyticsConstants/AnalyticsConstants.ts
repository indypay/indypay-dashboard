import { USERS_ROLE } from '@/lib/enum';

export interface AnalyticsTabsProps {
  id: string;
  label: string;
  value: string;
  roles: string[];
}

const AnalyticsTabs: AnalyticsTabsProps[] = [
  {
    id: '/summary/analytics/business-trends',
    label: 'Business Trends',
    value: '/business-trends',
    roles: [
      USERS_ROLE.MERCHANT,
      USERS_ROLE.CHANNEL_PARTNER,
      USERS_ROLE.OPS,
      USERS_ROLE.ADMIN,
      USERS_ROLE.OWNER,
    ],
  },
  {
    id: '/summary/analytics/conversion-rate',
    label: 'Conversion Rate',
    value: '/conversion-rate',
    roles: [
      USERS_ROLE.MERCHANT,
      USERS_ROLE.CHANNEL_PARTNER,
      USERS_ROLE.OPS,
      USERS_ROLE.ADMIN,
      USERS_ROLE.OWNER,
    ],
  },
  {
    id: '/summary/analytics/payment-failure',
    label: 'Payment Failure',
    value: '/payment-failure',
    roles: [
      USERS_ROLE.MERCHANT,
      USERS_ROLE.CHANNEL_PARTNER,
      USERS_ROLE.OPS,
      USERS_ROLE.ADMIN,
      USERS_ROLE.OWNER,
    ],
  },
  {
    id: '/summary/analytics/success-rate',
    label: 'Success Rate',
    value: '/success-rate',
    roles: [
      USERS_ROLE.MERCHANT,
      USERS_ROLE.CHANNEL_PARTNER,
      USERS_ROLE.OPS,
      USERS_ROLE.ADMIN,
      USERS_ROLE.OWNER,
    ],
  },
];

export default AnalyticsTabs;
