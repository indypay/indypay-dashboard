'use client';

import React from 'react';
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from '@heroui/react';
import { InputNumber } from 'antd';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { refundWallet, topupWallet } from '@/lib/hooks/use-payout-wallet';
import { CustomButton } from '../ButtonComponent/CustomButton';
import { useToast } from '../Toast/ToastContext';

interface WalletRechargeProps {
  isOpen: boolean;
  onClose: () => void;
  userId: string;
  onSuccess?: () => void;
  isRefund?: boolean;
}

const formSchema = z.object({
  amount: z
    .string()
    .min(1, 'Amount is required')
    .refine(
      (val) => {
        const num = parseFloat(val);
        return !isNaN(num) && num > 0;
      },
      { message: 'Amount must be a positive number' },
    ),
});

type FormData = z.infer<typeof formSchema>;

export const WalletRecharge: React.FC<WalletRechargeProps> = ({
  isOpen,
  onClose,
  userId,
  onSuccess,
  isRefund = false,
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      amount: '',
    },
  });

  const amount = watch('amount');

  const { showToast } = useToast();

  const { mutate: topup, isPending } = topupWallet();
  const { mutate: refund, isPending: isRefundPending } = refundWallet();

  const onSubmit = (data: FormData) => {
    if (isRefund) {
      refund(
        {
          amount: parseFloat(data.amount),
          userId,
        },
        {
          onSuccess: (response) => {
            const [data, error] = response;
            if (data?.data?.message) {
              showToast(data.data.message, 'success');
              reset();
              onSuccess?.();
              onClose();
            } else {
              showToast(error?.message || 'Failed to refund wallet', 'error');
            }
          },
        },
      );
    } else {
      topup(
        {
          amount: parseFloat(data.amount),
          userId,
        },
        {
          onSuccess: (response) => {
            const [data, error] = response;
            if (data?.data?.message) {
              showToast(data.data.message, 'success');
              reset();
              onSuccess?.();
              onClose();
            } else {
              showToast(error?.message || 'Failed to recharge wallet', 'error');
            }
          },
          onError: (error: Error) => {
            showToast(error.message || 'Failed to recharge wallet', 'error');
          },
        },
      );
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} placement="center">
      <ModalContent>
        <form onSubmit={handleSubmit(onSubmit)}>
          <ModalHeader className="flex flex-col gap-1">
            {isRefund ? 'Refund Wallet' : 'Recharge Wallet'}
          </ModalHeader>
          <ModalBody>
            <div>
              <label className="block text-sm mb-1">Amount</label>
              <InputNumber
                autoFocus
                placeholder="Enter amount"
                value={amount ? parseFloat(amount) : undefined}
                onChange={(val) => setValue('amount', val?.toString() || '')}
                status={errors.amount ? 'error' : undefined}
                min={0}
                step={0.01}
                className="w-full"
              />
              {errors.amount && (
                <div className="text-red-500 text-sm mt-1">
                  {errors.amount.message}
                </div>
              )}
            </div>
          </ModalBody>
          <ModalFooter>
            <CustomButton color="danger" variant="outlined" onPress={onClose}>
              Close
            </CustomButton>
            <CustomButton
              type="default"
              htmlType="submit"
              isLoading={isPending || isRefundPending}
              className="bg-gradient-to-r from-gradient-create-from to-gradient-create-to text-white"
            >
              {isRefund ? 'Refund' : 'Top Up'}
            </CustomButton>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  );
};

export default WalletRecharge;
