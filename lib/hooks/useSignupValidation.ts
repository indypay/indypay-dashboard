import { useState } from 'react';

interface ValidationErrors {
  email?: string;
  mobile?: string;
  password?: string;
  confirmPassword?: string;
}

interface UseSignupValidationReturn {
  errors: ValidationErrors;
  validateEmail: (email: string) => boolean;
  validateMobile: (mobile: string) => boolean;
  validatePassword: (password: string) => boolean;
  validateConfirmPassword: (
    password: string,
    confirmPassword: string,
  ) => boolean;
  validateForm: (
    email: string,
    mobile: string,
    password: string,
    confirmPassword: string,
  ) => boolean;
}

export const useSignupValidation = (): UseSignupValidationReturn => {
  const [errors, setErrors] = useState<ValidationErrors>({});

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const isValid = emailRegex.test(email);
    setErrors((prev) => ({
      ...prev,
      email: isValid ? undefined : 'Please enter a valid email address',
    }));
    return isValid;
  };

  const validateMobile = (mobile: string): boolean => {
    const mobileRegex = /^[0-9]{10}$/;
    const isValid = mobileRegex.test(mobile);
    setErrors((prev) => ({
      ...prev,
      mobile: isValid
        ? undefined
        : 'Please enter a valid 10-digit mobile number',
    }));
    return isValid;
  };

  const validatePassword = (password: string): boolean => {
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    const isLengthValid = password.length >= 8;

    const isValid =
      hasUpperCase &&
      hasLowerCase &&
      hasNumbers &&
      hasSpecialChar &&
      isLengthValid;

    setErrors((prev) => ({
      ...prev,
      password: isValid
        ? undefined
        : 'Password must contain at least 8 characters, including uppercase, lowercase, numbers, and special characters',
    }));

    return isValid;
  };

  const validateConfirmPassword = (
    password: string,
    confirmPassword: string,
  ): boolean => {
    const isValid = password === confirmPassword;
    setErrors((prev) => ({
      ...prev,
      confirmPassword: isValid ? undefined : 'Passwords do not match',
    }));
    return isValid;
  };

  const validateForm = (
    email: string,
    mobile: string,
    password: string,
    confirmPassword: string,
  ): boolean => {
    const isEmailValid = validateEmail(email);
    const isMobileValid = validateMobile(mobile);
    const isPasswordValid = validatePassword(password);
    const isConfirmPasswordValid = validateConfirmPassword(
      password,
      confirmPassword,
    );

    return (
      isEmailValid && isMobileValid && isPasswordValid && isConfirmPasswordValid
    );
  };

  return {
    errors,
    validateEmail,
    validateMobile,
    validatePassword,
    validateConfirmPassword,
    validateForm,
  };
};
