'use client';

import Image from 'next/image';
import Link from 'next/link';
import logo from '@public/RupeeFlowIcon.png';
import { useEffect, useState, useCallback, useRef } from 'react';
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

import { useRegisterStore } from './store/useRegisterStore';
import { RegisterForm } from './components/RegisterForm';
import { VerificationForm } from './components/VerificationForm';

import { googleSignup, registerUser } from '@/lib/services/auth-service';
import { useToast } from '@/lib/components/Toast/ToastContext';
import { safeAny } from '@/lib/interfaces/global.interface';
import GoogleIconSVG from '@/public/assests/Icon/GoogleIconSVG';
import AppleIconSVG from '@/public/assests/Icon/AppleIconSVG';
import FaceBookIconSVG from '@/public/assests/Icon/FaceBookIconSVG';
import SignUpImage from '@/public/assests/images/SignUpImg.png';
import IPSignUpImg from '@/public/assests/images/IPSignUpImg.png';
import { Logo } from '@/lib/components/Logo';
import { useTenant } from '@/context/TenantContext';

const SignUpForm = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { activeTenantId } = useTenant();
  // @ts-ignore
  const redirectUrl = searchParams.get('redirect') || '/home';
  const [currentForm, setCurrentForm] = useState<'register' | 'verify'>(
    'register',
  );
  const store = useRegisterStore();
  const { showToast } = useToast();
  const googleCallbackRef = useRef<((response: any) => Promise<void>) | null>(
    null,
  );

  useEffect(() => {
    store.reset();
  }, []);

  const handleGoogleCallback = useCallback(
    async (response: any) => {
      try {
        const googleIdToken = response.credential;

        const [res, error] = await googleSignup({
          googleToken: googleIdToken,
        });

        if (error) {
          showToast(error.message || 'Google signup failed', 'error');
          return;
        }

        showToast('Signup successful', 'success');
        router.push(redirectUrl);
      } catch (err: any) {
        showToast(err.message || 'Google signup error', 'error');
      }
    },
    [showToast, router, redirectUrl],
  );

  // Store callback in ref for use in useEffect
  useEffect(() => {
    googleCallbackRef.current = handleGoogleCallback;
  }, [handleGoogleCallback]);

  const handleSubmit = async () => {
    if (currentForm === 'register') {
      setCurrentForm('verify');
    } else {
      try {
        const [response, error] = await registerUser({
          email: store.email,
          mobile: store.mobileNumber,
          firstName: store.firstName,
          lastName: store.lastName,
          password: store.password,
          confirmPassword: store.confirmPassword,
          mobileOtp: store.mobileOtp,
          emailOtp: store.emailOtp,
          termsAccepted: store.termsAccepted,
          whatsappAlerts: store.whatsappAlerts,
        });

        if (error) {
          showToast(error.message || 'Registration failed', 'error');
          return;
        }

        if (response?.message) {
          showToast(response.message || 'Registration successful', 'success');
          router.push(redirectUrl);
        } else {
          showToast(response?.message || 'Registration failed', 'error');
        }
      } catch (error: safeAny) {
        showToast(error?.message || 'Something went wrong', 'error');
      }
    }
  };

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
    buttonContainer.id = 'google-signup-trigger';
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
        text: 'signup_with',
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

  return (
    <div className="min-h-screen w-full relative overflow-hidden" style={{ background: 'linear-gradient(135deg, var(--background), var(--border))' }}>
      <div className="absolute top-0 left-0 right-0 flex justify-between items-center px-4 sm:px-6 md:px-12 py-4 sm:py-6 z-30">
        <div className="flex items-center gap-3">
          {/* <Image
            src={logo}
            alt="RupeeFlow Logo"
            width={150}
            height={75}
            priority
            className="w-32 sm:w-40 md:w-48 lg:w-52 h-auto object-contain"
          /> */}
          <Logo isCollapsed={false} />
        </div>
        <div className="flex items-center gap-2 sm:gap-3">
          <span className="text-gray-400 text-xs sm:text-sm hidden sm:inline">
            Already a user?
          </span>
          <Link
            href={`/sign-in?redirect=${encodeURIComponent(redirectUrl)}`}
            className="px-2 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-semibold transition-all"
            style={{
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'black',
              backgroundClip: 'text',
            }}
          >
            LOGIN
          </Link>
        </div>
      </div>
      <div className="absolute top-[15%] sm:top-[20%] left-4 right-4 sm:left-8 sm:right-8 md:left-12 md:right-12 lg:left-20 lg:right-20 bottom-24 sm:bottom-32 md:bottom-48 bg-white z-0 rounded-xl"></div>
      <div className="min-h-screen flex items-center justify-center px-4 sm:px-6 lg:pl-20 lg:pr-6 py-20 sm:py-24 relative z-10">
        <div className="flex items-center gap-4 sm:gap-6 lg:gap-8 w-full max-w-7xl">
          <div className="hidden lg:flex flex-col gap-6 items-center z-10">
            {/* <div id="google-signup-btn"></div> */}
            <button
              type="button"
              className="google-signup-btn"
              onClick={handleGoogleSignup}
            >
              <GoogleIconSVG width={64} height={64} />
            </button>
            <button
              type="button"
              className="hover:opacity-80 transition-opacity"
            >
              <AppleIconSVG width={64} height={64} />
            </button>
            <button
              type="button"
              className="hover:opacity-80 transition-opacity"
            >
              <FaceBookIconSVG width={64} height={64} />
            </button>
          </div>

          <div className="flex-1 max-w-2xl z-20 lg:ml-8">
            <div className="bg-white rounded-2xl sm:rounded-3xl shadow-2xl p-6 sm:p-8 md:p-12">
              <div className="text-center mb-6 sm:mb-8">
                <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-black mb-2">
                  {currentForm === 'register'
                    ? 'CREATE YOUR ACCOUNT'
                    : 'VERIFY YOUR ACCOUNT'}
                </h1>
              </div>

              <form onSubmit={(e) => e.preventDefault()} className="w-full">
                {currentForm === 'register' ? (
                  <RegisterForm onSubmit={() => setCurrentForm('verify')} />
                ) : (
                  <VerificationForm onSubmit={() => handleSubmit()} />
                )}
              </form>
            </div>
          </div>
          <div className="hidden xl:flex flex-1 items-center justify-center z-10">
            <div className="relative w-full max-w-lg rounded-2xl overflow-hidden" style={{ height: 440 }}>
              <Image
                src={activeTenantId === 'indypay' ? IPSignUpImg : SignUpImage}
                alt="Sign Up Illustration"
                priority
                fill
                style={{ objectFit: 'cover' }}
                className="rounded-2xl"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUpForm;
