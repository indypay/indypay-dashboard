export interface IBankDetails {
  name: string;
  email: string;
  bankName: string;
  accountNumber: string;
  bankIFSC: string;
  mobile: string;
}

export interface IBankDetailsResponse {
  data: IBankDetails[];
}
