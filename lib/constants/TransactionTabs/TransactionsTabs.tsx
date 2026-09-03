export interface tabsProps {
  id: string;
  label: string;
  value: string;
  roles?: string[];
}
const TransactionsTabs: tabsProps[] = [
  {
    id: '/transactions',
    label: 'Transactions',
    value: '/transactions',
  },
  {
    id: '/transactions/recent-transactions',
    label: 'Recent Transactions',
    value: '/recent-transactions',
  },
  {
    id: '/transactions/update-transactions',
    label: 'Update Transactions',
    value: '/update-transactions',
  },
  {
    id: '/transactions/search',
    label: 'Search',
    value: '/search',
  },
  {
    id: '/transactions/download-transactions',
    label: 'Transaction Download',
    value: '/download-transactions',
  },
];

export default TransactionsTabs;
