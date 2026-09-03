import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

import { DocumentType } from '@/lib/services/kyc.service';

// ─── Verification Status ───────────────────────────────────────────────────────

export type VerifyStatus = 'idle' | 'verifying' | 'verified' | 'failed';

export interface PANVerification {
  status: VerifyStatus;
  verifiedName?: string; // Name returned by Karza API
  panType?: string; // Individual / Company
  message?: string;
}

export interface AadhaarVerification {
  status: VerifyStatus;
  /** @deprecated No Aadhaar OTP step; mobile-link API is used instead. Kept for persisted state compatibility. */
  otpSent: boolean;
  verifiedName?: string; // Name from Aadhaar eKYC
  maskedNumber?: string; // XXXX XXXX 4321
  address?: string; // Address from Aadhaar
  dob?: string;
  message?: string;
  /** True when Aadhaar is not linked to the account mobile (HTTP 400 from mobile-link). */
  mobileMismatch?: boolean;
  /** Success message from mobile-link verification */
  linkMessage?: string;
}

export interface GSTVerification {
  status: VerifyStatus;
  businessName?: string; // Auto-filled from GST data
  registeredAddress?: string;
  state?: string;
  city?: string;
  gstStatus?: string; // Active / Inactive
  filingStatus?: string; // Regular / Composition
  message?: string;
}

export interface CINVerification {
  status: VerifyStatus;
  companyName?: string;
  mcaStatus?: string; // Active / Struck Off
  message?: string;
}

export interface BankVerification {
  status: VerifyStatus;
  accountHolderName?: string; // Returned by penny drop
  bankName?: string; // From IFSC lookup
  branch?: string;
  message?: string;
}

// ─── Form Data ─────────────────────────────────────────────────────────────────

export interface PersonalInfo {
  fullName: string;
  panNumber: string;
  aadhaarNumber: string; // Store last-4 only after verification
}

export interface BusinessStructureData {
  gstNumber: string;
  businessName: string;
  typeOfBusiness: number | string;
  cinNumber?: string;
  industryName: string | number;
  turnover: string | number;
  yearEstablished?: string;
}

export interface KYBData {
  businessPan: string;
  registeredAddress: string;
  state: string;
  city: string;
  businessDescription: string;
  websiteUrl: string;
}

export interface BankData {
  accountNumber: string;
  ifscCode: string;
}

export interface DirectorKyc {
  name: string;
  din: string;
  pan: string;
  aadharNumber: string;
  panCardDoc?: DocumentInfo;
  aadharCardDoc?: DocumentInfo;
  _id: number;
}

export interface DocumentInfo {
  preview: string;
  s3Url: string;
  label: string;
  docType: DocumentType;
}

interface Documents {
  panCard?: DocumentInfo;
  aadharNumber?: DocumentInfo;
  bankStatement?: DocumentInfo;
  addressProof?: DocumentInfo;
  moa?: DocumentInfo;
  aoa?: DocumentInfo;
  coi?: DocumentInfo;
  gstinCertificate?: DocumentInfo;
  companyCheque?: DocumentInfo;
  companyPan?: DocumentInfo;
}

// ─── Store Interface ────────────────────────────────────────────────────────────

interface KycState {
  currentStep: number;

  // Form data
  personalInfo: PersonalInfo;
  businessStructure: BusinessStructureData;
  kybData: KYBData;
  bankData: BankData;
  documents: Documents;
  directors: DirectorKyc[];

  // Verification states (read by right panel)
  panVerification: PANVerification;
  aadhaarVerification: AadhaarVerification;
  gstVerification: GSTVerification;
  cinVerification: CINVerification;
  bankVerification: BankVerification;

  // Actions
  setCurrentStep: (step: number) => void;
  setPersonalInfo: (data: Partial<PersonalInfo>) => void;
  setBusinessStructure: (data: Partial<BusinessStructureData>) => void;
  setKYBData: (data: Partial<KYBData>) => void;
  setBankData: (data: Partial<BankData>) => void;
  setDocuments: (setter: (prev: Documents) => Documents) => void;
  setDirectors: (directors: DirectorKyc[]) => void;

  // Verification setters
  setPANVerification: (data: Partial<PANVerification>) => void;
  setAadhaarVerification: (data: Partial<AadhaarVerification>) => void;
  setGSTVerification: (data: Partial<GSTVerification>) => void;
  setCINVerification: (data: Partial<CINVerification>) => void;
  setBankVerification: (data: Partial<BankVerification>) => void;

  resetForm: () => void;
}

// ─── Initial State ──────────────────────────────────────────────────────────────

const initialState = {
  currentStep: 1,
  personalInfo: { fullName: '', panNumber: '', aadhaarNumber: '' },
  businessStructure: {
    gstNumber: '',
    businessName: '',
    typeOfBusiness: '',
    cinNumber: '',
    industryName: '',
    turnover: '',
    yearEstablished: '',
  },
  kybData: {
    businessPan: '',
    registeredAddress: '',
    state: '',
    city: '',
    businessDescription: '',
    websiteUrl: '',
  },
  bankData: { accountNumber: '', ifscCode: '' },
  documents: {},
  directors: [],

  panVerification: { status: 'idle' as VerifyStatus, otpSent: false },
  aadhaarVerification: { status: 'idle' as VerifyStatus, otpSent: false },
  gstVerification: { status: 'idle' as VerifyStatus },
  cinVerification: { status: 'idle' as VerifyStatus },
  bankVerification: { status: 'idle' as VerifyStatus },
};

// ─── Store ──────────────────────────────────────────────────────────────────────

export const useKycStore = create<KycState>()(
  persist(
    (set) => ({
      ...initialState,

      setCurrentStep: (step: number) =>
        set((state) => {
          if (step >= 1 && step <= 5) return { ...state, currentStep: step };
          return state;
        }),

      setPersonalInfo: (data) =>
        set((state) => ({ personalInfo: { ...state.personalInfo, ...data } })),

      setBusinessStructure: (data) =>
        set((state) => ({
          businessStructure: { ...state.businessStructure, ...data },
        })),

      setKYBData: (data) =>
        set((state) => ({ kybData: { ...state.kybData, ...data } })),

      setBankData: (data) =>
        set((state) => ({ bankData: { ...state.bankData, ...data } })),

      setDocuments: (setter) =>
        set((state) => ({ documents: setter(state.documents) })),

      setDirectors: (directors) => set({ directors }),

      setPANVerification: (data) =>
        set((state) => ({
          panVerification: { ...state.panVerification, ...data },
        })),

      setAadhaarVerification: (data) =>
        set((state) => ({
          aadhaarVerification: { ...state.aadhaarVerification, ...data },
        })),

      setGSTVerification: (data) =>
        set((state) => ({
          gstVerification: { ...state.gstVerification, ...data },
        })),

      setCINVerification: (data) =>
        set((state) => ({
          cinVerification: { ...state.cinVerification, ...data },
        })),

      setBankVerification: (data) =>
        set((state) => ({
          bankVerification: { ...state.bankVerification, ...data },
        })),

      resetForm: () => set(initialState),
    }),
    {
      name: 'kyc-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        currentStep: state.currentStep,
        personalInfo: state.personalInfo,
        businessStructure: state.businessStructure,
        kybData: state.kybData,
        bankData: state.bankData,
        documents: state.documents,
        directors: state.directors,
        panVerification: state.panVerification,
        aadhaarVerification: state.aadhaarVerification,
        gstVerification: state.gstVerification,
        cinVerification: state.cinVerification,
        bankVerification: state.bankVerification,
      }),
    },
  ),
);
