export interface AuthenticatedUser {
  fullName: string;
  email: string | null;
  mobile: string;
  designation?: string | null;
  businessName?: string;
  twoFactorEnabled?: boolean;
  onboardingStatus?: number;
}

export interface UserRegistration {
  fullName: string;
  email: string;
  mobile: string;
  // designation: string;
  // businessName: string;
}

export interface MerchantRegisterRequest {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
  mobile: string;
}

export interface MerchantRegisterDetails {
  email: string;
  businessEntityType: number;
  turnover: number;
  businessName: string;
  designation: string;
}
export interface MerchantRegisterResponse {
  message: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  message: string;
}

export interface LogoutResponse {
  message: string;
}
export interface GenrateQRCodeRequest {
  email: string | null | undefined;
}

export interface ResetPasswordRequest {
  login: string;
  verification_code: string;
  new_password: string;
}

export interface UserLogin {
  email: string;
  password: string;
}

export interface changePasswordRequest {
  oldPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export interface ChangedPasswordResponse {
  data: {
    message: string;
  };
}

export interface SendOTPRequest {
  email: string;
}

export interface SendOTPResponse {
  otp: number;
}

export interface VerifyOTPRequest {
  email: string;
  otp: string;
}

export interface VerifyOTPResponse {
  message: string;
}
export interface ForgotPasswordRequest {
  password: string;
  confirmPassword: string;
}

export interface ResetPasswordResponse {
  status: number;
  message: string;
  success: boolean;
  data: {
    message: string;
  };
}

export interface GoogleSignupRequest {
  googleToken: string;
}

export interface GoogleSignupResponse {
  message: string;
  token: string;
  user: {
    id: string;
    email: string;
    role: string;
  };
}
