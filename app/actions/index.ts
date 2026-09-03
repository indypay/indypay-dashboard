'use client';
import axios from 'axios';

import { signOut } from '@/lib/components/auth/auth';

export async function doSocialLogin(formData: FormData) {
  try {
    const { data: url } = await axios.get(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/auth/users/google`,
      { withCredentials: true },
    );

    if (url) {
      // Redirect the user to the received URL
      window.location.href = url;
    } else {
      console.error('URL not found in response');
    }
  } catch (err) {
    console.error('Fetch error:', err);
  }
}

export async function doLogout() {
  await signOut({ redirectTo: '/' });
}
