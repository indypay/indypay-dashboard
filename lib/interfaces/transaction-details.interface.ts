export interface TransactionDetailsApiResponse {
  statusCode: number;
  message: string;
  success: boolean;
  data: TransactionDetails;
}

interface TransactionDetails {
  id: string;
  transactionType: string;
  user: UserDetails;
  payInOrder: PayInOrderDetails | null;
  // payOutOrder: PayOutOrderDetails | null;
}

interface UserDetails {
  fullName: string;
  email: string;
  mobile: string;
  createdAt: string;
}

interface PayInOrderDetails {
  id: string;
  amount: string;
  orderId: string;
  status: string;
  commissionAmount: string;
  gstAmount: string;
  netPayableAmount: string;
  createdAt: string;
}

// interface PayOutOrderDetails {
//   // Define the structure if needed
// }

// Collections Types's

export interface CollectionsMerchantApiResponse {
  statusCode: number;
  message: string;
  success: boolean;
  data: TransactionData;
}

export interface TransactionData {
  id: string;
  amount: string;
  orderId: string;
  status: string;
  txnRefId: string;
  netPayableAmount: string;
  settlementStatus: string;
  createdAt: string;
  user: Users;
}

export interface Users {
  id: string;
  fullName: string;
  email: string;
  mobile: string;
  accountStatus: number;
}
