export interface IPagination {
  total: number;
  page: number;
  limit: number;
}

export interface ISettlementResponse {
  data: ISettlementData[];
  pagination: IPagination;
}

export interface ISettlementData {
  id: string;
  collectionAmount: string;
  serviceCharge: string;
  amountAfterDeduction: number;
  transferMode: string;
  status: string;
  remarks: string;
  transferId: string;
  utr: string;
  createdAt: string;
  user: Users;
  settledBy: ISettledBy;
  bankDetails?: IBankDetails;
}

export interface IBankDetails {
  id: string;
  name: string;
  bankName: string;
  accountNumber: string;
  bankIFSC: string;
}

export interface ISettledBy {
  fullName: string;
}

export interface Users {
  fullName: string;
}

export interface ISettlementStatsResponse {
  data: ISettlementStats;
}

export interface ISettlementStats {
  todayTotalCollections: number;
  todayTotalSettlements: number;
  todayTotalUnSettled: number;
}

export interface ISettlementDetailsResponse {
  data: ISettlementDetails[];
  pagination: IPagination;
}

export interface ISettlementDetails {
  id: string;
  name: string;
  totalCollections: number;
  serviceChange: number;
  collectionAfterDeduction: number;
}

export interface IUnsettledCollectionsResponse {
  data: ISettlementDetails[];
  pagination: IPagination;
}

export interface ICheckSettlementStatusResponse {
  data: ICheckSettlementStatus;
}

export interface ICheckSettlementStatus {
  settlementId: string;
  status: string;
  amount: string;
}
