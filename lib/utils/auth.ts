export const getAuthToken = (): string | null => {
  // Try to get token from localStorage
  const token = localStorage.getItem('auth_token');

  if (!token) {
    // If not in localStorage, try to get from cookie
    const cookies = document.cookie.split(';');
    const tokenCookie = cookies.find((cookie) =>
      cookie.trim().startsWith('auth_token='),
    );
    if (tokenCookie) {
      return tokenCookie.split('=')[1].trim();
    }
    return null;
  }

  return token;
};

export const setAuthToken = (token: string): void => {
  localStorage.setItem('auth_token', token);
  // Also set as cookie for SSR
  document.cookie = `auth_token=${token}; path=/; secure; samesite=strict`;
};
