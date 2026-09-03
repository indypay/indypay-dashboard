export interface RegisterFormInterface {
  firstName: string;
  lastName: string;
  email: string;
  mobile: string;
  password: string;
  confirmPassword: string;
  mobileOtp: string;
  emailOtp: string;
  termsAccepted: boolean;
  whatsappAlerts: boolean;
}

export interface RegisterUserResponse {
  success: boolean;
  message: string;
}
