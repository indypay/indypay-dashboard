export interface IBankDetailsResponse {
  data: IBankDetails;
}

export interface IBankDetails {
  name: string;
  email: string;
  mobile: string;
  bankName: string;
  bankIFSC: string;
  accountNumber: string;
}

export interface UserBankDetails {
  id: string;
  name: string;
  email: string;
  mobile: string;
  bankName: string;
  bankIFSC: string;
  accountNumber: string;
}

export interface BankListResponse {
  data: BankList[];
}

export interface BankList {
  id: string;
  name: string;
  email: string;
  mobile: string;
  bankName: string;
  bankIFSC: string;
  accountNumber: string;
}
