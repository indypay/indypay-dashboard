export const getSettlementColumns = (isAdminUser: boolean) => [
  {
    key: 'fullName',
    label: 'Full Name',
  },
  {
    key: 'collectionAmount',
    label: 'Collection Amount',
  },
  {
    key: 'serviceCharge',
    label: 'Service Charge',
  },
  {
    key: 'amount',
    label: 'Amount',
  },
  {
    key: 'transferMode',
    label: 'Transfer Mode',
  },
  {
    key: 'transferId',
    label: 'Transfer Id',
  },
  {
    key: 'utr',
    label: 'UTR',
  },
  {
    key: 'status',
    label: 'Status',
  },
  {
    key: 'remarks',
    label: 'Remarks',
  },
  {
    key: 'createdAt',
    label: 'Created At',
  },
  {
    key: 'settledBy',
    label: 'Settled By',
  },
  {
    key: 'actions',
    label: 'Actions',
  },
  ...(isAdminUser
    ? [
        {
          key: 'generate-pdf',
          label: 'Download Settlement',
        },
      ]
    : []),
];
