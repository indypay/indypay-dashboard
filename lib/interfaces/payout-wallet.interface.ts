export interface ApiResponse {
  statusCode: number;
  message: string;
  success: boolean;
  data: PayoutWalletList;
}

export interface PayoutWalletList {
  data: List[];
  pagination: Pagination;
}

export interface Pagination {
  totalItems: number;
  limit: number;
  page: number;
}

export interface Wallet {
  id: string;
}

export interface List {
  id: string;
  fullName: string;
  email: string;
  mobile: string;
  wallet: Wallet | null;
}

export interface WalletDetailsData {
  data: TopupRecord[];
  pagination: Pagination;
  stats: Stats;
}

interface User {
  id: string;
  fullName: string;
  email?: string;
  mobile?: string;
}
export interface TopupRecord {
  id: string;
  collectionAmount: string;
  payInCharge: string;
  amountAfterPayinDeduction: string;
  payOutCharge: string;
  topUpAmount: string;
  createdAt: string;
  user: User;
  topupBy: Pick<User, 'id' | 'fullName'>;
}

interface Stats {
  totalTopup: string;
  availablePayout: string;
  totalPayout: string;
}

export interface TopUpRequest {
  amount: number;
  userId: string;
}
