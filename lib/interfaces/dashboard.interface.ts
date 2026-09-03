export interface DashboardApiResponse {
  statusCode: number;
  message: string;
  success: boolean;
  data: Data;
}

export interface Data {
  payin: payin;
  payout: payout;
  settlement: settlement;
  recentTransactions?: RecentTransaction[];
  topMerchants?: TopMerchant[];
}

export interface RecentTransaction {
  date: string;
  transactionId: string;
  method: string;
  amount: string;
  status: string;
}

export interface TopMerchant {
  merchantName: string;
  merchantEmail: string;
  totalAmount: number;
  transactionCount: number;
}

export interface settlement {
  totalAmount: number | null;
  totalCount: number;
  successAmount: number | null;
  successCount: number;
  failedAmount: number | null;
  failedCount: number;
}

export interface payin {
  totalAmount: number | null;
  totalCount: number;
  successAmount: number | null;
  successCount: number;
  failedAmount: number | null;
  failedCount: number;
}

export interface payout {
  totalAmount: number | null;
  totalCount: number;
  successAmount: number | null;
  successCount: number;
  failedAmount: number | null;
  failedCount: number;
  totalAmountWithCharges?: number;
  successAmountWithCharges?: number;
  failedAmountWithCharges?: number;
}
