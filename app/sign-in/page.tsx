'use client';

import Image from 'next/image';
import Link from 'next/link';
import logo from '@public/RupeeFlowIcon.png';
import { useEffect, useState, useCallback, useRef } from 'react';
import React from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

// Type declaration for Google Sign-In API
declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (config: {
            client_id: string;
            callback: (response: any) => void;
          }) => void;
          renderButton: (element: HTMLElement, config: any) => void;
          prompt: (callback?: (notification: any) => void) => void;
        };
      };
    };
  }
}

import { UserLogin } from '@/lib/interfaces/authentication.interface';
import { useToast } from '@/lib/components/Toast/ToastContext';
import CustomInput from '@/lib/components/InputContainer/Input';
import { useLogin } from '@/lib/hooks/auth-verification';
import { EyeSlashFilledIcon } from '@/public/assests/Icon/EyeSlashedIcon';
import { EyeFilledIcon } from '@/public/assests/Icon/EyeFilledIcon';
import { safeAny } from '@/lib/interfaces/global.interface';
import Cookies from 'js-cookie';
import { jwtDecode } from 'jwt-decode';
import { googleSignup } from '@/lib/services/auth-service';
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from '@heroui/react';
import { useVerifyMultiAuth } from '@/lib/hooks/use-multiAuth';
import { deleteCookie, getCookie } from '@/lib/utils/cookies.utils';
import { CustomButton } from '@/lib/components/ButtonComponent/CustomButton';
import SignInImg from '@/public/assests/images/SignInImg.png';
import IPSignInImg from '@/public/assests/images/IPSignInImg.png';
import ProfileIconSVG from '@/public/assests/Icon/ProfileIconSVG';
import LockIconSVG from '@/public/assests/Icon/LockIconSVG';
import GoogleIconSVG from '@/public/assests/Icon/GoogleIconSVG';
import AppleIconSVG from '@/public/assests/Icon/AppleIconSVG';
import FaceBookIconSVG from '@/public/assests/Icon/FaceBookIconSVG';
import { Checkbox } from 'antd';
import { Logo } from '@/lib/components/Logo';
import { useTenant } from '@/context/TenantContext';

interface MultiAuthPayload {
  pending2FA: boolean;
}

const LoginForm = () => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [otp, setOtp] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({ email: false, password: false });
  const router = useRouter();
  const searchParams = useSearchParams();
  const { activeTenantId } = useTenant();
  // @ts-ignore
  const redirectUrl = searchParams.get('redirect') || '/summary/overview';

  const { showToast } = useToast();

  const { mutate } = useLogin();

  const { mutate: mutate2FA } = useVerifyMultiAuth();
  const googleCallbackRef = useRef<((response: any) => Promise<void>) | null>(
    null,
  );

  const toggleVisibility = () => setIsVisible((prevState) => !prevState);

  const navigateAfterAuth = useCallback(() => {
    const path = redirectUrl.startsWith('/') ? redirectUrl : `/${redirectUrl}`;
    router.replace(path);
    router.refresh();
  }, [router, redirectUrl]);

  const handleGoogleCallback = useCallback(
    async (response: any) => {
      try {
        const googleIdToken = response.credential;

        const [res, error] = await googleSignup({
          googleToken: googleIdToken,
        });

        if (error) {
          showToast(error.message || 'Google login failed', 'error');
          return;
        }

        showToast('Login successful', 'success');

        const vtk = Cookies.get('vtk') || getCookie('vtk');
        if (vtk) {
          try {
            if (jwtDecode<MultiAuthPayload>(vtk).pending2FA) {
              setShowOtpModal(true);
              return;
            }
          } catch {
            /* vtk not decodable */
          }
        }
        navigateAfterAuth();
      } catch (err: any) {
        showToast(err.message || 'Google login error', 'error');
      }
    },
    [showToast, navigateAfterAuth, setShowOtpModal],
  );

  // Store callback in ref for use in useEffect
  useEffect(() => {
    googleCallbackRef.current = handleGoogleCallback;
  }, [handleGoogleCallback]);

  useEffect(() => {
    // Check if script already exists
    if (
      document.querySelector(
        'script[src="https://accounts.google.com/gsi/client"]',
      )
    ) {
      // Script already loaded, initialize directly
      if (window.google?.accounts?.id) {
        window.google.accounts.id.initialize({
          client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!,
          callback: (response: any) => {
            googleCallbackRef.current?.(response);
          },
        });
      }
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;

    script.onload = () => {
      if (window.google?.accounts?.id) {
        window.google.accounts.id.initialize({
          client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!,
          callback: (response: any) => {
            googleCallbackRef.current?.(response);
          },
        });
      }
    };

    document.body.appendChild(script);
    return () => {
      // Safely remove script if it exists
      const existingScript = document.querySelector(
        'script[src="https://accounts.google.com/gsi/client"]',
      );
      if (existingScript && existingScript.parentNode) {
        existingScript.parentNode.removeChild(existingScript);
      }
    };
  }, []);

  const handleGoogleSignup = () => {
    if (!window.google?.accounts?.id) {
      showToast(
        'Google Sign-In is not available. Please refresh the page.',
        'error',
      );
      return;
    }

    // Create a hidden container for the Google button
    const buttonContainer = document.createElement('div');
    buttonContainer.id = 'google-signin-trigger';
    buttonContainer.style.position = 'absolute';
    buttonContainer.style.left = '-9999px';
    buttonContainer.style.opacity = '0';
    buttonContainer.style.pointerEvents = 'none';
    document.body.appendChild(buttonContainer);

    try {
      window.google.accounts.id.renderButton(buttonContainer, {
        theme: 'outline',
        size: 'large',
        type: 'standard',
        text: 'signin_with',
        shape: 'rectangular',
      });

      // Wait for button to render, then click it
      setTimeout(() => {
        const googleButton = buttonContainer.querySelector(
          'div[role="button"]',
        ) as HTMLElement;
        if (googleButton) {
          googleButton.click();
          // Clean up after click
          setTimeout(() => {
            if (buttonContainer.parentNode) {
              buttonContainer.parentNode.removeChild(buttonContainer);
            }
          }, 500);
        } else {
          // Fallback: remove container and show error
          if (buttonContainer.parentNode) {
            buttonContainer.parentNode.removeChild(buttonContainer);
          }
          showToast(
            'Unable to initialize Google Sign-In. Please try again.',
            'error',
          );
        }
      }, 200);
    } catch (error) {
      if (buttonContainer.parentNode) {
        buttonContainer.parentNode.removeChild(buttonContainer);
      }
      showToast('Google Sign-In error. Please try again.', 'error');
    }
  };

  const handleOtpVerification = async (otp: string) => {
    setIsLoading(true);
    try {
      const vtk = Cookies.get('vtk') || getCookie('vtk');
      if (!vtk) {
        showToast('Session expired. Please login again.', 'error');
        return;
      }

      mutate2FA(
        { token: otp },
        {
          onSuccess: async (data: safeAny) => {
            const [response, error] = data;
            if (response) {
              deleteCookie('vtk');
              showToast('Verification successful', 'success');
              setShowOtpModal(false);
              navigateAfterAuth();
            } else {
              showToast(error?.message || 'Invalid OTP', 'error');
            }
          },
          onError: (error) => {
            showToast('Failed to verify OTP', 'error');
          },
          onSettled: () => {
            setIsLoading(false);
          },
        },
      );
    } catch (error) {
      showToast('Failed to verify OTP', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!email || !password) {
      setErrors({
        email: !email,
        password: !password,
      });
      showToast('Please fill in all fields', 'error');
      return;
    }

    setErrors({ email: false, password: false });
    setIsLoading(true);
    try {
      const userData: UserLogin = { email, password };

      mutate(userData, {
        onSuccess: async (data: safeAny) => {
          const [response, error] = data;

          if (error) {
            console.log(error.message);
            showToast(error?.message, 'error');
            return;
          }

          if (response) {
            showToast(response?.message || 'Login successful', 'success');

            const vtk = Cookies.get('vtk') || getCookie('vtk');
            if (vtk) {
              try {
                if (jwtDecode<MultiAuthPayload>(vtk).pending2FA) {
                  setShowOtpModal(true);
                  return;
                }
              } catch {
                /* ignore */
              }
            }
            navigateAfterAuth();
          }
        },
        onSettled: () => setIsLoading(false),
      });
    } catch {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Modal
        isOpen={showOtpModal}
        onOpenChange={(isOpen) => setShowOtpModal(isOpen)}
        size="md"
        isDismissable={false}
        hideCloseButton
        classNames={{
          base: 'z-[1000] mx-4',
        }}
      >
        <ModalContent>
          <ModalHeader className="flex flex-col gap-1 px-4 sm:px-6">
            <h2 className="text-lg sm:text-xl font-semibold">
              Two-Factor Authentication
            </h2>
          </ModalHeader>
          <ModalBody className="px-4 sm:px-6">
            <div className="flex flex-col gap-3 sm:gap-4">
              <p className="text-xs sm:text-sm text-gray-600">
                Please enter the 6-digit OTP sent to your email
              </p>
              <CustomInput
                type="text"
                label="OTP"
                placeholder="Enter 6-digit OTP"
                value={otp}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  const value = e.target.value.replace(/[^0-9]/g, '');
                  if (value.length <= 6) setOtp(value);
                }}
                maxLength={6}
                className="w-full"
                size="lg"
                variant="bordered"
              />
            </div>
          </ModalBody>
          <ModalFooter className="px-4 sm:px-6">
            <CustomButton
              className="w-full text-white text-sm sm:text-base"
              style={{ background: 'linear-gradient(to right, var(--secondary), var(--primary))' }}
              onPress={() => handleOtpVerification(otp)}
              isDisabled={otp.length !== 6}
              isLoading={isLoading}
            >
              Verify OTP
            </CustomButton>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <div className="min-h-screen w-full relative overflow-hidden" style={{ background: 'linear-gradient(135deg, var(--background), var(--border))' }}>
        {/* Header */}
        <div className="absolute top-0 left-0 right-0 flex justify-between items-center px-4 sm:px-6 md:px-12 lg:pl-20 py-4 sm:py-6 z-30">
          <div className="flex items-center gap-3">
            {/* <Image
              src={logo}
              alt="RupeeFlow Logo"
              width={150}
              height={75}
              className="w-32 sm:w-40 md:w-48 lg:w-52 h-auto"
              priority
            /> */}

            <Logo isCollapsed={false} />
          </div>
          <div className="flex items-center gap-2 sm:gap-3">
            <span className="text-gray-400 text-xs sm:text-sm hidden sm:inline">
              Don&apos;t have an account?
            </span>
            <Link
              href={`/sign-up?redirect=${encodeURIComponent(redirectUrl)}`}
              className="px-2 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-semibold transition-all text-black"
              style={{
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'black',
                backgroundClip: 'text',
              }}
            >
              SIGN UP
            </Link>
          </div>
        </div>

        <div className="absolute top-[15%] sm:top-[20%] left-4 right-4 sm:left-8 sm:right-8 md:left-12 md:right-12 lg:left-20 lg:right-20 bottom-24 sm:bottom-32 md:bottom-48 bg-white z-0 rounded-xl"></div>

        <div className="min-h-screen flex items-center justify-center px-4 sm:px-6 py-20 sm:py-24 relative z-10 lg:pl-20">
          <div className="w-full max-w-md z-20 lg:ml-16">
            <div className="bg-white rounded-2xl sm:rounded-3xl shadow-2xl p-6 sm:p-8 md:p-12">
              <div className="text-center mb-6 sm:mb-8">
                <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-black mb-2">
                  Welcome Back !
                </h1>
              </div>

              <form
                className="space-y-4 sm:space-y-5 w-full"
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSubmit();
                }}
              >
                <CustomInput
                  type="email"
                  placeholder="Email address"
                  value={email}
                  onValueChange={(value: any) => {
                    setEmail(value);
                    if (errors.email) setErrors({ ...errors, email: false });
                  }}
                  className="w-full"
                  isInvalid={errors.email}
                  startContent={<ProfileIconSVG width={20} height={20} />}
                />

                <CustomInput
                  type={isVisible ? 'text' : 'password'}
                  placeholder="Password"
                  value={password}
                  onValueChange={(value: any) => {
                    setPassword(value);
                    if (errors.password)
                      setErrors({ ...errors, password: false });
                  }}
                  className="w-full"
                  isInvalid={errors.password}
                  startContent={<LockIconSVG width={20} height={20} />}
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

                <div className="flex items-center justify-between">
                  <Checkbox
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                  >
                    <span className="text-xs text-gray-700">Remember me</span>
                  </Checkbox>
                  <Link
                    href="/forgot-password"
                    className="text-xs hover:underline"
                    style={{ color: 'var(--primary)' }}
                  >
                    Forgot password?
                  </Link>
                </div>

                <CustomButton
                  className="w-full hover:opacity-90 text-white py-5 sm:py-6 text-sm sm:text-base font-semibold rounded-xl"
                  style={{ background: 'linear-gradient(to right, var(--secondary), var(--primary))' }}
                  htmlType="submit"
                  isLoading={isLoading}
                >
                  Login
                </CustomButton>

                <div className="relative my-5 sm:my-6">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-300"></div>
                  </div>
                  <div className="relative flex justify-center text-xs sm:text-sm">
                    <span className="px-3 sm:px-4 bg-white text-gray-500">
                      Login with others
                    </span>
                  </div>
                </div>

                <div className="space-y-2.5 sm:space-y-3">
                  <button
                    type="button"
                    onClick={handleGoogleSignup}
                    className="w-full flex items-center justify-center gap-2 sm:gap-3 px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors"
                  >
                    <GoogleIconSVG
                      width={20}
                      height={20}
                      className="sm:w-6 sm:h-6"
                    />
                    <span className="text-xs sm:text-sm font-medium text-black">
                      Continue with Google
                    </span>
                  </button>
                  <button
                    type="button"
                    className="w-full flex items-center justify-center gap-2 sm:gap-3 px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors"
                  >
                    <AppleIconSVG
                      width={20}
                      height={20}
                      className="sm:w-6 sm:h-6"
                    />
                    <span className="text-xs sm:text-sm font-medium text-black">
                      Continue with Apple
                    </span>
                  </button>
                  <button
                    type="button"
                    className="w-full flex items-center justify-center gap-2 sm:gap-3 px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors"
                  >
                    <FaceBookIconSVG
                      width={20}
                      height={20}
                      className="sm:w-6 sm:h-6"
                    />
                    <span className="text-xs sm:text-sm font-medium text-black">
                      Continue with Facebook
                    </span>
                  </button>
                </div>
              </form>
            </div>
          </div>
          <div className="hidden xl:flex flex-1 items-center justify-center z-10 ml-8">
            <div className="relative w-full max-w-lg rounded-2xl overflow-hidden" style={{ height: 440 }}>
              <Image
                src={activeTenantId === 'indypay' ? IPSignInImg : SignInImg}
                alt="Sign In Illustration"
                priority
                fill
                style={{ objectFit: 'cover' }}
                className="rounded-2xl"
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default LoginForm;
