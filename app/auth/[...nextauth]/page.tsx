'use client'; // Make sure to use "use client" to indicate this file uses client-side features

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

// import {
//   generateQRCodeLink,
//   useVerifyToken,
// } from "@/lib/hooks/auth-verification";

interface AuthRouteParams {
  nextauth: string[];
}

interface AuthRouteSearchParams {
  token?: string;
  error?: string;
  x?: string;
  [key: string]: string | undefined;
}

interface AuthRouteRequest {
  params: AuthRouteParams;
  searchParams: AuthRouteSearchParams;
}

interface VerificationStatusProps {
  email: string;
  is2FAEnabled: boolean;
  onboardingStatus: number;
}

const AuthRoute = ({ params, searchParams }: AuthRouteRequest) => {
  const { nextauth } = params;
  const { token } = searchParams;
  const { error } = searchParams;
  const router = useRouter();

  // const { refetch } = useVerifyToken(nextauth[0], token ?? "");
  const [loading, setLoading] = useState(true);
  const [componentToRender, setComponentToRender] =
    useState<React.ReactNode>(null);

  // useEffect(() => {
  //   const fetchData = async () => {
  //     if (token) {
  //       try {
  //         const res = await refetch();
  //         const userData = res?.data?.[0];

  //         if (userData) {
  //           const verificationStatus = {
  //             email: userData.email,
  //             is2FAEnabled: userData.is2FAEnabled,
  //             onboardingStatus: userData.onboardingStatus,
  //           };

  //           persistToLocalStorage(
  //             LocalStorageKeys.AUTHENTICATED_USER,
  //             verificationStatus
  //           );

  //           const { onboardingStatus, is2FAEnabled, email } = userData;
  //           if (onboardingStatus === 0) {
  //             router.push("/auth/merchant-info");
  //           } else if (onboardingStatus === 1) {
  //             router.push("/auth/merchants");
  //           } else if (onboardingStatus === 2) {
  //             router.push("/auth/multifactor");
  //           } else {
  //             router.push("/sign-in");
  //           }
  //         }

  //         if (error) {
  //           setComponentToRender(
  //             <VerifyingPopus
  //               title={transformStringFromSnakeCase(error)}
  //               content="Please verify your account"
  //               isOpen={true}
  //             />
  //           );
  //         }
  //       } catch (err) {
  //         console.error("Error:", err);
  //       } finally {
  //         setLoading(false);
  //       }
  //     } else {
  //       setLoading(false);
  //     }
  //   };

  //   fetchData();
  // }, [refetch, token, router, error]);

  if (loading) {
    return <div>Loading...</div>; // or a spinner/loading component
  }

  return <>{componentToRender}</>;
};

export default AuthRoute;
