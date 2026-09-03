export interface TransactionApiResponse {
  data: Transaction[];
}

export interface Transaction {
  id: string;
  transactionType: string;
  user: User;
  payInOrder: PayInOrder | null;
  // payOutOrder: PayOutOrder | null;
}

export interface User {
  id: string;
}

export interface PayInOrder {
  id: string;
  amount: string;
  orderId: string;
  status: string;
  commissionAmount: string;
  gstAmount: string;
  netPayableAmount: string;
  createdAt: string;
}

// interface PayOutOrder {
//   // Define the structure if available
// }

export type CollectionsApiResponse = {
  data: CollectionsTransactionsData[] | MerchantCollectionsData[];
  pagination: Pagination;
};

export interface CollectionsTransactionsData {
  id: string;
  fullName: string;
  initiatedTotalAmount: string;
  successTotalAmount: string;
  failedTotalAmount: string;
  pendingTotalAmount: string;
  initiatedCommissionAmount: string;
  successCommissionAmount: string;
  failedCommissionAmount: string;
  pendingCommissionAmount: string;
  initiatedGstAmount: string;
  successGstAmount: string;
  failedGstAmount: string;
  pendingGstAmount: string;
  initiatedNetPayableAmount: string;
  successNetPayableAmount: string;
  failedNetPayableAmount: string;
  pendingNetPayableAmount: string;
  initiatedTotalCount: string;
  successCount: string;
  failedCount: string;
  pendingCount: string;
}

export interface MerchantCollectionsData {
  id: string;
  amount: string;
  orderId: string;
  status: string;
  txnRefId: string;
  utr: string;
  netPayableAmount: string;
  settlementStatus: string;
  createdAt: string;
  user: User;
}

export interface MerchantUser {
  id: string;
  fullName: string;
}

export interface Pagination {
  totalItems: number;
  limit: number;
  page: number;
}

export interface CollectionDetailsTransRes {
  data: {
    data: CollectionDetailsTransData[];
    pagination: Pagination;
  };
  // data: CollectionDetailsTransData[];
  // pagination?: Pagination;
}

export interface CollectionDetailsTransData {
  id: string;
  name: string;
  amount: string;
  orderId: string;
  status: string;
  txnRefId: string;
  utr: string;
  netPayableAmount: string;
  settlementStatus: string;
  createdAt: string;
  user: Users;
}

export interface Users {
  id: string;
  fullName: string;
}

export interface MerchantDetailsRes {
  message: string;
  data: MerchantDetailsData[];
}

export interface MerchantDetailsData {
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

export interface UsersDetails {
  id: string;
  fullName: string;
  email: string;
  mobile: string;
  accountStatus: number;
}

export interface CardStats {
  todayCollections: number;
  todaySuccess: number;
  todayFailed: number;
}
