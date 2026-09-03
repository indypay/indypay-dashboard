export interface SendOtpRequest {
  email: string;
  mobile: string;
}

export interface SendOtpResponse {
  success: boolean;
  message: string;
  data?: {
    otpId?: string;
  };
}
