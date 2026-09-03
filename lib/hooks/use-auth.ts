import { useMutation } from '@tanstack/react-query';
import { refreshAccessToken } from '../services/auth.service';

export const useRefreshToken = () => {
  return useMutation({
    mutationKey: ['refresh-token'],
    mutationFn: refreshAccessToken,
  });
};
