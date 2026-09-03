import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

// import { AuthStore } from '@/store/auth-store';
import { AuthenticatedUser } from '@/lib/interfaces/authentication.interface';
const verifyToken = (token: string, provider: string) => {
  // const { setData } = AuthStore();
  // const router = useRouter();
  const { isLoading, refetch } = useQuery({
    queryKey: ['gAuth'],
    queryFn: () => {
      const res = axios.get<AuthenticatedUser>(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/auth/users/verify-token/${provider}?token=${token}`,
      );
      return res;
    },
    enabled: false,
  });
  if (isLoading) {
    return null;
  }

  return refetch;
};

export { verifyToken };
