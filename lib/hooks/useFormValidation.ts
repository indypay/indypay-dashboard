import { useState, useCallback } from 'react';

interface ValidationErrors {
  firstName?: string;
  lastName?: string;
  email?: string;
  mobileNumber?: string;
  password?: string;
  confirmPassword?: string;
  termsAccepted?: string;
  whatsappAlerts?: string;
}

interface UseFormValidationProps {
  firstName: string;
  lastName: string;
  email: string;
  mobileNumber: string;
  password: string;
  confirmPassword: string;
  termsAccepted: boolean;
  whatsappAlerts: boolean;
}

export const useFormValidation = ({
  firstName,
  lastName,
  email,
  mobileNumber,
  password,
  confirmPassword,
  termsAccepted,
  // whatsappAlerts,
}: UseFormValidationProps) => {
  const [errors, setErrors] = useState<ValidationErrors>({});

  const validateName = (
    name: string,
    field: 'firstName' | 'lastName',
  ): string | undefined => {
    if (!name.trim()) {
      return `${field === 'firstName' ? 'First' : 'Last'} name is required`;
    }
    if (name.length < 2) {
      return `${field === 'firstName' ? 'First' : 'Last'} name must be at least 2 characters`;
    }
    if (!/^[a-zA-Z\s-']+$/.test(name)) {
      return `${field === 'firstName' ? 'First' : 'Last'} name can only contain letters, spaces, hyphens, and apostrophes`;
    }
    return undefined;
  };

  const validateEmail = (email: string): string | undefined => {
    if (!email) {
      return 'Email is required';
    }
    // RFC 5322 compliant email regex
    const emailRegex =
      /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
    if (!emailRegex.test(email)) {
      return 'Please enter a valid email address';
    }
    return undefined;
  };

  const validateMobileNumber = (mobile: string): string | undefined => {
    if (!mobile) {
      return 'Mobile number is required';
    }
    // Allows +, country code, and 10 digits
    const mobileRegex = /^\+?([0-9]{2})?[0-9]{10}$/;
    if (!mobileRegex.test(mobile.replace(/\s/g, ''))) {
      return 'Please enter a valid 10-digit mobile number';
    }
    return undefined;
  };

  const validatePassword = (password: string): string | undefined => {
    if (!password) {
      return 'Password is required';
    }
    if (password.length < 8) {
      return 'Password must be at least 8 characters';
    }
    if (!/(?=.*[a-z])/.test(password)) {
      return 'Password must contain at least one lowercase letter';
    }
    if (!/(?=.*[A-Z])/.test(password)) {
      return 'Password must contain at least one uppercase letter';
    }
    if (!/(?=.*\d)/.test(password)) {
      return 'Password must contain at least one number';
    }
    if (!/(?=.*[!@#$%^&*(),.?":{}|<>])/.test(password)) {
      return 'Password must contain at least one special character';
    }
    return undefined;
  };

  const validateConfirmPassword = (confirmPass: string): string | undefined => {
    if (!confirmPass) {
      return 'Please confirm your password';
    }
    if (confirmPass !== password) {
      return 'Passwords do not match';
    }
    return undefined;
  };

  const validateTermsAccepted = (
    termsAccepted: boolean,
  ): string | undefined => {
    if (!termsAccepted) {
      return 'You must accept the terms and conditions';
    }
    return undefined;
  };

  const validateForm = useCallback((): boolean => {
    const newErrors: ValidationErrors = {
      firstName: validateName(firstName, 'firstName'),
      lastName: validateName(lastName, 'lastName'),
      email: validateEmail(email),
      mobileNumber: validateMobileNumber(mobileNumber),
      password: validatePassword(password),
      confirmPassword: validateConfirmPassword(confirmPassword),
      termsAccepted: validateTermsAccepted(termsAccepted),
    };

    // Remove undefined errors
    Object.keys(newErrors).forEach((key) => {
      if (newErrors[key as keyof ValidationErrors] === undefined) {
        delete newErrors[key as keyof ValidationErrors];
      }
    });

    if (!termsAccepted) {
      newErrors.termsAccepted = 'You must accept the terms and conditions';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [
    firstName,
    lastName,
    email,
    mobileNumber,
    password,
    confirmPassword,
    termsAccepted,
  ]);

  return {
    errors,
    validateForm,
    validateField: (field: keyof ValidationErrors) => {
      let error: string | undefined;
      switch (field) {
        case 'firstName':
          error = validateName(firstName, 'firstName');
          break;
        case 'lastName':
          error = validateName(lastName, 'lastName');
          break;
        case 'email':
          error = validateEmail(email);
          break;
        case 'mobileNumber':
          error = validateMobileNumber(mobileNumber);
          break;
        case 'password':
          error = validatePassword(password);
          break;
        case 'confirmPassword':
          error = validateConfirmPassword(confirmPassword);
          break;
        case 'termsAccepted':
          error = validateTermsAccepted(termsAccepted);
          break;
      }
      setErrors((prev) => ({
        ...prev,
        [field]: error,
      }));
      return error === undefined;
    },
  };
};
