export interface OperationsTabsProps {
  id: string;
  label: string;
  value: string;
}
const OperationsTabs: OperationsTabsProps[] = [
  {
    id: '/operations/unsettled',
    label: 'Unsettled',
    value: '/unsettled',
  },
  {
    id: '/operations/settled',
    label: 'Settled',
    value: '/settled',
  },
  {
    id: '/operations/pending',
    label: 'Pending',
    value: '/pending',
  },
];

export default OperationsTabs;

export const OperationsUnsettledColumns = [
  {
    key: 'name',
    label: 'Full Name',
  },
  {
    key: 'totalCollections',
    label: 'Total Unsettled Collections',
  },
  // {
  //   key: 'serviceChange',
  //   label: 'Service Change',
  // },
  // {
  //   key: 'collectionAfterDeduction',
  //   label: 'Unsettled Collection After Deduction',
  // },
  {
    key: 'settle',
    label: 'Settle',
  },
];

export const OperationsSettledColumns = [
  {
    key: 'fullName',
    label: 'Full Name',
  },
  {
    key: 'collectedAmount',
    label: 'Collected Amount',
  },
  {
    key: 'commissionAmount',
    label: 'Commission Amount',
  },
  {
    key: 'gstAmount',
    label: 'GST Amount',
  },
  {
    key: 'netPayableAmount',
    label: 'Net Payable Amount',
  },
  {
    key: 'utr',
    label: 'UTR',
  },
  {
    key: 'status',
    label: 'Status',
  },
];

export const OperationsPendingColumns = [
  {
    key: 'collectedAmount',
    label: 'Collected Amount',
  },
  {
    key: 'commissionAmount',
    label: 'Commission Amount',
  },
  {
    key: 'gstAmount',
    label: 'GST Amount',
  },
  {
    key: 'netPayableAmount',
    label: 'Net Payable Amount',
  },
  {
    key: 'utr',
    label: 'UTR',
  },
  {
    key: 'status',
    label: 'Status',
  },
];
