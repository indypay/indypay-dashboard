'use server';

import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { jwtDecode, JwtPayload } from 'jwt-decode';

import { restrictedAPIs } from './lib/constants/apiConstants/apiConstants';
import { ONBOARDING_STATUS } from './lib/enum';
import { isAdmin, isMerchant } from './lib/utils/utils';
interface CustomJwtPayload extends JwtPayload {
  role: string;
  onboardingStatus: ONBOARDING_STATUS;
}

const middleware = async (req: NextRequest) => {
  // if (
  //   req.nextUrl.hostname === 'localhost' ||
  //   process.env.NODE_ENV === 'development'
  // ) {
  //   return NextResponse.next();
  // }
  const multi_auth_token = req.cookies.get('vtk')?.value;
  const id_token = req.cookies.get('rtk')?.value; // Correct way to get cookies

  const path = req.nextUrl.pathname;

  // Define your public routes here (e.g., login, sign-up, and related routes)
  const publicRoutes =
    /^\/(login|auth|assets|login-2fa|sign-up|sign-in|forgot-password|merchant-info|merchants|invoice|payment-link|checkout-page|logos|RupeeFlow|api|_next\/static|_next\/images|favicon\.ico)/;

  const adminProtectedRoutes = /^\/(kyc-pending|users|kyc-pending\/\d+)/;

  // If vtk token exists, only allow access to sign-in page
  if (multi_auth_token) {
    if (path === '/sign-in') {
      return NextResponse.next();
    } else {
      return NextResponse.redirect(new URL('/sign-in', req.url));
    }
  }

  // If no vtk token, proceed with normal flow
  // If the user is trying to access a public route, allow it
  if (publicRoutes.test(path)) {
    if (!id_token) {
      return NextResponse.next();
    } else {
      return NextResponse.redirect(new URL('/summary/overview', req.url));
    }
  }

  // If the user does not have an id_token, redirect them to the sign-up page
  if (!id_token) {
    return NextResponse.redirect(
      new URL(`/sign-up?redirect=${encodeURIComponent(path)}`, req.url),
    );
  }

  let decodedRole;

  try {
    const decodedToken = jwtDecode<CustomJwtPayload>(id_token);
    const { onboardingStatus, role } = decodedToken;
    decodedRole = role || '2';
    // Handle routing based on onboarding status
    if (
      !publicRoutes.test(path) &&
      !['/kyc', '/pending-approval'].includes(path) &&
      onboardingStatus !== ONBOARDING_STATUS.KYC_VERIFIED &&
      onboardingStatus !== ONBOARDING_STATUS.FILLED_BUSINESS_DETAILS
    ) {
      // switch (onboardingStatus) {
      //   case ONBOARDING_STATUS.SIGN_UP:
      //     return NextResponse.redirect(new URL('/kyc', req.url));
      //   case ONBOARDING_STATUS.KYC_PENDING:
      //     return NextResponse.redirect(new URL('/pending-approval', req.url));
      //   case ONBOARDING_STATUS.KYC_ON_HOLD:
      //     return NextResponse.redirect(new URL('/pending-approval', req.url));
      //   case ONBOARDING_STATUS.KYC_REJECTED:
      //     return NextResponse.redirect(new URL('/pending-approval', req.url));
      //   default:
      //     return NextResponse.redirect(new URL('/pending-approval', req.url));
      // }
    }

    // Special handling for KYC page
    if (path.endsWith('/kyc')) {
      if (onboardingStatus !== ONBOARDING_STATUS.SIGN_UP) {
        switch (onboardingStatus) {
          case ONBOARDING_STATUS.KYC_PENDING:
            return NextResponse.redirect(new URL('/pending-approval', req.url));
          case ONBOARDING_STATUS.KYC_REJECTED:
            return NextResponse.redirect(new URL('/pending-approval', req.url));
          case ONBOARDING_STATUS.KYC_VERIFIED:
          case ONBOARDING_STATUS.FILLED_BUSINESS_DETAILS:
            return NextResponse.redirect(new URL('/summary/overview', req.url));
          default:
            return NextResponse.redirect(new URL('/pending-approval', req.url));
        }
      }
      return NextResponse.next();
    }

    // Non-merchants in KYC_PENDING/REJECTED are limited to /pending-approval.
    // Merchants may use the dashboard before KYC_VERIFIED (backend @SandboxAllowed + scoped data).
    if (
      !isMerchant(decodedRole.toString()) &&
      (onboardingStatus === ONBOARDING_STATUS.KYC_PENDING ||
        onboardingStatus === ONBOARDING_STATUS.KYC_REJECTED) &&
      !path.startsWith('/pending-approval')
    ) {
      return NextResponse.redirect(new URL('/pending-approval', req.url));
    }

    // Initial signup check
    // if (
    //   onboardingStatus === ONBOARDING_STATUS.SIGN_UP &&
    //   !path.startsWith('/kyc')
    // ) {
    //   return NextResponse.redirect(new URL('/kyc', req.url));
    // }

    if (
      path.startsWith('/pending-approval') &&
      (onboardingStatus === ONBOARDING_STATUS.KYC_VERIFIED ||
        onboardingStatus === ONBOARDING_STATUS.FILLED_BUSINESS_DETAILS)
    ) {
      return NextResponse.redirect(new URL('/summary', req.url));
    }

    // Handle role-based restrictions
    if (isMerchant(decodedRole.toString()) && restrictedAPIs.includes(path)) {
      return NextResponse.redirect(new URL('/access-denied', req.url));
    }
    if (!isAdmin(decodedRole.toString()) && adminProtectedRoutes.test(path)) {
      return NextResponse.redirect(new URL('/access-denied', req.url));
    }
  } catch (error) {
    console.error('Failed to decode token:', error);
    return NextResponse.redirect(new URL('/sign-in', req.url));
  }

  // Allow the request to proceed
  const response = NextResponse.next();
  response.headers.set('x-user-role', decodedRole || '2'); // Default to "2" if role is not set

  return response;
};

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - login
     * - login-2fa
     * - sign-up
     * - merchant-info
     * - merchants
     * - invoice (public invoice pages)
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|favicon_3.png|logos|RupeeFlow|login|login-2fa|sign-up|sign-in|forgot-password|merchant-info|merchants|invoice|payment-link|checkout-page).*)',
  ],
};

export default middleware;
