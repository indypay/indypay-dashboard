import {
  RegisterFormInterface,
  RegisterUserResponse,
} from '../interfaces/register-form-interface';

import {
  ChangedPasswordResponse,
  changePasswordRequest,
  ForgotPasswordRequest,
  LoginRequest,
  LoginResponse,
  LogoutResponse,
  MerchantRegisterRequest,
  MerchantRegisterResponse,
  ResetPasswordRequest,
  ResetPasswordResponse,
  SendOTPRequest,
  SendOTPResponse,
  VerifyOTPRequest,
  VerifyOTPResponse,
  GoogleSignupRequest,
  GoogleSignupResponse,
} from '@/lib/interfaces/authentication.interface';
import {
  SendOtpRequest,
  SendOtpResponse,
} from '@/lib/interfaces/otp.interface';
import { resolvePBApi } from '@/lib/utils/common-utils';
import { safeAny } from '@/lib/interfaces/global.interface';
import { API_CONFIG } from '../config/api.config';
import axios from '@/app/api/axios';
import {
  LOGIN_USER,
  LOGOUT_USER,
  CHANGE_PASSWORD,
  REGISTER_USER,
} from '@/lib/constants/apiConstants/apiConstants';
import { encrypt, decrypt } from '@/lib/utils/encryption.utils';

const baseUrl = API_CONFIG.baseURL;

// export const loginUser = async (request: LoginRequest): Promise<[LoginResponse | null, safeAny]> => {
//   const [response, error] = await resolveOAApi<LoginResponse>(
//     () => axios.post<LoginResponse>(`${baseUrl}/users/login`, request),
//     false,
//     true,
//     false
//   );

//   if (response) {
//     persistToLocalStorage(LocalStorageKeys.META, response.meta);
//   }
//   return [response, error];
// };

// export const logoutUser = async (): Promise<[OMBaseResponse | null, safeAny]> => {
//   const [response, error] = await resolveOAApi<OMBaseResponse>(() => axios.post<OMBaseResponse>(`${baseUrl}/users/logout`, {}), true);
//   removeFromLocalStorage(LocalStorageKeys.META);
//   return [response, error];
// };

// export const loginWithGoogle = async (
//   request: LoginRequest
// ): Promise<[GoogleSignInResponse | null, safeAny]> => {
//   const [response, error] = await resolvePBApi<GoogleSignInResponse>(
//     () =>
//       axios.post<GoogleSignInResponse>(
//         `${baseUrl}/api/v1/auth/users/login`,
//         request
//       ),
//     false,
//     true,
//     false
//   );
//   return [response, error];
// };
// export const googleSignUp = async (): Promise<
//   [PBBaseResponse | null, safeAny]
// > => {
//   const [response, error] = await resolvePBApi<PBBaseResponse>(
//     () => axios.get<PBBaseResponse>(`${baseUrl}/api/v1/auth/users/google`),
//     false,
//     true,
//     false
//   );

//   return [response, error];
// };

// export const signUpWithGoogle = async (
//   provider: string,
//   token: string
// ): Promise<[AuthenticatedUser | null, safeAny]> => {
//   const [response, error] = await resolvePBApi<AuthenticatedUser>(
//     () =>
//       axios.get<AuthenticatedUser>(
//         `${baseUrl}/api/v1/auth/users/verify-token/${provider}?token=${token}`
//       ),
//     false,
//     true,
//     false
//   );

//   if (response) {
//     persistToLocalStorage(LocalStorageKeys.AUTHENTICATED_USER, response);
//   }
//   return [response, error];
// };

// export const verifyMagicLink = async (
//   data: safeAny
// ): Promise<[GoogleSignInResponse | null, safeAny]> => {
//   const [response, error] = await resolvePBApi<GoogleSignInResponse>(
//     () => axios.post<GoogleSignInResponse>(`${baseUrl}/users/verify_id`, data),
//     false,
//     true,
//     false
//   );
//   return [response, error];
// };

// export const submitMerchantBasicInfo = async (
//   data: AuthenticatedUser
// ): Promise<[MerchantBasicInfoResponse | null, safeAny]> => {
//   const [response, error] = await resolvePBApi<MerchantBasicInfoResponse>(
//     () =>
//       axios.post<MerchantBasicInfoResponse>(
//         `${baseUrl}/api/v1/auth/users/send-magic-link`,
//         data
//       ),
//     false,
//     true,
//     false
//   );
//   return [response, error];
// };
// export const submitMerchantDetails = async (
//   data: MerchantDetailsProps
// ): Promise<[PBBaseResponse | null, safeAny]> => {
//   const [response, error] = await resolvePBApi<PBBaseResponse>(
//     () =>
//       axios.post<PBBaseResponse>(
//         `${baseUrl}/api/v1/users/business-details`,
//         data
//       ),
//     false,
//     true,
//     false
//   );
//   return [response, error];
// };

// export const generateQrCode = async (
//   email: string | null | undefined
// ): Promise<[generateQRCodeResponse | null, safeAny]> => {
//   const [response, error] = await resolvePBApi<generateQRCodeResponse>(
//     () =>
//       axios.post<generateQRCodeResponse>(
//         `${baseUrl}/api/v1/mf-auth/generate-qr`,
//         {
//           email,
//         }
//       ),
//     false,
//     true,
//     false
//   );
//   return [response, error];
// };

// export const submitUserDetails = async (
//   data: UserDetailsProps
// ): Promise<[UserLogInResponse | null, safeAny]> => {
//   const [response, error] = await resolvePBApi<UserLogInResponse>(
//     () =>
//       axios.post<UserLogInResponse>(
//         `${baseUrl}/api/v1/auth/login`,
//         data,
//       ),
//     false,
//     true,
//     false
//   );
//   return [response, error];
// }

export const registerMerchant = async (
  request: MerchantRegisterRequest,
): Promise<[MerchantRegisterResponse | null, safeAny]> => {
  const [response, error] = await resolvePBApi<MerchantRegisterResponse>(
    () =>
      axios.post<MerchantRegisterResponse>(
        `${baseUrl}/${REGISTER_USER}`,
        request,
      ),
    false,
    true,
    false,
  );
  return [response, error];
};

export const loginUser = async (
  request: LoginRequest,
): Promise<[LoginResponse | null, safeAny]> => {
  try {
    // Encrypt the request body so credentials are never sent in plain text
    const requestString = JSON.stringify(request);
    const encryptedPayload = await encrypt(requestString);
    const body: { encryptedData: string } = {
      encryptedData: encryptedPayload,
    };

    // Response is plain JSON from backend (errors and success messages are readable)
    const [response, error] = await resolvePBApi<LoginResponse>(
      () => axios.post<LoginResponse>(`${baseUrl}/${LOGIN_USER}`, body),
      false,
      true,
      false,
    );

    if (error) {
      return [null, error];
    }

    return [response ?? null, null];
  } catch (encryptError) {
    console.error('Failed to encrypt login request:', encryptError);
    return [
      null,
      {
        message:
          'Failed to encrypt request. Please ensure encryption is properly configured.',
        statusCode: 500,
      },
    ];
  }
};

export const logoutUser = async (
  request: safeAny,
): Promise<[LogoutResponse | null, safeAny]> => {
  const [response, error] = await resolvePBApi<LogoutResponse>(
    () => axios.post<LogoutResponse>(`${baseUrl}/${LOGOUT_USER}`, request),
    false,
    true,
    false,
  );

  return [response, error];
};

export const changePassword = async (
  request: changePasswordRequest,
): Promise<[ChangedPasswordResponse | null, safeAny]> => {
  const [response, error] = await resolvePBApi<ChangedPasswordResponse>(
    () =>
      axios.post<ChangedPasswordResponse>(
        `${baseUrl}/${CHANGE_PASSWORD}`,
        request,
      ),
    false,
    true,
    false,
  );

  return [response, error];
};

export const sendSignupOtp = async (
  request: SendOtpRequest,
): Promise<[SendOtpResponse | null, safeAny, number]> => {
  return await resolvePBApi<SendOtpResponse>(
    () =>
      axios.post<SendOtpResponse>(
        `${baseUrl}/api/v1/auth/send-signup-otp`,
        request,
      ),
    false,
    true,
    false,
  );
};

export const registerUser = async (
  request: RegisterFormInterface,
): Promise<[RegisterUserResponse | null, safeAny]> => {
  try {
    // 1. Encrypt the request body so credentials are never sent in plain text
    const requestString = JSON.stringify(request);
    const encryptedPayload = await encrypt(requestString);

    // 2. Send ONLY { encryptedData } - never send raw request
    const body: { encryptedData: string } = {
      encryptedData: encryptedPayload,
    };

    const [response, error] = await resolvePBApi<{ encryptedData: string }>(
      () =>
        axios.post<{ encryptedData: string }>(
          `${baseUrl}/api/v1/auth/register-contact`,
          body,
        ),
      false,
      true,
      false,
    );

    if (error) {
      return [null, error];
    }

    // 3. Decrypt the response from backend
    if (response && response.encryptedData) {
      try {
        const decryptedString = await decrypt(response.encryptedData);
        const decryptedResponse = JSON.parse(
          decryptedString,
        ) as RegisterUserResponse;
        return [decryptedResponse, null];
      } catch (decryptError) {
        console.error('Failed to decrypt register response:', decryptError);
        return [
          null,
          {
            message:
              'Failed to decrypt response. Please ensure data is properly encrypted.',
            statusCode: 500,
          },
        ];
      }
    }

    return [response as unknown as RegisterUserResponse, null];
  } catch (encryptError) {
    console.error('Failed to encrypt register request:', encryptError);
    return [
      null,
      {
        message:
          'Failed to encrypt request. Please ensure encryption is properly configured.',
        statusCode: 500,
      },
    ];
  }
};

export const sendOTP = async (
  request: SendOTPRequest,
): Promise<[SendOTPResponse | null, safeAny]> => {
  const [response, error] = await resolvePBApi<SendOTPResponse>(
    () =>
      axios.post<SendOTPResponse>(
        `${baseUrl}/api/v1/auth/send-forgot-password-otp`,
        request,
      ),
    false,
    true,
    false,
  );
  return [response, error];
};

export const verifyOTP = async (
  request: VerifyOTPRequest,
): Promise<[VerifyOTPResponse | null, safeAny]> => {
  const [response, error] = await resolvePBApi<VerifyOTPResponse>(
    () =>
      axios.post<VerifyOTPResponse>(
        `${baseUrl}/api/v1/auth/verify-forgot-password-otp`,
        request,
      ),
    false,
    true,
    false,
  );
  return [response, error];
};

export const resetPassword = async (
  request: ForgotPasswordRequest,
): Promise<[ResetPasswordResponse | null, safeAny]> => {
  const [response, error] = await resolvePBApi<ResetPasswordResponse>(
    () =>
      axios.post<ResetPasswordResponse>(
        `${baseUrl}/api/v1/auth/forgot-password`,
        request,
        {
          withCredentials: true,
        },
      ),
    false,
    true,
    false,
  );

  return [response, error];
};

export const googleSignup = async (
  request: GoogleSignupRequest,
): Promise<[GoogleSignupResponse | null, safeAny]> => {
  const [response, error] = await resolvePBApi<GoogleSignupResponse>(
    () =>
      axios.post<GoogleSignupResponse>(
        `${baseUrl}/api/v1/auth/google`,
        request,
      ),
    false,
    true,
    false,
  );

  return [response, error];
};
