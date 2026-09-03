import { useMutation } from '@tanstack/react-query';
import {
  EnableMultiAuth,
  MultiAuthOtpVerification,
} from '../interfaces/mutli-auth.interface';
import {
  postEnableMultiAuth,
  postVerifyMultiAuth,
} from '../services/multiAuth.service';

export const useEnableMultiAuth = () =>
  useMutation({
    mutationKey: ['enableMultiAuth'],
    mutationFn: postEnableMultiAuth,
  });

export const useVerifyMultiAuth = () => {
  return useMutation({
    mutationKey: ['post-verify-multi-auth'],
    mutationFn: (data: MultiAuthOtpVerification) => postVerifyMultiAuth(data),
  });
};
