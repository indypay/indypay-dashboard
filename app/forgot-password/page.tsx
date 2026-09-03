'use client';
import Link from 'next/link';
import { useState } from 'react';
import { Button } from '@heroui/button';
import { SignInIcon } from '@/public/assests/Icon/SignIpIcon';
import CustomInput from '@/lib/components/InputContainer/Input';
import {
  useResetPassword,
  useSendOTP,
  useVerifyOTP,
} from '@/lib/hooks/auth-verification';
import { useToast } from '@/lib/components/Toast/ToastContext';
import { useRouter } from 'next/navigation';
import { safeAny } from '@/lib/interfaces/global.interface';
import { EyeSlashFilledIcon } from '@/public/assests/Icon/EyeSlashedIcon';
import { EyeFilledIcon } from '@/public/assests/Icon/EyeFilledIcon';
import { Logo } from '@/lib/components/Logo';
import { useTenant } from '@/context/TenantContext';

const ForgotPassword = () => {
  const { tenantConfig } = useTenant();
  const [email, setEmail] = useState('');
  const { mutate: sendOTP } = useSendOTP();
  const { mutate: verifyOTP } = useVerifyOTP();
  const { mutate } = useResetPassword();
  const [passwordform, setPasswordForm] = useState(false);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [otpInput, setOtpInput] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [disableButton, setDisableButton] = useState(false);
  const { showToast } = useToast();
  const router = useRouter();

  const toggleVisibility = () => setIsVisible((prevState) => !prevState);

  const handleSendOTP = async () => {
    try {
      await sendOTP(
        { email },
        {
          onSuccess: ([response, error]) => {
            if (error) {
              showToast(error?.message, 'error');
              return;
            }
            setDisableButton(true);
            showToast('OTP sent successfully', 'success');
            setOtpInput(true);
          },
          onError: (error) => {
            showToast('Something went wrong', 'error');
          },
        },
      );
    } catch (error) {
      showToast('Something went wrong', 'error');
    }
  };

  const handleVerifyOTP = async () => {
    try {
      await verifyOTP(
        { email, otp },
        {
          onSuccess: ([response, error]) => {
            if (error) {
              showToast(error?.message, 'error');
              return;
            }
            if (response) {
              showToast(response?.message, 'success');
              setPasswordForm(true);
            }
          },
          onError: (error) => {
            showToast('Something went wrong', 'error');
          },
        },
      );
    } catch (error) {
      showToast('Something went wrong', 'error');
    }
  };

  const handleChangePassword = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    mutate(
      { password, confirmPassword },
      {
        onSuccess: (data: safeAny) => {
          const [response, error] = data;
          if (error) {
            showToast(error?.message, 'error');
            return;
          }

          if (response) {
            showToast(response?.message, 'success');
            router.push('/sign-in');
          }
        },
      },
    );
  };
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 min-h-screen w-full">
      <div className="flex flex-col h-full w-full p-4 relative">
        <div className="flex items-center justify-between px-6 py-6">
          <Logo isCollapsed={false} />

          <div className="flex gap-2">
            <Link
              href="/sign-in"
              className="cursor-pointer hover:underline font-semibold"
              style={{ color: 'var(--primary)' }}
            >
              Sign In
            </Link>
          </div>
        </div>

        <div className="flex flex-col items-center justify-center h-full">
          <div className="max-w-[400px] mx-auto">
            <h1 className="text-3xl font-bold text-center mb-2" style={{ color: 'var(--primary)' }}>
              Forgot Password
            </h1>
            <p className="text-center text-gray-600 mb-6">
              Verify your email to reset your password
            </p>

            {!passwordform && (
              <form
                className="space-y-6 w-full"
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSendOTP();
                }}
              >
                <CustomInput
                  type="email"
                  name="email"
                  placeholder="Enter your email address"
                  label="Email Address"
                  value={email}
                  onValueChange={setEmail}
                  className="w-full"
                  isRequired={true}
                  onClear={!disableButton ? () => setEmail('') : undefined}
                  clearButton={!disableButton && !otpInput}
                  readOnly={disableButton}
                />

                {!otpInput && (
                  <Button
                    type="submit"
                    onClick={handleSendOTP}
                    style={{
                      background:
                        'linear-gradient(135deg, var(--secondary) 0%, var(--primary) 100%)',
                      color: '#FFFFFF',
                      fontWeight: 600,
                    }}
                    className="w-full py-2 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    Send OTP
                  </Button>
                )}

                {otpInput && (
                  <>
                    <CustomInput
                      type="text"
                      name="otp"
                      placeholder="Enter OTP"
                      value={otp}
                      onValueChange={setOtp}
                      className="w-full"
                      isRequired={true}
                      onClear={() => setOtp('')}
                      clearButton={true}
                    />

                    <Button
                      onClick={(e) => {
                        e.preventDefault();
                        handleVerifyOTP();
                      }}
                      type="button"
                      style={{
                        background:
                          'linear-gradient(135deg, var(--secondary) 0%, var(--primary) 100%)',
                        color: '#FFFFFF',
                        fontWeight: 600,
                      }}
                      className="w-full py-2 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300"
                    >
                      Verify OTP
                    </Button>
                  </>
                )}
              </form>
            )}

            {passwordform && (
              <form
                className="space-y-6 w-full"
                onSubmit={handleChangePassword}
              >
                <CustomInput
                  type={isVisible ? 'text' : 'password'}
                  name="password"
                  placeholder="Enter your password"
                  label="New Password"
                  value={password}
                  onValueChange={setPassword}
                  className="w-full"
                  isRequired={true}
                  endContent={
                    <button
                      className="focus:outline-none"
                      type="button"
                      onClick={toggleVisibility}
                    >
                      {isVisible ? (
                        <EyeFilledIcon className="text-2xl text-default-400 pointer-events-none" />
                      ) : (
                        <EyeSlashFilledIcon className="text-2xl text-default-400 pointer-events-none" />
                      )}
                    </button>
                  }
                />

                <CustomInput
                  type="password"
                  name="confirmPassword"
                  placeholder="Confirm your password"
                  label="Confirm Password"
                  value={confirmPassword}
                  onValueChange={setConfirmPassword}
                  className="w-full"
                  isRequired={true}
                  onClear={() => setConfirmPassword('')}
                  clearButton={true}
                />

                <Button
                  type="submit"
                  style={{
                    background:
                      'linear-gradient(135deg, #53BEC2 0%, #00EF64 100%)',
                    color: '#FFFFFF',
                    fontWeight: 600,
                  }}
                  className="w-full py-2 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  Change Password
                </Button>
              </form>
            )}
          </div>
        </div>
      </div>

      <div className="hidden md:flex h-full w-full items-center justify-center bg-gray-50 relative overflow-hidden">
        <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg, var(--background), var(--border), var(--sidebar-active-bg, var(--background)))' }} />
        <div className="relative transform hover:scale-105 transition-transform duration-300">
          <div className="flex flex-col items-center justify-center space-y-6">
            <Logo isCollapsed={false} />
            <div className="text-center space-y-2">
              <h2 className="text-4xl font-bold" style={{ color: 'var(--primary)' }}>
                {tenantConfig.name}
              </h2>
              <p className="text-gray-700 text-lg font-medium">
                Secure Payment Solutions
              </p>
            </div>
            <SignInIcon width={500} height={500} className="opacity-90" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
