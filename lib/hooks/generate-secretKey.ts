import { useMutation } from '@tanstack/react-query';

import { SecretApiRequest } from '../interfaces/secret.interface';
import {
  callAdminGenerateSecretKey,
  callMerchantGenerateSecretKey,
  callUpdateWebhookUrl,
  resetPassword,
} from '../services/transaction-service';
import { WebhookApiRequest } from '../interfaces/webhook.interface';
import { ResetPasswordApiRequest } from '../interfaces/reset-password.interface';

export const useAdminGenerateSecretKey = () => {
  return useMutation({
    mutationFn: (data: SecretApiRequest) => {
      return callAdminGenerateSecretKey(data);
    },
  });
};

export const useMerchantGenerateSecretKey = () => {
  return useMutation({
    mutationFn: () => {
      return callMerchantGenerateSecretKey();
    },
  });
};

export const useUpdateWebhookUrl = () => {
  return useMutation({
    mutationFn: (data: WebhookApiRequest) => {
      return callUpdateWebhookUrl(data);
    },
  });
};

export const useResetPassword = () => {
  return useMutation({
    mutationFn: (data: ResetPasswordApiRequest) => {
      return resetPassword(data);
    },
  });
};
