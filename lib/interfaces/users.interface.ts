import { DocumentInfo } from '@/app/kyc/store/useKycStore';
import { safeAny } from './global.interface';

export interface Director {
  id: string;
  name: string;
  pan: string;
  aadharNumber: string;
  panCardDoc: DocumentInfo;
  aadharCardDoc: DocumentInfo;
  createdAt: string;
  updatedAt: string;
}

export interface UsersApiResponse {
  statusCode: number;
  message: string;
  success: boolean;
  data: UserData;
}

interface UserData {
  id: string;
  firstName: string;
  lastName: string;
  fullName: string;
  email: string;
  mobile: string;
  accountStatus: number;
  role: number;
  onboardingStatus: number;
  image: string | null;
  payInWebhookUrl: string | null;
  payOutWebhookUrl: string | null;
  createdAt: string; // Consider using Date if you plan to manipulate this as a date
  updatedAt: string; // Consider using Date if you plan to manipulate this as a date
  businessDetails: BusinessDetails;
  kyc: safeAny; // Define a more specific type if KYC structure is known
  twoFactorEnabled: boolean;
}

interface BusinessDetails {
  id: string;
  businessEntityType: number;
  businessName: string;
  designation: string;
  turnover: number;
  industry: number;
  registerBusinessNumber: string;
  businessIndustry: string;
  businessAddress: string;
  businessPan: string;
  websiteUrl: string;
  directors: Director[];
  createdAt: string; // Consider using Date if you plan to manipulate this as a date
  updatedAt: string; // Consider using Date if you plan to manipulate this as a date
}

export interface AddressApiRequest {
  address: string;
  city: string;
  state: string;
  country: string;
  pincode: string;
  userId: string | undefined;
}

export interface AddressApiResponse {
  statusCode: number;
  message: string;
  success: boolean;
  data: AddressData;
}

interface AddressData {
  message: string;
}

export interface AddressListResponse {
  statusCode: number;
  message: string;
  success: boolean;
  data: AddressListData;
}

export interface AddressListData {
  id: string;
  address: string;
  city: string;
  state: string;
  country: string;
  pincode: string;
  createdAt: string; // Consider using Date if you plan to manipulate this as a date
  updatedAt: string; // Consider using Date if you plan to manipulate this as a date
}

export interface BusinessDetailsApiRequest {
  businessEntityType: number;
  businessName: string;
  designation: string;
  turnover: number;
  industry: number;
}

export interface IAdminUser {
  id: string;
  fullName: string;
  email: string;
  mobile: string;
  accountStatus: number;
  onboardingStatus: number;
  role: number;
  createdAt: string;
  updatedAt: string;
}

export interface AdminUserListResponse {
  data: {
    data: IAdminUser[];
    pagination: {
      totalItems: number;
      limit: number;
      page: number;
    };
  };
}

export interface KYCDocument {
  id: string;
  documentUrl: string;
  /** Short-lived signed GET URL from GET /api/v1/kyc/documents/:userId */
  url?: string;
  documentType: string;
  documentName: string;
}

export interface KYCDetails {
  data: KYCDocument[];
  message: string;
}

export interface editCountRequest {
  userId: string;
  count: number;
}

export interface editCountResponse {
  message: string;
}

export interface getCountResponse {
  data: {
    count: number;
  };
}
