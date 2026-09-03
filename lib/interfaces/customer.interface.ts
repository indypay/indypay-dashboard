export interface ICustomerRequest {
  name: string;
  email: string;
  gstin: string;
  contactNumber: string;
  addressLine1: string;
  addressLine2: string;
  pincode: string;
  city: string;
  state: string;
  country: string;
}

export interface ICustomerResponse {
  message: string;
}

export interface ICustomerDetailsResponse {
  data: ICustomerDetails;
  message: string;
}

export interface ICustomerDetails {
  name: string;
  email: string;
  gstin: string;
  contactNumber: string;
  addressLine1: string;
  addressLine2: string;
  pincode: string;
  city: string;
  state: string;
  country: string;
  id?: string;
}

export interface ICustomer {
  name: string;
  id: string;
}

export interface ICustomerList {
  data: ICustomer[];
  message: string;
}
