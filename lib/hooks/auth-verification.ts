'use client';
// import { MerchantDetailsProps, UserDetailsProps } from "@/lib/interfaces/register-interface";
// import {
//   generateQrCode,
//   loginWithGoogle,
//   signUpWithGoogle,
//   submitMerchantBasicInfo,
//   submitMerchantDetails,
//   submitUserDetails,
// } from "@/lib/services/auth-service";
import { useMutation } from '@tanstack/react-query';

import {
  changePasswordRequest,
  ForgotPasswordRequest,
  LoginRequest,
  MerchantRegisterRequest,
  SendOTPRequest,
  VerifyOTPRequest,
} from '../interfaces/authentication.interface';
import {
  changePassword,
  loginUser,
  logoutUser,
  registerMerchant,
  sendOTP,
  verifyOTP,
  resetPassword,
} from '../services/auth-service';
import { safeAny } from '../interfaces/global.interface';
import { useQueryClient } from '@tanstack/react-query';

// export const useVerifyToken = (provider: string, token: string) => {
//   const { refetch } = useQuery({
//     queryKey: ["gAuth"],
//     queryFn: () => signUpWithGoogle(provider, token),
//     enabled: false,
//   });
//   return { refetch };
// };

// export const submitMerchantInfoSubmission = () => {
//   return useMutation({
//     mutationFn: (data: AuthenticatedUser) => {
//       return submitMerchantBasicInfo(data);
//     },
//   });
// };

// export const merchantDetailsSubmission = () => {
//   return useMutation({
//     mutationFn: (data: MerchantDetailsProps) => {
//       return submitMerchantDetails(data);
//     },
//   });
// };

// export const generateQRCodeLink = (email: string | null | undefined) => {
//   return useQuery({
//     queryKey: ["Qr-link"],
//     queryFn: () => generateQrCode(email),
//   });
// };

// export const signInwithGoogle = () => {
//   return useMutation({
//     mutationFn: (data: LoginRequest) => {
//       return loginWithGoogle(data);
//     },
//   });
// };

// export const logInWithMobile = () => {
//   return useMutation({
//     mutationFn: (data: UserDetailsProps) => {
//       return submitUserDetails(data);
//     }
//   })
// }

export const useLogin = () => {
  return useMutation({
    mutationFn: (data: LoginRequest) => {
      return loginUser(data);
    },
  });
};

export const useOnboardMerchant = () => {
  return useMutation({
    mutationFn: (data: MerchantRegisterRequest) => {
      return registerMerchant(data);
    },
  });
};

export const useLogout = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: safeAny) => {
      const [response, error] = await logoutUser(data);
      if (!error) {
        queryClient.clear();
      }
      return [response, error];
    },
  });
};

export const useChangePassword = () => {
  return useMutation({
    mutationFn: (data: changePasswordRequest) => {
      return changePassword(data);
    },
  });
};

export const useSendOTP = () => {
  return useMutation({
    mutationFn: (data: SendOTPRequest) => {
      return sendOTP(data);
    },
  });
};

export const useVerifyOTP = () => {
  return useMutation({
    mutationFn: (data: VerifyOTPRequest) => {
      return verifyOTP(data);
    },
  });
};

export const useResetPassword = () => {
  return useMutation({
    mutationFn: (data: ForgotPasswordRequest) => {
      return resetPassword(data);
    },
  });
};
