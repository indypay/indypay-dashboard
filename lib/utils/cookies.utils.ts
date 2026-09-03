import Cookies from 'js-cookie';

export const deleteCookie = (cookieName: string): void => {
  Cookies.remove(cookieName);
};

export const deleteAllCookies = (): void => {
  const all = Cookies.get();
  if (!all) return;
  for (const name of Object.keys(all)) {
    Cookies.remove(name);
  }
};

export const getCookie = (cookieName: string): string | undefined => {
  return Cookies.get(cookieName);
};
