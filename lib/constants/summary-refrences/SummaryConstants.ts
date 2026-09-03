import { USERS_ROLE } from '@/lib/enum';

export interface SettingsTabsProps {
  id: string;
  label: string;
  value: string;
  roles: string[];
}
const SettingsTabs: SettingsTabsProps[] = [
  {
    id: '/summary/',
    label: 'Overview',
    value: '/overview',
    roles: [
      USERS_ROLE.MERCHANT,
      USERS_ROLE.CHANNEL_PARTNER,
      USERS_ROLE.OPS,
      USERS_ROLE.ADMIN,
      USERS_ROLE.OWNER,
    ],
  },
  {
    id: '/settings/onboarding',
    label: 'Onboarding',
    value: '/onboarding',
    roles: [USERS_ROLE.ADMIN, USERS_ROLE.OWNER],
  },
  // {
  //   id: "/settings/business-details",
  //   label: "Business Details",
  //   value: "/business-details",
  // },

  {
    id: '/settings/security',
    label: 'Security',
    value: '/security',
    roles: [
      USERS_ROLE.MERCHANT,
      USERS_ROLE.CHANNEL_PARTNER,
      USERS_ROLE.OPS,
      USERS_ROLE.ADMIN,
      USERS_ROLE.OWNER,
    ],
  },
  {
    id: '/settings/developer',
    label: 'Developer',
    value: '/developer',
    roles: [USERS_ROLE.MERCHANT, USERS_ROLE.ADMIN, USERS_ROLE.OWNER],
  },
  // {
  //   id: "/settings/pricing",
  //   label: "Billing",
  //   value: "/pricing",
  // },
  // {
  //   id: "/settings/api-reference",
  //   label: "API Reference",
  //   value: "/api-reference",
  // },
  {
    id: '/settings/bank-details',
    label: 'Bank Details',
    value: '/bank-details',
    roles: [USERS_ROLE.MERCHANT, USERS_ROLE.ADMIN, USERS_ROLE.OWNER],
  },
  {
    id: '/settings/address-details',
    label: 'Address Details',
    value: '/address-details',
    roles: [
      USERS_ROLE.MERCHANT,
      USERS_ROLE.CHANNEL_PARTNER,
      USERS_ROLE.OPS,
      USERS_ROLE.ADMIN,
      USERS_ROLE.OWNER,
    ],
  },
  {
    id: '/settings/config',
    label: 'Config',
    value: '/config',
    roles: [USERS_ROLE.OWNER],
  },
];

export default SettingsTabs;
