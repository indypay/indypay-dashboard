import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface RegisterState {
  email: string;
  password: string;
  confirmPassword: string;
  firstName: string;
  lastName: string;
  mobileNumber: string;
  emailOtp: string;
  mobileOtp: string;
  isEmailVerified: boolean;
  isMobileVerified: boolean;
  termsAccepted: boolean;
  whatsappAlerts: boolean;
  setField: <T extends string | boolean>(
    field: keyof Omit<
      RegisterState,
      'setField' | 'reset' | 'setVerificationStatus'
    >,
    value: T,
  ) => void;
  setVerificationStatus: (
    field: 'isEmailVerified' | 'isMobileVerified',
    value: boolean,
  ) => void;
  reset: () => void;
}

const initialState = {
  email: '',
  password: '',
  confirmPassword: '',
  firstName: '',
  lastName: '',
  mobileNumber: '',
  emailOtp: '',
  mobileOtp: '',
  isEmailVerified: false,
  isMobileVerified: false,
  termsAccepted: false,
  whatsappAlerts: false,
};

export const useRegisterStore = create<RegisterState>()(
  persist(
    (set) => ({
      ...initialState,
      setField: (field, value) =>
        set((state) => ({ ...state, [field]: value })),
      setVerificationStatus: (field, value) =>
        set((state) => ({ ...state, [field]: value })),
      reset: () => set(initialState),
    }),
    {
      name: 'register-store',
    },
  ),
);
