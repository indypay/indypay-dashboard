export interface ResetPasswordApiRequest {
  oldPassword: string;
  newPassword: string;
  confirmPassword: string;
}
