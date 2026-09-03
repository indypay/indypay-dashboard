import { generateULID } from './utils';

export const chargesTabs = [
  {
    id: '1',
    label: 'Charges',
  },
  {
    id: '2',
    label: 'Refunds',
  },
];

export const settleTabs = [
  {
    id: '1',
    label: 'Settle Data',
  },
  {
    id: '2',
    label: 'Batch 1 (12AM-09AM)',
  },
  {
    id: '3',
    label: 'Batch 2 (09AM-02PM)',
  },
  {
    id: '4',
    label: 'Batch 3 (02PM-07AM)',
  },
  {
    id: '5',
    label: 'Batch 4 (07AM-12AM)',
  },
];

export const transactionsTabs = [
  {
    id: '1',
    label: 'Transactions',
  },
  {
    id: '2',
    label: 'RupeeFlow Adjustments',
  },
  {
    id: '3',
    label: 'Bulk Adjustments',
  },
];

export const refundRows = [
  {
    key: '1',
    name: 'Tony Reichert',
    amount: 1238799,
    status: 'Success',
    transactionId: generateULID('txn'),
    refundId: generateULID('rfd'),
    createdAt: '2020-01-01',
  },
  {
    key: '2',
    name: 'Zoey Lang',
    amount: 123799,
    status: 'Pending',
    transactionId: generateULID('txn'),
    refundId: generateULID('rfd'),
    createdAt: '2020-01-01',
  },
  {
    key: '3',
    name: 'Jane Fisher',
    amount: 32399,
    status: 'Success',
    transactionId: generateULID('txn'),
    refundId: generateULID('rfd'),
    createdAt: '2020-01-01',
  },
  {
    key: '4',
    name: 'William Howard',
    amount: 5238799,
    status: 'Failed',
    transactionId: generateULID('txn'),
    refundId: generateULID('rfd'),
    createdAt: '2020-01-01',
  },
];

export const refundColumns = [
  {
    key: 'name',
    label: 'NAME',
  },
  {
    key: 'refundId',
    label: 'Refund ID',
  },
  {
    key: 'transactionId',
    label: 'Transaction ID',
  },
  {
    key: 'amount',
    label: 'Amount',
  },
  {
    key: 'status',
    label: 'Status',
  },
  {
    key: 'createdAt',
    label: 'Created At',
  },
];

export const chargeRows = [
  {
    key: '1',
    name: 'Tony Reichert',
    amount: 1238799,
    status: 'Success',
    transactionId: generateULID('txn'),
    createdAt: '2020-01-01',
  },
  {
    key: '2',
    name: 'Zoey Lang',
    amount: 123799,
    status: 'Pending',
    transactionId: generateULID('txn'),
    createdAt: '2020-01-01',
  },
  {
    key: '3',
    name: 'Jane Fisher',
    amount: 32399,
    status: 'Success',
    transactionId: generateULID('txn'),
    createdAt: '2020-01-01',
  },
  {
    key: '1',
    name: 'Tony Reichert',
    amount: 1238799,
    status: 'Success',
    transactionId: generateULID('txn'),
    createdAt: '2020-01-01',
  },
  {
    key: '2',
    name: 'Zoey Lang',
    amount: 123799,
    status: 'Pending',
    transactionId: generateULID('txn'),
    createdAt: '2020-01-01',
  },
  {
    key: '3',
    name: 'Jane Fisher',
    amount: 32399,
    status: 'Success',
    transactionId: generateULID('txn'),
    createdAt: '2020-01-01',
  },
  {
    key: '1',
    name: 'Tony Reichert',
    amount: 1238799,
    status: 'Success',
    transactionId: generateULID('txn'),
    createdAt: '2020-01-01',
  },
  {
    key: '2',
    name: 'Zoey Lang',
    amount: 123799,
    status: 'Pending',
    transactionId: generateULID('txn'),
    createdAt: '2020-01-01',
  },
  {
    key: '3',
    name: 'Jane Fisher',
    amount: 32399,
    status: 'Success',
    transactionId: generateULID('txn'),
    createdAt: '2020-01-01',
  },
];

export const chargeColumns = [
  {
    key: 'name',
    label: 'NAME',
  },
  {
    key: 'transactionId',
    label: 'Transaction ID',
  },
  {
    key: 'amount',
    label: 'Amount',
  },
  {
    key: 'status',
    label: 'Status',
  },
  {
    key: 'createdAt',
    label: 'Created At',
  },
];
