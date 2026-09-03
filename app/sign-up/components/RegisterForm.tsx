'use client';
import { useState, ChangeEvent } from 'react';
import { Checkbox } from 'antd';

import { useRegisterStore } from '../store/useRegisterStore';

import CustomInput from '@/lib/components/InputContainer/Input';
import { EyeFilledIcon } from '@/public/assests/Icon/EyeFilledIcon';
import { EyeSlashFilledIcon } from '@/public/assests/Icon/EyeSlashedIcon';
import { sendSignupOtp } from '@/lib/services/auth-service';
import { useFormValidation } from '@/lib/hooks/useFormValidation';
import { useToast } from '@/lib/components/Toast/ToastContext';
import { CustomButton } from '@/lib/components/ButtonComponent/CustomButton';
import { safeAny } from '@/lib/interfaces/global.interface';

interface RegisterFormProps {
  onSubmit: () => void;
}

export const RegisterForm = ({ onSubmit }: RegisterFormProps) => {
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const [isConfirmVisible, setIsConfirmVisible] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { showToast } = useToast();

  const {
    setField,
    firstName,
    lastName,
    email,
    password,
    confirmPassword,
    mobileNumber,
    termsAccepted,
    whatsappAlerts,
    // setVerificationStatus,
  } = useRegisterStore();

  const { errors, validateForm, validateField } = useFormValidation({
    firstName,
    lastName,
    email,
    mobileNumber,
    password,
    confirmPassword,
    termsAccepted,
    whatsappAlerts,
  });

  const toggleVisibility = () => setIsVisible(!isVisible);
  const toggleConfirmVisibility = () => setIsConfirmVisible(!isConfirmVisible);

  const handleFieldChange = (field: string, value: string) => {
    setField(field as safeAny, value);
    validateField(field as safeAny);
  };

  const handleCheckboxChange = (field: string, value: boolean) => {
    setField(field as safeAny, value);
  };

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement>,
    field: string,
  ) => {
    handleFieldChange(field, e.target.value);
  };

  const handleSendOtp = async () => {
    if (!validateForm()) {
      showToast('Please fix the errors in the form', 'error');
      return;
    }

    try {
      setIsLoading(true);
      const [response, error] = await sendSignupOtp({
        email,
        mobile: mobileNumber,
      });

      if (error) {
        showToast(error.message || 'Failed to send OTP', 'error');
        return;
      }

      if (response?.success) {
        showToast(response.message || 'OTP sent successfully', 'success');
        onSubmit();
      } else {
        showToast(response?.message || 'Failed to send OTP', 'error');
      }
    } catch (error) {
      showToast('Something went wrong', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  // const storeValues = useRegisterStore();

  return (
    <div className="space-y-4 sm:space-y-5 w-full">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <CustomInput
          type="text"
          label="First Name"
          value={firstName}
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            handleInputChange(e, 'firstName')
          }
          className="w-full"
          required
          errorMessage={errors.firstName}
          isInvalid={!!errors.firstName}
          onBlur={() => validateField('firstName')}
        />
        <CustomInput
          type="text"
          label="Last Name"
          value={lastName}
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            handleInputChange(e, 'lastName')
          }
          className="w-full"
          required
          errorMessage={errors.lastName}
          isInvalid={!!errors.lastName}
          onBlur={() => validateField('lastName')}
        />
      </div>

      <CustomInput
        type="email"
        label="Email"
        placeholder="Email"
        value={email}
        onChange={(e: ChangeEvent<HTMLInputElement>) =>
          handleInputChange(e, 'email')
        }
        className="w-full"
        required
        errorMessage={errors.email}
        isInvalid={!!errors.email}
        onBlur={() => validateField('email')}
      />

      <CustomInput
        type="tel"
        label="Mobile No."
        placeholder="Mobile No."
        value={mobileNumber}
        onChange={(e: ChangeEvent<HTMLInputElement>) =>
          handleInputChange(e, 'mobileNumber')
        }
        className="w-full"
        required
        errorMessage={errors.mobileNumber}
        isInvalid={!!errors.mobileNumber}
        onBlur={() => validateField('mobileNumber')}
      />

      <CustomInput
        label="Password"
        placeholder="Password"
        value={password}
        onChange={(e: ChangeEvent<HTMLInputElement>) =>
          handleInputChange(e, 'password')
        }
        endContent={
          <button
            className="focus:outline-none"
            type="button"
            onClick={toggleVisibility}
          >
            {isVisible ? (
              <EyeSlashFilledIcon className="text-2xl text-default-400 pointer-events-none" />
            ) : (
              <EyeFilledIcon className="text-2xl text-default-400 pointer-events-none" />
            )}
          </button>
        }
        type={isVisible ? 'text' : 'password'}
        className="w-full"
        required
        errorMessage={errors.password}
        isInvalid={!!errors.password}
        onBlur={() => validateField('password')}
      />

      <CustomInput
        label="Confirm Password"
        placeholder="Confirm Password"
        value={confirmPassword}
        onChange={(e: ChangeEvent<HTMLInputElement>) =>
          handleInputChange(e, 'confirmPassword')
        }
        endContent={
          <button
            className="focus:outline-none"
            type="button"
            onClick={toggleConfirmVisibility}
          >
            {isConfirmVisible ? (
              <EyeSlashFilledIcon className="text-2xl text-default-400 pointer-events-none" />
            ) : (
              <EyeFilledIcon className="text-2xl text-default-400 pointer-events-none" />
            )}
          </button>
        }
        type={isConfirmVisible ? 'text' : 'password'}
        className="w-full"
        required
        errorMessage={errors.confirmPassword}
        isInvalid={!!errors.confirmPassword}
        onBlur={() => validateField('confirmPassword')}
      />

      <div className="flex flex-col gap-3 mt-2">
        <Checkbox
          checked={termsAccepted}
          onChange={(e) => {
            handleCheckboxChange('termsAccepted', e.target.checked);
          }}
          style={{ fontSize: '12px' }}
        >
          <span className="flex items-center gap-1 text-xs text-gray-700">
            I accept the Terms and Conditions
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="text-gray-400"
            >
              <circle cx="12" cy="12" r="10" />
              <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
              <line x1="12" y1="17" x2="12.01" y2="17" />
            </svg>
          </span>
        </Checkbox>
        <Checkbox
          checked={whatsappAlerts}
          onChange={(e) => {
            handleCheckboxChange('whatsappAlerts', e.target.checked);
          }}
          style={{ fontSize: '12px' }}
        >
          <span className="text-xs text-gray-700">Enable whatsapp alert</span>
        </Checkbox>
      </div>

      <CustomButton
        className="w-full hover:opacity-90 text-white py-5 sm:py-6 text-sm sm:text-base font-semibold rounded-xl mt-4 sm:mt-6"
        style={{ background: 'linear-gradient(to right, var(--secondary), var(--primary))' }}
        onPress={handleSendOtp}
        isLoading={isLoading}
        isDisabled={!email || !mobileNumber || !termsAccepted}
      >
        CREATE ACCOUNT
      </CustomButton>
    </div>
  );
};
