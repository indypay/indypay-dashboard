// import { AuthenticatedUser } from '@/interfaces/authentication.interface';
// // import { LocalStorageKeys } from '@lib/interfaces/global.interface';
// import { PASSWORD_LOWERCASE,
//   PASSWORD_MINLENGTH,
//   PASSWORD_NUMBER,
//   PASSWORD_SPECIALCHAR,
//   PASSWORD_UPPERCASE, } from '@/shared/regular-expressions';
// import { resetAuthenticatedUser, setAuthenticatedUser } from '@/store/global-store';

// export const validateUserPassword = (password: string) =>
//   password &&
//   PASSWORD_MINLENGTH.test(password) &&
//   PASSWORD_UPPERCASE.test(password) &&
//   PASSWORD_LOWERCASE.test(password) &&
//   PASSWORD_NUMBER.test(password) &&
//   PASSWORD_SPECIALCHAR.test(password);

// export const storeAuthenticatedUserDetails = (authenticatedUser: AuthenticatedUser) => {
//   setAuthenticatedUser(authenticatedUser);
//   // persistToLocalStorage(LocalStorageKeys.AUTHENTICATED_USER, authenticatedUser);
// };

// export const getAuthenticatedUserDetailsFromLS = () => {
//   const authenticatedUser = getFromLocalStorage<AuthenticatedUser>(LocalStorageKeys.AUTHENTICATED_USER);
//   return authenticatedUser;
// };

// // export const getAuthenticatedUser = (): AuthenticatedUser => {
// //   return authenticatedUse;
// // };

// export const clearAuthenticatedUserDetails = () => {
//   resetAuthenticatedUser();
//   // removeFromLocalStorage(LocalStorageKeys.AUTHENTICATED_USER);
// };

// export const authenticateUser = (response, navigator: Navigator) => {
//   if (response) {
//     const authenticatedUser: AuthenticatedUser = {
//       token: response?.meta.token,
//       company_id: response?.data.account.data[0].company.data[0].companies_id,
//       account_id: response?.data.account.data[0].accounts_id,
//       user_id: response?.data.users_id,
//       role_id: response?.data.user_roles.data.open_roles_id,
//       name: `${response?.data.first_name} ${response?.data.last_name}`,
//     };
//     response && storeAuthenticatedUserDetails(authenticatedUser);
//   }
//   // navigator('/mail');
// };

// // export const isOwner = () => authenticatedUser && authenticatedUser.role_id === ROLES_ID.OWNER;

import { NextRequest, NextResponse } from 'next/server';

import { AuthenticatedUser as IAuthenticatedUser } from '../interfaces/authentication.interface';

import { getFromLocalStorage, LocalStorageKeys } from './localStorage-utils';

const AuthenticatedUser = async (req: NextRequest) => {
  // const isAuthenticated = getAuthenticatedUser();
  // if (!isAuthenticated) {
  //   return NextResponse.redirect(new URL("/login", req.url));
  // }

  const isAuthenticated = false;

  return isAuthenticated
    ? NextResponse.next()
    : NextResponse.redirect(new URL('/sign-up', req.url));
};

export default AuthenticatedUser;

export const getAuthenticatedUserDetailsFromLS = () => {
  const authenticatedUser = getFromLocalStorage<IAuthenticatedUser>(
    LocalStorageKeys.AUTHENTICATED_USER,
  );
  return authenticatedUser;
};
