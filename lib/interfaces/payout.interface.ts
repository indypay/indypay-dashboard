import { StringValidation } from 'zod';
import { MerchantDetailsData } from './transactions.interface';

export interface IPagination {
  total: number;
  page: number;
  limit: number;
}

export interface IPayoutResponse {
  data: IPayoutData[];
  pagination: IPagination;
}

export interface IPayoutData {
  amount: number;
  purpose: string;
  beneficiaryName: string;
  accountNumber: string;
  ifscCode: string;
  remarks: string;
  paymentMode: string;
  orderId: string;
  createdAt: string;
  status: string;
  txnId: string;
}

export interface ManualPayout {
  data: IManualPayout[];
}

export interface IManualPayout {
  amount: number;
  purpose: string;
  beneficiaryName: string;
  accountNumber: string;
  ifscCode: string;
  remarks: string;
  paymentMode: 'IMPS';
  bankName: string;
  payoutId: string;
  beneficiaryMobile: string;
}

export type PayoutApiResponse = {
  data: PayoutTransactionsData[] | MerchantPayoutCollectionsData[];
  pagination: Pagination;
};

export interface PayoutTransactionsData {
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

export interface MerchantPayoutCollectionsData {
  id: string;
  amount: string;
  amountBeforeDeduction: string;
  orderId: string;
  payoutId: string;
  status: string;
  transferId: string;
  utr: string;
  createdAt: string;
  user: User;
}

export interface User {
  id: string;
  fullName: string;
  commissionInPercentagePayout: string;
  gstInPercentagePayout: string;
}

export interface Pagination {
  totalItems: number;
  limit: number;
  page: number;
}

export interface MerchantPayoutDetailsTransRes {
  data: PayoutDetailsTransData[];
  pagination?: Pagination;
  stats?: PayoutCardStats;
}

export interface PayoutDetailsTransData {
  id: string;
  amount: string;
  amountBeforeDeduction: string;
  orderId: string;
  payoutId: string;
  status: string;
  transferId: string;
  createdAt: string;
  utr: string;
  user: Users;
}

export interface Users {
  id: string;
  fullName: string;
  commissionInPercentagePayout: string;
  gstInPercentagePayout: string;
}

export interface PayoutStatusRes {
  data: {
    message: string;
    status: string;
  };
}
export interface MerchantPayoutRes {
  message: string;
  data: MerchantPayoutData[];
}

export interface MerchantPayoutData {
  id: string;
  amount: string;
  orderId: string;
  transferMode: string;
  status: string;
  utr: string;
  payoutId: string;
  transferId: string;
  createdAt: string;
  user: UsersDetails;
}

export interface UsersDetails {
  id: string;
  fullName: string;
  email: string;
  mobile: string;
  accountStatus: number;
}

export interface PayoutCardStats {
  totalPayouts: number;
  totalSuccess: number;
  totalFailed: number;
  totalPayoutsWithCharges: number;
  totalSuccessWithCharges: number;
  totalFailedWithCharges: number;
}
