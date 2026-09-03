import { safeAny } from '@/lib/interfaces/global.interface';

export const UsersData = [
  {
    key: '1',
    name: 'Tony Reichert',
    role: 'CEO',
    status: 'Active',
  },
  {
    key: '2',
    name: 'Zoey Lang',
    role: 'Technical Lead',
    status: 'Paused',
  },
  {
    key: '3',
    name: 'Jane Fisher',
    role: 'Senior Developer',
    status: 'Active',
  },
  {
    key: '4',
    name: 'William Howard',
    role: 'Community Manager',
    status: 'Vacation',
  },
  {
    key: '5',
    name: 'Emily Collins',
    role: 'Marketing Manager',
    status: 'Active',
  },
  {
    key: '6',
    name: 'Brian Kim',
    role: 'Product Manager',
    status: 'Active',
  },
  {
    key: '7',
    name: 'Laura Thompson',
    role: 'UX Designer',
    status: 'Active',
  },
  {
    key: '8',
    name: 'Michael Stevens',
    role: 'Data Analyst',
    status: 'Paused',
  },
  {
    key: '9',
    name: 'Sophia Nguyen',
    role: 'Quality Assurance',
    status: 'Active',
  },
  {
    key: '10',
    name: 'James Wilson',
    role: 'Front-end Developer',
    status: 'Vacation',
  },
  {
    key: '11',
    name: 'Ava Johnson',
    role: 'Back-end Developer',
    status: 'Active',
  },
  {
    key: '12',
    name: 'Isabella Smith',
    role: 'Graphic Designer',
    status: 'Active',
  },
  {
    key: '13',
    name: 'Oliver Brown',
    role: 'Content Writer',
    status: 'Paused',
  },
  {
    key: '14',
    name: 'Lucas Jones',
    role: 'Project Manager',
    status: 'Active',
  },
  {
    key: '15',
    name: 'Grace Davis',
    role: 'HR Manager',
    status: 'Active',
  },
  {
    key: '16',
    name: 'Elijah Garcia',
    role: 'Network Administrator',
    status: 'Active',
  },
  {
    key: '17',
    name: 'Emma Martinez',
    role: 'Accountant',
    status: 'Vacation',
  },
  {
    key: '18',
    name: 'Benjamin Lee',
    role: 'Operations Manager',
    status: 'Active',
  },
  {
    key: '19',
    name: 'Mia Hernandez',
    role: 'Sales Manager',
    status: 'Paused',
  },
  {
    key: '20',
    name: 'Daniel Lewis',
    role: 'DevOps Engineer',
    status: 'Active',
  },
  {
    key: '21',
    name: 'Amelia Clark',
    role: 'Social Media Specialist',
    status: 'Active',
  },
  {
    key: '22',
    name: 'Jackson Walker',
    role: 'Customer Support',
    status: 'Active',
  },
  {
    key: '23',
    name: 'Henry Hall',
    role: 'Security Analyst',
    status: 'Active',
  },
  {
    key: '24',
    name: 'Charlotte Young',
    role: 'PR Specialist',
    status: 'Paused',
  },
  {
    key: '25',
    name: 'Liam King',
    role: 'Mobile App Developer',
    status: 'Active',
  },
];

export const MockTransactionData = [
  {
    serial_no: 1,
    date: '2024-09-20',
    transaction_type: 'Credit',
    amount: '5000.00',
    commission_amount: '200.00',
    net_amount: '4800.00',
    order_id: 'ORD123456',
    status: 'Completed',
    transaction_id: 'TXN789012',
    view_details: 'View',
  },
  {
    serial_no: 2,
    date: '2024-09-21',
    transaction_type: 'Debit',
    amount: '2500.00',
    commission_amount: '100.00',
    net_amount: '2400.00',
    order_id: 'ORD654321',
    status: 'Pending',
    transaction_id: 'TXN345678',
    view_details: 'View',
  },
  {
    serial_no: 3,
    date: '2024-09-22',
    transaction_type: 'Credit',
    amount: '7500.00',
    commission_amount: '300.00',
    net_amount: '7200.00',
    order_id: 'ORD789654',
    status: 'Failed',
    transaction_id: 'TXN123789',
    view_details: 'View',
  },
  {
    serial_no: 4,
    date: '2024-09-23',
    transaction_type: 'Debit',
    amount: '6000.00',
    commission_amount: '240.00',
    net_amount: '5760.00',
    order_id: 'ORD321654',
    status: 'Completed',
    transaction_id: 'TXN987654',
    view_details: 'View',
  },
  {
    serial_no: 5,
    date: '2024-09-24',
    transaction_type: 'Credit',
    amount: '3500.00',
    commission_amount: '140.00',
    net_amount: '3360.00',
    order_id: 'ORD852741',
    status: 'Completed',
    transaction_id: 'TXN963852',
    view_details: 'View',
  },
];

export const TransactionColumns: safeAny = [
  {
    key: 'serial_no',
    label: 'SI.No',
  },
  {
    key: 'date',
    label: 'Created At',
  },
  {
    key: 'transaction_type',
    label: 'Txn type',
  },
  {
    key: 'amount',
    label: 'Amount',
  },
  {
    key: 'commission_amount',
    label: 'Commission Amount',
  },
  {
    key: 'net_amount',
    label: 'Net Amount',
  },
  {
    key: 'order_id',
    label: 'Order Id',
  },
  {
    key: 'status',
    label: 'Status',
  },
  {
    key: 'transaction_id',
    label: 'Txn Id',
  },
  {
    key: 'view_details',
    label: 'View Details',
  },
  // {
  //   key: "transaction_id",
  //   label: "Transaction Id",
  // },
  // {
  //   key: "utr",
  //   label: "UTR",
  // },
  // {
  //   key: "merchant_name",
  //   label: "Merchant Name",
  // },
  // {
  //   key: "user_name",
  //   label: "User Name",
  // },
  // {
  //   key: "email",
  //   label: "Email",
  // },
  // {
  //   key: "phone",
  //   label: "phone",
  // },
  // {
  //   key: "amount",
  //   label: "Amount",
  // },
  // {
  //   key: "status",
  //   label: "Status",
  // },
  // {
  //   key: "date",
  //   label: "Date",
  // },
];
