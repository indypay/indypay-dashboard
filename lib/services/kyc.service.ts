import { AxiosError } from 'axios';

import httpClient from '@/app/api/axios';
import { safeAny } from '../interfaces/global.interface';
import {
  KYBData,
  PersonalInfo as StorePersonalInfo,
  BusinessStructureData,
} from '@/app/kyc/store/useKycStore';

export type DocumentType =
  | 'panCard'
  | 'aadharNumber'
  | 'bankStatement'
  | 'addressProof'
  | 'moa'
  | 'aoa'
  | 'coi'
  | 'gstinCertificate'
  | 'companyPan'
  | 'companyCheque';

export interface UploadParams {
  fileName: string;
  fileType: string;
  documentType: DocumentType;
}

export interface ApiResponse<T = safeAny> {
  statusCode: number;
  message: string;
  success: boolean;
  data: T;
}

export interface PresignedUrlData {
  documentType: string;
  fileUrl: string;
  presignedUrl: string;
  headers?: Record<string, string>;
}

export interface PresignedUrlResponse {
  url: string;
  headers?: Record<string, string>;
}

export interface DocumentInfo {
  url: string;
  docType: string;
  name: string;
}

export interface KycSubmitData {
  personalInfo: StorePersonalInfo;
  kybInfo: KYBData;
  businessStructure: BusinessStructureData;
  documents: Record<DocumentType, DocumentInfo>;
}

export interface VerifyPanData {
  verified: boolean;
  message?: string | null;
  pan?: string | null;
  name?: string | null;
  firstName?: string | null;
  middleName?: string | null;
  lastName?: string | null;
  gender?: string | null;
  dob?: string | null;
  mobile?: string | null;
  email?: string | null;
  panStatus?: string | null;
  panIssueDate?: string | null;
  fatherName?: string | null;
  isSoleProprietor?: boolean | null;
  isDirector?: boolean | null;
  isSalaried?: boolean | null;
  aadhaarLinked?: boolean | null;
  aadhaarMatch?: boolean | null;
  address?: string | null;
}

export interface VerifyAadhaarMobileLinkData {
  verified: boolean;
  message?: string | null;
  validId?: boolean | null;
  isMobileLinked?: boolean | null;
  isVerified?: boolean | null;
}

export const kycService = {
  getPresignedUrl: async ({
    fileName,
    fileType,
    documentType,
  }: UploadParams): Promise<PresignedUrlResponse> => {
    try {
      const response = await httpClient.post<ApiResponse<PresignedUrlData>>(
        '/api/v1/kyc/document/presigned-url',
        {
          fileName,
          fileType,
          documentType,
        },
      );

      if (!response.data?.data?.presignedUrl) {
        throw new Error('Response missing presignedUrl field');
      }

      return {
        url: response.data.data.presignedUrl,
        headers: response.data.data.headers,
      };
    } catch (error) {
      const axiosError = error as AxiosError;
      console.error('Presigned URL error:', {
        message: axiosError.message,
        response: axiosError.response?.data,
      });
      throw error;
    }
  },

  uploadToS3: async (
    file: File,
    presignedData: PresignedUrlResponse,
  ): Promise<string> => {
    try {
      const headers: HeadersInit = {
        'Content-Type': file.type,
        ...(presignedData.headers || {}),
      };

      const response = await fetch(presignedData.url, {
        method: 'PUT',
        headers,
        body: file,
        mode: 'cors',
        credentials: 'omit',
      });

      if (!response.ok) {
        throw new Error(`Upload failed with status: ${response.status}`);
      }

      return presignedData.url.split('?')[0];
    } catch (error) {
      console.error('S3 upload error:', error);
      throw error;
    }
  },

  submitKyc: async (data: KycSubmitData): Promise<ApiResponse> => {
    try {
      const response = await httpClient.post<ApiResponse>(
        '/api/v1/kyc/submit-full',
        data,
      );
      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError;
      console.error('KYC submission error:', {
        message: axiosError.message,
        response: axiosError.response?.data,
      });
      throw error;
    }
  },

  verifyPan: async (pan: string): Promise<ApiResponse<VerifyPanData>> => {
    try {
      const response = await httpClient.post<ApiResponse<VerifyPanData>>(
        '/api/v1/kyc/verify/pan',
        { pan: pan.toUpperCase(), consent: 'Y' },
      );
      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError;
      console.error('PAN verify error:', {
        message: axiosError.message,
        response: axiosError.response?.data,
      });
      throw error;
    }
  },

  verifyAadhaarMobileLink: async (
    aadhaarNumber: string,
  ): Promise<ApiResponse<VerifyAadhaarMobileLinkData>> => {
    try {
      const response = await httpClient.post<
        ApiResponse<VerifyAadhaarMobileLinkData>
      >('/api/v1/kyc/verify/aadhaar/mobile-link', {
        aadhaarNumber: aadhaarNumber.replace(/\s/g, ''),
        consent: 'Y',
      });
      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError;
      console.error('Aadhaar mobile-link verify error:', {
        message: axiosError.message,
        response: axiosError.response?.data,
      });
      throw error;
    }
  },
};
